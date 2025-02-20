import React from 'react';
import Background from './components/Background';
import Countdown from './components/Countdown';

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      <Background />
      
      <div className="w-full max-w-4xl mx-auto px-4 text-center z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Road Quality Measurement using Satellite Images
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 text-white/80">
          Project Launch Countdown
        </p>
        
        <div className="flex justify-center">
          <Countdown />
        </div>
        
        <div className="mt-12 text-lg text-white/60">
          Coming February 28th, 2025
        </div>
      </div>
    </div>
  );
}

export default App