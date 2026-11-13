import { profile } from '@/data/profile'
import { ActionButton } from '@/components/section/Cta'

/** Closing call to action on the home page: the email address, large. */
export function ContactBand() {
  const { email, links } = profile.identity
  return (
    <section className="contact-band relative overflow-hidden border-t border-hairline" aria-labelledby="contact-band-heading">
      <div className="shell py-section">
        <p className="eyebrow mb-4">Say hello</p>
        <h2 id="contact-band-heading" className="max-w-[18ch] text-h1 font-medium tracking-tight text-balance">
          Have something that needs to work outside the lab?
        </h2>
        <a
          href={`mailto:${email}`}
          className="big-mail mt-10 inline-block break-all font-medium tracking-tight text-content"
        >
          {email}
        </a>
        <div className="mt-10 flex flex-wrap gap-3">
          <ActionButton action={{ label: 'Contact page', href: '/contact/' }} />
          <ActionButton action={{ label: links.github.label, href: links.github.href, external: true }} />
          <ActionButton action={{ label: links.linkedin.label, href: links.linkedin.href, external: true }} />
        </div>
      </div>
    </section>
  )
}
