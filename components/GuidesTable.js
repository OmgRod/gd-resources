import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Table, THead, TBody, TR, TH, TD, Caption } from './WikiTable';
import { useGuidesContext } from '../lib/guides-context';

function toSearchableText(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map((v) => toSearchableText(v)).join(' ');
  if (typeof value === 'object') return Object.values(value).map((v) => toSearchableText(v)).join(' ');
  return String(value);
}

function fuzzyMatch(query, text) {
  const q = String(query || '').toLowerCase();
  const t = String(text || '').toLowerCase();

  if (!q) return { score: 0, positions: [] };

  let qi = 0;
  let ti = 0;
  const positions = [];
  let score = 0;
  let consecutive = 0;

  while (qi < q.length && ti < t.length) {
    if (q[qi] === t[ti]) {
      positions.push(ti);
      score += 10;
      if (positions.length > 1 && positions[positions.length - 1] === positions[positions.length - 2] + 1) {
        consecutive += 1;
        score += consecutive * 5;
      } else {
        consecutive = 0;
      }
      qi += 1;
      ti += 1;
    } else {
      ti += 1;
    }
  }

  if (qi !== q.length) {
    const used = new Set();
    const pos = [];

    for (let c = 0; c < q.length; c++) {
      const ch = q[c];
      let found = -1;
      for (let i = 0; i < t.length; i++) {
        if (t[i] === ch && !used.has(i)) {
          found = i;
          used.add(i);
          pos.push(i);
          break;
        }
      }

      if (found === -1) {
        return { score: 0, positions: [] };
      }
    }

    let unorderedScore = pos.length * 8;
    const span = Math.max(...pos) - Math.min(...pos) || 0;
    unorderedScore += Math.max(0, 40 - span);

    return { score: unorderedScore, positions: pos.sort((a, b) => a - b) };
  }

  const firstPos = positions[0] || 0;
  score += Math.max(0, 50 - firstPos);

  return { score, positions };
}

function highlightText(text, positions) {
  if (!positions || positions.length === 0) return text;

  const ranges = [];
  let start = positions[0];
  let end = positions[0];

  for (let i = 1; i < positions.length; i++) {
    const idx = positions[i];
    if (idx === end + 1) {
      end = idx;
    } else {
      ranges.push([start, end]);
      start = idx;
      end = idx;
    }
  }
  ranges.push([start, end]);

  const parts = [];
  let lastIndex = 0;

  for (const [s, e] of ranges) {
    if (lastIndex < s) {
      parts.push(text.slice(lastIndex, s));
    }
    parts.push(<strong key={`h-${s}-${e}`}>{text.slice(s, e + 1)}</strong>);
    lastIndex = e + 1;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function GuidesTable({ guides: initialGuides = [], subdirectory, subcategory, caption, subdirectoryGuides: propGuides = {} }) {
  const directory = subdirectory || subcategory;
  const contextGuides = useGuidesContext();

  const resolvedGuides = useMemo(() => {
    if (directory) {
      const normalized = String(directory).replace(/^\/+/, '');
      return contextGuides[normalized] ?? propGuides[normalized] ?? [];
    }
    return initialGuides;
  }, [directory, contextGuides, propGuides, initialGuides]);

  const [query, setQuery] = useState('');

  const normalized = useMemo(() => {
    return resolvedGuides.map((g) => ({
      ...g,
      searchable: `${g.title || ''} ${g.description || ''} ${toSearchableText(g.metadata || '')}`,
    }));
  }, [resolvedGuides]);

  const results = useMemo(() => {
    const q = String(query || '').trim();

    const sortGuides = (aGuide, bGuide) => {
      const valA = aGuide.order ?? aGuide.metadata?.order ?? aGuide.meta?.order;
      const valB = bGuide.order ?? bGuide.metadata?.order ?? bGuide.meta?.order;

      const hasOrderA = valA !== undefined && valA !== null;
      const hasOrderB = valB !== undefined && valB !== null;

      if (hasOrderA && !hasOrderB) return -1;
      if (!hasOrderA && hasOrderB) return 1;
      if (hasOrderA && hasOrderB) {
        const numA = Number(valA);
        const numB = Number(valB);
        if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
          return numA - numB;
        }
      }
      return String(aGuide.title || '').localeCompare(String(bGuide.title || ''));
    };

    if (!q) {
      return [...normalized]
        .sort(sortGuides)
        .map((item) => ({ guide: item, titlePositions: [], descPositions: [], score: 0 }));
    }

    return normalized
      .map((item) => {
        const titleMatch = fuzzyMatch(q, item.title || '');
        const descMatch = fuzzyMatch(q, item.description || '');
        const metaMatch = fuzzyMatch(q, item.searchable || '');

        const score = titleMatch.score * 3 + descMatch.score * 1 + metaMatch.score * 0.5;

        return {
          guide: item,
          titlePositions: titleMatch.positions,
          descPositions: descMatch.positions,
          score,
        };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return sortGuides(a.guide, b.guide);
      });
  }, [normalized, query]);

  if (!resolvedGuides.length) {
    return <p>No guides are available yet.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter guides..."
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-300 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:max-w-md"
        />
        <div className="text-sm text-slate-600 dark:text-slate-400">{results.length} result(s)</div>
      </div>

      <Table>
        {caption ? <Caption>{caption}</Caption> : null}
        <THead>
          <TR>
            <TH>Title</TH>
            <TH>Description</TH>
          </TR>
        </THead>
        <TBody>
          {results.map(({ guide, titlePositions, descPositions }) => (
            <TR key={guide.route}>
              <TD>
                <Link
                  href={guide.route}
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                >
                  {titlePositions && titlePositions.length ? (
                    <span>{highlightText(guide.title || '', titlePositions)}</span>
                  ) : (
                    guide.title
                  )}
                </Link>
              </TD>
              <TD>
                {descPositions && descPositions.length ? (
                  <span>{highlightText(guide.description || '', descPositions)}</span>
                ) : (
                  guide.description || 'No description provided.'
                )}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
