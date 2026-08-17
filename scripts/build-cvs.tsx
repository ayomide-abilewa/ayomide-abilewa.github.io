import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import React from 'react'
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'
import {
  AlignmentType,
  BorderStyle,
  Document as DocxDocument,
  Footer,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageNumber,
  Paragraph,
  TabStopType,
  TextRun,
} from 'docx'
import { CV_VARIANTS } from '../src/data/types'
import { buildDocument, type CvDocument, type Line } from './cv-document'

/**
 * Generates eight files: four CV variants × { PDF, DOCX }.
 *
 *   npm run cv
 *
 * Both formats render from `./cv-document.ts`, so the PDF and the Word file for a
 * given variant contain the same text in the same order. Nothing here decides
 * *what* goes in a CV — that is `src/lib/select.ts`, shared with the website.
 *
 * ATS rules this obeys:
 *   - one column, no tables, no text boxes, no images, no icons
 *   - standard fonts only: Helvetica in the PDF, Calibri in the Word file
 *   - real selectable text in both; the DOCX is authored as Word paragraphs, not
 *     a picture of a PDF, so a recruiter can edit it and a parser can read it
 *   - dates and headings as plain text in reading order
 *   - bare URLs rather than hyperlink markup, which parsers mangle less often
 *
 * Colour and rules are not on that list because they cost nothing: a parser reads
 * the text stream and never sees them, so the ink below and the hairlines are
 * free to do the work of making the page look set by a person.
 *
 * The bullet character is "•" with a real indent rather than a hyphen: Word
 * numbering carries the semantics for accessibility, and the PDF draws the glyph
 * in a fixed-width column so wrapped lines align under the text, not the bullet.
 */

const OUT_DIR = join(process.cwd(), 'public', 'cv')

// --------------------------------------------------------------------------
// Measure
// --------------------------------------------------------------------------

/**
 * The page box, in points. A4 is 595.28 × 841.89.
 *
 * The margins are deliberately asymmetric — 54pt in from the left, 72pt in from the
 * right — which leaves a 469pt text column instead of the 503pt one this file used
 * to set. At 9.6pt Helvetica that is roughly 97 characters a line. Still wide for
 * continuous prose, and it is a compromise: pulling it to the 70-odd characters a
 * book would use costs a third page, and two pages is the brief. What makes 97
 * readable is the rest of the change — ragged right instead of justified, more
 * leading than before, and headings you can find without reading them.
 *
 * The first version of this pass set the right margin at 88pt for a 453pt column,
 * and the page-count readback at the bottom of this file immediately caught what
 * that cost: three of the four variants ran to three pages. 72pt is where the
 * column gets most of the benefit and the documents still close on two.
 *
 * The wide right margin is not wasted space. Dates hang at its edge, so the eye
 * gets a straight vertical line to scan down for chronology, which is the second
 * thing anybody looks for after the name.
 */
const PAGE = { top: 46, bottom: 40, left: 54, right: 72 } as const
const MEASURE = Math.round(595 - PAGE.left - PAGE.right)

/** One body size, shared by both formats so they cannot drift apart. */
const BODY = 9.6

// --------------------------------------------------------------------------
// Ink
// --------------------------------------------------------------------------

/**
 * Two hues, and that is the whole palette.
 *
 * The text ramp is warm neutral: each step carries a little more red than green
 * and a little more green than blue, which is how ink on off-white stock actually
 * looks. The earlier draft stopped there, and five warm greys on white is not a
 * design — it is the absence of one. A reader who has seen a hundred generated
 * documents has seen that page.
 *
 * So there is one accent, and it is borrowed rather than invented: `#1E5A6B` is
 * the `--accent-strong` of the website's research mode, the register the site
 * already uses for the printed page. Amber is the house colour on screen and is
 * unreadable on paper at this size; the teal is the same idea translated into ink.
 * It appears four times — the role line, the section labels, the section rules,
 * the bullets — and nowhere else. Four is a rhythm. Six would be decoration.
 *
 * Stored as bare hex because Word wants it that way; `ink()` adds the `#` for the
 * PDF. One source, so the two formats cannot disagree about colour either.
 *
 * Contrast against white, measured: body 16.9:1, secondary 10.7:1, meta 5.9:1,
 * accent 6.6:1 — all past AA, which matters because these are read on screen
 * before they are ever printed. `accentSoft` and `accentFaint` carry no text.
 */
