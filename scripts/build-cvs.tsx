import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import React from 'react'
import { Document, Font, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'
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
 * The register is the traditional academic one: Times, a centred all-caps name
 * block, Title Case section headings over a full-measure rule, the organisation on
 * its own italic line under the role, and dates in a right-hand column. Two ink
 * values and no accent colour. It is the shape a CV has had since long before
 * anything could generate one, and that is the point — the previous version of
 * this file set a teal-accented, tracked-caps, tight-leading page that read as a
 * template because it *was* the look every template ships with.
 *
 * ATS rules this obeys:
 *   - one column, no tables, no text boxes, no images, no icons
 *   - standard fonts only: Times in the PDF (a PDF standard-14 face, embedded
 *     nowhere and available everywhere), Times New Roman in the Word file
 *   - real selectable text in both; the DOCX is authored as Word paragraphs, not
 *     a picture of a PDF, so a recruiter can edit it and a parser can read it
 *   - dates and headings as plain text in reading order
 *   - bare URLs rather than hyperlink markup, which parsers mangle less often
 *
 * The bullet character is "•" with a real indent rather than a hyphen: Word
 * numbering carries the semantics for accessibility, and the PDF draws the glyph
 * in a fixed-width column so wrapped lines align under the text, not the bullet.
 */

const OUT_DIR = join(process.cwd(), 'public', 'cv')

/**
 * No hyphenation. @react-pdf hyphenates by default, which is correct for justified
 * book setting and wrong here: a CV is read in ten-second glances, and "specifi-
 * cations" broken across two lines is exactly the kind of artefact a reader files
 * under "this was produced by a machine". Ragged right with whole words is what a
 * person setting this page in Word would get, because Word does the same.
 */
Font.registerHyphenationCallback((word) => [word])

// --------------------------------------------------------------------------
// Measure
// --------------------------------------------------------------------------

/**
 * The page box, in points. A4 is 595.28 × 841.89.
 *
 * One inch on all four sides, which is the convention for a document that might be
 * printed, filed and photocopied, and — not incidentally — the only margin set
 * anybody reads as deliberate. The previous version ran 54pt left against 72pt
 * right to hang the dates in the right margin; it saved 18pt of measure and cost
 * the page its symmetry, and an asymmetric margin with no gutter to justify it is a
 * thing only software does.
 *
 * 451pt at 10.5pt Times is about 95 characters a line. Wide for continuous prose,
 * and a compromise: the only continuous prose here is the four-line profile
 * paragraph, everything else is a bullet or an entry head, and pulling the measure
 * to book width costs a third page. Two pages is the brief.
 */
const PAGE = { top: 56, bottom: 52, left: 72, right: 72 } as const
const MEASURE = Math.round(595 - PAGE.left - PAGE.right)

/** One body size, shared by both formats so they cannot drift apart. */
const BODY = 10.5

/**
 * Width of the right-hand date column, in points.
 *
 * This number is the fix for the defect that made the last two builds unusable.
 * The dates used to sit in a `space-between` row as a `flexShrink: 0` sibling of a
 * `flexShrink: 1` title — and `flexShrink` does not make a single-line `Text` wrap,
 * it just lets the box be measured smaller than its content, so a long title ran
 * straight underneath its own date. Measured on the last build: "2024" at
 * x=505.3–524.0 against "· ACE Quanser Robotics Lab, Obafemi Awolowo University"
 * ending at x=508.4 — 3.1pt of overlap, in six places across the four documents,
 * with the date also 0.7pt past the right margin.
 *
 * A fixed column cannot do that. The title takes `flexBasis: 0` and grows into
 * whatever is left, so it wraps; the date box is the same width whatever it holds.
 * 102pt is measured, not guessed: the longest string that can appear here is
 * "2021–2027 (expected)", which sets to 94.2pt at 10.5pt Times, and the 8pt of
 * headroom absorbs a date format nobody has thought of yet.
 */
const DATE_COL = 102

/**
 * Indent for everything subordinate to an entry head: the organisation line, the
 * bullets, the detail lines. One value, so the left edge of the material under a
 * role is a single straight line rather than three near-misses.
 */
const INDENT = 14

/**
 * Hanging indent for skill groups, in points, shared by both renderers so the two
 * formats cannot drift apart. Deliberately small: enough that a wrapped line is
 * visibly subordinate, not a label column, which at these label lengths would spend
 * a third of the measure on white space for the shortest of them.
 */
const HANG = 14

// --------------------------------------------------------------------------
// Ink
// --------------------------------------------------------------------------

/**
 * Two values, and that is the whole palette.
 *
 * There was an accent here — a teal borrowed from the website's research mode,
 * used on the role line, the section labels, the section rules and the bullet
 * glyphs. It looked considered on screen and it was the wrong instinct for this
 * document. A coloured section label over a hairline is the single most common
 * feature of the CV templates that ship with every résumé builder, so the thing
 * intended to make the page look designed was doing the opposite.
 *
 * What replaces it is structural rather than chromatic: weight for what you scan
 * (bold, on names and section heads), italic for what qualifies it (organisations,
 * skill labels), and a rule under each heading. Black text does the rest.
 *
 * Stored as bare hex because Word wants it that way; `ink()` adds the `#` for the
 * PDF. One source, so the two formats cannot disagree about colour either.
 *
 * Contrast against white, measured: body 15.9:1, muted 9.2:1 — both well past AA,
 * which matters because these are read on screen before they are ever printed.
 */
const INK = {
  /** Body text. Near-black, never pure #000 — pure black on white glares. */
  body: '1A1A1A',
  /** Dates, organisations, skill labels, repo lines, coursework, the folio. */
  muted: '454545',
} as const

const ink = (value: string) => `#${value}`

/**
 * Separator for the folio and the document-properties title.
 *
 * A middot, not an em dash. A pair of em dashes bracketing an aside is the most
 * recognisable fingerprint of generated prose, and once a reader has noticed one
 * they start finding them everywhere.
 */
const SEP = ' · '

// --------------------------------------------------------------------------
// PDF
// --------------------------------------------------------------------------

/**
 * Vertical rhythm, in points, largest gap to smallest: 12 above a section heading,
 * 7 above an entry, 1.5 between bullets, 1 before a detail line, 0.5 before the
 * organisation line. Every gap is bigger than the one below it in the hierarchy
 * and there are no near-ties, which is what lets you see the structure of the page
 * before you read a word of it.
 *
 * Leading is 1.34, which for Times is generous without looking airy — Times has a
 * small x-height for its point size, so the same ratio that reads tight in
 * Helvetica reads comfortable here.
 *
 * The section headings are 11pt against 10.5pt body: barely larger, and that is
 * the point. Title Case, bold, over a rule, in a document that uses bold nowhere
 * else at that size, they are unmissable at a glance without shouting. The version
 * of this file that set them in 8.4pt tracked caps needed colour and a hairline to
 * be found at all.
 */
const pdf = StyleSheet.create({
  page: {
    paddingTop: PAGE.top,
    paddingBottom: PAGE.bottom,
    paddingLeft: PAGE.left,
    paddingRight: PAGE.right,
    fontFamily: 'Times-Roman',
    fontSize: BODY,
    lineHeight: 1.34,
    color: ink(INK.body),
  },

  /**
   * The name block. Centred and set in caps — the one piece of display setting in
   * the document.
   *
   * There is deliberately no `letterSpacing`, and that is an ATS decision rather
   * than a typographic one. Tracked caps is the conventional setting for a name at
   * the head of a CV, and it survives being looked at perfectly well; it does not
   * survive being *parsed*. With 1.8pt of tracking, extracting the text of this
   * page returned "AYO M I D E A B I L E WA" — pdf.js, and every parser built the
   * same way, reads a horizontal jump wider than its threshold as a word space. The
   * name is the single field a tracking system cannot afford to get wrong, so the
   * tracking goes and the size comes up instead.
   *
   * `lineHeight` is explicit and the margin below is generous, and both are load
   * bearing. At 20pt with the page's default leading and a 3pt margin, @react-pdf
   * computed a line box shorter than the glyphs it contained: measured on the last
   * build, the name's baseline sat at y=64 and the line under it at y=72, so the
   * descender of "Ayomide" crossed the ascenders below it by 3.56pt. Every one of
   * the four PDFs shipped with the header overlapping itself.
   */
  name: {
    fontSize: 17.5,
    fontFamily: 'Times-Bold',
    lineHeight: 1.3,
    textAlign: 'center',
  },
  contact: { marginTop: 6, fontSize: 9.5, lineHeight: 1.3, textAlign: 'center' },
  links: { marginTop: 1.5, fontSize: 9.5, lineHeight: 1.3, textAlign: 'center' },

  /** The rule belongs *below* the heading: it underlines the name of the section. */
  sectionWrap: {
    marginTop: 12,
    marginBottom: 3.5,
    paddingBottom: 2,
    borderBottomWidth: 0.75,
    borderBottomColor: ink(INK.body),
  },
  section: { fontSize: 11, fontFamily: 'Times-Bold', letterSpacing: 0.25 },

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
  skills: { marginTop: 2.5, paddingLeft: HANG },
  skillsLabel: { fontFamily: 'Times-Italic', color: ink(INK.muted), textIndent: -HANG },

  /**
   * The entry head: title on the left, date in a fixed column on the right.
   *
   * `flexGrow: 1, flexBasis: 0` on the title is the whole fix — it makes the title
   * box exactly the leftover width, so a long role wraps to a second line instead
   * of running under its own date. `flexShrink: 0` plus a fixed `width` on the date
   * means the column edge is the same on every entry down the page, which is the
   * straight vertical line a reader scans for chronology.
   *
   * Both are set at `BODY`. That is not an aesthetic choice: two `Text` children of
   * a flex row with different font sizes get different line-box heights, and their
   * baselines then differ by the difference — measured at 1.44pt on the last build,
   * every date on every page sitting slightly high against its own title. Nothing
   * about that is legible as a mistake; it just reads as machine-set. Equal size
   * and equal leading put the baselines on the same line by construction.
   */
  entryRow: { marginTop: 7, flexDirection: 'row', alignItems: 'flex-start' },
  /** An entry with nothing under it. Tighter, so a run of them reads as a list. */
  entryRowTight: { marginTop: 2.5, flexDirection: 'row', alignItems: 'flex-start' },
  entryTitle: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingRight: 12,
    fontFamily: 'Times-Bold',
  },
  entryDate: {
    width: DATE_COL,
    flexGrow: 0,
    flexShrink: 0,
    textAlign: 'right',
    color: ink(INK.muted),
  },

  /** Organisation, institution or toolchain. Italic, indented, its own line. */
  org: { marginTop: 0.5, paddingLeft: INDENT, fontFamily: 'Times-Italic', color: ink(INK.muted) },

  detail: { marginTop: 1, paddingLeft: INDENT, fontSize: 9.4, color: ink(INK.muted) },

  bulletRow: { marginTop: 1.5, paddingLeft: INDENT, flexDirection: 'row' },
  bulletGlyph: { width: 11 },
  bulletText: { flexGrow: 1, flexShrink: 1, flexBasis: 0 },

  /** Folio, so a printed copy that gets separated can be put back together. */
  folio: {
    position: 'absolute',
    bottom: 30,
    left: PAGE.left,
    right: PAGE.right,
    fontSize: 9,
    color: ink(INK.muted),
    textAlign: 'center',
  },
})

