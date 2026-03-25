
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    const { email, phone } = await req.json();
    if (!email || !phone) {
      return new Response(JSON.stringify({ error: "Email and phone are required" }), { status: 400 });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.Otp.create({
      data: { email, phone, otp: hashedOtp, expiresAt },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Inventory System",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    return new Response(JSON.stringify({ message: "OTP sent successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