const INK = {
  /** Body text. Near-black, warm, never pure #000. */
  body: '191614',
  /** Organisation names, and the subtitle half of an entry line. */
  secondary: '43403C',
  /** Dates, locations, coursework, repository lines, the folio. */
  meta: '6B635A',
  /** The role line, the section labels, the rule under the contact block. */
  accent: '1E5A6B',
  /** Bullet glyphs: the accent, stepped back so it marks without shouting. */
  accentSoft: '6E9CAA',
  /** The hairline above each section label. */
  accentFaint: 'BFD2D8',
} as const

const ink = (value: string) => `#${value}`

/**
 * Separator between an entry's title and its subtitle.
 *
 * A middot, not an em dash. Two reasons: an em dash pair is the loudest tell in
 * overly formal text, and the project entries put a comma-separated technology
 * list in the subtitle slot, where a comma separator would read as one more item.
 */
const SEP = ' · '

/**
 * Hanging indent for skill groups, in points, shared by both renderers so the two
 * formats cannot drift apart. Deliberately small: enough that a wrapped line is
 * visibly subordinate, not a label column, which at these label lengths would spend
 * a third of the measure on white space for the shortest of them.
 */
const HANG = 13

// --------------------------------------------------------------------------
// PDF
// --------------------------------------------------------------------------

/**
 * Vertical rhythm, in points, largest gap to smallest: 13 before a section rule,
 * 6.5 before an entry, 2 between bullets, 1 before a detail line. Every gap is
 * bigger than the one below it in the hierarchy and there are no near-ties, which
 * is what lets you see the structure of the page before you read a word of it.
 *
 * The ratios matter more than the absolute values, which is what made fitting the
 * documents back onto two pages a tuning job rather than a redesign: the whole
 * scale came down about 20% and the hierarchy it encodes is untouched.
 *
 * The section labels are 8.4pt against 9.6pt body, and that is on purpose. Set in
 * caps with 1.35pt of tracking, in the accent, under a rule, an 8.4pt label reads
 * as larger than the body it heads — cap height, colour and the rule do the work
 * that size would otherwise have to. The version of this file that set them at 9pt
 * bold black had them competing with the body text on the only axis they shared.
 */
const pdf = StyleSheet.create({
  page: {
    paddingTop: PAGE.top,
    paddingBottom: PAGE.bottom,
    paddingLeft: PAGE.left,
    paddingRight: PAGE.right,
    fontFamily: 'Helvetica',
    fontSize: BODY,
    lineHeight: 1.44,
    color: ink(INK.body),
  },

  name: { fontSize: 20, fontFamily: 'Helvetica-Bold', letterSpacing: -0.4 },
  role: { marginTop: 3, fontSize: 10.2, color: ink(INK.accent) },
  contact: { marginTop: 6, fontSize: 8.4, color: ink(INK.meta) },
  links: { marginTop: 1.5, fontSize: 8.4, color: ink(INK.meta) },
  rule: {
    marginTop: 9,
    marginBottom: 2,
    borderBottomWidth: 1.2,
    borderBottomColor: ink(INK.accent),
  },

  /** The rule belongs above the label, marking the boundary the label then names. */
  sectionWrap: {
    marginTop: 13,
    marginBottom: 3,
    paddingTop: 4,
    borderTopWidth: 0.7,
    borderTopColor: ink(INK.accentFaint),
  },
  section: {
    fontSize: 8.4,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.35,
    color: ink(INK.accent),
  },

  /** Ragged right. Justified text at this measure with no hyphenation gives rivers. */
  paragraph: { marginTop: 2 },

  /**
   * Hanging indent for skill groups: the first line starts at the margin, every
   * wrapped line clears the label. Without it a continuation lands flush left, in
   * the same column as the labels themselves, so "Weighted Boxes Fusion, OpenCV"
   * reads as another skill group whose label went missing.
   *
   * Two non-obvious parts. It is padding plus a *negative* first-line indent, which
   * is the only route to a hanging indent here — the bullet rows use a fixed-width
   * flex column instead, and that only works because a bullet glyph is always
   * exactly one character wide, where these labels run from "Tools" to
   * "Instrumentation and Control".
   *
   * And the negative indent has to sit on the label run rather than on the wrapper,
   * even though it is the wrapper's paragraph it indents. @react-pdf's line layout
   * reads it as `paragraph.runs[0].attributes.indent` — the first run's own style —
   * and a nested Text does not inherit textIndent from its parent. On the wrapper
   * alone it resolves to 0 and the whole block just shifts right by HANG with no
   * hanging indent at all, which is silent: there is no warning, and the output
   * looks deliberate.
   */
  skills: { marginTop: 2, paddingLeft: HANG },
  skillsLabel: { fontFamily: 'Helvetica-Bold', textIndent: -HANG },

  entryRow: { marginTop: 6.5, flexDirection: 'row', justifyContent: 'space-between' },
  /** An entry with nothing under it. Tighter, so a run of them reads as a list. */
  entryRowTight: { marginTop: 3.5, flexDirection: 'row', justifyContent: 'space-between' },
  entryTitle: { flexShrink: 1, paddingRight: 14 },
  entryBold: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  entrySub: { color: ink(INK.secondary) },
  entryMeta: { flexShrink: 0, fontSize: 8.4, color: ink(INK.meta), textAlign: 'right' },

  detail: { marginTop: 1, fontSize: 8.6, color: ink(INK.meta) },

  bulletRow: { marginTop: 2, flexDirection: 'row' },
  bulletGlyph: { width: 11, color: ink(INK.accentSoft) },
  bulletText: { flex: 1 },

  /** Folio, so a printed copy that gets separated can be put back together. */
  folio: {
    position: 'absolute',
    bottom: 22,
    left: PAGE.left,
    right: PAGE.right,
    fontSize: 7.8,
    color: ink(INK.meta),
    textAlign: 'right',
  },
})

