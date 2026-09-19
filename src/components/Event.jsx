import React, { useState } from 'react';
import paperPresentation from '../assets/paperPresentation.jpg';
import webDesign from '../assets/webDesign.jpg';
import sqlQuery from '../assets/sqlQuery.jpg';
import chess from '../assets/chess.jpg';
import freeFire from '../assets/freeFire.jpg';
import LogoIdentification from '../assets/LogoIdentification.jpg';
import minuteToWinIt from '../assets/minuteToWinIt.jpg';
import techQuiz from '../assets/techQuiz.jpg';
import visionVoid from '../assets/visionVoid.jpg';
import techTreasureHunt from '../assets/techTreasureHunt.jpg';

// Sample Event Data (Unga requirements-kku yetha maadiri modify pannikonga)
export const posters = [
  {
    id: 1,
    name: 'PAPER PRESENTATION',
    animeName: 'Assassin Scholars',
    category: 'Technical',
    imgUrl: paperPresentation,

    teamSize: '1–3 members',
    rounds: '2 rounds — Abstract review + Presentation',
    timing: '10 min presentation + 5 min Q&A',

    rules: [
      'Topics must be related to emerging tech',
      'Plagiarism leads to disqualification',
      'Abstract must be submitted before the event',
      'Time limit strictly enforced'
    ]
  },
  {
    id: 2,
    name: 'Web Design',
    animeName: 'Digital Espadas',
    category: 'Technical',
    imgUrl: webDesign,

    teamSize: '1–2 members',
    rounds: 'Single round — 2 hours',
    timing: '2 hours total',

    rules: [
      'Topic will be given on-spot',
      'Pre-built templates not allowed',
      'Internet access allowed for reference only',
      'Responsive design gets bonus points'
    ]
  },
  {
    id: 3,
    name: 'SQL Query',
    animeName: 'Data Slayer',
    category: 'Technical',
    imgUrl: sqlQuery,
    teamSize: 'Individual',
    rounds: '3 rounds — Basic, Intermediate, Advanced',
    timing: '45 minutes per round',
    rules: [
      'No external tools or notes',
      'Queries must be optimized',
      'Correct syntax and output mandatory',
      'Tie-breaker based on speed'
    ]
  },
  {
    id: 4,
    name: 'Tech Quiz',
    animeName: 'Aizen IQ Arena',
    category: 'Technical',
    imgUrl: techQuiz,
    teamSize: '2 members',
    rounds: '3 rounds — MCQ, Rapid Fire, Buzzer',
    timing: '1 hour total',
    rules: [
      'No electronic devices allowed',
      'Questions cover CS, IT, current tech',
      'Negative marking in MCQ round',
      "Judge's decision is final"
    ]
  },
  {
    id: 5,
    name: 'Tech Treasure Hunt',
    animeName: 'One Piece Quest',
    category: 'Semi-Technical',
    imgUrl: techTreasureHunt,
    teamSize: '3–4 members',
    rounds: '5 checkpoints across campus',
    timing: '1.5 hours',
    rules: [
      'All team members must stay together',
      'Clues involve coding puzzles and riddles',
      'GPS/phone usage not allowed',
      'First team to finish wins'
    ]
  },
  {
    id: 6,
    name: 'Logo Identification',
    animeName: 'Six Eye Challenge',
    category: 'Semi-Technical',
    imgUrl: LogoIdentification,
    teamSize: 'Individual',
    rounds: '3 rounds — Easy, Medium, Hard',
    timing: '30 minutes total',
    rules: [
      'Logos from tech companies, apps, and brands',
      'Partial logos shown in harder rounds',
      'No electronic devices allowed',
      'Spelling must be accurate'
    ]
  },
  {
    id: 7,
    name: 'Free Fire',
    animeName: 'Akatsuki Royale',
    category: 'Esports',
    imgUrl: freeFire,
    teamSize: 'Squad (4 members)',
    rounds: '3 matches — Points cumulative',
    timing: 'Best of 3 matches',
    rules: [
      'Custom room codes shared before match',
      'Emulators not allowed',
      'Hacking leads to permanent ban',
      'Kill points + placement points'
    ]
  },
  {
    id: 8,
    name: 'Chess',
    animeName: 'Lelouch Strategy Arena',
    category: 'Esports',
    imgUrl: chess,
    teamSize: 'Individual',
    rounds: 'Knockout format',
    timing: '10 min per player (Rapid Chess)',
    rules: [
      'Standard FIDE rules apply',
      'Touch-move rule enforced',
      'No electronic assistance',
      'Draws resolved by Armageddon'
    ]
  },

  {
    id: 9,
    name: 'Vision Void',
    animeName: 'Sharingan Challenge',
    category: 'Non-Technical',
    imgUrl: visionVoid,
    teamSize: 'Individual',
    rounds: 'Multiple tasks blindfolded',
    timing: '5 minutes per task',
    rules: [
      'Tasks include drawing, typing, and sorting',
      'No peeking — instant disqualification',
      'Audience must not assist',
      'Best accuracy wins'
    ]
  },

  {
    id: 10,
    name: 'Minute to Win It',
    animeName: 'One Minute Hero',
    category: 'Non-Technical',
    imgUrl: minuteToWinIt,
    teamSize: 'Individual',
    rounds: '5 mini-games, 1 min each',
    timing: '1 minute per challenge',
    rules: [
      'Must complete task within 60 seconds',
      'No retries on failed tasks',
      'Points awarded based on completion',
      'Tie-breaker: bonus sudden death round'
    ]
  }
];


