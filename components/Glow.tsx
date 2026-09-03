// Soft colour glows that drift slowly behind the whole page — the "night
// flight" atmosphere every section sits on. Pure CSS; parked under
// reduced motion.
export default function Glow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-navy">
      <div className="glow-orb absolute -top-[20%] -left-[10%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(131,152,183,0.45),transparent_60%)]" style={{ "--rise": "-22vh" } as React.CSSProperties} />
      <div className="glow-orb glow-orb-2 absolute top-[30%] -right-[20%] h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(circle,rgba(185,190,198,0.22),transparent_60%)]" style={{ "--rise": "-40vh" } as React.CSSProperties} />
      <div className="glow-orb glow-orb-3 absolute -bottom-[30%] left-[20%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(179,168,155,0.22),transparent_60%)]" style={{ "--rise": "-12vh" } as React.CSSProperties} />
      {/* Cloud wisps at two depths: they drift on their own and rise past
          the page faster than it scrolls (.cloud in globals.css). */}
      <div className="cloud absolute top-[70%] -left-[10%] h-[16vh] w-[70vw] rounded-full bg-cream/[0.06] blur-3xl" style={{ "--rise": "-140vh", "--drift": "9vw" } as React.CSSProperties} />
      <div className="cloud cloud-2 absolute top-[120%] left-[30%] h-[12vh] w-[55vw] rounded-full bg-cream/[0.05] blur-3xl" style={{ "--rise": "-90vh", "--drift": "-7vw" } as React.CSSProperties} />
      <div className="cloud cloud-3 absolute top-[165%] -right-[15%] h-[18vh] w-[80vw] rounded-full bg-silver/[0.05] blur-3xl" style={{ "--rise": "-160vh", "--drift": "6vw" } as React.CSSProperties} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(28,41,64,0.55)_100%)]" />
    </div>
  );
}
