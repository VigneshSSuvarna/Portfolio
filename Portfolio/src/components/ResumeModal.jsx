import React from 'react';
import { X, Download } from 'lucide-react';

export const ResumeModal = ({ isOpen, onClose, isDark }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl h-[85vh] rounded-sm border flex flex-col overflow-hidden ${
          isDark ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-200'
        }`}
      >
        <div className={`px-4 py-3 border-b flex justify-between items-center ${
          isDark ? 'border-neutral-800 bg-[#171717]' : 'border-neutral-200 bg-[#fafafa]'
        }`}>
          <span className={`font-mono text-xs sm:text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
            resume.pdf — Vignesh Suvarna
          </span>
          <div className="flex items-center gap-3">
            <a
              href="/resume.pdf"
              download
              className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-sm border transition-colors ${
                isDark
                  ? 'border-neutral-700 bg-[#111111] text-[#e5e5e5] hover:border-neutral-500 hover:text-white'
                  : 'border-neutral-300 bg-white text-[#171717] hover:border-neutral-500 hover:text-black'
              }`}
            >
              <Download size={13} /> Download PDF
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume preview"
              className={`cursor-pointer p-1 transition-colors ${
                isDark ? 'text-[#737373] hover:text-white' : 'text-[#737373] hover:text-black'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <iframe
          src="/resume.pdf"
          title="Vignesh Suvarna Resume"
          className={`w-full flex-1 ${isDark ? 'bg-[#111111]' : 'bg-[#fafafa]'}`}
        />
      </div>
    </div>
  );
};
