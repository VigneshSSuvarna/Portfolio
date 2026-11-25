import React from 'react';
import { X, Download } from 'lucide-react';

export const ResumeModal = ({ isOpen, onClose, isDark }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl h-[85vh] rounded-xl border shadow-2xl flex flex-col overflow-hidden ${
          isDark ? 'bg-[#141414] border-neutral-800' : 'bg-white border-neutral-300'
        }`}
      >
        <div className={`px-4 py-3 border-b flex justify-between items-center ${
          isDark ? 'border-neutral-800 bg-[#161b22]' : 'border-neutral-200 bg-neutral-50'
        }`}>
          <span className={`font-mono text-xs sm:text-sm font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            resume.pdf — Vignesh Suvarna
          </span>
          <div className="flex items-center gap-3">
            <a
              href="/resume.pdf"
              download
              className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded border transition-colors ${
  isDark
    ? 'border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white'
    : 'border-neutral-300 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 hover:text-black'
}`}
            >
              <Download size={13} /> Download PDF
            </a>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white cursor-pointer p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <iframe
          src="/resume.pdf"
          title="Vignesh Suvarna Resume"
          className="w-full flex-1 bg-neutral-900"
        />
      </div>
    </div>
  );
};