import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function GET(req) {
  try {
    // ... auth check

    const unverified = await db.customerAccount.findMany({
      where: { customerId: null },
      select: { id: true, email: true, phone: true, createdAt: true },
    });

    return new Response(JSON.stringify({ unverified }), {
      status: 200,
      headers: { "Content-Type": "application/json" }, // <-- important
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
