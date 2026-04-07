// import { db } from "@/lib/db";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";

// export async function POST(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id)
//       return new Response(JSON.stringify({ success: false }), { status: 401 });

//     const userId = session.user.id;
//     const { payload, amount } = await req.json();

//     // Verify payment with Khalti
//     const res = await fetch("https://khalti.com/api/v2/payment/verify/", {
//       method: "POST",
//       headers: {
//         Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         token: payload.token,
//         amount: Number(amount) * 100,
//       }),
//     });

//     const data = await res.json();
//     if (!data.idx) return new Response(JSON.stringify({ success: false }), { status: 400 });

//     const customer = await db.customer.findFirst({ where: { userId } });
//     if (!customer) return new Response(JSON.stringify({ success: false }), { status: 404 });

//     await db.payment.create({
//       data: {
//         customerId: customer.id,
//         userId,
//         amount: Number(amount),
//         method: "KHALTI",
//         reference: payload.idx,
//       },
//     });

//     return new Response(JSON.stringify({ success: true }));
//   } catch (err) {
//     console.error(err);
//     return new Response(JSON.stringify({ success: false }), { status: 500 });
//   }
// }import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const pidx = searchParams.get("pidx");
    const status = searchParams.get("status");
    const merchantExtra = searchParams.get("merchant_extra");

    if (status !== "Completed") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/customer/payment?status=failed`
      );
    }

    // Verify with Khalti
    const verifyRes = await fetch("https://dev.khalti.com/api/v2/epayment/lookup/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const verifyData = await verifyRes.json();
    console.log("Khalti lookup response:", verifyData);

    if (verifyData.status !== "Completed") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/customer/payment?status=failed`
      );
    }

    const { customerId, userId, amount } = JSON.parse(merchantExtra);

    await db.payment.create({
      data: {
        customerId,
        userId,
        amount: Number(amount),
        method: "KHALTI",
        reference: pidx,
      },
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/customer/dashboard?status=success`
    );
  } catch (err) {
    console.error("Khalti verify error:", err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/customer/payment?status=error`
    );
  }
}