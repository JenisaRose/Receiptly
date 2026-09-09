/**
 * Landing-only atmosphere system. Each section variant is a multi-stop
 * gradient (real tonal movement, not a flat fill) kept inside a readable
 * range — light variants stay pale lavender, dark variants stay near-ink.
 * Glows, grain, drifting type and faded paper are layered on top by
 * <Atmosphere>.
 */

export const BG = {
  hero: 'linear-gradient(178deg, #f3eeff 0%, #ece6ff 34%, #e6ddf9 66%, #efe9ff 100%)',
  ink: 'radial-gradient(115% 80% at 50% -10%, #221d33 0%, #16131f 46%, #100d17 100%)',
  insights: 'linear-gradient(180deg, #ede9fb 0%, #e6e4f7 40%, #e3e8f6 78%, #ebe7fa 100%)',
  wrapped: 'linear-gradient(180deg, #14121e 0%, #191426 48%, #271a2c 80%, #38222f 100%)',
  features: 'linear-gradient(180deg, #f4f1fb 0%, #efeaf8 45%, #f1edfa 100%)',
  install: 'linear-gradient(150deg, #fbff9c 0%, #f4ff5a 44%, #eafba6 100%)',
  final: 'radial-gradient(120% 90% at 50% 120%, #2a2036 0%, #16131f 44%, #0d0b14 100%)',
}

/** Fractal-noise grain, desaturated, tileable. */
export const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.62'/%3E%3C/svg%3E\")"
