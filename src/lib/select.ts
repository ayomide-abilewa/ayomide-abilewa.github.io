import type {
  CvVariant,
  Experience,
  LeadershipRole,
  Project,
  SkillGroup,
  VisitorMode,
} from '@/data/types'
import { profile } from '@/data/profile'

/**
 * Audience selection.
 *
 * The site and the CV generator share these functions, which is what makes
 * "switching mode reorganises content" true rather than cosmetic: ordering,
 * inclusion and bullet emphasis all come from one place.
 */

/** Each CV variant is the document form of one visitor path. */
const MODE_FOR_VARIANT: Record<CvVariant, VisitorMode> = {
  technical: 'engineering',
  research: 'research',
  scholarship: 'scholarship',
  general: 'everything',
}

function byRank<T extends { rank: Partial<Record<VisitorMode, number>> }>(
  items: T[],
  mode: VisitorMode,
): T[] {
  return items
    .filter((item) => typeof item.rank[mode] === 'number')
    .sort((a, b) => (a.rank[mode] ?? 99) - (b.rank[mode] ?? 99))
}

/** Projects surfaced in a path, in that path's order. */
export function projectsForMode(mode: VisitorMode): Project[] {
  return byRank(profile.projects, mode)
}

export function experienceForMode(mode: VisitorMode): Experience[] {
  return byRank(profile.experience, mode)
}

export function leadershipForMode(mode: VisitorMode): LeadershipRole[] {
  return byRank(profile.leadership, mode)
}

export function projectBySlug(slug: string): Project | undefined {
  return profile.projects.find((p) => p.slug === slug)
}

/**
 * The complete project index in the order a given lens should read it.
 *
 * Ranked projects first, then everything the lens does not rank, chronologically.
 * Ordering rather than filtering: /work is an index, so a project that a path does
 * not lead with still belongs in it — it just does not come first. Shared by /work
 * and by the previous/next control on each case study, so the two agree.
 */
export function indexOrderForMode(mode: VisitorMode): { ranked: Project[]; rest: Project[] } {
  const ranked = projectsForMode(mode)
  const inLens = new Set(ranked.map((p) => p.slug))
  const rest = projectsForMode('everything').filter((p) => !inLens.has(p.slug))
  return { ranked, rest }
}

/** Neighbours of a project in the current lens's index order. */
export function projectNeighbours(
  slug: string,
  mode: VisitorMode,
): { previous?: Project; next?: Project } {
  const { ranked, rest } = indexOrderForMode(mode)
  const order = [...ranked, ...rest]
  const at = order.findIndex((p) => p.slug === slug)
  if (at === -1) return {}
  return { previous: order[at - 1], next: order[at + 1] }
}

/** Every slug, for generateStaticParams and the sitemap. */
export function allProjectSlugs(): string[] {
  return profile.projects.map((p) => p.slug)
}

/**
 * The lead framing sentence for a project in a given path, falling back to the
 * project's own tagline where no path-specific framing was written.
 */
export function framingFor(project: Project, mode: VisitorMode): string {
  return project.framing[mode] ?? project.tagline
}

export function skillsForVariant(variant: CvVariant): SkillGroup[] {
  return profile.skills.filter((group) => group.emphasis.includes(variant))
}

export function certificationsForVariant(variant: CvVariant) {
  return profile.certifications.filter((c) => c.emphasis.includes(variant))
}

/** Bullets tagged for this CV variant. This is the tailoring mechanism. */
export function bulletsFor(
  source: { bullets: { text: string; emphasis: CvVariant[] }[] },
  variant: CvVariant,
): string[] {
  return source.bullets.filter((b) => b.emphasis.includes(variant)).map((b) => b.text)
}

/**
 * How many bullets a single entry may contribute to a CV.
 *
 * The website carries every bullet: it has the room, and a reader who chose to be
 * on that page. A document does not, and the discipline of cutting is most of what
 * separates a CV somebody set from a CV something assembled — five bullets under
 * every single role is the shape of a data dump, and a reader working through forty
 * applications reads the first two of each anyway. Four is the professional
 * convention for a role worth detailing, and nothing here needs more.
 *
 * Bullets in `profile.ts` are authored strongest-first, so taking the head of the
 * list is a priority cut rather than a truncation. `general` is tightest because it
 * is the version read without a specific question in mind, and because it is the
 * only one carrying every section: breadth gets paid for in depth.
 */
