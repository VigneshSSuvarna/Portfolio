import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function AiChatboxPage({ isDark, setCurrentPage }) {
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
          AI-PDF-CHATBOX
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${mutedText}`}>
          Applied AI · Document Retrieval System
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

      <div className={`max-w-3xl space-y-8 pt-2 text-sm sm:text-base leading-relaxed ${bodyText}`}>
        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            1. Abstract
          </h3>
          <p>
            AI-PDF-CHATBOX is a high-performance Retrieval-Augmented Generation (RAG) system engineered to allow users to securely interact with their private local documents. By grounding the AI's knowledge exclusively in the provided text, the application effectively eliminates the risk of Large Language Model (LLM) hallucinations, ensuring all responses are factually accurate and strictly bound to the source material.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            2. Core System Architecture
          </h3>
          <p className="mb-3">To ensure high accuracy and rapid context retrieval, the system operates on a structured pipeline:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${headingText}`}>Document Ingestion & Processing:</span> Extracts text securely from local PDFs and divides it into optimized semantic chunks for efficient vectorization.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Contextual Retrieval Engine:</span> Utilizes advanced embedding models to map user queries against the document space, retrieving only the most relevant text passages.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Grounded Generation:</span> Feeds the retrieved context into the LLM alongside strict prompt boundaries, forcing the model to synthesize answers solely from the retrieved data.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
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
