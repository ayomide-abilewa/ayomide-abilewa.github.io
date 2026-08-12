import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import React from 'react'
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'
import {
  AlignmentType,
  BorderStyle,
  Document as DocxDocument,
  HeadingLevel,
  LevelFormat,
  Packer,
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
 * The bullet character is "•" with a real indent rather than a hyphen: Word
 * numbering carries the semantics for accessibility, and the PDF draws the glyph
 * in a fixed-width column so wrapped lines align under the text, not the bullet.
 */

const OUT_DIR = join(process.cwd(), 'public', 'cv')

// --------------------------------------------------------------------------
// Ink
// --------------------------------------------------------------------------

/**
 * The document's ink, mixed for paper rather than for a screen.
 *
 * These are warm neutrals: each step carries a little more red than green and a
 * little more green than blue, which is how ink on off-white stock actually looks
 * and which quietly agrees with the warm paper tone the website uses. The earlier
 * draft of this file used a well-known CSS framework's default grey ramp, and that
 * is exactly the problem — a reader who has seen a hundred generated documents has
 * seen those five values a hundred times. A CV should look like someone set it.
 *
 * Stored as bare hex because Word wants it that way; `ink()` adds the `#` for the
 * PDF. One source, so the two formats cannot disagree about colour either.
 *
 * Contrast against white, measured: body 16.9:1, secondary 9.6:1, meta 5.9:1 —
 * all past AA, which matters because these are also read on screen before print.
 */
const INK = {
  /** Body text and headings. Near-black, warm, never pure #000. */
  body: '191614',
  /** Organisation names and the role line under the name. */
  secondary: '4A443E',
  /** Dates, locations, coursework, repository lines. */
  meta: '6B635A',
  /** The rule under the contact block. */
  rule: '8C837A',
  /** The hairline under each section heading. */
  hairline: 'CFC7BD',
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

// --------------------------------------------------------------------------
// PDF
// --------------------------------------------------------------------------

/**
 * A4 with 46pt margins. Type is 9.5pt on 1.42 leading — small enough to keep the
 * technical and full variants near two pages, large enough to stay readable when
 * printed, which is still how some panels review these.
 */
const pdf = StyleSheet.create({
  page: {
    paddingTop: 46,
    paddingBottom: 46,
    paddingHorizontal: 46,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.42,
    color: ink(INK.body),
  },
  name: { fontSize: 19, fontFamily: 'Helvetica-Bold', letterSpacing: -0.3 },
  role: { marginTop: 3, fontSize: 10, color: ink(INK.secondary) },
  contact: { marginTop: 6, fontSize: 8.5, color: ink(INK.meta) },
  links: { marginTop: 2, fontSize: 8.5, color: ink(INK.meta) },
  rule: {
    marginTop: 10,
    marginBottom: 4,
    borderBottomWidth: 0.75,
    borderBottomColor: ink(INK.rule),
  },

  section: {
    marginTop: 13,
    marginBottom: 4,
    paddingBottom: 2,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: ink(INK.hairline),
  },

  paragraph: { marginTop: 2, textAlign: 'justify' },

  entryRow: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between' },
  entryTitle: { flexShrink: 1, paddingRight: 12 },
  entryBold: { fontFamily: 'Helvetica-Bold' },
  entrySub: { color: ink(INK.secondary) },
  entryMeta: { fontSize: 8.5, color: ink(INK.meta) },

  detail: { fontSize: 8.5, color: ink(INK.meta) },

  bulletRow: { marginTop: 1.5, flexDirection: 'row' },
  bulletGlyph: { width: 10 },
  bulletText: { flex: 1, textAlign: 'justify' },
})

function PdfLine({ line }: { line: Line }) {
  switch (line.kind) {
    case 'section':
      return <Text style={pdf.section}>{line.text.toUpperCase()}</Text>

    case 'paragraph':
      return <Text style={pdf.paragraph}>{line.text}</Text>

    case 'entry':
      return (
        // `wrap={false}` keeps a role line from being orphaned at a page break.
        <View style={pdf.entryRow} wrap={false}>
          <Text style={pdf.entryTitle}>
            <Text style={pdf.entryBold}>{line.title}</Text>
            {line.subtitle ? (
              <Text style={pdf.entrySub}>
                {SEP}
                {line.subtitle}
              </Text>
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
      </Page>
    </Document>
  )
}

// --------------------------------------------------------------------------
// DOCX
// --------------------------------------------------------------------------

/** Half-points, the unit Word uses for font size. 9.5pt → 19. */
const PT = (points: number) => Math.round(points * 2)
/** Twips: 1pt = 20 twips. Used for spacing and indents. */
const TW = (points: number) => Math.round(points * 20)

/**
 * Right tab stop for the date column: A4 is 595pt wide, less 46pt of margin on
 * each side, so the text column ends at 503pt.
 */
const RIGHT_TAB = TW(595 - 46 * 2)

function docxLine(line: Line): Paragraph {
  switch (line.kind) {
    case 'section':
      return new Paragraph({
        // A real Word heading, so the document has an outline a screen reader
        // and a parser can both follow.
        heading: HeadingLevel.HEADING_2,
        spacing: { before: TW(11), after: TW(3) },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: INK.hairline, space: 2 } },
        children: [
          new TextRun({
            text: line.text.toUpperCase(),
            bold: true,
            size: PT(9),
            color: INK.body,
            characterSpacing: 20,
          }),
        ],
      })

    case 'paragraph':
      return new Paragraph({
        spacing: { after: TW(2), line: 264 },
        children: [new TextRun({ text: line.text, size: PT(9.5) })],
      })

    case 'entry':
      return new Paragraph({
        spacing: { before: TW(5), after: TW(0) },
        tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
        keepNext: true,
        children: [
          new TextRun({ text: line.title, bold: true, size: PT(9.5) }),
          ...(line.subtitle
            ? [
                new TextRun({
                  text: `${SEP}${line.subtitle}`,
                  size: PT(9.5),
                  color: INK.secondary,
                }),
              ]
            : []),
          ...(line.meta
            ? [new TextRun({ text: `\t${line.meta}`, size: PT(8.5), color: INK.meta })]
            : []),
        ],
      })

    case 'detail':
      return new Paragraph({
        spacing: { after: TW(0), line: 252 },
        children: [new TextRun({ text: line.text, size: PT(8.5), color: INK.meta })],
      })

    case 'bullet':
      return new Paragraph({
        numbering: { reference: 'cv-bullets', level: 0 },
        spacing: { before: TW(1), after: TW(1), line: 264 },
        children: [new TextRun({ text: line.text, size: PT(9.5) })],
      })
  }
}

function docxFile(doc: CvDocument): DocxDocument {
  const head: Paragraph[] = [
    new Paragraph({
      spacing: { after: TW(1) },
      children: [new TextRun({ text: doc.name, bold: true, size: PT(19) })],
    }),
    new Paragraph({
      spacing: { after: TW(3) },
      children: [new TextRun({ text: doc.title, size: PT(10), color: INK.secondary })],
    }),
    new Paragraph({
      spacing: { after: TW(0) },
      children: [new TextRun({ text: doc.contact, size: PT(8.5), color: INK.meta })],
    }),
    new Paragraph({
      spacing: { after: TW(6) },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: INK.rule, space: 6 } },
      children: [new TextRun({ text: doc.links, size: PT(8.5), color: INK.meta })],
    }),
  ]

  return new DocxDocument({
    title: `${doc.name} · ${doc.label}`,
    creator: doc.name,
    description: doc.title,
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: PT(9.5), color: INK.body } },
        heading2: { run: { font: 'Calibri', bold: true, color: INK.body } },
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
              style: { paragraph: { indent: { left: TW(11), hanging: TW(11) } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            // A4 in twips, with 46pt margins to match the PDF.
            size: { width: 11906, height: 16838 },
            margin: { top: TW(46), bottom: TW(46), left: TW(46), right: TW(46) },
          },
        },
        children: [...head, ...doc.lines.map(docxLine)],
      },
    ],
  })
}

// --------------------------------------------------------------------------

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  for (const variant of CV_VARIANTS) {
    const doc = buildDocument(variant)

    const pdfBuffer = await renderToBuffer(<PdfCv doc={doc} />)
    await writeFile(join(OUT_DIR, `${doc.stem}.pdf`), pdfBuffer)

    const docxBuffer = await Packer.toBuffer(docxFile(doc))
    await writeFile(join(OUT_DIR, `${doc.stem}.docx`), docxBuffer)

    const bullets = doc.lines.filter((l) => l.kind === 'bullet').length
    const sections = doc.lines.filter((l) => l.kind === 'section').length
    console.log(
      `${variant.padEnd(12)} ${doc.stem}  ${sections} sections, ${bullets} bullets  ` +
        `(pdf ${Math.round(pdfBuffer.length / 1024)}kB, docx ${Math.round(docxBuffer.length / 1024)}kB)`,
    )
  }

  console.log(`\n8 files written to public/cv/`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
