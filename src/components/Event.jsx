import { useState } from "react";

const IMG_BASE = "https://picsum.photos/seed/"; // swap for your real IMGS[event.image] paths

const EVENTS = [
  { id: 1, name: "Paper Presentation", animeName: "Assassin Scholars", category: "technical", image: "hammer_titan", teamSize: "1–3 members", rounds: "2 rounds — Abstract review + Presentation", timing: "10 min presentation + 5 min Q&A", rules: ["Topics must be related to emerging tech", "Plagiarism leads to disqualification", "Abstract must be submitted before the event", "Time limit strictly enforced"] },
  { id: 2, name: "Web Design", animeName: "Digital Espadas", category: "technical", image: "kakashi", teamSize: "1–2 members", rounds: "Single round — 2 hours", timing: "2 hours total", rules: ["Topic will be given on-spot", "Pre-built templates not allowed", "Internet access allowed for reference only", "Responsive design gets bonus points"] },
  { id: 3, name: "SQL Query", animeName: "Data Slayer", category: "technical", image: "edward_elric", teamSize: "Individual", rounds: "3 rounds — Basic, Intermediate, Advanced", timing: "45 minutes per round", rules: ["No external tools or notes", "Queries must be optimized", "Correct syntax and output mandatory", "Tie-breaker based on speed"] },
  { id: 4, name: "Tech Quiz", animeName: "Aizen IQ Arena", category: "technical", image: "aizen", teamSize: "2 members", rounds: "3 rounds — MCQ, Rapid Fire, Buzzer", timing: "1 hour total", rules: ["No electronic devices allowed", "Questions cover CS, IT, current tech", "Negative marking in MCQ round", "Judge's decision is final"] },
  { id: 5, name: "Tech Treasure Hunt", animeName: "One Piece Quest", category: "semi-technical", image: "luffy", teamSize: "3–4 members", rounds: "5 checkpoints across campus", timing: "1.5 hours", rules: ["All team members must stay together", "Clues involve coding puzzles and riddles", "GPS/phone usage not allowed", "First team to finish wins"] },
  { id: 6, name: "Logo Identification", animeName: "Six Eye Challenge", category: "semi-technical", image: "gojo", teamSize: "Individual", rounds: "3 rounds — Easy, Medium, Hard", timing: "30 minutes total", rules: ["Logos from tech companies, apps, and brands", "Partial logos shown in harder rounds", "No electronic devices allowed", "Spelling must be accurate"] },
  { id: 7, name: "Free Fire", animeName: "Akatsuki Royale", category: "esports", image: "sungjinwoo", teamSize: "Squad (4 members)", rounds: "3 matches — Points cumulative", timing: "Best of 3 matches", rules: ["Custom room codes shared before match", "Emulators not allowed", "Hacking leads to permanent ban", "Kill points + placement points"] },
  { id: 8, name: "Chess", animeName: "Lelouch Strategy Arena", category: "esports", image: "lelouch", teamSize: "Individual", rounds: "Knockout format", timing: "10 min per player (Rapid Chess)", rules: ["Standard FIDE rules apply", "Touch-move rule enforced", "No electronic assistance", "Draws resolved by Armageddon"] },
  { id: 9, name: "Vision Void", animeName: "Sharingan Challenge", category: "non-technical", image: "itachi", teamSize: "Individual", rounds: "Multiple tasks blindfolded", timing: "5 minutes per task", rules: ["Tasks include drawing, typing, and sorting", "No peeking — instant disqualification", "Audience must not assist", "Best accuracy wins"] },
  { id: 10, name: "Minute to Win It", animeName: "One Minute Hero", category: "non-technical", image: "saitama", teamSize: "Individual", rounds: "5 mini-games, 1 min each", timing: "1 minute per challenge", rules: ["Must complete task within 60 seconds", "No retries on failed tasks", "Points awarded based on completion", "Tie-breaker: bonus sudden death round"] },
];

const CAT = {
  technical:        { label: "Technical",       color: "#00e5ff" },
  "semi-technical": { label: "Semi-Technical",  color: "#ff2e9f" },
  esports:          { label: "Esports",         color: "#a855f7" },
  "non-technical":  { label: "Non-Technical",   color: "#ffd400" },
};

