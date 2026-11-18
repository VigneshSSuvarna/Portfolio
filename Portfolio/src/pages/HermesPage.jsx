import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function HermesPage({ isDark, setCurrentPage }) {
  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => setCurrentPage('projects')}
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono mb-6 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
            isDark
              ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
              : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:text-black hover:bg-neutral-200'
          }`}
        >
          <ArrowLeft size={16} /> Back to Projects
        </button>
        <h1 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          HERMES
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${isDark ? 'text-[#39d353]' : 'text-emerald-700'}`}>
          Applied AI • Desktop Automation Engine
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

      <div className={`space-y-6 text-sm sm:text-base leading-relaxed p-6 sm:p-10 rounded-2xl border ${
        isDark ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
      }`}>
        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            1. Abstract
          </h3>
          <p>
            HERMES is an intelligent, voice-activated personal AI companion engineered for localized desktop automation. Built heavily around asynchronous programming paradigms, it listens for verbal commands, processes natural language, and executes system-level tasks efficiently without freezing the main application thread.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            2. Core Technical Implementations
          </h3>
          <p className="mb-3">The engine leverages specialized libraries and concurrency patterns to achieve a seamless user experience:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Asynchronous Event Loop:</span> Utilizes a non-blocking architecture to ensure that the engine can continuously listen for new inputs while simultaneously executing ongoing system commands or fetching data.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Speech-to-Action Pipeline:</span> Integrates offline speech recognition models to transcribe audio commands instantly, routing them through an intent parser to trigger specific desktop automations.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>System Automation Integration:</span> Interfaces directly with the underlying operating system to manage files, launch applications, fetch information, and perform routine workflows hands-free.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
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