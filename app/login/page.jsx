//app/login/page.jsx
"use client";

import { useEffect, useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Login() {
    const router = useRouter();
    const [callbackError, setCallbackError] = useState(null);
    const { data: session, status } = useSession();

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      setCallbackError(params.get("error"));

      if (status === "authenticated" && session?.user) {
        router.replace("/dashboard/home/overview");
      }
    }, [router, session, status]);

  const errorMessage =
    callbackError === "CredentialsCallbackMethod"
      ? "Login failed because the credentials callback was requested with GET instead of POST. Check your deploy URL/proxy settings (especially NEXTAUTH_URL and HTTPS redirect rules)."
      : callbackError === "Configuration"
      ? "Authentication configuration is incomplete. Verify NEXTAUTH_SECRET or AUTH_SECRET and database environment variables in deployment settings."
      : null;

    if (status === "loading") {
        return <p>Loading User Please Wait....</p>;
    }

    if (status === "authenticated") {
        return <p>Redirecting...</p>;
    }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Inventory System
        </a>
        <div className="w-full bg-white rounded-lg shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            {errorMessage && (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {errorMessage}
              </p>
            )}
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
