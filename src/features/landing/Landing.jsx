import PwaDebug from './PwaDebug'
import Seam from './Seam'
import Nav from './sections/Nav'
import Hero from './sections/Hero'
import ProductStory from './sections/ProductStory'
import HowItThinks from './sections/HowItThinks'
import Features from './sections/Features'
import MonthInGlance from './sections/MonthInGlance'
import InstallSection from './sections/InstallSection'
import FinalCta from './sections/FinalCta'
import Footer from './sections/Footer'

// colours the seams blend between (must track atmosphere.js edge tones)
const C = {
  lavender: '#efe9ff',
  ink: '#16131f',
  insights: '#ebe7fa',
  featuresTop: '#f4f1fb',
  featuresBot: '#f1edfa',
  wrappedTop: '#14121e',
  sunset: '#38222f',
  yellow: '#f4ff5a',
  yellowBot: '#eafba6',
  finalTop: '#2a2036',
}

/**
 * The public marketing entry point at `/`. Its own atmospheric visual
 * system — layered gradients, soft light, drifting background type,
 * grain, editorial detail — with each section carrying a distinct mood
 * and melting into the next.
 */
export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:border-[3px] focus:border-ink focus:bg-yellow focus:px-3 focus:py-2 focus:font-display focus:text-[12px]"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Seam from={C.lavender} to={C.ink} />
        <ProductStory />
        <Seam from={C.ink} to={C.insights} />
        <HowItThinks />
        <Seam from={C.insights} to={C.featuresTop} h={90} />
        <Features />
        <Seam from={C.featuresBot} to={C.wrappedTop} />
        <MonthInGlance />
        <Seam from={C.sunset} to={C.yellow} />
        <InstallSection />
        <Seam from={C.yellowBot} to={C.finalTop} />
        <FinalCta />
      </main>

      <Footer />
      <PwaDebug />
    </div>
  )
}
