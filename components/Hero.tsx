import { wedding } from "@/lib/config";
import { weddingPhase } from "@/lib/day-of";
import {
  PaperPlane,
  CalendarIcon,
  PinIcon,
  ClockIcon,
  Barcode,
  PlayIcon,
  VideoIcon,
} from "@/components/Decor";
import QR from "@/components/QRCode";

function InfoChip({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 font-sans uppercase tracking-[0.25em] text-[11px] text-cream/85">
      <span className="text-gold shrink-0">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function BoardingPassCard() {
  return (
    <div className="relative h-full bg-cream/95 text-navy rounded-md shadow-2xl shadow-navy-deep/60 overflow-hidden grid grid-cols-[1fr_auto_180px] sm:grid-cols-[1fr_auto_200px]">
      {/* MAIN STUB */}
      <div className="p-5 sm:p-6 md:p-7 flex flex-col">
        {/* Header strip */}
        <div className="pb-4 border-b border-navy/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <PaperPlane className="w-5 h-5 text-gold shrink-0" />
              <span className="font-serif text-base sm:text-lg leading-none truncate">
                <span className="font-semibold">JM</span>{" "}
                <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/70 align-middle ml-1">
                  Airways
                </span>
              </span>
            </div>
            <div className="font-sans uppercase tracking-[0.3em] text-[9px] sm:text-[10px] text-navy/55 shrink-0">
              First Class
            </div>
          </div>
          <div className="font-sans uppercase tracking-[0.3em] text-[9px] text-navy/55 mt-2 pl-7">
            Flight to Forever
          </div>
        </div>

        {/* Body grid */}
        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 mt-5">
          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
              Passenger
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">You Are Invited!</dd>
          </div>
          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
              From
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1 flex items-center gap-2">
              {wedding.origin}
              <PaperPlane className="w-4 h-4 text-gold" />
            </dd>
          </div>

          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
              Flight
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.flightNumber}</dd>
          </div>
          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
              To
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.destination}</dd>
          </div>

          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
              Date
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.shortDateCompact}</dd>
          </div>
          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
              Destination
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.destinationVenue}</dd>
          </div>

          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
              Boarding Time
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.boardingTime}</dd>
          </div>
          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
              Dress Code
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.dressCode}</dd>
            <dd className="mt-2 flex items-center gap-1.5" aria-label={`Colour motif: ${wedding.motif.map((m) => m.name).join(", ")}`}>
              {wedding.motif.map((m) => (
                <span
                  key={m.hex}
                  title={m.name}
                  className="w-5 h-5 rounded-full ring-1 ring-navy/25 shadow-sm"
                  style={{ backgroundColor: m.hex }}
                />
              ))}
            </dd>
          </div>
        </div>

        {/* Footer line */}
        <div className="mt-auto pt-6 border-t border-dashed border-navy/20 text-center font-sans uppercase tracking-[0.35em] text-[10px] text-navy/65">
          Together is our favorite destination ♡
        </div>
      </div>

      {/* Tear line */}
      <div className="relative w-px">
        <div className="absolute inset-y-3 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-navy/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-navy-deep" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-4 w-4 rounded-full bg-navy-deep" />
      </div>

      {/* RIGHT STUB */}
      <div className="bg-cream/95 p-5 sm:p-6 flex flex-col h-full">
        <div>
          <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
            Seat / Table
          </div>
          <div className="font-serif text-2xl sm:text-3xl mt-1 leading-none">{wedding.seat}</div>
        </div>

        <div className="mt-5">
          <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
            Gate
          </div>
          <div className="font-serif text-base sm:text-lg mt-1 leading-tight">
            {wedding.gate.split(" ").map((w, i) => (
              <span key={i} className="block uppercase tracking-wide">
                {w}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-5 text-navy">
          <Barcode className="w-full h-10" />
        </div>
        <div className="mt-4 bg-white p-1 rounded-sm self-start text-navy">
          <QR text="/api/calendar.ics" size={80} />
        </div>
      </div>
    </div>
  );
}

function PrenupCard() {
  return (
    <div className="relative h-full flex flex-col bg-navy-deep/40 backdrop-blur-sm border border-cream/15 rounded-md overflow-hidden shadow-2xl shadow-navy-deep/50">
      <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-cream/10">
        <VideoIcon className="w-4 h-4 text-gold" />
        <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-cream/85">
          Save the Date
        </span>
      </div>

      <div className="relative flex-1 min-h-[220px] bg-navy-deep">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={wedding.prenup.videoUrl}
          poster={wedding.prenup.coverImage}
          controls
          playsInline
          preload="metadata"
          aria-label={`${wedding.groomFirst} and ${wedding.brideFirst} — ${wedding.prenup.tagline}`}
        />
      </div>

      <div className="px-4 sm:px-5 py-4">
        <a
          href={wedding.prenup.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] px-5 py-3 bg-cream/10 hover:bg-gold hover:text-navy text-cream rounded-sm transition-colors"
        >
          <PlayIcon className="w-3.5 h-3.5" />
          Open full screen
        </a>
      </div>
    </div>
  );
}

export default function Hero() {
  const phase = weddingPhase();
  const badge =
    phase === "before"
      ? "Boarding Soon"
      : phase === "day-of"
      ? "Now Boarding"
      : "Thank you for flying with us";
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-navy-deep pt-16 sm:pt-20"
    >
      {/* Background — airplane / clouds */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{
          backgroundImage: `url('${wedding.backgrounds.hero}')`,
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/40 to-navy-deep" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/40 to-transparent" aria-hidden />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* LEFT — names + chips + CTAs */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="self-start inline-flex items-center gap-2 px-3 py-1.5 border border-cream/30 rounded-full font-sans uppercase tracking-[0.3em] text-[10px] text-cream/85 mb-6">
              <PaperPlane className="w-3.5 h-3.5 text-gold" />
              {badge}
            </div>

            <h1 className="font-serif text-cream leading-[0.95]">
              <span className="block text-5xl sm:text-6xl md:text-7xl font-semibold uppercase tracking-tight">
                {wedding.groomFirst}
              </span>
              <span className="block text-5xl sm:text-6xl md:text-7xl font-semibold uppercase tracking-tight">
                <span className="text-gold">&amp;</span> {wedding.brideFirst}
              </span>
            </h1>

            <p className="font-script text-2xl sm:text-3xl text-cream/85 mt-4">
              flight {wedding.flightNumber.toLowerCase()} to forever
            </p>

            <div className="mt-8 space-y-3">
              <InfoChip
                icon={<CalendarIcon className="w-4 h-4" />}
                text={wedding.shortDateCompact}
              />
              <InfoChip
                icon={<PinIcon className="w-4 h-4" />}
                text={wedding.destinationVenue}
              />
              <InfoChip
                icon={<ClockIcon className="w-4 h-4" />}
                text={wedding.ceremonyTime}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href="#checkin"
                className="inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-3.5 bg-cream text-navy-deep rounded-sm hover:bg-gold transition-colors shadow-lg shadow-navy-deep/40"
              >
                <PaperPlane className="w-4 h-4" />
                Begin Check-in
              </a>
              <a
                href="#schedule"
                className="inline-flex items-center justify-center gap-2 font-sans uppercase tracking-[0.3em] text-[11px] px-6 py-3.5 border border-cream/50 text-cream rounded-sm hover:bg-cream/10 transition-colors"
              >
                View Flight Details
              </a>
            </div>

            <a
              href="/api/calendar.ics"
              className="mt-4 self-start inline-flex items-center gap-2 font-sans uppercase tracking-[0.3em] text-[10px] text-cream/70 hover:text-gold transition-colors"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Add to calendar
            </a>
          </div>

          {/* CENTER — boarding pass */}
          <div className="lg:col-span-5">
            <BoardingPassCard />
          </div>

          {/* RIGHT — prenup video */}
          <div id="prenup" className="lg:col-span-3 scroll-mt-24">
            <PrenupCard />
          </div>
        </div>
      </div>
    </section>
  );
}
