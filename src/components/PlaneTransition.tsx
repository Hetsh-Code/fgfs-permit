import { useEffect } from 'react';
import { motion } from 'motion/react';
import { soundFX } from '../utils/audio';

interface PlaneTransitionProps {
  onComplete: () => void;
}

export default function PlaneTransition({ onComplete }: PlaneTransitionProps) {
  useEffect(() => {
    soundFX.playCabinChime();
    const timer = setTimeout(() => {
      soundFX.playJetFlyby();
    }, 200);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div
      id="plane-transition-overlay"
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* Speed lines & clouds parting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.9, 0] }}
        transition={{ duration: 2.8, times: [0, 0.2, 0.7, 1] }}
        className="absolute inset-0 bg-sky-500/10 backdrop-blur-[2px]"
      />

      {/* Rushing wind streaks */}
      <div className="absolute inset-0 overflow-hidden">
        {[15, 30, 50, 70, 85].map((top, idx) => (
          <motion.div
            key={idx}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 0.8, 0] }}
            transition={{
              duration: 1.2,
              delay: 0.2 + idx * 0.1,
              ease: 'linear',
            }}
            style={{ top: `${top}%` }}
            className="absolute left-0 w-96 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent"
          />
        ))}
      </div>

      {/* The Jet & Contrail Group flying across */}
      <motion.div
        initial={{ x: '-120vw', y: '10vh', rotate: -6, scale: 0.85 }}
        animate={{ x: '120vw', y: '-15vh', rotate: -4, scale: 1.15 }}
        transition={{
          duration: 2.4,
          ease: [0.25, 0.1, 0.25, 1], // aerodynamic acceleration curve
        }}
        className="relative flex items-center"
      >
        {/* Trailing Flight Banner */}
        <div className="relative mr-4 hidden sm:flex items-center">
          <div className="w-12 h-[1px] bg-slate-400/80 border-t border-dashed border-slate-500" />
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="bg-white/95 border-2 border-sky-600 text-sky-900 font-bold px-4 py-2 rounded-lg shadow-xl text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 whitespace-nowrap"
          >
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>FGFS Flight Clearance Request Inbound</span>
            <span>✈️</span>
          </motion.div>
        </div>

        {/* Realistic Contrail Stream */}
        <div className="absolute right-[85%] top-[45%] -translate-y-1/2 flex flex-col gap-3 pointer-events-none">
          <motion.div
            initial={{ width: 0, opacity: 0.9 }}
            animate={{ width: ['0vw', '100vw'], opacity: [0.9, 0.4] }}
            transition={{ duration: 2 }}
            className="h-3 bg-gradient-to-l from-white/90 via-white/50 to-transparent rounded-full blur-[2px]"
          />
          <motion.div
            initial={{ width: 0, opacity: 0.9 }}
            animate={{ width: ['0vw', '95vw'], opacity: [0.9, 0.3] }}
            transition={{ duration: 2, delay: 0.05 }}
            className="h-2.5 bg-gradient-to-l from-white/80 via-white/40 to-transparent rounded-full blur-[2px]"
          />
        </div>

        {/* Detailed Modern Jet Vector (A380 / Airliner style) */}
        <div className="relative w-64 h-36 sm:w-80 sm:h-44 drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]">
          <svg viewBox="0 0 400 220" className="w-full h-full" fill="none">
            {/* Contrail emitters */}
            <circle cx="90" cy="115" r="4" fill="white" className="animate-pulse" />
            <circle cx="130" cy="125" r="4" fill="white" className="animate-pulse" />

            {/* Fuselage Shadow / Underbelly */}
            <path
              d="M 50,110 Q 90,135 240,135 Q 350,135 380,115 Q 360,130 240,140 Q 90,140 50,110 Z"
              fill="#cbd5e1"
            />

            {/* Main Fuselage Body */}
            <path
              d="M 40,105 Q 60,60 120,65 L 330,75 Q 380,85 390,110 Q 370,130 250,130 L 90,125 Q 40,120 40,105 Z"
              fill="#ffffff"
              stroke="#0369a1"
              strokeWidth="2.5"
            />

            {/* Cockpit Windshield */}
            <path
              d="M 360,100 Q 378,103 382,108 Q 370,112 355,108 Z"
              fill="#0f172a"
            />
            {/* Cockpit glare */}
            <path
              d="M 364,102 Q 374,105 378,107"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />

            {/* Passenger Windows (Double deck A380 tribute) */}
            <g fill="#0284c7">
              {/* Upper Deck Windows */}
              {[150, 170, 190, 210, 230, 250, 270, 290, 310, 330].map((cx) => (
                <circle key={`u-${cx}`} cx={cx} cy="85" r="2.5" />
              ))}
              {/* Main Deck Windows */}
              {[130, 150, 170, 190, 210, 230, 250, 270, 290, 310, 330, 345].map((cx) => (
                <circle key={`m-${cx}`} cx={cx} cy="100" r="3" />
              ))}
            </g>

            {/* Livery Stripe */}
            <path
              d="M 120,92 L 355,95 Q 370,105 375,110 L 100,105 Z"
              fill="#0284c7"
              opacity="0.9"
            />
            <path
              d="M 140,104 L 360,107 L 340,112 L 120,110 Z"
              fill="#f59e0b"
            />

            {/* Vertical Tail Fin */}
            <path
              d="M 50,105 L 10,25 Q 25,20 65,30 L 110,80 Z"
              fill="#0284c7"
              stroke="#0369a1"
              strokeWidth="2"
            />
            <path
              d="M 25,32 L 55,36 L 90,82 L 60,80 Z"
              fill="#38bdf8"
            />
            {/* Tail logo emblem */}
            <circle cx="50" cy="50" r="10" fill="#f59e0b" />
            <text x="44" y="54" fontSize="12" fill="white" fontWeight="bold">✈</text>

            {/* Horizontal Stabilizer */}
            <path
              d="M 35,98 L 10,90 Q 20,85 50,88 L 75,98 Z"
              fill="#94a3b8"
            />

            {/* Main Swept Wing */}
            <path
              d="M 180,105 L 110,185 Q 125,190 145,185 L 255,120 Z"
              fill="#e2e8f0"
              stroke="#0369a1"
              strokeWidth="2"
            />
            {/* Wingtip fence / Sharklet */}
            <path
              d="M 110,185 L 102,172 L 115,185 L 106,195 Z"
              fill="#0284c7"
            />

            {/* Turbofan Jet Engines under the wing */}
            <g>
              {/* Inner Engine */}
              <rect x="180" y="130" width="34" height="18" rx="7" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
              <ellipse cx="212" cy="139" rx="3.5" ry="8.5" fill="#38bdf8" />
              <ellipse cx="182" cy="139" rx="3.5" ry="8" fill="#f97316" className="animate-pulse" />

              {/* Outer Engine */}
              <rect x="135" y="150" width="30" height="16" rx="6" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
              <ellipse cx="163" cy="158" rx="3" ry="7.5" fill="#38bdf8" />
              <ellipse cx="137" cy="158" rx="3" ry="7" fill="#f97316" className="animate-pulse" />
            </g>

            {/* Aircraft Registration Code "A-380" */}
            <text
              x="220"
              y="74"
              fill="#0369a1"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="1"
            >
              FGFS-A380
            </text>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