// split events round-robin into N columns
function makeColumns(n) {
  const cols = Array.from({ length: n }, () => []);
  EVENTS.forEach((ev, i) => cols[i % n].push(ev));
  return cols;
}

const COLUMNS = makeColumns(4); // 4 on desktop; render fewer visually on mobile via CSS

export default function EventsNetflix() {
  const [active, setActive] = useState(null);
  const [closing, setClosing] = useState(false);

  function openModal(ev) {
    setActive(ev);
    setClosing(false);
  }
  function closeModal() {
    setClosing(true);
    setTimeout(() => {
      setActive(null);
      setClosing(false);
    }, 300);
  }

  return (
    <section className="py-24 px-4 bg-[#0d0d0d] text-neutral-100 overflow-hidden">
      <h2 className="font-['Orbitron'] text-3xl md:text-5xl font-bold text-center mb-2">
        EVENTS
      </h2>
      <p className="text-neutral-500 text-center mb-16 text-sm">
        Click a poster for full details
      </p>

      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        {COLUMNS.map((col, ci) => {
          const goingLeft = ci % 2 === 0; // alternate direction per row
          const duration = 22 + ci * 4; // slightly different speed per row
          const doubled = [...col, ...col]; // duplicate for seamless loop

          return (
            <div key={ci} className="relative overflow-hidden rounded-xl">
              <div
                className="flex gap-4 w-max hover:[animation-play-state:paused]"
                style={{
                  animation: `${goingLeft ? "scrollLeft" : "scrollRight"} ${duration}s linear infinite`,
                }}
              >
                {doubled.map((ev, i) => {
                  const cat = CAT[ev.category];
                  return (
                    <div
                      key={ci + "-" + i}
                      onClick={() => openModal(ev)}
                      className="relative rounded-xl overflow-hidden w-40 md:w-52 aspect-[3/4] cursor-pointer border-2 shadow-lg group flex-shrink-0"
                      style={{ borderColor: `${cat.color}55`, boxShadow: `0 0 14px ${cat.color}33` }}
                    >
                      <img
                        src={`${IMG_BASE}${ev.image}/300/400`}
                        alt={ev.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      <span
                        className="absolute top-2 right-2 text-[.55rem] font-['Orbitron'] uppercase tracking-wide px-2 py-0.5 rounded-full border backdrop-blur bg-black/60"
                        style={{ borderColor: cat.color, color: cat.color }}
                      >
                        {cat.label}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <p className="text-[.85rem] font-semibold leading-tight">{ev.name}</p>
                        <p className="text-[.65rem] text-neutral-400">{ev.animeName}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* fade edges like Netflix rows, now on left/right */}
              <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#0d0d0d] to-transparent" />
              <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#0d0d0d] to-transparent" />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Full-screen modal */}
      {active && (
        <div
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4 transition-opacity duration-300 ${
            closing ? "opacity-0" : "opacity-100"
          }`}
        >
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 md:top-8 md:right-8 w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-xl hover:border-white/50 hover:bg-white/10 transition z-10"
          >
            ✕
          </button>

          <div
            className={`w-full max-w-4xl max-h-[85vh] bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl transition-all duration-300 ${
              closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div className="h-56 md:h-full">
              <img
                src={`${IMG_BASE}${active.image}/600/800`}
                alt={active.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh]">
              <span
                className="inline-block text-[.65rem] font-['Orbitron'] tracking-widest uppercase px-3 py-1 rounded-full border mb-4"
                style={{ borderColor: CAT[active.category].color, color: CAT[active.category].color }}
              >
                {CAT[active.category].label}
              </span>
              <h3
                className="font-['Orbitron'] text-sm tracking-wide uppercase mb-1"
                style={{ color: CAT[active.category].color }}
              >
                {active.animeName}
              </h3>
              <h2 className="text-2xl md:text-3xl font-bold mb-5">{active.name}</h2>

              <div className="space-y-3 mb-6 text-sm text-neutral-300">
                <div><span className="text-neutral-500">Team Size — </span>{active.teamSize}</div>
                <div><span className="text-neutral-500">Rounds — </span>{active.rounds}</div>
                <div><span className="text-neutral-500">Timing — </span>{active.timing}</div>
              </div>

              <h4 className="font-['Orbitron'] text-xs tracking-widest uppercase text-neutral-500 mb-2">
                Rules
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-neutral-300">
                {active.rules.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}