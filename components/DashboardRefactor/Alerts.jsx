import { useRouter } from "next/navigation";

export default function Alerts({ dueBalance, isVerified }) {
  const router = useRouter();

  return (
    <>
      {dueBalance > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-700 dark:text-red-300">
            Outstanding balance of <span className="font-medium">NPR {dueBalance.toLocaleString()}</span> — please clear your dues
          </p>
          <button
            onClick={() => router.push("/customer/payment")}
            className="text-xs font-medium px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg ml-4 whitespace-nowrap transition-colors"
          >
            Pay now
          </button>
        </div>
      )}

      {!isVerified && (
        <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-300">
          Your account is unverified. Please contact admin to activate your account.
        </div>
      )}
    </>
  );
}