function PdfLine({ line }: { line: Line }) {
  switch (line.kind) {
    case 'section':
      return (
        // `wrap={false}` stops the label itself splitting; `minPresenceAhead` is what
        // stops it being stranded. A label is the one line on the page that is
        // worthless alone — "SELECTED PROJECTS" at the foot of page 1 with the first
        // project overleaf tells a reader nothing and costs them a page turn to find
        // out. 48pt reserves the label plus its first entry and the opening line of
        // that entry's first bullet, so a section either starts properly or starts on
        // the next page.
        //
        // Tuned by measuring, not guessed. 46 stranded the label; 64 was too greedy
        // and pushed the whole of SELECTED PROJECTS overleaf, leaving 100pt — seven
        // body lines — of white at the foot of page 1 of the technical CV. At 48 that
        // foot closes to 16pt: the heading, the aniwe entry and its first complete
        // bullet all land on page 1, and the reader turns the page mid-bullet-list,
        // which is the break they would not notice.
        <View style={pdf.sectionWrap} wrap={false} minPresenceAhead={48}>
          <Text style={pdf.section}>{line.text.toUpperCase()}</Text>
        </View>
      )

    case 'paragraph':
      return <Text style={pdf.paragraph}>{line.text}</Text>

    case 'skills':
      return (
        <Text style={pdf.skills}>
          <Text style={pdf.skillsLabel}>{`${line.label}: `}</Text>
          {line.items}
        </Text>
      )

    case 'entry':
      return (
        // `wrap={false}` keeps a role line from being orphaned at a page break.
        //
        // `minPresenceAhead` solves the other half of that problem, which the first
        // build had: an entry can sit unbroken at the foot of a page and still leave
        // its first bullet stranded at the top of the next one, so a reader turning
        // the page meets "Designed three-tier text-to-speech degradation…" with no
        // heading above it and no way to know what it belongs to. Reserving ~two
        // body lines means the heading moves down with its content instead. Not for
        // standalone entries: nothing follows them, so reserving space below only
        // pushes a certification onto the next page for no reason.
        <View
          style={line.standalone ? pdf.entryRowTight : pdf.entryRow}
          wrap={false}
          {...(line.standalone ? {} : { minPresenceAhead: 30 })}
        >
          <Text style={pdf.entryTitle}>
            <Text style={pdf.entryBold}>{line.title}</Text>
            {line.subtitle ? (
              <Text style={pdf.entrySub}>{`${SEP}${line.subtitle}`}</Text>
            ) : null}
          </Text>
          {line.meta ? <Text style={pdf.entryMeta}>{line.meta}</Text> : null}
        </View>
      )

    case 'detail':
      return <Text style={pdf.detail}>{line.text}</Text>

    case 'bullet':
      return (
        <View style={pdf.bulletRow}>
          <Text style={pdf.bulletGlyph}>•</Text>
          <Text style={pdf.bulletText}>{line.text}</Text>
        </View>
      )
  }
}

