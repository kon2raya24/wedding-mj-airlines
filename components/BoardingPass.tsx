import { wedding } from "@/lib/config";
import { PaperPlane, Barcode } from "@/components/Decor";
import QR from "@/components/QRCode";

// The full boarding pass: main stub + tear line + right stub. Rendered on the
// dashboard where it rests as a ticket on the counter, tilting under the pointer.
export default function BoardingPass() {
  return (
    <div className="relative h-full bg-cream/95 text-navy rounded-md shadow-2xl shadow-navy-deep/60 overflow-hidden grid grid-cols-1 sm:grid-cols-[1fr_auto_200px] transition-shadow duration-700 ease-out-expo hover:shadow-[0_30px_60px_-20px_rgba(28,41,64,0.6)]">
      {/* MAIN STUB */}
      <div className="p-5 sm:p-6 md:p-7 flex flex-col">
        {/* Header strip */}
        <div className="pb-4 border-b border-navy/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <PaperPlane className="w-5 h-5 text-sky shrink-0" />
              <span className="font-serif text-base sm:text-lg leading-none truncate">
                <span className="font-semibold">JM</span>{" "}
                <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-navy/70 align-middle ml-1">
                  Airways
                </span>
              </span>
            </div>
            <div className="font-sans uppercase tracking-[0.3em] text-[9px] sm:text-[10px] text-navy/70 shrink-0">
              First Class
            </div>
          </div>
          <div className="font-sans uppercase tracking-[0.3em] text-[9px] text-navy/70 mt-2 pl-7">
            Flight to Forever
          </div>
        </div>

        {/* Body grid */}
        <dl className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 mt-5">
          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">
              Passenger
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">You Are Invited!</dd>
          </div>
          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">
              From
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1 flex items-center gap-2">
              {wedding.origin}
              <PaperPlane className="w-4 h-4 text-sky" />
            </dd>
          </div>

          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">
              Flight
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.flightNumber}</dd>
          </div>
          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">
              To
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.destination}</dd>
          </div>

          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">
              Date
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.shortDateCompact}</dd>
          </div>
          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">
              Destination
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.destinationVenue}</dd>
          </div>

          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">
              Boarding Time
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.boardingTime}</dd>
          </div>
          <div>
            <dt className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">
              Dress Code
            </dt>
            <dd className="font-serif text-sm sm:text-base mt-1">{wedding.dressCode}</dd>
            <dd className="mt-2 flex items-center gap-1.5" aria-label={`Colour motif: ${wedding.motif.map((m) => m.name).join(", ")}`}>
              {wedding.motif.map((m) => (
                <span
                  key={m.hex}
                  title={m.name}
                  className="w-5 h-5 rounded-full ring-1 ring-navy/25 shadow-sm transition-transform duration-300 hover:scale-125"
                  style={{ backgroundColor: m.hex }}
                />
              ))}
            </dd>
          </div>
        </dl>

        {/* Footer line */}
        <div className="mt-auto pt-6 border-t border-dashed border-navy/20 text-center font-sans uppercase tracking-[0.35em] text-[10px] text-navy/70">
          Together is our favorite destination ♡
        </div>
      </div>

      {/* Tear line — vertical between the stubs on wide screens, a
          perforated edge across the card when the stubs stack. */}
      <div className="relative h-px sm:h-auto sm:w-px">
        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-navy/30 sm:inset-x-auto sm:inset-y-3 sm:left-1/2 sm:top-auto sm:translate-y-0 sm:-translate-x-1/2 sm:h-auto sm:w-px sm:border-t-0 sm:border-l" />
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-navy-deep sm:left-1/2 sm:top-0" />
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-navy-deep sm:right-auto sm:left-1/2 sm:top-auto sm:bottom-0 sm:-translate-x-1/2 sm:translate-y-1/2" />
      </div>

      {/* RIGHT STUB */}
      <div className="bg-cream/95 p-5 sm:p-6 grid grid-cols-2 gap-x-4 gap-y-5 items-start sm:flex sm:flex-col sm:h-full">
        <div>
          <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">
            Seat / Table
          </div>
          <div className="font-serif text-2xl sm:text-3xl mt-1 leading-none">{wedding.seat}</div>
        </div>

        <div>
          <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/70">
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

        <div className="text-navy self-end sm:self-auto sm:mt-auto sm:pt-5 sm:w-full">
          <Barcode className="w-full h-10" />
        </div>
        <div className="bg-white p-1 rounded-sm justify-self-end sm:justify-self-auto sm:self-start sm:mt-4 text-navy">
          <QR text="/api/calendar.ics" size={80} />
        </div>
      </div>
    </div>
  );
}
