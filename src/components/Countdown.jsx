import { useEffect, useState } from "react";

const Countdown = () => {
  const calculateTimeLeft = () => {
    const eventDate = new Date("2026-09-30T00:00:00");
    const now = new Date();

    const difference = eventDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-3 text-white">

      <div className="text-center">
        <p className="
          text-4xl font-bold
          text-transparent
          bg-clip-text
          bg-gradient-to-b
          from-[#fff3a3]
          via-[#D4AF37]
          to-[#8a5a00]
          drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]
        ">
          {String(timeLeft.days).padStart(2, "0")}
        </p>

        <span className="text-xs tracking-[0.2em] text-gray-400">
          DAYS
        </span>
      </div>

      <span className="text-2xl text-[#D4AF37]">:</span>

      <div className="text-center">
        <p className="
          text-4xl font-bold
          text-transparent
          bg-clip-text
          bg-gradient-to-b
          from-[#fff3a3]
          via-[#D4AF37]
          to-[#8a5a00]
          drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]
        ">
          {String(timeLeft.hours).padStart(2, "0")}
        </p>

        <span className="text-xs tracking-[0.2em] text-gray-400">
          HOURS
        </span>
      </div>

      <span className="text-2xl text-[#D4AF37]">:</span>

      <div className="text-center">
        <p className="
          text-4xl font-bold
          text-transparent
          bg-clip-text
          bg-gradient-to-b
          from-[#fff3a3]
          via-[#D4AF37]
          to-[#8a5a00]
          drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]
        ">
          {String(timeLeft.minutes).padStart(2, "0")}
        </p>

        <span className="text-xs tracking-[0.2em] text-gray-400">
          MINUTES
        </span>
      </div>

      <span className="text-2xl text-[#D4AF37]">:</span>

      <div className="text-center">
        <p className="
          text-4xl font-bold
          text-transparent
          bg-clip-text
          bg-gradient-to-b
          from-[#fff3a3]
          via-[#D4AF37]
          to-[#8a5a00]
          drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]
        ">
          {String(timeLeft.seconds).padStart(2, "0")}
        </p>

        <span className="text-xs tracking-[0.2em] text-gray-400">
          SECONDS
        </span>
      </div>

    </div>
  );
};

export default Countdown;