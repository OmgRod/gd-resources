import AuthorCard from './AuthorCard';
import authors from '../content/authors.json';

export default function AuthorList() {
  const entries = Object.entries(authors || {});

  if (!entries.length) {
    return <p className="text-sm text-slate-600 dark:text-slate-400">No authors defined yet.</p>;
  }

  return (
    <div className="space-y-4">
      {entries.map(([username, author]) => (
        <AuthorCard
          key={username}
          username={username}
          name={author.name || username}
          avatar={author.avatar}
          url={author.url}
          role={author.role}
          contributions={author.contributions}
          showLabel={false}
        />
      ))}
    </div>
  );
}
