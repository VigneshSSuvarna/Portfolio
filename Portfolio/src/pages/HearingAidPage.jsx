import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function HearingAidPage({ isDark, previousPage, setCurrentPage }) {
  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => setCurrentPage(previousPage)}
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono mb-6 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
            isDark
              ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
              : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:text-black hover:bg-neutral-200'
          }`}
        >
          <ArrowLeft size={16} /> Back to {previousPage === 'home' ? 'About' : 'Projects'}
        </button>
        <h1 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          HearingAid Pro
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${isDark ? 'text-[#39d353]' : 'text-emerald-700'}`}>
          Dr. S. R. Chandrasekhar Institute of Speech and Hearing • Project Team Lead
        </p>
      </div>

      <CaseStudyMetaBar
        role="Project Team Lead"
        domain="Android & Real-Time DSP"
        status="Active Development"
        github="https://github.com/VigneshSSuvarna/HearingAid.git"
        demo="#"
        isDark={isDark}
      />

      <div className={`space-y-6 text-sm sm:text-base leading-relaxed p-6 sm:p-10 rounded-2xl border ${
        isDark ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
      }`}>
        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            1. Abstract
          </h3>
          <p>
            Hearing Aid Pro is a native Android application designed to transform mobile devices into real-time, customizable acoustic assistance tools. By implementing a custom digital signal processing (DSP) architecture, the system delivers high-fidelity sound amplification and personal sound profiling without relying on dedicated hardware.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            2. The Real-Time Audio Challenge
          </h3>
          <p>
            Processing live audio introduces strict performance constraints regarding latency and feedback control. To ensure a seamless user experience, the system utilizes low-level native audio buffers and optimized processing threads, minimizing delay between environmental input and headphone output.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            3. Core DSP & Signal Pipeline
          </h3>
          <p className="mb-3">The application relies on an advanced software-driven signal chain to shape and clean audio streams:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Spectral Noise Suppression:</span> Implements frequency-domain filtering to dynamically reduce background ambient noise and adapt to room acoustics.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Parametric Equalization:</span> Features configurable biquad filter bands for precise frequency shaping, paired with automated headroom scaling to prevent audio clipping.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Live Visualizations:</span> Drives real-time time-domain waveforms and frequency spectrum analyzers via custom canvas rendering and optimized FFT processing.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Conclusion
          </h3>
          <p>
            This project demonstrates how commodity mobile hardware can be leveraged to build sophisticated, low-latency audio accessibility tools entirely through software optimization.
          </p>
        </div>
      </div>
    </div>
  );
}