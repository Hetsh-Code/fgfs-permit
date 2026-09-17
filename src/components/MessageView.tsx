import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  CheckCircle2, 
  Clock, 
  Monitor, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  RotateCcw, 
  Sparkles,
  Heart,
  Volume2,
  Printer
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface MessageViewProps {
  onReset: () => void;
}

export default function MessageView({ onReset }: MessageViewProps) {
  const [approved, setApproved] = useState(false);
  const [dadSignature, setDadSignature] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds = 1200
  const [useHandwrittenFont, setUseHandwrittenFont] = useState(true);

  // Sound on reveal
  useEffect(() => {
    soundFX.playCabinChime();
  }, []);

  // 20-minute countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            soundFX.playCabinChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleApprove = () => {
    soundFX.playSuccess();
    setApproved(true);
    setTimerActive(true);
  };

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (dadSignature.trim()) {
      soundFX.playPaperRustle();
      setIsSigned(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto px-4 py-8"
    >
      {/* Top Floating Controls */}
      <div className="flex items-center justify-between mb-4 text-xs">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-slate-600 shadow-sm border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Re-open Envelope</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUseHandwrittenFont(!useHandwrittenFont)}
            className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-slate-600 shadow-sm border border-slate-200 transition-colors"
          >
            Font: {useHandwrittenFont ? 'Handwritten' : 'Standard Clean'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-slate-600 shadow-sm border border-slate-200 transition-colors"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* The Letter Sheet Container */}
      <div className="relative bg-[#fffdf9] rounded-2xl shadow-2xl border-4 border-amber-100 overflow-hidden">
        
        {/* Airmail Banner on Top */}
        <div
          className="h-3.5 w-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #ef4444 0px, #ef4444 14px, #ffffff 14px, #ffffff 20px, #2563eb 20px, #2563eb 34px, #ffffff 34px, #ffffff 40px)',
          }}
        />

        <div className="p-6 sm:p-10">
          
          {/* Header & Official Stamps */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-amber-200/80 pb-5 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                  <Plane className="w-5 h-5" />
                </span>
                <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-blue-800">
                  FlightGear Clearance Permit
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Flight Authorization Request
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Dispatch: Flight No. A-380 • Priority Passenger Clearance
              </p>
            </div>

            {/* Official Stamp badge */}
            <div className="border-2 border-emerald-600 text-emerald-700 bg-emerald-50/70 px-3 py-1.5 rounded-lg text-right font-mono-code text-[11px] font-bold tracking-wider rotate-[-2deg] shadow-sm">
              <div>STATUS: PENDING DAD</div>
              <div className="text-[9px] text-emerald-600">STRICT: 20 MIN MAX</div>
            </div>
          </div>

          {/* Letter Content Card */}
          <div className="relative bg-amber-50/40 rounded-2xl p-6 sm:p-8 border border-amber-200/70 shadow-inner">
            
            {/* Greeting */}
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono-code">
                To My Dear Dad,
              </span>
            </div>

            {/* The exact requested text */}
            <div className={`space-y-4 text-slate-800 leading-relaxed text-lg sm:text-xl ${useHandwrittenFont ? 'font-handwriting text-xl sm:text-2xl font-bold tracking-wide' : 'font-medium'}`}>
              <p className="text-justify">
                "Dad, can I please play FGFS (FlightGear Flight Simulator) on the PC for just 20 minutes instead of playing it on my mobile? The PC gives me a much better and more realistic experience because the screen is bigger and the controls are easier to use. I’ll play only for 20 minutes, and after that I’ll stop without arguing. I’ll also make sure I finish my important work first. Please let me play for just 20 minutes on the PC. ✈️🙂"
              </p>
            </div>

            {/* Visual Signature & Heart */}
            <div className="mt-6 pt-4 border-t border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-handwriting text-xl">
                <span>With respect & promise,</span>
                <span className="font-bold text-blue-700">Your Co-Pilot</span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline" />
              </div>
              <div className="text-xs font-mono-code text-slate-400">
                DATE: TODAY
              </div>
            </div>
          </div>

          {/* Key Promises Highlight Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">20 Minutes Only</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Strict timer limit, no overtime</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">No Arguing</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Will stop immediately when time is up</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Important Work First</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">All essential tasks completed before takeoff</p>
              </div>
            </div>
          </div>

          {/* PC vs Mobile Advantage comparison pill */}
          <div className="mt-3 bg-sky-50/70 border border-sky-200 rounded-xl p-3 flex items-center justify-between text-xs text-sky-900">
            <div className="flex items-center gap-2 font-medium">
              <Monitor className="w-4 h-4 text-sky-600" />
              <span>Why PC? Bigger display + realistic flight controls vs cramped mobile screen</span>
            </div>
            <span className="text-[11px] font-mono-code font-bold bg-sky-200/80 px-2 py-0.5 rounded text-sky-800">
              FGFS v2020+
            </span>
          </div>

          {/* Dad's Official Decision / Approval Section */}
          <div className="mt-8 border-t-2 border-dashed border-slate-200 pt-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Dad's Flight Clearance Decision</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click below to grant the 20-minute flight simulator session on PC
              </p>
            </div>

            {!approved ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.button
                  id="dad-approve-btn"
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleApprove}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Approved! Let him fly for 20 minutes ✈️</span>
                </motion.button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Approval Badge Banner */}
                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-base sm:text-lg">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Flight Clearance Granted by Dad! 🎉</span>
                  </div>
                  <p className="text-xs text-emerald-700 mt-1">
                    Permission granted for exactly 20 minutes of FlightGear Flight Simulator on PC.
                  </p>
                </div>

                {/* Live 20-Minute Countdown Clock */}
                <div className="bg-slate-900 text-white rounded-xl p-5 text-center shadow-lg border border-slate-700">
                  <div className="text-xs font-mono-code uppercase text-sky-400 tracking-wider flex items-center justify-center gap-1.5">
                    <Clock className="w-4 h-4 animate-spin text-sky-400" />
                    <span>20-Minute PC Flight Timer</span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-mono-code font-bold tracking-widest text-emerald-400 my-2">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-xs text-slate-400">
                    {timeLeft === 0
                      ? '⏱️ Time is officially up! Time to stop without arguing.'
                      : timerActive
                      ? 'Flight in progress. When timer reaches 00:00, PC session concludes.'
                      : 'Timer paused.'}
                  </p>

                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTimerActive(!timerActive)}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono-code text-slate-200 border border-slate-600"
                    >
                      {timerActive ? 'Pause Timer' : 'Resume Timer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimeLeft(20 * 60);
                        setTimerActive(false);
                      }}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono-code text-slate-200 border border-slate-600"
                    >
                      Reset 20m
                    </button>
                  </div>
                </div>

                {/* Dad's Signature Block */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                  {!isSigned ? (
                    <form onSubmit={handleSign} className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        value={dadSignature}
                        onChange={(e) => setDadSignature(e.target.value)}
                        placeholder="Dad's Signature (e.g. Best Dad / Captain Dad)"
                        className="w-full text-sm px-3.5 py-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        type="submit"
                        disabled={!dadSignature.trim()}
                        className="w-full sm:w-auto shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Stamp Signature ✍️
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Official Signature:</span>
                        <span className="font-handwriting text-2xl font-bold text-blue-900 border-b-2 border-blue-900 px-2">
                          {dadSignature}
                        </span>
                      </div>
                      <span className="text-xs font-mono-code text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                        OFFICIALLY RATIFIED
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Airmail Banner on Bottom */}
        <div
          className="h-3.5 w-full"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #ef4444 0px, #ef4444 14px, #ffffff 14px, #ffffff 20px, #2563eb 20px, #2563eb 34px, #ffffff 34px, #ffffff 40px)',
          }}
        />
      </div>
    </motion.div>
  );
}
