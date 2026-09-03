import Hero from "@/components/Hero";
import QuickLinks from "@/components/QuickLinks";
import PassengerCheckIn from "@/components/PassengerCheckIn";
import BoardingPass from "@/components/BoardingPass";
import TiltCard from "@/components/TiltCard";
import Countdown from "@/components/Countdown";
import OurStory from "@/components/OurStory";
import EventDetails from "@/components/EventDetails";
import Schedule from "@/components/Schedule";
import WeddingParty from "@/components/WeddingParty";
import Gallery from "@/components/Gallery";
import Travel from "@/components/Travel";
import Registry from "@/components/Registry";
import AttireGuide from "@/components/AttireGuide";
import FAQ from "@/components/FAQ";
import GuestBook from "@/components/GuestBook";
import RSVP from "@/components/RSVP";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import Quote from "@/components/Quote";
import Reveal from "@/components/Reveal";
import { weddingPhase } from "@/lib/day-of";

export default function Home() {
  const phase = weddingPhase();
  const showCountdown = phase === "before";

  return (
    <main>
      <Hero />

      {/* Dashboard row — quick links, check-in form, side stub */}
      {/* Dashboard row — the boarding pass rises out of the film into the
          counter, followed by check-in, quick links and the countdown. */}
      <section className="relative z-20 pb-6 md:pb-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 -mt-24 lg:-mt-32 pb-8 lg:pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <TiltCard className="h-full">
              <BoardingPass />
            </TiltCard>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <PassengerCheckIn />
          </Reveal>

          <Reveal delay={200} className={showCountdown ? "lg:col-span-7" : "lg:col-span-12"}>
            <QuickLinks />
          </Reveal>

          {showCountdown && (
            <Reveal delay={280} className="lg:col-span-5">
              <Countdown />
            </Reveal>
          )}
        </div>
      </section>

      {/* Rich scroll content below */}
      <OurStory />
      <Quote />
      <EventDetails />
      <Schedule />
      <Marquee />
      <WeddingParty />
      <Gallery />
      <Travel />
      <Marquee />
      <Registry />
      <AttireGuide />
      <FAQ />
      <GuestBook />
      {phase !== "after" && <RSVP />}
      <Footer />
    </main>
  );
}
