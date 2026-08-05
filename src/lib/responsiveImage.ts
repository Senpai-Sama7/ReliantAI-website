/**
 * Responsive image helpers.
 *
 * The `scripts/generate-responsive.mjs` build script emits `-400`, `-800`,
 * and `-1200` WebP variants next to each large source image in `public/`.
 * These helpers derive `srcSet`/`sizes` for those variants so browsers can
 * pick the smallest adequate asset — the audit's "improve image delivery"
 * finding (~67 KiB on the two project images).
 *
 * Variants only exist for images listed in the generator script. For any
 * other path, `responsiveSrcSet` returns undefined and the browser falls
 * back to `src`.
 */

const RESPONSIVE_WIDTHS = [400, 800, 1200] as const;

/**
 * Build a `srcSet` string for an image that has generated width variants.
 * Returns undefined when the path doesn't point at a variant-backed asset.
 */
export function responsiveSrcSet(src: string): string | undefined {
  // Only project images have generated variants today.
  if (!src.startsWith('/project-') || !src.endsWith('.webp')) return undefined;

  const base = src.slice(0, -'.webp'.length);
  return RESPONSIVE_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
}

/**
 * A sane default `sizes` for full-bleed / large card imagery: on small
 * screens the image spans the viewport; on large screens it tops out
 * around the pinned-stage / card width.
 */
export const DEFAULT_IMAGE_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px';