function PdfLine({ line }: { line: Line }) {
  switch (line.kind) {
    case 'section':
      return (
        // `wrap={false}` stops the heading itself splitting; `minPresenceAhead` is
        // what stops it being stranded. A heading is the one line on the page that
        // is worthless alone — "Projects" at the foot of page 1 with the first
        // project overleaf tells a reader nothing and costs them a page turn to find
        // out. 58pt reserves the heading plus its first entry, that entry's
        // organisation line and the opening line of its first bullet, so a section
        // either starts properly or starts on the next page.
        <View style={pdf.sectionWrap} wrap={false} minPresenceAhead={58}>
          <Text style={pdf.section}>{line.text}</Text>
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
        // `wrap={false}` keeps a role line from being split across a page break.
        //
        // `minPresenceAhead` solves the other half of that problem: an entry can sit
        // unbroken at the foot of a page and still leave its organisation line and
        // first bullet stranded at the top of the next one, so a reader turning the
        // page meets "Two I2C sensors on one bus…" with no heading above it and no
        // way to know what it belongs to. Reserving ~three lines means the heading
        // moves down with its content instead. Not for standalone entries: nothing
        // follows them, so reserving space below only pushes a certification onto
        // the next page for no reason.
        <View
          style={line.standalone ? pdf.entryRowTight : pdf.entryRow}
          wrap={false}
          {...(line.standalone ? {} : { minPresenceAhead: 40 })}
        >
          <Text style={pdf.entryTitle}>{line.title}</Text>
          {line.meta ? <Text style={pdf.entryDate}>{line.meta}</Text> : null}
        </View>
      )

    case 'org':
      return <Text style={pdf.org}>{line.text}</Text>

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
        {/* Caps applied here rather than in the data: `doc.name` is also the author
            string in the PDF properties, where "AYOMIDE ABILEWA" would be wrong. */}
        <Text style={pdf.name}>{doc.name.toUpperCase()}</Text>
        <Text style={pdf.contact}>{doc.contact}</Text>
        <Text style={pdf.links}>{doc.links}</Text>

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

/** Half-points, the unit Word uses for font size. 10.5pt → 21. */
const PT = (points: number) => Math.round(points * 2)
/** Twips: 1pt = 20 twips. Used for spacing and indents. */
const TW = (points: number) => Math.round(points * 20)

/**
 * Word's `line` is relative to single spacing, where 240 is single — and single
 * for Times New Roman already carries about 1.15 of leading. 280 is therefore
 * roughly the 1.34 the PDF sets, not 1.34 × 240.
 */
const LEADING = 280

/**
 * Right tab stop for the date column, at the right edge of the measure — the same
 * place the PDF's fixed date column ends. Word's right tab does natively what
 * `DATE_COL` has to construct: text runs leftward from the stop, so a long title
 * pushes the tab rather than colliding with what follows it.
 */
const RIGHT_TAB = TW(MEASURE)

function docxLine(line: Line): Paragraph {
  switch (line.kind) {
    case 'section':
      return new Paragraph({
        // A real Word heading, so the document has an outline a screen reader
        // and a parser can both follow.
        heading: HeadingLevel.HEADING_2,
        spacing: { before: TW(11), after: TW(3.5) },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: INK.body, space: 2 },
        },
        keepNext: true,
        children: [new TextRun({ text: line.text, bold: true, size: PT(11) })],
      })

    case 'paragraph':
      return new Paragraph({
        spacing: { after: TW(2), line: LEADING },
        children: [new TextRun({ text: line.text, size: PT(BODY) })],
      })

    case 'skills':
      return new Paragraph({
        spacing: { before: TW(2.5), after: TW(0), line: LEADING },
        // Word has a real hanging indent, so this is the one place the two renderers
        // differ in mechanism rather than in result. Same HANG either way, so a
        // change to the indent cannot land in one format and miss the other.
        indent: { left: TW(HANG), hanging: TW(HANG) },
        children: [
          new TextRun({ text: `${line.label}: `, italics: true, color: INK.muted, size: PT(BODY) }),
          new TextRun({ text: line.items, size: PT(BODY) }),
        ],
      })

    case 'entry':
      return new Paragraph({
        spacing: { before: TW(line.standalone ? 2.5 : 7), after: TW(0), line: LEADING },
        tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
        // Only where something follows that must not be separated from it.
        keepNext: !line.standalone,
        children: [
          new TextRun({ text: line.title, bold: true, size: PT(BODY) }),
          ...(line.meta
            ? [new TextRun({ text: `\t${line.meta}`, size: PT(BODY), color: INK.muted })]
            : []),
        ],
      })

    case 'org':
      return new Paragraph({
        spacing: { before: TW(0.5), after: TW(0), line: LEADING },
        indent: { left: TW(INDENT) },
        keepNext: true,
        children: [
          new TextRun({ text: line.text, italics: true, size: PT(BODY), color: INK.muted }),
        ],
      })

    case 'detail':
      return new Paragraph({
        spacing: { before: TW(1), after: TW(0), line: LEADING },
        indent: { left: TW(INDENT) },
        children: [new TextRun({ text: line.text, size: PT(9.4), color: INK.muted })],
      })

    case 'bullet':
      return new Paragraph({
        numbering: { reference: 'cv-bullets', level: 0 },
        spacing: { before: TW(1.5), after: TW(0), line: LEADING },
        children: [new TextRun({ text: line.text, size: PT(BODY) })],
      })
  }
}

