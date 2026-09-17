/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import SkyBackground from './components/SkyBackground';
import EnvelopeView from './components/EnvelopeView';
import PlaneTransition from './components/PlaneTransition';
import MessageView from './components/MessageView';

type FlowStep = 'envelope' | 'transition' | 'letter';

export default function App() {
  const [step, setStep] = useState<FlowStep>('envelope');

  const handlePasswordSuccess = () => {
    setStep('transition');
  };

  const handleTransitionComplete = () => {
    setStep('letter');
  };

  const handleReset = () => {
    setStep('envelope');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center justify-center p-3 sm:p-6 font-sans">
      {/* Sky atmosphere with animated clouds and audio controller */}
      <SkyBackground />

      {/* Main interactive stage */}
      <main className="relative z-10 w-full flex items-center justify-center my-auto">
        <AnimatePresence mode="wait">
          {step === 'envelope' && (
            <motion.div
              key="step-envelope"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              className="w-full"
            >
              <EnvelopeView onPasswordSuccess={handlePasswordSuccess} />
            </motion.div>
          )}

          {step === 'letter' && (
            <motion.div
              key="step-letter"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full"
            >
              <MessageView onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Plane Flyover Transition Overlay */}
      {step === 'transition' && (
        <PlaneTransition onComplete={handleTransitionComplete} />
      )}

      {/* Footer subtle brand */}
      <footer className="relative z-10 py-3 text-center text-xs text-sky-800/60 font-medium">
        <span>FlightGear Flight Simulator (FGFS) • Special Flight Authorization</span>
      </footer>
    </div>
  );
}
