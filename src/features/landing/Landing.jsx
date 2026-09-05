import Nav from './sections/Nav'
import Hero from './sections/Hero'
import ProductStory from './sections/ProductStory'
import HowItThinks from './sections/HowItThinks'
import Features from './sections/Features'
import MonthInGlance from './sections/MonthInGlance'
import InstallSection from './sections/InstallSection'
import FinalCta from './sections/FinalCta'
import Footer from './sections/Footer'

/**
 * The public marketing entry point at `/`. Its own visual system —
 * editorial type, tight vertical rhythm, full-fidelity product mockups
 * layered with depth — rather than the app's neubrutalist card grammar
 * reused at a bigger size.
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
        <ProductStory />
        <HowItThinks />
        <Features />
        <MonthInGlance />
        <InstallSection />
        <FinalCta />
      </main>

      <Footer />
    </div>
  )
}
