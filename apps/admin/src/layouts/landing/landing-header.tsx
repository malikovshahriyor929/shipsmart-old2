'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from '@core/i18n/routing';
import { LandingBrandMark } from './landing-brand-mark';
import { landingNavigation } from './landing-navigation';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="grid h-10 w-6 shrink-0 place-items-center text-[#17181b] transition hover:text-[#03a1fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03a1fe]"
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 fill-current" aria-hidden="true" />
      )}
    </button>
  );
}

function DesktopMenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Landing navigation"
      aria-hidden={!open}
      className={`ss-menu-overlay fixed inset-0 z-[70] hidden bg-[#07182f]/45 p-4 backdrop-blur-md lg:block ${
        open ? 'is-open' : ''
      }`}
    >
      <div className="ss-menu-panel ml-auto flex h-full max-w-[46rem] flex-col rounded-[2.25rem] bg-[#f4f4f2] p-8 shadow-2xl xl:p-12">
        <div className="flex items-center justify-between">
          <LandingBrandMark />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="h-13 w-13 grid place-items-center rounded-full bg-white text-[#111214] transition hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-16 grid" aria-label="Expanded navigation">
          {landingNavigation.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="ss-menu-link group flex items-center justify-between border-b border-black/10 py-4 text-4xl font-semibold tracking-[-0.055em] text-[#111214] xl:text-6xl"
              style={{ transitionDelay: `${90 + index * 55}ms` }}
            >
              {item.label}
              <ArrowUpRight className="h-6 w-6 transition group-hover:rotate-45" />
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between gap-8 border-t border-black/10 pt-7">
          <p className="max-w-sm text-sm leading-6 text-[#77797e]">
            One connected team for transportation, warehousing, and shipment
            visibility.
          </p>
          <Link
            href="/get-quote"
            onClick={onClose}
            className="min-h-13 inline-flex shrink-0 items-center gap-3 rounded-full bg-[#4ba6f8] px-6 text-sm font-bold text-white"
          >
            Request a Quote <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 560);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="ss-editorial-header absolute inset-x-0 top-0 z-50 px-3 pt-[18px] sm:px-4">
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <Link
            href="/"
            className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ba6f8]"
          >
            <LandingBrandMark compact />
          </Link>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full bg-white px-[15px] py-[10px] shadow-[0_1px_0_rgba(0,0,0,.03)] xl:flex"
            aria-label="Main navigation"
          >
            {landingNavigation.map((item, navIndex) => (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="ss-nav-item inline-flex items-center gap-1 rounded-full px-6 py-[10px] text-base font-semibold leading-none tracking-[-0.02em] text-[#17181b] transition hover:bg-[#f4f4f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03a1fe]"
                  style={{ animationDelay: `${120 + navIndex * 55}ms` }}
                  aria-haspopup={item.children.length ? 'menu' : undefined}
                >
                  {item.label}
                  {item.children.length ? (
                    <svg
                      viewBox="0 0 5 5"
                      className="mt-1 h-[5px] w-[5px] shrink-0 transition-transform duration-300 group-focus-within:rotate-180 group-hover:rotate-180"
                      aria-hidden="true"
                    >
                      <path
                        d="M.12 4.092 3.762.146a.5.5 0 0 1 .885.354l.32 3.95a.46.46 0 0 1-.461.499L.544 4.945a.5.5 0 0 1-.424-.853Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : null}
                </Link>

                {item.children.length ? (
                  <div
                    className={`ss-nav-dropdown pointer-events-none absolute left-1/2 top-full z-[80] -translate-x-1/2 -translate-y-2 pt-[10px] opacity-0 transition-[opacity,transform] duration-300 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 ${
                      item.label === 'Company'
                        ? 'w-[245px]'
                        : item.label === 'Solutions'
                          ? 'w-[250px]'
                          : 'w-[230px]'
                    }`}
                  >
                    <div
                      role="menu"
                      className="rounded-[1.15rem] border border-black/[0.05] bg-white p-3 shadow-[0_22px_55px_rgba(10,20,36,.13)]"
                    >
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={child}
                          role="menuitem"
                          href={item.href}
                          className={`ss-nav-dropdown-link block rounded-xl px-4 py-2.5 text-sm font-medium text-[#4f5156] transition hover:bg-[#f3f3f1] hover:text-[#111214] focus-visible:bg-[#f3f3f1] focus-visible:outline-none ${
                            item.label === 'Company' && childIndex === 5
                              ? 'mt-2 border-t border-black/10 pt-4'
                              : ''
                          }`}
                          style={{
                            transitionDelay: `${Math.min(childIndex * 28, 168)}ms`,
                          }}
                        >
                          {child}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <Link
              href="/track-shipment"
              aria-label="Track a shipment"
              className="grid h-10 w-7 shrink-0 place-items-center text-[#17181b] transition hover:text-[#03a1fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03a1fe]"
            >
              <Search className="h-5 w-5" />
            </Link>
            <ThemeToggle />
            <div className="flex items-center gap-1">
              <Link
                href="/get-quote"
                className="inline-flex h-[50px] items-center rounded-full bg-[#03a1fe] px-[27px] text-base font-semibold tracking-[-0.05em] text-white transition hover:bg-[#018fe5]"
              >
                Request a Quote
              </Link>
              <Link
                href="/get-quote"
                aria-label="Request a quote"
                className="grid h-[50px] w-[50px] place-items-center rounded-full bg-[#03a1fe] text-white transition hover:bg-[#018fe5]"
              >
                <ArrowUpRight className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="editorial-mobile-menu"
            className="inline-flex h-12 items-center gap-1.5 rounded-2xl bg-white px-3 font-bold text-[#17181b] shadow-[0_8px_30px_rgba(12,20,34,.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03a1fe] xl:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="text-xs uppercase tracking-[0.12em]">
              {menuOpen ? 'Close' : 'Menu'}
            </span>
          </button>
        </div>

        <div
          id="editorial-mobile-menu"
          className={`mx-auto mt-3 max-w-[1440px] overflow-hidden rounded-[1.75rem] bg-white transition-[max-height,opacity] duration-300 xl:hidden ${
            menuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="grid gap-1 p-4" aria-label="Mobile navigation">
            {landingNavigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3.5 text-base font-semibold text-[#17181b] hover:bg-[#f4f4f2]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/auth/sign-in"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3.5 text-base font-semibold text-[#17181b] hover:bg-[#f4f4f2]"
            >
              Login
            </Link>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/track-shipment"
                onClick={closeMenu}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 text-sm font-semibold"
              >
                Track shipment
              </Link>
              <Link
                href="/get-quote"
                onClick={closeMenu}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#4ba6f8] text-sm font-bold text-white"
              >
                Request a quote
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open navigation menu"
        className={`fixed right-5 top-5 z-[60] hidden h-14 items-center gap-3 rounded-full bg-white px-6 text-xs font-bold uppercase tracking-[0.12em] text-[#111214] shadow-[0_14px_45px_rgba(6,19,37,.16)] transition-[opacity,transform,background-color,color] duration-300 lg:inline-flex ${
          scrolled
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-50 opacity-0'
        }`}
      >
        Menu
        <span className="grid grid-cols-2 gap-[3px]">
          <span className="h-1 w-1 rounded-full bg-current" />
          <span className="h-1 w-1 rounded-full bg-current" />
          <span className="h-1 w-1 rounded-full bg-current" />
          <span className="h-1 w-1 rounded-full bg-current" />
        </span>
      </button>

      <DesktopMenuOverlay open={menuOpen} onClose={closeMenu} />
    </>
  );
}
