import type { VisitorMode } from '@/data/types'

/**
 * Browser chrome colour per mode, so a phone's address bar matches the page under
 * it. The theme follows the route, not the OS, so these are keyed by mode rather
 * than by prefers-color-scheme. Each must track `--surface` in globals.css.
 */
export const THEME_COLOR: Record<VisitorMode, string> = {
  engineering: '#0C1E29',
  everything: '#0C1E29',
  research: '#F6F9FB',
  scholarship: '#F9F1E1',
}

/** `.lofi` flattens every mode to one surface. */
export const LOFI_THEME_COLOR = '#060D11'
