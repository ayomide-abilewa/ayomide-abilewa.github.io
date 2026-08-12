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
  openGraph: {
    type: 'profile',
    siteName: 'Ayomide Abilewa',
    title: 'Ayomide Abilewa — Embedded Systems & Instrumentation',
    description: DESCRIPTION,
    url: SITE_URL,
    firstName: 'Ayomide',
    lastName: 'Abilewa',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: 'Ayomide Abilewa — embedded systems and instrumentation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayomide Abilewa — Embedded Systems & Instrumentation',
    description: DESCRIPTION,
    images: ['/og/default.png'],
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
 * Pre-paint decisions, inlined and synchronous.
 *
 * Two things have to be known before the browser paints anything:
 *
 *   1. Which visitor mode applies — otherwise someone opening /research from a
 *      shared link gets a frame of the dark engineering theme before the light
 *      paper theme takes over. Route wins over the stored session choice, since
 *      the route is an explicit request.
 *   2. Whether the opening sequence will run — otherwise the page paints once,
 *      revealed, and is then covered by the curtain, which looks like a bug.
 *      Deciding here also means reduced-motion and returning visitors never see
 *      a black shade flash on their way to content they were always going to get.
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
      </head>
      <body className="min-h-dvh bg-surface font-sans text-body text-content antialiased">
        {/* Holds the dark until <Opening> mounts its own curtain over it. */}
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
