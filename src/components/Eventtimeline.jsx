import React, { useState, useEffect, useMemo } from 'react';
import { posters, EventModal } from './Event';

// Live time is used by default.
// To test the colors, put a time here (example: '11:15 AM'). Keep it null for real time.
const TEST_TIME = null;

// Layout numbers (row = one event)
const ROW_H = 112;

// Each colour belongs to one event row, the wave line blends through them
const COLORS = [
  '#facc15', // yellow
  '#4ade80', // green
  '#38bdf8', // blue
  '#f472b6', // pink
  '#c084fc', // purple
  '#fb923c', // orange
  '#f87171', // red
];

const DULL_COLOR = '#52525b';
const DULL_DOT = '#3f3f46';

// posterId connects the timeline row with the event popup (id from posters in Event.jsx)
// posterId: null means no popup for that row
const timelineData = [
  { time: '9:00 AM', title: 'Registration & Check-in', posterId: null },
  { time: '9:30 AM', title: 'Inauguration Ceremony', posterId: null },
  { time: '10:00 AM', title: 'Paper Presentation', posterId: 1 },
  { time: '10:00 AM', title: 'Web Design', posterId: 2 },
  { time: '11:00 AM', title: 'SQL Query', posterId: 3 },
  { time: '11:30 AM', title: 'Tech Quiz', posterId: 4 },
  { time: '12:30 PM', title: 'Lunch Break', posterId: null },
  { time: '1:30 PM', title: 'Tech Treasure Hunt', posterId: 5 },
  { time: '1:30 PM', title: 'Logo Identification', posterId: 6 },
  { time: '2:30 PM', title: 'Free Fire Tournament', posterId: 7 },
  { time: '3:00 PM', title: 'Chess Championship', posterId: 8 },
  { time: '3:30 PM', title: 'Vision Void', posterId: 9 },
  { time: '4:00 PM', title: 'Minute to Win It', posterId: 10 },
  { time: '4:30 PM', title: 'Prize Distribution & Closing', posterId: null },
];

// "1:30 PM" -> minutes from midnight
const toMinutes = (label) => {
  const [clock, period] = label.split(' ');
  let [hours, minutes] = clock.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const events = timelineData.map((item, index) => ({
  ...item,
  minutes: toMinutes(item.time),
  color: COLORS[index % COLORS.length],
}));

const TOTAL_H = events.length * ROW_H;

const getNowMinutes = () => {
  if (TEST_TIME) return toMinutes(TEST_TIME);
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

// Builds the wavy line. The curve bulges to the empty side of every row.
const buildWavePath = (centerX, amplitude) => {
  let path = `M ${centerX} 0`;
  for (let y = 2; y <= TOTAL_H; y += 2) {
    const x = centerX + amplitude * Math.sin((Math.PI * y) / ROW_H);
    path += ` L ${x.toFixed(1)} ${y}`;
  }
  return path;
};

// Dotted colourful wave. Coloured part = started events, dull part = upcoming events
const WaveLine = ({ id, amplitude, className, progressY }) => {
  const width = amplitude * 2 + 24;
  const centerX = width / 2;
  const path = useMemo(() => buildWavePath(centerX, amplitude), [centerX, amplitude]);

  return (
    <svg
      className={`absolute top-0 pointer-events-none ${className}`}
      width={width}
      height={TOTAL_H}
      viewBox={`0 0 ${width} ${TOTAL_H}`}
      fill="none"
    >
      <defs>
        <linearGradient
          id={`${id}-gradient`}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2={TOTAL_H}
        >
          {events.map((event, index) => (
            <stop
              key={index}
              offset={(index + 0.5) / events.length}
              stopColor={event.color}
            />
          ))}
        </linearGradient>

        <clipPath id={`${id}-clip`}>
          <rect x="0" y="0" width={width} height={progressY} />
        </clipPath>
      </defs>

      {/* Dull line (upcoming) */}
      <path
        d={path}
        stroke={DULL_DOT}
        strokeOpacity="0.6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="0.1 7"
      />

      {/* Coloured line (past + present) */}
      <path
        d={path}
        stroke={`url(#${id}-gradient)`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="0.1 7"
        clipPath={`url(#${id}-clip)`}
      />
    </svg>
  );
};

export default function EventTimeline() {
  const [nowMinutes, setNowMinutes] = useState(getNowMinutes);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Refresh the current time every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => setNowMinutes(getNowMinutes()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Last event that has already started (events are in time order)
  let lastStartedIndex = -1;
  events.forEach((event, index) => {
    if (event.minutes <= nowMinutes) lastStartedIndex = index;
  });

  const progressY = (lastStartedIndex + 1) * ROW_H;

  return (
    <section className="w-full bg-zinc-950 py-16 px-4 font-sans">
      
      <h2 className="text-center text-3xl md:text-5xl font-extrabold text-white tracking-wide mb-12 font-[Krona_one]">
        Event Timeline
        
      </h2>

      <div className="relative max-w-5xl mx-auto">

        {/* Wave line: wide for desktop, slim for mobile */}
        <WaveLine
          id="timeline-desktop"
          amplitude={98}
          className="hidden md:block left-1/2 -translate-x-1/2"
          progressY={progressY}
        />
        <WaveLine
          id="timeline-mobile"
          amplitude={10}
          className="md:hidden left-0"
          progressY={progressY}
        />

        {events.map((event, index) => {
          const isActive = index <= lastStartedIndex;
          const isLeft = index % 2 === 0;
          const poster = posters.find((item) => item.id === event.posterId);

          return (
            <div key={index} className="relative flex items-center" style={{ height: ROW_H }}>

              {/* Center dot */}
              <span
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-[22px] md:left-1/2 w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: isActive ? event.color : DULL_DOT }}
              />

              {/* Event card */}
              <div
                className={`w-full pl-12 md:pl-0 md:w-[calc(50%-44px)] ${isLeft ? '' : 'md:ml-auto'}`}
              >
                <div
                  onClick={poster ? () => setSelectedEvent(poster) : undefined}
                  className={`h-[92px] rounded-xl border bg-[#141414] px-5 md:px-6 flex flex-col justify-center ${
                    isActive ? 'border-zinc-800' : 'border-zinc-900'
                  } ${poster ? 'cursor-pointer' : ''}`}
                >
                  <p
                    className="text-sm font-bold"
                    style={{ color: isActive ? event.color : DULL_COLOR }}
                  >
                    {event.time}
                  </p>

                  <h3
                    className={`text-base md:text-lg font-semibold mt-1 ${
                      isActive ? 'text-zinc-200' : 'text-zinc-600'
                    }`}
                  >
                    {event.title}
                  </h3>
                </div>
              </div>

            </div>
          );
        })}

      </div>

      {/* Same event popup as the poster wall */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onChange={setSelectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

    </section>
  );
}