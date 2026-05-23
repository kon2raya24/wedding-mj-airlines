import Hero from "@/components/Hero";
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

export default function Home() {
  return (
    <main>
      <Hero />
      <Countdown />
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
      <RSVP />
      <Footer />
    </main>
  );
}