// Badge Color Mapper (Category-kku thagundha maadhiri colors automatic-a maarum)
const getBadgeStyle = (category) => {
  switch (category) {
    case 'Technical':
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';

    case 'Semi-Technical':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';

    case 'Esports':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/40';

    case 'Non-Technical':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/40';

    default:
      return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40';
  }
};
// Reusable Column Component
const GridColumn = ({ items, direction = 'up', onCardClick }) => {
  const animationClass = direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down';

  return (
    <div className={`flex flex-col gap-4 ${animationClass}`}>
      {[...items, ...items].map((item, index) => (
        <div
          key={index}
          onClick={() => onCardClick(item)}
          className="relative w-56 h-80 rounded-2xl overflow-hidden border-2 border-zinc-800 bg-zinc-950 group cursor-pointer transition-all duration-300 hover:border-zinc-500 hover:shadow-2xl hover:shadow-cyan-500/20 flex-shrink-0"
        >
          {/* Image */}
          <img
            src={item.imgUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />

          {/* Gradient Overlay & Details */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
            <span className={`text-xs px-2 py-0.5 rounded-full border w-max font-semibold backdrop-blur-md mb-1.5 ${getBadgeStyle(item.category)}`}>
              {item.category}
            </span>
            <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">
              {item.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

// Event Details Popup (shared by the poster wall and the timeline)
export function EventModal({ event, onChange, onClose }) {
  const currentIndex = posters.findIndex((item) => item.id === event.id);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onChange(posters[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < posters.length - 1) {
      onChange(posters[currentIndex + 1]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4" id="event">

      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-6xl overflow-y-auto max-h-[90vh] md:h-[600px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative animate-in fade-in zoom-in duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {/* Left Side: Image */}
        <div className="w-full md:w-[35%] h-64 md:h-full bg-zinc-950 flex items-center justify-center relative shrink-0">
          <img
            src={event.imgUrl}
            alt={event.name}
            className="w-full h-full object-cover "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent md:hidden" />
        </div>

        {/* Right Side: Event Details */}
        <div className="w-full md:w-[65%] p-6 md:p-7 flex flex-col min-w-0">

          {/* Scrollable Details */}
          <div className="flex-1 overflow-y-auto pr-2">

            {/* Category */}
            <span
              className={`text-xs px-2.5 py-1 rounded-full border font-semibold inline-block mb-3 ${getBadgeStyle(
                event.category
              )}`}
            >
              {event.category}
            </span>

            {/* Event Name */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              {event.name}
            </h2>

            {/* Anime Name */}
            <p className="text-zinc-400 text-sm mb-5">
              {event.animeName}
            </p>

            {/* Team Size + Rounds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">

              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                <p className="text-[10px] tracking-widest text-zinc-500 uppercase">
                  Team Size
                </p>

                <p className="text-sm text-white font-medium mt-1">
                  {event.teamSize}
                </p>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                <p className="text-[10px] tracking-widest text-zinc-500 uppercase">
                  Rounds
                </p>

                <p className="text-sm text-white font-medium mt-1">
                  {event.rounds}
                </p>
              </div>

            </div>

            {/* Timing */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 mb-4">
              <p className="text-[10px] tracking-widest text-zinc-500 uppercase">
                Timing
              </p>

              <p className="text-sm text-white font-medium mt-1">
                {event.timing}
              </p>
            </div>

            {/* Rules */}
            <div>
              <p className="text-[10px] tracking-widest text-zinc-500 uppercase mb-3">
                Rules
              </p>

              <ul className="space-y-2">
                {event.rules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm text-zinc-300"
                  >
                    <span className="text-pink-500 shrink-0">▸</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Previous / Next */}
          <div className="border-t border-zinc-800 pt-4 mt-4 grid grid-cols-2 gap-3">

            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="w-full py-2.5 border border-cyan-500/60 text-cyan-400 hover:bg-cyan-500/10 rounded-lg font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← PREV
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === posters.length - 1}
              className="w-full py-2.5 border border-pink-500/60 text-pink-400 hover:bg-pink-500/10 rounded-lg font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              NEXT →
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default function SymposiumPosterWall() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <>
    
    <div className="w-full h-screen overflow-hidden bg-zinc-950 flex justify-center items-center relative font-sans">
        
      {/* Dynamic Tilted Grid Wall */}
      <div className="flex gap-4 transform -rotate-12 scale-125 hover:[&>*]:[animation-play-state:paused]">
        <GridColumn items={posters} direction="up" onCardClick={setSelectedEvent} />
        <GridColumn items={posters} direction="down" onCardClick={setSelectedEvent} />
        <GridColumn items={posters} direction="up" onCardClick={setSelectedEvent} />
        <GridColumn items={posters} direction="down" onCardClick={setSelectedEvent} />
        <GridColumn items={posters} direction="up" onCardClick={setSelectedEvent} />
        <GridColumn items={posters} direction="down" onCardClick={setSelectedEvent} />
        <GridColumn items={posters} direction="up" onCardClick={setSelectedEvent} />
        <GridColumn items={posters} direction="down" onCardClick={setSelectedEvent} />
      </div>

      {/* Pop-up Showcase Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onChange={setSelectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

    </div>
    </>
  );
}