function PdfCv({ doc }: { doc: CvDocument }) {
  return (
    <Document
      title={`${doc.name} · ${doc.label}`}
      author={doc.name}
      subject={doc.title}
      creator={doc.name}
      producer={doc.name}
    >
      <Page size="A4" style={pdf.page}>
        <Text style={pdf.name}>{doc.name}</Text>
        <Text style={pdf.role}>{doc.title}</Text>
        <Text style={pdf.contact}>{doc.contact}</Text>
        <Text style={pdf.links}>{doc.links}</Text>
        <View style={pdf.rule} />

        {doc.lines.map((line, i) => (
          <PdfLine key={`${line.kind}-${i}`} line={line} />
        ))}

        {/* Nothing to fold back together on a one-page CV, so it says nothing. */}
        <Text
          fixed
          style={pdf.folio}
          render={({ pageNumber, totalPages }) =>
            totalPages > 1 ? `${doc.name}${SEP}${pageNumber} of ${totalPages}` : ''
          }
        />
      </Page>
    </Document>
  )
}

// --------------------------------------------------------------------------
// DOCX
// --------------------------------------------------------------------------

/** Half-points, the unit Word uses for font size. 9.6pt → 19. */
const PT = (points: number) => Math.round(points * 2)
/** Twips: 1pt = 20 twips. Used for spacing and indents. */
const TW = (points: number) => Math.round(points * 20)

/**
 * Word's `line` is relative to single spacing, where 240 is single — and single
 * for Calibri already carries about 1.15 of leading. 300 is therefore roughly the
 * 1.44 the PDF sets, not 1.25.
 */
const LEADING = 300

/**
 * Right tab stop for the date column, at the same 469pt the PDF's dates hang at.
 */
const RIGHT_TAB = TW(MEASURE)

function docxLine(line: Line): Paragraph {
  switch (line.kind) {
    case 'section':
      return new Paragraph({
        // A real Word heading, so the document has an outline a screen reader
        // and a parser can both follow.
        heading: HeadingLevel.HEADING_2,
        spacing: { before: TW(11), after: TW(3) },
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: INK.accentFaint, space: 4 } },
        keepNext: true,
        children: [
          new TextRun({
            text: line.text.toUpperCase(),
            bold: true,
            size: PT(8.4),
            color: INK.accent,
            characterSpacing: 27,
          }),
        ],
      })

    case 'paragraph':
      return new Paragraph({
        spacing: { after: TW(2), line: LEADING },
        children: [new TextRun({ text: line.text, size: PT(BODY) })],
      })

    case 'skills':
      return new Paragraph({
        spacing: { before: TW(2), after: TW(0), line: LEADING },
        // Word has a real hanging indent, so this is the one place the two renderers
        // differ in mechanism rather than in result. Same HANG either way, so a
        // change to the indent cannot land in one format and miss the other.
        indent: { left: TW(HANG), hanging: TW(HANG) },
        children: [
          new TextRun({ text: `${line.label}: `, bold: true, size: PT(BODY) }),
          new TextRun({ text: line.items, size: PT(BODY) }),
        ],
      })

    case 'entry':
      return new Paragraph({
        spacing: { before: TW(line.standalone ? 3 : 6), after: TW(0) },
        tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
        // Only where something follows that must not be separated from it.
        keepNext: !line.standalone,
        children: [
          new TextRun({ text: line.title, bold: true, size: PT(10) }),
          ...(line.subtitle
            ? [
                new TextRun({
                  text: `${SEP}${line.subtitle}`,
                  size: PT(BODY),
                  color: INK.secondary,
                }),
              ]
            : []),
          ...(line.meta
            ? [new TextRun({ text: `\t${line.meta}`, size: PT(8.4), color: INK.meta })]
            : []),
        ],
      })

    case 'detail':
      return new Paragraph({
        spacing: { before: TW(1), after: TW(0), line: 264 },
        children: [new TextRun({ text: line.text, size: PT(8.6), color: INK.meta })],
      })

    case 'bullet':
      return new Paragraph({
        numbering: { reference: 'cv-bullets', level: 0 },
        spacing: { before: TW(2), after: TW(0), line: LEADING },
        children: [new TextRun({ text: line.text, size: PT(BODY) })],
      })
  }
}

