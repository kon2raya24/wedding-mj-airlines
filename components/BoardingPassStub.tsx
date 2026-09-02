import { wedding } from "@/lib/config";
import { PaperPlane, Barcode } from "@/components/Decor";

export default function BoardingPassStub() {
  return (
    <aside className="relative bg-cream rounded-md border border-navy/15 shadow-lg overflow-hidden flex flex-col h-full">
      {/* Left rail with rotated text */}
      <div className="absolute left-0 inset-y-0 w-9 bg-navy-deep text-cream flex items-center justify-center">
        <span className="rotate-180 [writing-mode:vertical-rl] font-sans uppercase tracking-[0.5em] text-[10px]">
          Boarding Pass
        </span>
      </div>

      <div className="pl-12 pr-5 sm:pr-6 py-5 sm:py-6 flex-1 flex flex-col">
        {/* Top header */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-dashed border-navy/20">
          <div className="flex items-center gap-2 min-w-0">
            <PaperPlane className="w-5 h-5 text-gold shrink-0" />
            <div>
              <div className="font-serif text-base leading-none">
                <span className="font-semibold">JM</span>{" "}
                <span className="font-sans uppercase tracking-[0.3em] text-[9px] text-navy/70 align-middle ml-1">
                  Airways
                </span>
              </div>
              <div className="font-sans uppercase tracking-[0.3em] text-[9px] text-navy/55 mt-0.5">
                Flight to Forever
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-5">
          <div>
            <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
              Passenger
            </div>
            <div className="font-serif text-base mt-1">You Are Invited!</div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 items-center">
            <div>
              <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
                From
              </div>
              <div className="font-serif text-base mt-1">{wedding.origin}</div>
            </div>
            <div className="text-right">
              <PaperPlane className="w-4 h-4 text-gold inline-block" />
            </div>
            <div className="col-span-2">
              <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
                To
              </div>
              <div className="font-serif text-base mt-1">{wedding.destination}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
                Flight
              </div>
              <div className="font-serif text-base mt-1">{wedding.flightNumber}</div>
            </div>
            <div>
              <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
                Date
              </div>
              <div className="font-serif text-base mt-1">{wedding.shortDateCompact}</div>
            </div>
            <div>
              <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
                Gate
              </div>
              <div className="font-serif text-base mt-1 uppercase">{wedding.gate}</div>
            </div>
            <div>
              <div className="font-sans uppercase tracking-[0.25em] text-[9px] text-navy/55">
                Seat / Table
              </div>
              <div className="font-serif text-base mt-1">{wedding.seat}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-5">
          <Barcode className="w-full h-10 text-navy" />
          <p className="mt-3 text-center font-sans uppercase tracking-[0.3em] text-[10px] text-navy/65">
            Thank you for flying with us!
          </p>
        </div>
      </div>
    </aside>
  );
}
