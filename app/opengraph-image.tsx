import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { wedding } from "@/lib/config";

// The card that shows when the link is shared: the film still, graded dark,
// with the names, the flight line and the essentials. Rendered once per
// deploy; fonts are bundled locally so it never waits on Google Fonts.
export const alt = `${wedding.groomFirst} & ${wedding.brideFirst} — ${wedding.shortDate}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#1c2940";
const NAVY_DEEP = "#4c6385";
const CREAM = "#f6efe0";
const SILVER = "#b9bec6";

async function font(file: string) {
  return readFile(path.join(process.cwd(), "app", "fonts", file));
}

export default async function OpenGraphImage() {
  const [serif, script, sans, still] = await Promise.all([
    font("cormorant-garamond-600.woff"),
    font("great-vibes-400.woff"),
    font("inter-500.woff"),
    readFile(path.join(process.cwd(), "public", "images", "hero-poster.jpg")),
  ]);
  const bg = `data:image/jpeg;base64,${still.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: NAVY_DEEP,
          color: CREAM,
          fontFamily: "Cormorant",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bg}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover", opacity: 0.55 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(76,99,133,0.35) 0%, rgba(28,41,64,0.55) 55%, ${NAVY} 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(28,41,64,0.6) 0%, rgba(28,41,64,0) 60%)",
          }}
        />

        {/* Top strip */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 56,
            right: 56,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Inter",
            fontSize: 18,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "rgba(246,239,224,0.75)",
          }}
        >
          <span>{`${wedding.brand} · Boarding pass`}</span>
          <span>{`FLT ${wedding.flightNumber}`}</span>
        </div>

        {/* Names */}
        <div style={{ position: "absolute", left: 56, bottom: 150, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, lineHeight: 0.86, textTransform: "uppercase", letterSpacing: -3 }}>
            {wedding.groomFirst}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", fontSize: 150, lineHeight: 0.86, textTransform: "uppercase", letterSpacing: -3 }}>
            <span style={{ fontFamily: "GreatVibes", textTransform: "none", color: SILVER, fontSize: 88, marginRight: 8, marginBottom: 14 }}>
              &amp;
            </span>
            <span>{wedding.brideFirst}</span>
          </div>
          <div style={{ fontFamily: "GreatVibes", fontSize: 46, color: "rgba(246,239,224,0.9)", marginTop: 26 }}>
            {`flight ${wedding.flightNumber.toLowerCase()} to forever`}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            bottom: 44,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(246,239,224,0.25)",
            paddingTop: 22,
            fontFamily: "Inter",
            fontSize: 20,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: SILVER }}>{wedding.shortDateCompact}</span>
          <span>{`${wedding.destinationVenue} · ${wedding.ceremonyTime}`}</span>
          <span style={{ color: "rgba(246,239,224,0.7)" }}>{`Gate ${wedding.gate}`}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: serif, weight: 600, style: "normal" },
        { name: "GreatVibes", data: script, weight: 400, style: "normal" },
        { name: "Inter", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
