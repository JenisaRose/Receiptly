/**
 * Landing-only background treatment — deliberately nothing like the app's
 * fine dot grid. A fractal-noise grain for tactile richness, plus soft
 * off-axis colour glows that give each section depth and a hint of the
 * brand palette without any hard pattern.
 */

// fractal-noise film grain, desaturated, as a tileable data-URI
export const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.55'/%3E%3C/svg%3E\")"

// soft off-axis glows — a white key light plus brand-colour fills in the
// far corners, over the section's base colour
export const LIGHT_BG =
  'radial-gradient(80% 60% at 85% -12%, rgba(255,255,255,0.75), transparent 62%),' +
  'radial-gradient(70% 60% at -8% 110%, rgba(255,111,176,0.24), transparent 60%),' +
  'radial-gradient(65% 60% at 108% 115%, rgba(121,242,192,0.26), transparent 60%),' +
  '#e9e2fb'

export const DARK_BG =
  'radial-gradient(80% 60% at 14% -14%, rgba(201,184,255,0.22), transparent 60%),' +
  'radial-gradient(75% 60% at 112% 112%, rgba(255,111,176,0.18), transparent 60%),' +
  'radial-gradient(65% 55% at -10% 108%, rgba(111,216,255,0.16), transparent 58%),' +
  '#131120'

export const YELLOW_BG =
  'radial-gradient(75% 65% at 10% -8%, rgba(255,255,255,0.6), transparent 60%),' +
  'radial-gradient(75% 65% at 108% 112%, rgba(255,168,77,0.4), transparent 62%),' +
  '#f4ff5a'
