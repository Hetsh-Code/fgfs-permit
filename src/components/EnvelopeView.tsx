import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, KeyRound, ArrowRight, Sparkles, Mail, Plane, RotateCcw, AlertCircle } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface EnvelopeViewProps {
  onPasswordSuccess: () => void;
}

export default function EnvelopeView({ onPasswordSuccess }: EnvelopeViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize password to check for either literal emojis "✈️3️⃣8️⃣0️⃣", variations with/without variation selectors, or standard "380"
  const checkPassword = (input: string) => {
    // Strip variation selectors \uFE0F and zero-width joiners
    const clean = input.replace(/[\uFE0E\uFE0F\u200D]/g, '').trim();
    const rawDigitsAndPlane = clean.replace(/[^0-9✈]/g, '');

    const targetExact = '✈️3️⃣8️⃣0️⃣';
    const targetClean = targetExact.replace(/[\uFE0E\uFE0F\u200D]/g, '');

    return (
      clean === targetClean ||
      input.includes('✈️3️⃣8️⃣0️⃣') ||
      clean.includes('✈380') ||
      rawDigitsAndPlane === '✈380' ||
      input.trim().toLowerCase() === '380' ||
      input.trim().toLowerCase() === 'a380'
    );
  };

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      soundFX.playPaperRustle();
      setIsOpen(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 600);
    }
  };

  const handleAppendSymbol = (sym: string) => {
    soundFX.playPaperRustle();
    setErrorMsg('');
    setPassword((prev) => prev + sym);
  };

  const handleBackspace = () => {
    soundFX.playPaperRustle();
    setErrorMsg('');
    setPassword((prev) => {
      // Handle emoji slicing safely
      const chars = Array.from(prev);
      chars.pop();
      return chars.join('');
    });
  };

  const handleClear = () => {
    soundFX.playPaperRustle();
    setPassword('');
    setErrorMsg('');
  };

  const handleFillCorrect = () => {
    soundFX.playPaperRustle();
    setPassword('✈️3️⃣8️⃣0️⃣');
    setErrorMsg('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (checkPassword(password)) {
      setErrorMsg('');
      soundFX.playSuccess();
      onPasswordSuccess();
    } else {
      soundFX.playPaperRustle();
      setIsShaking(true);
      setErrorMsg('Incorrect passcode. The required password is ✈️3️⃣8️⃣0️⃣');
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  // Keyboard shortcut: if user presses enter inside the input
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[600px] px-4 py-8">
      {/* Outer Envelope Wrapper */}
      <div className="relative w-full flex flex-col items-center">
        
        {/* Envelope Body */}
        <motion.div
          layout
          className="relative w-full max-w-md sm:max-w-lg bg-amber-50 rounded-2xl shadow-2xl border-4 border-amber-200/80 overflow-visible transition-all"
          style={{
            perspective: 1200,
          }}
        >
          {/* Airmail Border (classic red and royal blue angled stripes) */}
          <div
            className="h-3 w-full rounded-t-xl"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, #ef4444 0px, #ef4444 14px, #ffffff 14px, #ffffff 20px, #2563eb 20px, #2563eb 34px, #ffffff 34px, #ffffff 40px)',
            }}
          />

          {/* Envelope Header Stamps & Air Mail Label */}
          <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-mono-code font-bold text-[11px] sm:text-xs px-2.5 py-0.5 rounded tracking-wider uppercase shadow-sm">
                <Plane className="w-3.5 h-3.5" />
                Air Mail // Par Avion
              </span>
              <span className="text-[10px] font-mono-code text-slate-400 font-semibold tracking-wider">
                PRIORITY NO. 380
              </span>
            </div>

            {/* Vintage Postmark Stamp */}
            <div className="w-11 h-11 border-2 border-dashed border-red-400 rounded-full flex flex-col items-center justify-center text-red-500 text-[8px] font-mono-code font-bold uppercase rotate-12 opacity-80 select-none">
              <span>SPECIAL</span>
              <span className="text-[9px]">FGFS</span>
              <span>POST</span>
            </div>
          </div>

          {/* If Envelope is Closed: Show Front Addressing and Wax Seal */}
          {!isOpen && (
            <motion.div
              id="envelope-front"
              key="envelope-closed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleOpenEnvelope}
              className="px-6 py-10 sm:py-14 text-center cursor-pointer group flex flex-col items-center justify-center space-y-6"
            >
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-amber-100/80 rounded-full text-xs font-semibold text-amber-900 border border-amber-300/60">
                  ✈️ Confidential Aviation Message
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                  For: Dad 👨‍✈️
                </h1>
                <p className="text-sm font-handwriting text-slate-600 text-lg">
                  (Important Flight Clearance Request inside)
                </p>
              </div>

              {/* Interactive Wax Seal / Click Button */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                animate={{
                  boxShadow: [
                    '0 10px 25px -5px rgba(220, 38, 38, 0.3)',
                    '0 15px 30px -5px rgba(220, 38, 38, 0.5)',
                    '0 10px 25px -5px rgba(220, 38, 38, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-rose-900 border-4 border-amber-300 text-white flex flex-col items-center justify-center shadow-xl cursor-pointer relative"
              >
                <Mail className="w-7 h-7 text-amber-200" />
                <span className="text-[9px] font-bold tracking-widest text-amber-200 uppercase mt-0.5">
                  OPEN
                </span>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-300 text-[10px] text-red-800 font-bold items-center justify-center">!</span>
                </span>
              </motion.div>

              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Click envelope to break seal & inspect contents</span>
              </div>
            </motion.div>
          )}

          {/* When Open: The Paper slides out of the envelope */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="envelope-opened-paper"
                key="envelope-opened"
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="p-5 sm:p-7 bg-letter-ruled rounded-b-xl"
              >
                {/* Security Passcode Paper Header */}
                <div className="bg-white/95 rounded-xl p-4 sm:p-5 border border-amber-200/90 shadow-md mb-5">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Lock className="w-5 h-5" />
                      <h2 className="font-bold text-base sm:text-lg text-slate-800 tracking-tight">
                        Flight Clearance Passcode
                      </h2>
                    </div>
                    <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      LEVEL: FGFS-A380
                    </span>
                  </div>

                  {/* Required Password instruction banner */}
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-center mb-4">
                    <p className="text-xs sm:text-sm font-semibold text-slate-700">
                      Please enter the flight password below:
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-1.5">
                      <span className="inline-block text-2xl sm:text-3xl px-3 py-1 bg-white rounded-md shadow-inner border border-sky-300 font-bold tracking-widest text-sky-950 select-all">
                        ✈️3️⃣8️⃣0️⃣
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-600 mt-1">
                      (Aircraft flight code: Airbus A380 Superjumbo)
                    </p>
                  </div>

                  {/* Input & Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <input
                        ref={inputRef}
                        id="password-input"
                        type="text"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrorMsg('');
                        }}
                        placeholder="Type or tap: ✈️3️⃣8️⃣0️⃣"
                        className={`w-full text-center text-xl sm:text-2xl font-bold tracking-wider py-3 px-4 rounded-xl border-2 bg-white transition-all shadow-inner focus:outline-none ${
                          errorMsg
                            ? 'border-red-400 ring-2 ring-red-200'
                            : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        }`}
                        autoComplete="off"
                      />

                      {password && (
                        <button
                          type="button"
                          onClick={handleClear}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md px-2 py-1"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Error Feedback */}
                    <AnimatePresence>
                      {errorMsg && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errorMsg}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Quick-Tap Aviation Keypad for mobile or instant tap */}
                    <div className="pt-2">
                      <div className="text-[11px] font-medium text-slate-500 mb-2 flex items-center justify-between">
                        <span>Quick-Tap Passcode Keypad:</span>
                        <button
                          type="button"
                          onClick={handleFillCorrect}
                          className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          Auto-fill ✈️3️⃣8️⃣0️⃣
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { val: '✈️', label: 'Plane' },
                          { val: '3️⃣', label: 'Three' },
                          { val: '8️⃣', label: 'Eight' },
                          { val: '0️⃣', label: 'Zero' },
                        ].map((btn) => (
                          <button
                            key={btn.val}
                            type="button"
                            onClick={() => handleAppendSymbol(btn.val)}
                            className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 active:scale-95 shadow-sm transition-all"
                          >
                            <span className="text-xl sm:text-2xl">{btn.val}</span>
                            <span className="text-[9px] text-slate-400 font-mono-code mt-0.5">{btn.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Extra Helper keys */}
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <button
                          type="button"
                          onClick={handleBackspace}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                        >
                          <span>⌫ Backspace</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleClear}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleFillCorrect}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
                        >
                          <span>Paste ✈️3️⃣8️⃣0️⃣</span>
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      id="submit-passcode-btn"
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={isShaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Verify Password & Launch Plane</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Airmail Border at bottom */}
          <div
            className="h-3 w-full rounded-b-xl"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, #ef4444 0px, #ef4444 14px, #ffffff 14px, #ffffff 20px, #2563eb 20px, #2563eb 34px, #ffffff 34px, #ffffff 40px)',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
