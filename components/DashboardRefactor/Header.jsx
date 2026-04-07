import Pill from "./Pill";

export default function Header({ profile, initials, isVerified, onLogout }) {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-xl">🏪</div>
        <div>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100">{profile.customer?.name || "My Account"}</p>
          <p className="text-xs text-gray-400 mt-0.5">{profile.customer?.address || "—"} · {profile.account?.phone}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm font-medium text-gray-500">
          {initials(profile.customer?.name || "")}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{profile.account?.email}</p>
          <Pill text={isVerified ? "Verified" : "Unverified"} variant={isVerified ? "VERIFIED" : "UNVERIFIED"} />
        </div>
        <button
          onClick={onLogout}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}