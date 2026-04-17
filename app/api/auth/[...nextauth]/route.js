import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const handler = NextAuth(authOptions);

export async function GET(req, context) {
  const { pathname } = new URL(req.url);

  // Credentials providers only support POST callbacks.
  // On some deployments, proxy redirects can rewrite POST -> GET,
  // which causes NextAuth to return a raw unsupported callback error.
  if (pathname.endsWith("/callback/credentials")) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "CredentialsCallbackMethod");
    return NextResponse.redirect(loginUrl);
  }

  return handler(req, context);
}

export { handler as POST };
