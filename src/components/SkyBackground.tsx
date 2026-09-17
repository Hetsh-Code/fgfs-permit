import { Volume2, VolumeX, Plane } from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useState } from 'react';

export default function SkyBackground() {
  const [muted, setMuted] = useState(!soundFX.enabled);

  const toggleSound = () => {
    const next = !soundFX.enabled;
    soundFX.enabled = next;
    setMuted(!next);
    if (next) {
      soundFX.playCabinChime();
    }
  };

  return (
    <div id="sky-environment" className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-sky-400 via-sky-200 to-amber-50">
      {/* Sun glow */}
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute top-12 right-24 w-28 h-28 rounded-full bg-amber-100/60 blur-xl" />

      {/* Distant background clouds */}
      <div className="absolute top-12 left-0 right-0 opacity-40 animate-cloud-drift">
        <svg className="w-full h-32" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="white">
          <path d="M0,60 C150,90 200,30 350,50 C500,70 600,20 750,45 C900,70 1000,30 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Fluffy mid-layer clouds */}
      <div className="absolute top-1/4 -left-20 w-96 h-36 bg-white/70 rounded-full blur-sm animate-cloud-drift-slow" />
      <div className="absolute top-1/3 -right-20 w-80 h-32 bg-white/60 rounded-full blur-sm animate-cloud-drift" />
      <div className="absolute bottom-20 left-1/4 w-[500px] h-40 bg-white/50 rounded-full blur-md animate-cloud-drift-slow" />

      {/* Tiny high altitude cruise plane in the distance */}
      <div className="absolute top-16 left-[-100px] animate-[slideRight_60s_linear_infinite] opacity-30 flex items-center gap-2">
        <div className="w-32 h-[1px] bg-white/80 blur-[0.5px]" />
        <Plane className="w-4 h-4 text-white rotate-45" />
      </div>

      {/* Sound control button (needs pointer-events-auto) */}
      <div className="pointer-events-auto fixed top-4 right-4 z-50">
        <button
          id="sound-toggle-btn"
          type="button"
          onClick={toggleSound}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-sky-200 shadow-sm text-xs font-medium text-slate-700 hover:bg-white hover:text-sky-600 transition-colors"
          title={muted ? 'Enable sound effects' : 'Mute sound effects'}
        >
          {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-sky-600 animate-pulse" />}
          <span>{muted ? 'Audio Off' : 'Audio On'}</span>
        </button>
      </div>
    </div>
  );
}
