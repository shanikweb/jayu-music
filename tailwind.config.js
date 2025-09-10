// Tailwind CSS configuration.  This file specifies which files to
// scan for class names and extends the default theme to utilise
// CSS custom properties defined in src/index.css.  See
// https://tailwindcss.com/docs/configuration for more details.
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        accentBg: 'var(--accent-bg)',
        divider: 'var(--divider)',
        navAccent: 'var(--nav-accent)',
      },
      fontFamily: {
        sans: ['Neue Montreal', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        DEFAULT: '16px',
      },
    },
  },
  plugins: [],
};