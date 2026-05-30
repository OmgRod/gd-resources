import { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import FlexSearch from 'flexsearch';
import Icon from './Icon';

export default function SearchBar({ documents = [], placeholder = 'Search docs...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isMac, setIsMac] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setIsMac(navigator.userAgent.includes('Mac OS X'));

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      document.body.classList.add('search-open');
    } else {
      setQuery('');
      document.body.classList.remove('search-open');
    }
    return () => document.body.classList.remove('search-open');
  }, [isOpen]);

  const index = useMemo(() => {
    const searchIndex = new FlexSearch.Document({
      tokenize: 'forward',
      document: {
        id: 'id',
        index: ['title', 'description', 'content'],
      },
    });

    documents.forEach((doc, id) => {
      searchIndex.add({
        id,
        title: doc.title || '',
        description: doc.description || '',
        content: doc.content || doc.excerpt || '',
      });
    });

    return searchIndex;
  }, [documents]);

  const matches = useMemo(() => {
    if (!query.trim()) return [];

    const searchResults = index.search(query, { limit: 8 });
    const uniqueIds = new Set();

    searchResults.forEach((fieldResult) => {
      fieldResult.result.forEach((id) => uniqueIds.add(id));
    });

    return Array.from(uniqueIds)
      .map((id) => documents[id])
      .filter(Boolean)
      .slice(0, 8);
  }, [documents, index, query]);

  const getHighlightedText = (text, highlight) => {
    if (!text || !highlight) return text;
    const lowerText = text.toLowerCase();
    const lowerHighlight = highlight.toLowerCase();
    const idx = lowerText.indexOf(lowerHighlight);

    if (idx === -1) return text.substring(0, 80) + (text.length > 80 ? '...' : '');

    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + lowerHighlight.length + 40);
    const snippet =
      (start > 0 ? '...' : '') +
      text.substring(start, end) +
      (end < text.length ? '...' : '');

    const snippetLower = snippet.toLowerCase();
    const snippetIdx = snippetLower.indexOf(lowerHighlight);

    if (snippetIdx === -1) return snippet;

    return (
      <>
        {snippet.substring(0, snippetIdx)}
        <strong className="text-slate-900 dark:text-slate-100 font-semibold bg-blue-100/50 dark:bg-blue-900/30 rounded px-0.5">
          {snippet.substring(snippetIdx, snippetIdx + highlight.length)}
        </strong>
        {snippet.substring(snippetIdx + highlight.length)}
      </>
    );
  };

  const modal = (
    <>
      {/* Full-viewport dark backdrop — rendered directly in <body> via portal */}
      <div
        className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal panel — above backdrop, pointer-events-none on wrapper lets backdrop capture clicks */}
      <div className="fixed inset-0 z-[201] flex items-start justify-center pointer-events-none pt-16 sm:pt-24 px-4">
        <div className="pointer-events-auto relative w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-900/5 dark:border-slate-800 dark:bg-slate-950 dark:ring-0 sm:rounded-2xl">
          {/* Search input row */}
          <div className="flex items-center border-b border-slate-200 px-4 dark:border-slate-800">
            <Icon name="Search" size={20} className="text-slate-500 dark:text-slate-400" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-100 sm:text-sm"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-semibold tracking-wider text-slate-500 cursor-pointer hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 uppercase"
            >
              Esc
            </button>
          </div>

          {/* No results */}
          {query && matches.length === 0 ? (
            <div className="px-6 py-14 text-center text-sm text-slate-500 dark:text-slate-400">
              No results found for{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                "{query}"
              </span>
              .
            </div>
          ) : null}

          {/* Results list */}
          {matches.length > 0 ? (
            <ul className="max-h-[60vh] overflow-y-auto p-2">
              {matches.map((match) => (
                <li key={match.route}>
                  <Link
                    href={match.route}
                    className="group flex flex-col gap-1 rounded-lg p-3 transition hover:bg-slate-100 dark:hover:bg-slate-900/50"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {match.title}
                    </span>
                    {match.description || match.excerpt ? (
                      <span className="line-clamp-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {match.description || match.excerpt}
                      </span>
                    ) : null}
                    {match.content ? (
                      <span className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {getHighlightedText(match.content, query)}
                      </span>
                    ) : null}
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      {match.route}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            !query && (
              <div className="px-6 py-14 text-center text-sm text-slate-500 dark:text-slate-400">
                Type to start searching...
              </div>
            )
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Trigger button shown in the header */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex w-full sm:w-48 lg:w-64 items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 outline-none transition cursor-pointer hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-900"
      >
        <Icon name="Search" size={16} className="text-slate-400 dark:text-slate-500" />
        <span className="flex-1 text-left">{placeholder}</span>
        <kbd className="hidden items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-sans text-[10px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 sm:flex">
          <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span>K
        </kbd>
      </button>

      {/* Portal: modal is injected directly into <body>, not inside the header */}
      {mounted && isOpen ? createPortal(modal, document.body) : null}
    </>
  );
}
