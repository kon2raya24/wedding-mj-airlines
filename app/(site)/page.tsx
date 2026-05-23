import Hero from "@/components/Hero";
import QuickLinks from "@/components/QuickLinks";
import PassengerCheckIn from "@/components/PassengerCheckIn";
import BoardingPassStub from "@/components/BoardingPassStub";
import Countdown from "@/components/Countdown";
import OurStory from "@/components/OurStory";
import EventDetails from "@/components/EventDetails";
import Schedule from "@/components/Schedule";
import WeddingParty from "@/components/WeddingParty";
import Gallery from "@/components/Gallery";
import Travel from "@/components/Travel";
import Registry from "@/components/Registry";
import FAQ from "@/components/FAQ";
import GuestBook from "@/components/GuestBook";
import RSVP from "@/components/RSVP";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import Quote from "@/components/Quote";
import { weddingPhase } from "@/lib/day-of";

export default function Home() {
  const phase = weddingPhase();
  const showCountdown = phase === "before";

  return (
    <main>
      <Hero />

      {/* Dashboard row — quick links, check-in form, side stub */}
      <section className="relative bg-navy-deep">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left column — quick links + (conditional) countdown stacked */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-6 lg:gap-8">
            <QuickLinks />
            {showCountdown && <Countdown />}
          </div>

          {/* Center — Passenger check-in form */}
          <div className="lg:col-span-4">
            <PassengerCheckIn />
          </div>

          {/* Right — vertical boarding pass stub */}
          <div className="lg:col-span-3">
            <BoardingPassStub />
          </div>
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
      <FAQ />
      <GuestBook />
      {phase !== "after" && <RSVP />}
      <Footer />
    </main>
  );
}
