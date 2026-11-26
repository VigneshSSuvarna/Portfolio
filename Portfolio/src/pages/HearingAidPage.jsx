import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function HearingAidPage({ isDark, previousPage, setCurrentPage }) {
  const headingText = isDark ? 'text-white' : 'text-black';
  const bodyText = isDark ? 'text-[#a3a3a3]' : 'text-[#525252]';
  const mutedText = 'text-[#737373]';

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => setCurrentPage(previousPage)}
          className={`inline-flex items-center gap-1.5 text-xs font-mono mb-6 cursor-pointer hover:underline underline-offset-4 transition-colors ${
            isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#525252] hover:text-black'
          }`}
        >
          <ArrowLeft size={14} /> Back to {previousPage === 'home' ? 'About' : 'Projects'}
        </button>
        <h1 className={`text-2xl sm:text-3xl font-semibold tracking-tight ${headingText}`}>
          HearingAid Pro
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${mutedText}`}>
          Dr. S. R. Chandrasekhar Institute of Speech and Hearing · Project Team Lead
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

      <div className={`max-w-3xl space-y-8 pt-2 text-sm sm:text-base leading-relaxed ${bodyText}`}>
        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            1. Abstract
          </h3>
          <p>
            Hearing Aid Pro is a native Android application designed to transform mobile devices into real-time, customizable acoustic assistance tools. By implementing a custom digital signal processing (DSP) architecture, the system delivers high-fidelity sound amplification and personal sound profiling without relying on dedicated hardware.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            2. The Real-Time Audio Challenge
          </h3>
          <p>
            Processing live audio introduces strict performance constraints regarding latency and feedback control. To ensure a seamless user experience, the system utilizes low-level native audio buffers and optimized processing threads, minimizing delay between environmental input and headphone output.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            3. Core DSP & Signal Pipeline
          </h3>
          <p className="mb-3">The application relies on an advanced software-driven signal chain to shape and clean audio streams:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${headingText}`}>Spectral Noise Suppression:</span> Implements frequency-domain filtering to dynamically reduce background ambient noise and adapt to room acoustics.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Parametric Equalization:</span> Features configurable biquad filter bands for precise frequency shaping, paired with automated headroom scaling to prevent audio clipping.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Live Visualizations:</span> Drives real-time time-domain waveforms and frequency spectrum analyzers via custom canvas rendering and optimized FFT processing.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
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
