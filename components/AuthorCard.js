import Link from 'next/link';
import authors from '../content/authors.json';

export default function AuthorCard({ username, name, avatar, url, role: passedRole, contributions, showLabel = true }) {
  const label = 'Written by:';
  const displayName = name || username;

  const authorMeta = username && authors[username] ? authors[username] : {};
  const role = passedRole || authorMeta.role;

  const roleColors = {
    Owner: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/30',
    Administrator: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30',
    Verified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/30',
    Contributor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30',
  };
  
  const roleBadgeColor = roleColors[role] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';

  const content = (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {avatar ? (
        <img
          src={avatar}
          alt={`${displayName} avatar`}
          className="h-12 w-12 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="space-y-1 w-full">
        {showLabel ? (
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</div>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-base font-semibold text-slate-900 dark:text-slate-100">{displayName}</div>
          {role && (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${roleBadgeColor}`}>
              {role}
            </span>
          )}
        </div>
        {contributions && !showLabel && (
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {contributions}
          </div>
        )}
      </div>
    </div>
  );

  if (url) {
    return (
      <Link href={url} className="block hover:opacity-90" target="_blank" rel="noreferrer">
        {content}
      </Link>
    );
  }

  return content;
}
