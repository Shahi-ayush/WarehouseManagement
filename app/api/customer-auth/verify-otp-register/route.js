
// import { db } from "@/lib/db";
// import bcrypt from "bcrypt";

// export async function POST(req) {
//   try {
//     const { email, phone, otp, password } = await req.json();
//     if (!email || !phone || !otp || !password) {
//       return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
//     }

//     const latestOtp = await db.Otp.findFirst({
//       where: { email },
//       orderBy: { createdAt: "desc" },
//     });

//     if (!latestOtp) return new Response(JSON.stringify({ error: "OTP not found" }), { status: 404 });
//     if (latestOtp.expiresAt < new Date()) return new Response(JSON.stringify({ error: "OTP expired" }), { status: 400 });

//     const isValid = await bcrypt.compare(otp, latestOtp.otp);
//     if (!isValid) return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 400 });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const existing = await db.customerAccount.findFirst({ where: { email } });
//     if (existing) return new Response(JSON.stringify({ error: "Customer already exists" }), { status: 409 });

//     await db.customerAccount.create({
//       data: { email, phone, password: hashedPassword },
//     });

//     return new Response(JSON.stringify({ message: "Account created successfully" }), { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
//   }
// }

import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, phone, otp, password } = await req.json();
    if (!email || !phone || !otp || !password) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    // Get latest OTP for this email
    const latestOtp = await db.Otp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!latestOtp)
      return new Response(JSON.stringify({ error: "OTP not found" }), { status: 404 });

    if (latestOtp.expiresAt < new Date())
      return new Response(JSON.stringify({ error: "OTP expired" }), { status: 400 });

    const isValid = await bcrypt.compare(otp, latestOtp.otp);
    if (!isValid)
      return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ check if email OR phone already exists
    const existing = await db.customerAccount.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      },
    });

    if (existing)
      return new Response(
        JSON.stringify({ error: "Customer with this email or phone already exists" }),
        { status: 409 }
      );

    // ✅ create account
    await db.customerAccount.create({
      data: { email, phone, password: hashedPassword },
    });

    return new Response(JSON.stringify({ message: "Account created successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
