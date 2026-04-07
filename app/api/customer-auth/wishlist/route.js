import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyCustomerToken } from "@/lib/auth";

function sanitizeQuantity(value) {
  const qty = Number.parseInt(value, 10);
  if (!Number.isFinite(qty)) return 0;
  if (qty < 0) return 0;
  if (qty > 999) return 999;
  return qty;
}

function parseWishlistRequests(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const normalized = {};
  for (const [itemId, qty] of Object.entries(raw)) {
    const cleanQty = sanitizeQuantity(qty);
    if (cleanQty > 0) normalized[itemId] = cleanQty;
  }
  return normalized;
}

function mergeLegacyWishlistIds(wishlistIds, requestMap) {
  const merged = { ...requestMap };
  for (const id of wishlistIds || []) {
    if (!merged[id]) merged[id] = 1;
  }
  return merged;
}

async function getCustomerFromToken(req) {
  const decoded = verifyCustomerToken(req);
  const account = await db.customerAccount.findUnique({
    where: { id: decoded.accountId },
  });

  if (!account?.customerId) {
    return { error: NextResponse.json({ error: "Customer not linked" }, { status: 400 }) };
  }

  const customer = await db.customer.findUnique({
    where: { id: account.customerId },
  });

  if (!customer) {
    return { error: NextResponse.json({ error: "Customer not found" }, { status: 404 }) };
  }

  return { customer };
}

async function buildCustomerCatalog(userId, wishlistMap) {
  const items = await db.item.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      sellingPrice: true,
      imageUrl: true,
    },
  });

  return items.map((item) => ({
    id: item.id,
    name: item.title,
    price: item.sellingPrice,
    image: item.imageUrl,
    quantity: wishlistMap[item.id] || 0,
    wishlisted: (wishlistMap[item.id] || 0) > 0,
  }));
}

async function persistWishlist(customer, wishlistMap) {
  const wishlistIds = Object.entries(wishlistMap)
    .filter(([, qty]) => sanitizeQuantity(qty) > 0)
    .map(([id]) => id);

  await db.customer.update({
    where: { id: customer.id },
    data: {
      wishlist: wishlistIds,
      purchasedItems: wishlistMap,
    },
  });

  return wishlistIds;
}

export async function GET(req) {
  try {
    const result = await getCustomerFromToken(req);
    if (result.error) return result.error;

    const requestMap = parseWishlistRequests(result.customer.purchasedItems);
    const mergedMap = mergeLegacyWishlistIds(result.customer.wishlist || [], requestMap);
    const wishlist = await buildCustomerCatalog(result.customer.userId, mergedMap);
    const wishlistIds = Object.keys(mergedMap).filter((id) => mergedMap[id] > 0);

    return NextResponse.json({ success: true, wishlist, wishlistIds });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
// POST /api/customer-auth/wishlist
export async function POST(req) {
  try {
    const result = await getCustomerFromToken(req);
    if (result.error) return result.error;
    const customer = result.customer;

    const body = await req.json();
    const itemId = body?.itemId || body?.productId;

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID required" },
        { status: 400 }
      );
    }

    const item = await db.item.findUnique({
      where: { id: itemId },
      select: { id: true },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const requestMap = parseWishlistRequests(customer.purchasedItems);
    const mergedMap = mergeLegacyWishlistIds(customer.wishlist || [], requestMap);
    const currentQty = sanitizeQuantity(mergedMap[itemId]);
    mergedMap[itemId] = currentQty + 1;

    const wishlistIds = await persistWishlist(customer, mergedMap);
    const wishlistItems = await buildCustomerCatalog(customer.userId, mergedMap);
    return NextResponse.json({ success: true, wishlist: wishlistItems, wishlistIds });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function DELETE(req) {
  try {
    const result = await getCustomerFromToken(req);
    if (result.error) return result.error;
    const customer = result.customer;

    const body = await req.json().catch(() => ({}));
    const itemId = body?.itemId || body?.productId;

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID required" },
        { status: 400 }
      );
    }

    const requestMap = parseWishlistRequests(customer.purchasedItems);
    const mergedMap = mergeLegacyWishlistIds(customer.wishlist || [], requestMap);
    delete mergedMap[itemId];

    const wishlistIds = await persistWishlist(customer, mergedMap);
    const wishlistItems = await buildCustomerCatalog(customer.userId, mergedMap);
    return NextResponse.json({ success: true, wishlist: wishlistItems, wishlistIds });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function PATCH(req) {
  try {
    const result = await getCustomerFromToken(req);
    if (result.error) return result.error;
    const customer = result.customer;

    const body = await req.json();
    const itemId = body?.itemId || body?.productId;
    const quantity = sanitizeQuantity(body?.quantity);

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID required" },
        { status: 400 }
      );
    }

    const item = await db.item.findUnique({
      where: { id: itemId },
      select: { id: true },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const requestMap = parseWishlistRequests(customer.purchasedItems);
    const mergedMap = mergeLegacyWishlistIds(customer.wishlist || [], requestMap);

    if (quantity === 0) delete mergedMap[itemId];
    else mergedMap[itemId] = quantity;

    const wishlistIds = await persistWishlist(customer, mergedMap);
    const wishlistItems = await buildCustomerCatalog(customer.userId, mergedMap);
    return NextResponse.json({ success: true, wishlist: wishlistItems, wishlistIds });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}
