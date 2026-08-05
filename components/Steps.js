import { Children } from 'react';

export function Step({ children }) {
  return <>{children}</>;
}

export default function Steps({ items = [], children }) {
  const childSteps = Children.toArray(children).filter(Boolean);
  const entries = childSteps.length > 0 ? childSteps : items;

  return (
    <ol className="my-6 space-y-3">
      {entries.map((entry, index) => (
        <li
          key={`step-${index}`}
          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            {typeof entry === 'string' ? (
              <span className="text-sm text-slate-700 dark:text-slate-200">{entry}</span>
            ) : (
              entry
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
