import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';
import SearchBar from './SearchBar';
import Icon from './Icon';
import { normalizeAssetPath } from '../lib/asset-path';

function isExternal(path = '') {
  return path.startsWith('http://') || path.startsWith('https://');
}

export default function Header({ headerConfig, searchDocuments, siteConfig }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownRect, setDropdownRect] = useState(null);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.miniwiki-dropdown-trigger')) {
        setActiveDropdown(null);
        setDropdownRect(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close dropdown on scroll (rect would be stale)
  useEffect(() => {
    const handleScroll = () => {
      setActiveDropdown(null);
      setDropdownRect(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownToggle = useCallback((e, title) => {
    if (activeDropdown === title) {
      setActiveDropdown(null);
      setDropdownRect(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setActiveDropdown(title);
      setDropdownRect(rect);
    }
  }, [activeDropdown]);

  const links = headerConfig?.links || [];
  const rightLinks = headerConfig?.rightLinks || [];
  const siteName = siteConfig?.siteName || 'GD Resources';
  const branding = siteConfig?.branding || {};
  const logoPath = typeof branding.logoPath === 'string' ? branding.logoPath.trim() : '';
  const resolvedLogoPath = normalizeAssetPath(logoPath);
  const brandText =
    typeof branding.text === 'string' && branding.text.trim() ? branding.text.trim() : siteName;
  const displayMode = branding.display || (logoPath ? 'logo-and-text' : 'text-only');
  const showLogo = Boolean(logoPath) && displayMode !== 'text-only';
  const showText = displayMode !== 'logo-only';
  const logoAlt =
    typeof branding.logoAlt === 'string' && branding.logoAlt.trim()
      ? branding.logoAlt.trim()
      : `${brandText} logo`;
  const logoClassName =
    typeof branding.logoClassName === 'string' && branding.logoClassName.trim()
      ? branding.logoClassName.trim()
      : 'h-7 w-auto';
  const showSearch = siteConfig?.header?.showSearch !== false;
  const showDarkModeToggle = siteConfig?.header?.showDarkModeToggle !== false;
  const searchPlaceholder = siteConfig?.header?.searchPlaceholder || 'Search docs...';
  const maxWidthClass = siteConfig?.layout?.maxWidthClass || 'max-w-7xl';
  const headerVariant = headerConfig?.variant || null;

  // Active dropdown panel rendered via portal so it escapes overflow clipping
  const activeLink = links.find((l) => l.title === activeDropdown);
  const dropdownPortal =
    mounted && activeLink && dropdownRect
      ? createPortal(
          <div
            className="fixed z-[204] min-w-[200px] rounded-lg border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 flex flex-col gap-0.5"
            style={{ top: dropdownRect.bottom + 6, left: dropdownRect.left }}
          >
            {activeLink.items.map((subLink) => {
              if (isExternal(subLink.path)) {
                return (
                  <a
                    key={`${subLink.title}-${subLink.path}`}
                    href={subLink.path}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {subLink.icon ? <Icon name={subLink.icon} size={14} /> : null}
                    <span>{subLink.title}</span>
                  </a>
                );
              }
              return (
                <Link
                  key={`${subLink.title}-${subLink.path}`}
                  href={subLink.path}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={() => { setActiveDropdown(null); setDropdownRect(null); }}
                >
                  {subLink.icon ? <Icon name={subLink.icon} size={14} /> : null}
                  <span>{subLink.title}</span>
                </Link>
              );
            })}
          </div>,
          document.body
        )
      : null;

  return (
    // z-[203] keeps the header above the search overlay (z-[200]) and its modal (z-[201])
    <header className="miniwiki-header sticky top-0 z-[203] border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      {headerVariant === 'logo-only' ? (
        <div className={`miniwiki-header-inner mx-auto ${maxWidthClass} flex items-center justify-center px-4 py-6`}>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100"
            aria-label={brandText}
          >
            {showLogo ? <img src={resolvedLogoPath} alt={logoAlt} className={logoClassName} /> : null}
            {showText ? <span>{brandText}</span> : null}
            {!showLogo && !showText ? <span>{siteName}</span> : null}
          </Link>
        </div>
      ) : (
        <div className={`miniwiki-header-inner mx-auto flex ${maxWidthClass} items-center gap-4 px-4 py-3`}>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100"
            aria-label={brandText}
          >
            {showLogo ? <img src={resolvedLogoPath} alt={logoAlt} className={logoClassName} /> : null}
            {showText ? <span>{brandText}</span> : null}
            {!showLogo && !showText ? <span>{siteName}</span> : null}
          </Link>

          <div className="ml-auto hidden min-w-0 flex-1 md:block">
            <div className="flex items-center gap-2 whitespace-nowrap overflow-x-auto scrollbar-simple pb-1">
              {links.map((link) => {
                if (link.items && Array.isArray(link.items)) {
                  const isOpen = activeDropdown === link.title;
                  return (
                    <button
                      key={link.title}
                      type="button"
                      onClick={(e) => handleDropdownToggle(e, link.title)}
                      className={`miniwiki-dropdown-trigger inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 ${
                        isOpen ? 'bg-slate-100 dark:bg-slate-800' : ''
                      }`}
                      aria-expanded={isOpen}
                    >
                      {link.icon ? <Icon name={link.icon} size={16} /> : null}
                      <span>{link.title}</span>
                      <Icon
                        name="ChevronDown"
                        size={12}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  );
                }

                if (isExternal(link.path)) {
                  return (
                    <a
                      key={`${link.title}-${link.path}`}
                      href={link.path}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {link.icon ? <Icon name={link.icon} size={16} /> : null}
                      <span>{link.title}</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={`${link.title}-${link.path}`}
                    href={link.path}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {link.icon ? <Icon name={link.icon} size={16} /> : null}
                    <span>{link.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {showSearch ? (
            <SearchBar documents={searchDocuments} placeholder={searchPlaceholder} />
          ) : null}

          {rightLinks.length > 0 ? (
            <div className="flex items-center gap-1">
              {rightLinks.map((link) => {
                const isExt = isExternal(link.path);
                const content = (
                  <span className="flex items-center justify-center rounded-md p-1.5 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" title={link.title}>
                    {link.icon ? <Icon name={link.icon} size={18} /> : null}
                    <span className={link.icon ? 'sr-only' : 'text-sm px-1'}>{link.title}</span>
                  </span>
                );

                if (isExt) {
                  return (
                    <a
                      key={`${link.title}-${link.path}`}
                      href={link.path}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <Link
                    key={`${link.title}-${link.path}`}
                    href={link.path}
                    className="shrink-0"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          ) : null}

          {showDarkModeToggle ? <DarkModeToggle /> : null}

          {links.length > 0 ? (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-md p-1.5 cursor-pointer text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
              aria-label="Toggle menu"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          ) : null}
        </div>
      )}

      {isMobileMenuOpen && links.length > 0 ? (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col gap-1.5">
            {links.map((link) => {
              if (link.items && Array.isArray(link.items)) {
                const isExpanded = expandedMobileMenus[link.title] || false;
                return (
                  <div key={`mobile-${link.title}`} className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setExpandedMobileMenus({ ...expandedMobileMenus, [link.title]: !isExpanded })}
                      className="flex items-center cursor-pointer justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 w-full text-left"
                    >
                      <span className="flex items-center gap-2">
                        {link.icon ? <Icon name={link.icon} size={18} /> : null}
                        <span>{link.title}</span>
                      </span>
                      <Icon
                        name="ChevronDown"
                        size={16}
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="flex flex-col gap-1 pl-4 border-l border-slate-200/50 dark:border-slate-800/50 ml-5 mt-1">
                        {link.items.map((subLink) => {
                          if (isExternal(subLink.path)) {
                            return (
                              <a
                                key={`mobile-sub-${subLink.title}-${subLink.path}`}
                                href={subLink.path}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subLink.icon ? <Icon name={subLink.icon} size={18} /> : null}
                                <span>{subLink.title}</span>
                              </a>
                            );
                          }

                          return (
                            <Link
                              key={`mobile-sub-${subLink.title}-${subLink.path}`}
                              href={subLink.path}
                              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subLink.icon ? <Icon name={subLink.icon} size={18} /> : null}
                              <span>{subLink.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              if (isExternal(link.path)) {
                return (
                  <a
                    key={`mobile-${link.title}-${link.path}`}
                    href={link.path}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon ? <Icon name={link.icon} size={18} /> : null}
                    <span>{link.title}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={`mobile-${link.title}-${link.path}`}
                  href={link.path}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon ? <Icon name={link.icon} size={18} /> : null}
                  <span>{link.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}

      {dropdownPortal}
    </header>
  );
}
