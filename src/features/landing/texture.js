/**
 * Landing-only background system — deliberately nothing like the app's fine
 * dot grid. Each section is a tonal gradient (not a flat fill) with one or
 * two big soft light-blooms (<Glow>) on top, then a fractal-noise grain.
 */

// fractal-noise film grain, desaturated, as a tileable data-URI
export const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.6'/%3E%3C/svg%3E\")"

// base tonal gradients — a clear shift, not a whisper
export const LIGHT_BG =
  'radial-gradient(120% 85% at 50% -30%, #f5f1ff 0%, #e8e1fa 46%, #e0d7f6 100%)'
export const DARK_BG =
  'radial-gradient(120% 90% at 30% -20%, #26213c 0%, #16131f 52%, #100d17 100%)'
export const YELLOW_BG =
  'linear-gradient(160deg, #fbff9c 0%, #f4ff5a 46%, #e7f43d 100%)'
export const WRAPPED_BG =
  'linear-gradient(180deg, #16131f 0%, #191426 55%, #2a1b2e 82%, #3a2233 100%)'
