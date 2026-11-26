import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function HermesPage({ isDark, setCurrentPage }) {
  const headingText = isDark ? 'text-white' : 'text-black';
  const bodyText = isDark ? 'text-[#a3a3a3]' : 'text-[#525252]';
  const mutedText = 'text-[#737373]';

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => setCurrentPage('projects')}
          className={`inline-flex items-center gap-1.5 text-xs font-mono mb-6 cursor-pointer hover:underline underline-offset-4 transition-colors ${
            isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#525252] hover:text-black'
          }`}
        >
          <ArrowLeft size={14} /> Back to Projects
        </button>
        <h1 className={`text-2xl sm:text-3xl font-semibold tracking-tight ${headingText}`}>
          HERMES
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${mutedText}`}>
          Applied AI · Desktop Automation Engine
        </p>
      </div>

      <CaseStudyMetaBar
        role="Systems & AI Builder"
        domain="Asyncio & Voice AI"
        status="Active Prototype"
        github="https://github.com/VigneshSSuvarna/HERMES.git"
        demo="#"
        isDark={isDark}
      />

      <div className={`max-w-3xl space-y-8 pt-2 text-sm sm:text-base leading-relaxed ${bodyText}`}>
        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            1. Abstract
          </h3>
          <p>
            HERMES is an intelligent, voice-activated personal AI companion engineered for localized desktop automation. Built heavily around asynchronous programming paradigms, it listens for verbal commands, processes natural language, and executes system-level tasks efficiently without freezing the main application thread.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            2. Core Technical Implementations
          </h3>
          <p className="mb-3">The engine leverages specialized libraries and concurrency patterns to achieve a seamless user experience:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${headingText}`}>Asynchronous Event Loop:</span> Utilizes a non-blocking architecture to ensure that the engine can continuously listen for new inputs while simultaneously executing ongoing system commands or fetching data.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Speech-to-Action Pipeline:</span> Integrates offline speech recognition models to transcribe audio commands instantly, routing them through an intent parser to trigger specific desktop automations.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>System Automation Integration:</span> Interfaces directly with the underlying operating system to manage files, launch applications, fetch information, and perform routine workflows hands-free.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            Conclusion
          </h3>
          <p>
            HERMES demonstrates the power of combining AI with low-level system integration, offering a responsive, privacy-focused, and highly extensible virtual assistant tailored specifically for developer and desktop environments.
          </p>
        </div>
      </div>
    </div>
  );
}
