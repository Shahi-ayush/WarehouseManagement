import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
// import db from "./db";
import { db } from "@/lib/db";

import { compare } from "bcrypt";

const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        // Find user by email
        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!existingUser) {
          console.log("User not found");
          return null;
        }

        // Check password
        const isPasswordValid = await compare(
          credentials.password,
          existingUser.hashedPassword
        );

        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        // Return minimal user object
        return {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // ✅ Persist user id into JWT
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      // ✅ Make user id available in client session
      if (token?.id) session.user.id = token.id;
      return session;
    },
  },
};

export { authOptions };
