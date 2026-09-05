import Hero from './sections/Hero'
import ProductStory from './sections/ProductStory'
import HowItThinks from './sections/HowItThinks'
import ProductShowcase from './sections/ProductShowcase'
import FeatureCollage from './sections/FeatureCollage'
import MonthInGlance from './sections/MonthInGlance'
import InstallSection from './sections/InstallSection'
import FinalCta from './sections/FinalCta'
import Footer from './sections/Footer'

/**
 * The public marketing entry point at `/`. Deliberately its own visual
 * system — full-bleed colour sections, oversized editorial type, layered
 * product mockups — rather than the app's neubrutalist card grammar reused
 * at a bigger size. Every section owns an opaque background, so the app's
 * global dotted body texture never shows through here.
 */
export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:border-[3px] focus:border-ink focus:bg-yellow focus:px-3 focus:py-2 focus:font-display focus:text-[12px]"
      >
        Skip to content
      </a>

      <main id="main">
        <Hero />
        <div id="story">
          <ProductStory />
        </div>
        <div id="thinks">
          <HowItThinks />
        </div>
        <div id="showcase">
          <ProductShowcase />
        </div>
        <div id="features">
          <FeatureCollage />
        </div>
        <div id="glance">
          <MonthInGlance />
        </div>
        <div id="install">
          <InstallSection />
        </div>
        <FinalCta />
      </main>

      <Footer />
    </div>
  )
}