export const CV_BULLET_LIMIT: Record<CvVariant, number> = {
  technical: 4,
  research: 4,
  scholarship: 4,
  general: 3,
}

/**
 * Bullets for one entry of a CV: tagged for the variant, capped, strongest first.
 *
 * Deliberately separate from `bulletsFor`. The site pages call that one and show
 * everything; only the four documents — and the preview that promises to match
 * them — come through here.
 */
export function cvBulletsFor(
  source: { bullets: { text: string; emphasis: CvVariant[] }[] },
  variant: CvVariant,
): string[] {
  return bulletsFor(source, variant).slice(0, CV_BULLET_LIMIT[variant])
}

/** Section identifiers used by the CV templates. */
export type CvSection =
  | 'summary'
  | 'education'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'research-interests'
  | 'leadership'
  | 'certifications'

/**
 * Section order per variant — the structural half of CV tailoring.
 *
 * A technical reader wants skills and systems built before anything else. An
 * academic reader wants education and research interests first. A scholarship
 * reviewer wants the journey and the community work near the top. Same facts,
 * different reading order.
 */
export const CV_SECTION_ORDER: Record<CvVariant, CvSection[]> = {
  technical: [
    'summary',
    'skills',
    'experience',
    'projects',
    'education',
    'certifications',
    'leadership',
  ],
  research: [
    'summary',
    'education',
    'research-interests',
    'projects',
    'experience',
    'skills',
    'certifications',
    'leadership',
  ],
  scholarship: [
    'summary',
    'education',
    'leadership',
    'experience',
    'projects',
    'certifications',
    'skills',
  ],
  general: [
    'summary',
    'education',
    'experience',
    'projects',
    'skills',
    'leadership',
    'certifications',
  ],
}

/** Per-variant section headings. Wording matters to each audience. */
export const CV_SECTION_TITLES: Record<CvVariant, Partial<Record<CvSection, string>>> = {
  technical: {
    summary: 'Profile',
    skills: 'Technical Skills',
    experience: 'Engineering Experience',
    projects: 'Selected Projects',
    education: 'Education',
    certifications: 'Training and Certifications',
    leadership: 'Leadership and Teaching',
  },
  research: {
    summary: 'Research Profile',
    education: 'Education',
    'research-interests': 'Research Interests',
    projects: 'Research and Technical Projects',
    experience: 'Research and Engineering Experience',
    skills: 'Technical Skills',
    certifications: 'Training and Certifications',
    leadership: 'Teaching and Academic Service',
  },
  scholarship: {
    summary: 'Profile',
    education: 'Education',
    leadership: 'Leadership and Community Impact',
    experience: 'Experience',
    projects: 'Projects',
    certifications: 'Training and Certifications',
    skills: 'Technical Skills',
  },
  general: {
    summary: 'Profile',
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Technical Skills',
    leadership: 'Leadership and Teaching',
    certifications: 'Training and Certifications',
  },
}

/**
 * How many projects each variant carries, and how much of each.
 * Length and detail level are part of tailoring, not an accident.
 *
 * The technical CV is the only one that takes all five, because a hiring engineer
 * reading it is looking for range. The other three take four, which is what fits
 * once each project is given three bullets rather than one — four projects with
 * evidence beats five projects with a line each, and the page-count readback in
 * `scripts/build-cvs.tsx` is what settled the number.
 */
export const CV_PROJECT_LIMIT: Record<CvVariant, number> = {
  technical: 5,
  research: 4,
  scholarship: 4,
  general: 4,
}

/** Research CV lists coursework; a technical CV does not need it. */
export const CV_SHOWS_COURSEWORK: Record<CvVariant, boolean> = {
  technical: false,
  research: true,
  scholarship: true,
  general: false,
}

/**
 * How many leadership entries each variant carries.
 *
 * Five is the whole set, and only the scholarship CV should print all five: for
 * that reader the community work *is* the case, so the campus ambassador role and
 * the departmental editorial work earn their lines. Everywhere else they are the
 * fourth and fifth most interesting thing in the section, and a reader who has
 * already seen SPAW and the Zero-to-Hero workshop learns nothing new from them. A
 * CV that lists everything is asking the reader to do the editing.
 *
 * The full CV takes two rather than three because it is the only variant carrying
 * every section at once, and something has to give: it inherits the technical CV's
 * six skill lines *and* the scholarship CV's entry count, which is exactly 70pt
 * more than two pages hold. Two leadership entries is what that costs.
 */
