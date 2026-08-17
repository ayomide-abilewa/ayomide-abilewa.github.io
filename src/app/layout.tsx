import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { ModeProvider } from '@/lib/mode'
import { SiteChrome } from '@/components/chrome/SiteChrome'
import { profile } from '@/data/profile'

/**
 * One type superfamily, three voices.
 *
 * IBM Plex was designed for technical and engineering contexts and ships Sans,
 * Serif and Mono as siblings. The engineering path leans on Sans and Mono, the
 * research path on Serif — different registers that are provably the same
 * family, which is exactly the "one person, different perspectives" brief.
 */
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex-sans',
})

const plexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex-serif',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
})

const SITE_URL = 'https://ayomide-abilewa.github.io'

const DESCRIPTION =
  'Ayomide Abilewa builds embedded and computer-vision systems designed for the conditions that break them. Electrical and electronics engineering student at Obafemi Awolowo University, currently on Chevron Nigeria’s electrical and instrumentation team.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ayomide Abilewa — Embedded Systems & Instrumentation',
    template: '%s — Ayomide Abilewa',
  },
  description: DESCRIPTION,
  applicationName: 'Ayomide Abilewa',
  authors: [{ name: 'Ayomide Abilewa', url: SITE_URL }],
  creator: 'Ayomide Abilewa',
  keywords: [
    'Ayomide Abilewa',
    'embedded systems',
    'instrumentation',
    'electrical and electronics engineering',
    'computer vision',
    'control systems',
    'ESP32',
    'Obafemi Awolowo University',
    'Chevron Nigeria',
  ],
  alternates: { canonical: '/' },
  /**
   * No `images` key on either block, deliberately.
   *
   * Every route ships an `opengraph-image.tsx`, and Next's file convention
   * populates og:image AND twitter:image from it. Declaring images here as well
   * used to win the twitter tag and point it at /og/default.png, which has never
   * existed — so every X share rendered a broken card while og:image was fine.
   */
  openGraph: {
    type: 'profile',
    siteName: 'Ayomide Abilewa',
    title: 'Ayomide Abilewa — Embedded Systems & Instrumentation',
    description: DESCRIPTION,
    url: SITE_URL,
    firstName: 'Ayomide',
    lastName: 'Abilewa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayomide Abilewa — Embedded Systems & Instrumentation',
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#070B0D' },
    { media: '(prefers-color-scheme: light)', color: '#FBF9F5' },
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark light',
}

/** Person structured data. Facts only — same source as the CVs. */
function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.identity.name,
    url: SITE_URL,
    email: `mailto:${profile.identity.email}`,
    jobTitle: 'Electrical and Electronics Engineering Student',
    description: DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
      addressCountry: 'NG',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Obafemi Awolowo University',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ile-Ife',
        addressRegion: 'Osun State',
        addressCountry: 'NG',
      },
    },
    knowsAbout: [
      'Embedded systems',
      'Instrumentation and control',
      'Computer vision',
      'Control systems',
      'Power systems',
    ],
    sameAs: [profile.identity.links.github.href, profile.identity.links.linkedin.href],
  }
}

/**
 * Analytics, only if asked for.
 *
 * `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is read at build time — Next inlines the value
 * and dead-code-eliminates this whole block when it is unset, which is the only
 * way to gate a third-party script in a static export. Unset is the default and
 * what ships today: no request to any third party appears in the HTML, and
 * `track()` degrades to nothing. See lib/analytics.ts.
 *
 * To turn it on: create the site in Plausible, then build with
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=ayomide-abilewa.github.io npm run build
 * or set the same variable in the GitHub Actions workflow env.
 *
 * The stub matters. Plausible's script is `defer`red, so it does not exist for
 * the first second or so of the page — exactly when someone picks a path. The
 * stub gives `window.plausible` a queue immediately; the real script drains it on
 * arrival, so early events are counted rather than dropped.
 */
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
const PLAUSIBLE_STUB =
  'window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}'

/**
 * Pre-paint decisions, inlined and synchronous.
 *
 * Two things have to be known before the browser paints anything:
 *
 *   1. Which visitor mode applies — otherwise someone opening /research from a
 *      shared link gets a frame of the dark engineering theme before the light
 *      paper theme takes over. Route wins over the stored session choice, since
 *      the route is an explicit request.
 *   2. Whether the opening sequence will run — otherwise the page paints once,
 *      revealed, and is then covered by the opening field, which looks like a bug.
 *      Deciding here also means reduced-motion visitors, and anyone who has
 *      already watched it this session, never see a black shade flash on their way
 *      to content they were always going to get.
 *
 * Kept to a few hundred bytes, wrapped in try/catch (private browsing throws on
 * sessionStorage), and a no-op when scripting is off — nothing is hidden by
 * default, so a scriptless visitor simply gets the plain page.
 */
const PRE_PAINT = `(function(){try{
var d=document.documentElement,s=null;
try{s=sessionStorage}catch(e){}
var p=location.pathname.replace(/\\/+$/,'')||'/';
var byPath={'/engineering':'engineering','/research':'research','/scholarship':'scholarship','/everything':'everything'};
var m=byPath[p]||(s&&s.getItem('aa.mode'))||null;
if(m&&/^(engineering|research|scholarship|everything)$/.test(m)){d.classList.add('mode-'+m);d.setAttribute('data-mode',m);}
if(p!=='/')return;
if(s&&s.getItem('aa.intro')==='seen')return;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.setAttribute('data-intro','on');
}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
        {PLAUSIBLE_DOMAIN && (
          <>
            <script
              defer
              data-domain={PLAUSIBLE_DOMAIN}
              src="https://plausible.io/js/script.js"
            />
            <script dangerouslySetInnerHTML={{ __html: PLAUSIBLE_STUB }} />
          </>
        )}
      </head>
      <body className="min-h-dvh bg-surface font-sans text-body text-content antialiased">
        {/* Holds the dark until <Opening> mounts its own field over it. */}
        <div className="intro-shade" aria-hidden="true" />
        <script
          type="application/ld+json"
          // Static, build-time JSON from typed data — no user input involved.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <ModeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ModeProvider>
      </body>
    </html>
  )
}
