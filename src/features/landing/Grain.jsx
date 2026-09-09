import { GRAIN_URL } from './texture'

/** Fine fractal-noise grain layer — sits behind a section's content, over
 *  its gradient. Blend mode keeps it working on both light and dark. */
export default function Grain({ dark = false }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-repeat [background-size:180px_180px] ${
        dark ? 'opacity-[0.12] mix-blend-screen' : 'opacity-[0.5] mix-blend-overlay'
      }`}
      style={{ backgroundImage: GRAIN_URL }}
    />
  )
}
