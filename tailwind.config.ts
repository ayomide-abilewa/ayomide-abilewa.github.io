import type { Config } from 'tailwindcss'

/**
 * Design tokens.
 *
 * Identity: instrumentation. A dark scope-bezel ink, warm paper, and one accent
 * per visitor mode. The type scale and spacing rhythm are shared by every mode —
 * that shared skeleton is what makes four different-looking paths read as one
 * site. Only surface and accent change.
 *
 * Deliberately absent: purple, multi-stop gradients, glow/shadow-heavy cards.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Scope-bezel dark. Slight cyan cast so it reads as instrument, not "web dark mode".
        ink: {
          950: '#070B0D',
          900: '#0D1417',
          850: '#131C20',
          800: '#1A252A',
          700: '#24333A',
          600: '#35474F',
          500: '#4C6169',
          400: '#6E858D',
          300: '#97A9AF',
        },
        // Warm paper for the research/academic register.
        paper: {
          50: '#FBF9F5',
          100: '#F5F1EA',
          200: '#EAE4D9',
          300: '#D8CFC0',
          400: '#B8AB97',
        },
        // Engineering accent — signal amber, the colour of a live trace.
        signal: {
          300: '#F5C97A',
          400: '#EDB158',
          500: '#E09A2E',
          600: '#BE7C1C',
        },
        // Research accent — probe teal.
        probe: {
          300: '#7FB8C4',
          400: '#4E96A6',
          500: '#2E7488',
          600: '#1F5A6B',
        },
        // Scholarship accent — clay. Human, warm, not corporate blue.
        ember: {
          300: '#E8A98D',
          400: '#D98460',
          500: '#C4643A',
          600: '#A34D28',
        },
        // Semantic aliases driven by CSS custom properties so a mode switch is
        // a single class change on <html> rather than a re-render of every leaf.
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised) / <alpha-value>)',
        'surface-sunken': 'rgb(var(--surface-sunken) / <alpha-value>)',
        content: 'rgb(var(--content) / <alpha-value>)',
        'content-muted': 'rgb(var(--content-muted) / <alpha-value>)',
        'content-faint': 'rgb(var(--content-faint) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-strong': 'rgb(var(--accent-strong) / <alpha-value>)',
        /** The reference colour each mode is read against: graticule, annotation, olive. */
        'accent-alt': 'rgb(var(--accent-alt) / <alpha-value>)',
        hairline: 'rgb(var(--hairline) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-plex-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Fluid modular scale. Single source for every mode.
        micro: ['0.6875rem', { lineHeight: '1.45', letterSpacing: '0.08em' }],
        caption: ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        body: ['1rem', { lineHeight: '1.65' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.7' }],
        lead: ['clamp(1.125rem, 0.95rem + 0.7vw, 1.375rem)', { lineHeight: '1.55' }],
        h4: ['clamp(1.0625rem, 0.98rem + 0.35vw, 1.1875rem)', { lineHeight: '1.4', letterSpacing: '-0.005em' }],
        h3: ['clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        h2: ['clamp(1.625rem, 1.3rem + 1.4vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.018em' }],
        h1: ['clamp(2.125rem, 1.5rem + 2.8vw, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        display: ['clamp(2.75rem, 1.4rem + 6vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
      },
      spacing: {
        gutter: 'clamp(1.25rem, 0.6rem + 3vw, 3rem)',
        section: 'clamp(4rem, 2rem + 9vw, 8.5rem)',
      },
      maxWidth: {
        measure: '68ch', // comfortable reading measure for body copy
        shell: '84rem',
      },
      borderRadius: {
        // Restrained. Instruments have square corners; only controls get radius.
        DEFAULT: '2px',
        control: '3px',
        panel: '4px',
      },
      transitionTimingFunction: {
        // Mechanical: fast out, hard stop. Used for the engineering register.
        mech: 'cubic-bezier(0.2, 0.9, 0.1, 1)',
        // Settle: mimics a lightly-damped second-order response.
        settle: 'cubic-bezier(0.16, 1.08, 0.3, 1)',
        // Paper: slow, even. Research register.
        paper: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'trace-in': {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
        'rise': {
          from: { opacity: '0', transform: 'translate3d(0, 12px, 0)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'trace-in': 'trace-in 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        rise: 'rise 0.5s cubic-bezier(0.16, 1.08, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
