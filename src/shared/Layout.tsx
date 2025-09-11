import { NavLink, Outlet } from 'react-router-dom';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Layout component shared across all pages.  It renders a header
 * with navigation links, a main content area and a footer.  GSAP
 * is used to animate page transitions: when the route changes the
 * .page element fades in and slides up slightly.
 */
export default function Layout() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle page mount animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-1 pl-3 border-l transition-colors ${
      isActive
        ? 'border-[var(--ink)] text-[var(--ink)] font-medium'
        : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
    }`;

  return (
    <div ref={containerRef} className="app-shell min-h-screen">
      <div className="container mx-auto px-6 md:px-10 py-8 md:py-12">
        <div className="grid gap-8 md:gap-12 md:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="mb-4">
              <div className="text-xl font-semibold tracking-tight">JAYU Music</div>
              <div className="text-sm opacity-70 leading-snug">Digital Music · Youth Program</div>
            </div>
            <nav className="flex flex-col gap-1 text-sm">
              <NavLink to="/" end className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/lessons" className={linkClass}>
                Lessons
              </NavLink>
              <NavLink to="/exercises" className={linkClass}>
                Exercises
              </NavLink>
              <NavLink to="/resources" className={linkClass}>
                Resources
              </NavLink>
              <NavLink to="/showcase" className={linkClass}>
                Showcase
              </NavLink>
            </nav>
          </aside>

          {/* Content */}
          <main className="page">
            <Outlet />
            <div className="mt-10 text-xs opacity-60">© {new Date().getFullYear()} — JAYU</div>
          </main>
        </div>
      </div>
    </div>
  );
}
