import React from "react";
import Lanyard from "@/components/Lanyard";
import "../index.css"
const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Krona+One&family=Rajdhani:wght@400;600&display=swap');
.font-krona { font-family: 'Krona One', sans-serif; }
.font-rajdhani { font-family: 'Rajdhani', sans-serif; }
`;

const STATS = [
  { value: "10", label: "Epic Events", color: "#00f5ff" },
  { value: "1", label: "Legendary Day", color: "#ff2d78" },
  { value: "∞", label: "Glory Awaits", color: "#ffd700" },
  { value: "All", label: "Departments", color: "#a855f7" },
];

export default function AboutSection() {
  return (
    <section className="bg-[black] px-6 md:px-16 py-16 md:py-24 relative">
      <style>{FONT_IMPORT}</style>

      <div className="max-w-6xl mx-auto flex flex-col items-center font-rajdhani">
        {/* Lanyard, big and centered */}
        <div className="w-full h-[480px] md:h-[580px] -top-40 relative lanyardContainer md:scale-x-100 md:scale-y-120 ">
          <Lanyard />
        </div>

        {/* Heading + content below, overlapping slightly with lanyard bottom */}
        <div className="text-center -mt-10 md:-mt-16 max-w-3xl  z-10">
          <h2
            className="font-krona text-[34px] md:text-[70px] text-[#ffd700] tracking-[4px] uppercase font-black "
            style={{ textShadow: "0 0 0 rgba(255,215,0,0.6), 0 0 10px rgba(255,215,0,0.35)" }}
          >
            About Fest
          </h2>

          <p className="mt-3 text-[14px] md:text-[18px] text-cyan-100/70 leading-relaxed text-left font-[Roboto]">
            Welcome to Titan Techfest 2K26 — the annual technical festival of
            the Department of Computer Science &amp; Engineering, hosted at
            St. Joseph's College of Engineering &amp; Technology, Thanjavur.
          </p>
          <p className="mt-3 text-[14px] md:text-[18px] text-cyan-100/70 leading-relaxed text-left font-[Roboto]">
            This year's edition blends the world of anime with cutting-edge
            technology, bringing together students from across departments to
            compete, collaborate, and conquer.
          </p>
          <p className="mt-3 text-[14px] md:text-[18px] text-cyan-100/70 leading-relaxed text-left font-[Roboto]">
            From high-stakes coding battles to strategic chess duels and epic
            esports showdowns — there is an arena for every warrior.
          </p>
        </div>

        {/* Stat cards, single horizontal row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 w-full max-w-4xl">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="border border-white/10 bg-[#0d0d0d] rounded-lg py-6 px-4 text-center"
            >
              <div
                className="font-krona text-[28px] md:text-[32px]"
                style={{
                  color: s.color,
                  textShadow: `0 0 8px ${s.color}99, 0 0 20px ${s.color}55`,
                }}
              >
                {s.value}
              </div>
              <div className="mt-2 text-[13px] text-cyan-100/50 tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}