function docxFile(doc: CvDocument): DocxDocument {
  const head: Paragraph[] = [
    new Paragraph({
      spacing: { after: TW(2) },
      children: [new TextRun({ text: doc.name, bold: true, size: PT(20) })],
    }),
    new Paragraph({
      spacing: { after: TW(4) },
      children: [new TextRun({ text: doc.title, size: PT(10.2), color: INK.accent })],
    }),
    new Paragraph({
      spacing: { after: TW(0) },
      children: [new TextRun({ text: doc.contact, size: PT(8.4), color: INK.meta })],
    }),
    new Paragraph({
      spacing: { after: TW(4) },
      border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: INK.accent, space: 6 } },
      children: [new TextRun({ text: doc.links, size: PT(8.4), color: INK.meta })],
    }),
  ]

  /**
   * The PDF drops its folio when the document turns out to be one page; Word
   * cannot know that at authoring time, so this one always prints.
   */
  const folio = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: `${doc.name}${SEP}`, size: PT(7.8), color: INK.meta }),
          new TextRun({ children: [PageNumber.CURRENT], size: PT(7.8), color: INK.meta }),
          new TextRun({ text: ' of ', size: PT(7.8), color: INK.meta }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: PT(7.8), color: INK.meta }),
        ],
      }),
    ],
  })

  return new DocxDocument({
    title: `${doc.name} · ${doc.label}`,
    creator: doc.name,
    description: doc.title,
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: PT(BODY), color: INK.body } },
        heading2: { run: { font: 'Calibri', bold: true, color: INK.accent } },
      },
    },
    numbering: {
      config: [
        {
          reference: 'cv-bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: {
                // `run` belongs under `style`, not beside it. Put it at the top
                // level and docx's types reject it — and before this typechecked,
                // the glyph was quietly printing in body ink. It colours the
                // bullet only, never the text after it, same split as the PDF.
                run: { color: INK.accentSoft, size: PT(BODY) },
                paragraph: { indent: { left: TW(11), hanging: TW(11) } },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            // A4 in twips, with the PDF's asymmetric margins.
            size: { width: 11906, height: 16838 },
            margin: {
              top: TW(PAGE.top),
              bottom: TW(PAGE.bottom),
              left: TW(PAGE.left),
              right: TW(PAGE.right),
            },
          },
        },
        footers: { default: folio },
        children: [...head, ...doc.lines.map(docxLine)],
      },
    ],
  })
}

// --------------------------------------------------------------------------

/**
 * Page count, read back out of the PDF we just wrote.
 *
 * Two pages is the brief for all four, and it is a content constraint before it is
 * a typographic one: nobody experienced sends a three-page undergraduate CV, and
 * the fix when one runs long is to cut an entry, not to shave the leading. This
 * readback is what makes that decision visible — it caught the first draft of the
 * redesign at three pages, and it caught the full variant again after the bullet
 * cap, which is how the leadership limit in `select.ts` got its number.
 */
function pageCount(buffer: Buffer): number {
  const matches = buffer.toString('latin1').match(/\/Type\s*\/Page[^s]/g)
  return matches ? matches.length : 0
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  for (const variant of CV_VARIANTS) {
    const doc = buildDocument(variant)

    const pdfBuffer = await renderToBuffer(<PdfCv doc={doc} />)
    await writeFile(join(OUT_DIR, `${doc.stem}.pdf`), pdfBuffer)

    const docxBuffer = await Packer.toBuffer(docxFile(doc))
    await writeFile(join(OUT_DIR, `${doc.stem}.docx`), docxBuffer)

    const count = (kind: Line['kind']) => doc.lines.filter((l) => l.kind === kind).length
    console.log(
      `${variant.padEnd(12)} ${doc.stem}  ${pageCount(pdfBuffer)}pp  ` +
        `${count('section')} sections, ${count('entry')} entries, ` +
        `${count('bullet')} bullets, ${count('skills')} skill groups, ` +
        `${count('paragraph')} paragraphs, ${count('detail')} details  ` +
        `(pdf ${Math.round(pdfBuffer.length / 1024)}kB, docx ${Math.round(docxBuffer.length / 1024)}kB)`,
    )
  }

  console.log(`\n8 files written to public/cv/ — ${MEASURE}pt measure, ${BODY}pt body`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
