import { GRAIN_URL } from './texture'

/** Fine fractal-noise grain — sits behind a section's content, over its
 *  gradient and glows. Blend keeps it working on light and dark. */
export default function Grain({ dark = false }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-repeat [background-size:200px_200px] ${
        dark ? 'opacity-[0.15] mix-blend-screen' : 'opacity-[0.5] mix-blend-overlay'
      }`}
      style={{ backgroundImage: GRAIN_URL }}
    />
  )
}