function docxFile(doc: CvDocument): DocxDocument {
  const head: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: TW(6), line: LEADING },
      children: [
        new TextRun({
          text: doc.name.toUpperCase(),
          bold: true,
          size: PT(17.5),
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: TW(1.5), line: LEADING },
      children: [new TextRun({ text: doc.contact, size: PT(9.5) })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: TW(2), line: LEADING },
      children: [new TextRun({ text: doc.links, size: PT(9.5) })],
    }),
  ]

  /**
   * The PDF drops its folio when the document turns out to be one page; Word
   * cannot know that at authoring time, so this one always prints.
   */
  const folio = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: `${doc.name}${SEP}`, size: PT(9), color: INK.muted }),
          new TextRun({ children: [PageNumber.CURRENT], size: PT(9), color: INK.muted }),
          new TextRun({ text: ' of ', size: PT(9), color: INK.muted }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: PT(9), color: INK.muted }),
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
        document: { run: { font: 'Times New Roman', size: PT(BODY), color: INK.body } },
        heading2: { run: { font: 'Times New Roman', bold: true, color: INK.body } },
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
                // the glyph was quietly printing at the wrong size.
                run: { font: 'Times New Roman', size: PT(BODY), color: INK.body },
                // Indented to INDENT, hanging by the glyph column, so the bullet
                // text lines up with the organisation line above it.
                paragraph: { indent: { left: TW(INDENT + 11), hanging: TW(11) } },
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
            // A4 in twips, with the PDF's margins.
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

  console.log(`\n8 files written to public/cv/ — ${MEASURE}pt measure, ${BODY}pt Times`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
