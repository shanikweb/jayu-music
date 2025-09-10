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

  // Animate child pages when they mount using GSAP.  This hook runs
  // after every render and sets up a context to clean up animations
  // on unmount.  Without the context GSAP can leak references.
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

  return (
    <div ref={containerRef} className="app-shell flex flex-col min-h-screen">
      <header className="container mx-auto flex items-center gap-4 py-6">
        <div className="font-bold text-lg">JAYU Music</div>
        <nav className="ml-auto flex gap-6">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'underline' : '')}>
            Home
          </NavLink>
          <NavLink to="/lessons" className={({ isActive }) => (isActive ? 'underline' : '')}>
            Lessons
          </NavLink>
          <NavLink to="/exercises" className={({ isActive }) => (isActive ? 'underline' : '')}>
            Exercises
          </NavLink>
          <NavLink to="/resources" className={({ isActive }) => (isActive ? 'underline' : '')}>
            Resources
          </NavLink>
          <NavLink to="/showcase" className={({ isActive }) => (isActive ? 'underline' : '')}>
            Showcase
          </NavLink>
        </nav>
      </header>
      <main className="main container mx-auto page flex-1">
        <Outlet />
      </main>
      <footer className="container mx-auto py-4 text-sm opacity-75">
        Built with love — © {new Date().getFullYear()}
      </footer>
    </div>
  );
}