export const CV_LEADERSHIP_LIMIT: Record<CvVariant, number> = {
  technical: 2,
  research: 3,
  scholarship: 5,
  general: 2,
}

export function projectsForVariant(variant: CvVariant): Project[] {
  const mode = MODE_FOR_VARIANT[variant]
  return projectsForMode(mode).slice(0, CV_PROJECT_LIMIT[variant])
}

export function experienceForVariant(variant: CvVariant): Experience[] {
  return experienceForMode(MODE_FOR_VARIANT[variant])
}

export function leadershipForVariant(variant: CvVariant): LeadershipRole[] {
  const mode = MODE_FOR_VARIANT[variant]
  // Ranked first, then cut — so each variant keeps the entries that matter to it.
  return leadershipForMode(mode).slice(0, CV_LEADERSHIP_LIMIT[variant])
}

/**
 * Human-readable purpose of each CV, shown on /cv.
 *
 * Deliberately not parallel in construction. Four descriptions that all opened
 * "Leads with..." was the giveaway that one template had produced all four, so each
 * now says the thing it needs to say in its own shape.
 */
export const CV_DESCRIPTIONS: Record<CvVariant, { title: string; bestFor: string }> = {
  technical: {
    title: 'Technical CV',
    bestFor:
      'Engineering, software, AI, robotics and embedded systems roles. Skills and systems built come first, with the technologies behind each one named.',
  },
  research: {
    title: 'Research CV',
    bestFor:
      'Research internships, lab positions and graduate applications. Opens on education and research interests, then the investigations that back them up.',
  },
  scholarship: {
    title: 'Scholarship CV',
    bestFor:
      'Scholarships, fellowships and academic programmes. Academic background first, then teaching, leadership and who the work has reached.',
  },
  general: {
    title: 'Full CV',
    bestFor:
      'A balanced read across all of it — engineering, research and teaching — rather than depth in one. The safe choice if you are not sure which of the other three fits.',
  },
}

/**
 * Filename stem per variant, without extension.
 *
 * Exported because the build script needs the same strings: if these lived in two
 * places, a rename would silently break every download link on /cv.
 */
export const CV_STEM: Record<CvVariant, string> = {
  technical: 'Ayomide-Abilewa-Technical-CV',
  research: 'Ayomide-Abilewa-Research-CV',
  scholarship: 'Ayomide-Abilewa-Scholarship-CV',
  general: 'Ayomide-Abilewa-CV',
}

/** File paths for generated documents, used by /cv and by the build script. */
export function cvFile(variant: CvVariant, format: 'pdf' | 'docx'): string {
  return `/cv/${CV_STEM[variant]}.${format}`
}

/**
 * Measured shape of one CV variant.
 *
 * /cv uses this to show what genuinely differs between the four documents
 * rather than asserting that they differ. Counted from the same
 * selection functions the generator runs, so the numbers cannot drift from the
 * files people download.
 */
export type CvShape = {
  sections: CvSection[]
  projects: number
  experience: number
  leadership: number
  skillGroups: number
  certifications: number
  /** Bullets selected across experience, projects, leadership and education. */
  bullets: number
  coursework: boolean
}

export function cvShape(variant: CvVariant): CvShape {
  const projects = projectsForVariant(variant)
  const experience = experienceForVariant(variant)
  const leadership = leadershipForVariant(variant)

  // `cvBulletsFor`, not `bulletsFor` — this number is printed on /cv as a fact
  // about the downloadable files, so it has to count what those files carry.
  const bullets =
    experience.reduce((n, item) => n + cvBulletsFor(item, variant).length, 0) +
    projects.reduce((n, item) => n + cvBulletsFor(item, variant).length, 0) +
    leadership.reduce((n, item) => n + cvBulletsFor(item, variant).length, 0) +
    profile.education.reduce((n, item) => n + cvBulletsFor(item, variant).length, 0)

  return {
    sections: CV_SECTION_ORDER[variant],
    projects: projects.length,
    experience: experience.length,
    leadership: leadership.length,
    skillGroups: skillsForVariant(variant).length,
    certifications: certificationsForVariant(variant).length,
    bullets,
    coursework: CV_SHOWS_COURSEWORK[variant],
  }
}

/** Section labels for the comparison table on /cv. Short, audience-neutral. */
export const CV_SECTION_SHORT: Record<CvSection, string> = {
  summary: 'Profile',
  education: 'Education',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  'research-interests': 'Research interests',
  leadership: 'Leadership',
  certifications: 'Certifications',
}
