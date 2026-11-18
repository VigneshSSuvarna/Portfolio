import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function AiChatboxPage({ isDark, setCurrentPage }) {
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
          AI-PDF-CHATBOX
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${isDark ? 'text-[#39d353]' : 'text-emerald-700'}`}>
          Applied AI • Document Retrieval System
        </p>
      </div>

      <CaseStudyMetaBar
        role="Lead Developer"
        domain="Applied AI & RAG"
        status="Production Live"
        github="https://github.com/VigneshSSuvarna/AI-PDF-CHATBOX.git"
        demo="https://ai-pdf-chatboxgit-bbhsv8xdll7e3vz498pf6n.streamlit.app/"
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
            AI-PDF-CHATBOX is a high-performance Retrieval-Augmented Generation (RAG) system engineered to allow users to securely interact with their private local documents. By grounding the AI's knowledge exclusively in the provided text, the application effectively eliminates the risk of Large Language Model (LLM) hallucinations, ensuring all responses are factually accurate and strictly bound to the source material.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            2. Core System Architecture
          </h3>
          <p className="mb-3">To ensure high accuracy and rapid context retrieval, the system operates on a structured pipeline:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Document Ingestion & Processing:</span> Extracts text securely from local PDFs and divides it into optimized semantic chunks for efficient vectorization.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Contextual Retrieval Engine:</span> Utilizes advanced embedding models to map user queries against the document space, retrieving only the most relevant text passages.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Grounded Generation:</span> Feeds the retrieved context into the LLM alongside strict prompt boundaries, forcing the model to synthesize answers solely from the retrieved data.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Conclusion
          </h3>
          <p>
            This project transforms static PDF files into intelligent, interactive knowledge bases, providing a reliable and secure tool for document analysis, research, and data extraction.
          </p>
        </div>
      </div>
    </div>
  );
}