

// import { db } from "@/lib/db";
// import bcrypt from "bcrypt";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET;

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // 1️⃣ Find customer account
//     const account = await db.customerAccount.findUnique({ where: { email } });
//     if (!account) {
//       return NextResponse.json(
//         { error: "Email not found" },
//         { status: 404 }
//       );
//     }

//     // 2️⃣ Verify password
//     const isPasswordValid = await bcrypt.compare(password, account.password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: "Incorrect password" },
//         { status: 401 }
//       );
//     }

//     // 3️⃣ Generate JWT token
//     const token = jwt.sign(
//       { accountId: account.id, email: account.email },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // 4️⃣ Attempt to link customer if not already linked
//     let linkStatus = null;

//     if (!account.customerId) {
//       // Find Customer by phone (or other criteria)
//       const customer = await db.customer.findFirst({
//         where: { phone: account.phone },
//       });

//       if (customer) {
//         // Link the account
//         await db.customerAccount.update({
//           where: { id: account.id },
//           data: { customerId: customer.id },
//         });
//         linkStatus = { linked: true, customerId: customer.id };
//       } else {
//         linkStatus = { linked: false, message: "Customer not found to link" };
//       }
//     } else {
//       linkStatus = { linked: true, customerId: account.customerId };
//     }

//     // 5️⃣ Return token + link info
//     return NextResponse.json({
//       message: "Login successful",
//       token,
//       linkStatus,
//     });

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }


import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Find customer account
    const account = await db.customerAccount.findUnique({ where: { email } });
    if (!account) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Verify password
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { accountId: account.id, email: account.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ Attempt to link customer if not already linked
    let linkStatus = null;

    if (!account.customerId) {
      // Find Customer by phone (or other criteria)
      const customer = await db.customer.findFirst({
        where: { phone: account.phone },
      });

      if (customer) {
        // Link the account AND mark it verified
        await db.customerAccount.update({
          where: { id: account.id },
          data: { 
            customerId: customer.id,
            status: "verified", // <-- mark as verified after linking
          },
        });
        linkStatus = { linked: true, customerId: customer.id };
      } else {
        linkStatus = { linked: false, message: "Customer not found to link" };
      }
    } else {
      linkStatus = { linked: true, customerId: account.customerId };
    }

    // 5️⃣ Return token + link info
    return NextResponse.json({
      message: "Login successful",
      token,
      linkStatus,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
