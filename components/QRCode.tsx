"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QR({
  text,
  className = "",
  size = 96,
}: {
  text: string;
  className?: string;
  size?: number;
}) {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    // Resolve relative paths against the current origin so a phone
    // scanning the QR opens the right page.
    let payload = text;
    if (typeof window !== "undefined" && text.startsWith("/")) {
      payload = window.location.origin + text;
    }
    QRCode.toString(payload, {
      type: "svg",
      margin: 1,
      width: size,
      color: { dark: "#0e2a47", light: "#ffffff" },
    })
      .then(setSvg)
      .catch(() => setSvg(null));
  }, [text, size]);

  if (!svg) {
    // Placeholder while the QR generates — keeps layout stable.
    return <div className={className} style={{ width: size, height: size, background: "#fff" }} />;
  }

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
