import Pill from "./Pill";

export default function Header({ profile, initials, isVerified, onLogout, onProfileClick }) {
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onProfileClick}
            aria-label="Open profile settings"
            title="Profile settings"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-blue-800 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="3.25" />
              <path d="M6.5 18.25c1.7-2.45 3.45-3.5 5.5-3.5s3.8 1.05 5.5 3.5" />
              <path d="M19.4 4.6l.55 1.1 1.2.2-.86.84.2 1.2-1.09-.57-1.08.57.2-1.2-.87-.84 1.2-.2.55-1.1Z" />
            </svg>
          </button>
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}