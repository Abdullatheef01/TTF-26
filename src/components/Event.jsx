import React, { useState } from 'react';

// Sample Event Data (Unga requirements-kku yetha maadiri modify pannikonga)
const posters = [
  {
    id: 1,
    name: 'Code Sprint',
    category: 'Technical',
    imgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400',
    description: 'Competitive coding challenge to solve algorithmic problems under tight time constraints.',
    rules: 'Languages allowed: C++, Java, Python. Individual participation.',
    time: '10:00 AM - 12:30 PM',
    venue: 'Lab 3, Main Block'
  },
  {
    id: 2,
    name: 'Prompt Design',
    category: 'Semi-Technical',
    imgUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=400',
    description: 'Use generative AI models to create complex UI graphics using precise prompt engineering.',
    rules: 'Internet provided. Max 2 members per team.',
    time: '01:30 PM - 03:00 PM',
    venue: 'Seminar Hall B'
  },
  {
    id: 3,
    name: 'VALORANT Showdown',
    category: 'E-Sports',
    imgUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400',
    description: '5v5 tactical shooter tournament. Battle out against the best campus teams.',
    rules: 'Bring your own peripherals (Mouse/Headset). Standard competitive rulebook.',
    time: '10:30 AM - 04:00 PM',
    venue: 'E-Sports Arena'
  },
  {
    id: 4,
    name: 'Web Craft',
    category: 'Technical',
    imgUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400',
    description: 'Build a fully responsive web page based on the given Figma asset within 2 hours.',
    rules: 'React or Tailwind allowed. No external UI libraries.',
    time: '11:00 AM - 01:00 PM',
    venue: 'Lab 1'
  },
  {
    id: 5,
    name: 'Tech Quiz',
    category: 'Semi-Technical',
    imgUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400',
    description: 'Test your knowledge on latest tech trends, computer science fundamentals, and history.',
    rules: '2 rounds: prelims written, final buzzer round. Teams of 2.',
    time: '02:00 PM - 03:30 PM',
    venue: 'Auditorium'
  }
];

// Badge Color Mapper (Category-kku thagundha maadhiri colors automatic-a maarum)
const getBadgeStyle = (category) => {
  switch (category) {
    case 'Technical':
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
    case 'Semi-Technical':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    case 'E-Sports':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
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

export default function SymposiumPosterWall() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {/* Left Side: Image */}
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img
                src={selectedEvent.imgUrl}
                alt={selectedEvent.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent md:hidden" />
            </div>

            {/* Right Side: Event Details */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
              <div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold inline-block mb-3 ${getBadgeStyle(selectedEvent.category)}`}>
                  {selectedEvent.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                  {selectedEvent.name}
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  {selectedEvent.description}
                </p>

                <div className="space-y-2 text-xs text-zinc-400">
                  <p><strong className="text-zinc-200">Rules:</strong> {selectedEvent.rules}</p>
                  <p><strong className="text-zinc-200">Time:</strong> {selectedEvent.time}</p>
                  <p><strong className="text-zinc-200">Venue:</strong> {selectedEvent.venue}</p>
                </div>
              </div>

              <button 
                onClick={() => alert(`Registered for ${selectedEvent.name}!`)}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                Register Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}