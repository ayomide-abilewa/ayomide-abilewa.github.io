import { access, mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { media } from '../src/data/media'

const ROOT = process.cwd()
const SOURCE_DIR = resolve(ROOT, '..', 'Pictures')
const MEDIA_DIR = join(ROOT, 'public', 'media')
const PUBLIC_DIR = join(ROOT, 'public')

async function buildPhoto(item: (typeof media)[number]) {
  const source = join(SOURCE_DIR, item.source)
  await access(source)

  for (const width of item.widths) {
    const height = Math.round(width / item.aspect)
    const base = sharp(source).rotate()
    const oriented = item.flip ? base.flop() : base
    const resized = oriented.resize(width, height, {
      fit: 'cover',
      position: sharp.strategy.attention,
      withoutEnlargement: true,
    })

    await Promise.all([
      resized.clone().avif({ quality: 68, effort: 5 }).toFile(join(MEDIA_DIR, `${item.out}-${width}.avif`)),
      resized.clone().webp({ quality: 80, effort: 5 }).toFile(join(MEDIA_DIR, `${item.out}-${width}.webp`)),
      resized.clone().jpeg({ quality: 84, progressive: true, mozjpeg: true }).toFile(join(MEDIA_DIR, `${item.out}-${width}.jpg`)),
    ])
  }

  console.log(`${item.id.padEnd(14)} ${item.widths.length * 3} responsive files`)
}

async function buildIcons() {
  const svg = join(PUBLIC_DIR, 'favicon.svg')
  await access(svg)
  await Promise.all([
    sharp(svg).resize(32, 32).png().toFile(join(PUBLIC_DIR, 'favicon-32.png')),
    sharp(svg).resize(180, 180).png().toFile(join(PUBLIC_DIR, 'apple-touch-icon.png')),
  ])
}

async function main() {
  await mkdir(MEDIA_DIR, { recursive: true })
  for (const item of media) await buildPhoto(item)
  await buildIcons()
  console.log(`\nResponsive media and site icons written to public/`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
