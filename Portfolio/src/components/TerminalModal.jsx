import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export const TerminalModal = ({ isOpen, onClose, setCurrentPage, setShowResumeModal, isDark }) => {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', text: 'Welcome to VSSh v1.0.0.' },
    { type: 'output', text: 'Type "help" to see available commands.' }
  ]);
  const terminalInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, isOpen]);

  if (!isOpen) return null;

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...terminalHistory, { type: 'input', text: `vignesh@portfolio:~$ ${cmd}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: 'Available commands:\n  about       - Go to About page\n  projects    - View all projects\n  skills      - List technical skills\n  contact     - Copy & show contact info\n  resume      - Open interactive resume preview\n  curl resume - Download resume PDF\n  clear       - Clear terminal'
        });
        break;
      case 'about':
        newHistory.push({ type: 'output', text: 'Navigating to about...' });
        setCurrentPage('home');
        setTimeout(() => onClose(), 500);
        break;
      case 'projects':
        newHistory.push({ type: 'output', text: 'Loading projects...' });
        setCurrentPage('projects');
        setTimeout(() => onClose(), 500);
        break;
      case 'skills':
        newHistory.push({
          type: 'output',
          text: 'Languages: Python, JS/TS, C++, C, Java, Kotlin, SQL\nFrontend:  React, Vite, Tailwind CSS\nBackend:   Node.js, Express, Python asyncio\nAI & Data: RAG, LangChain, LLMs, PyPDF'
        });
        break;
      case 'contact':
        navigator.clipboard?.writeText(personalInfo.email).catch(() => {});
        newHistory.push({
          type: 'output',
          text: `Email: ${personalInfo.email} (copied to clipboard!)\nGitHub: github.com/${personalInfo.githubHandle}\nCodeforces: codeforces.com/profile/${personalInfo.codeforcesHandle}`
        });
        break;
      case 'resume':
        newHistory.push({ type: 'output', text: 'Opening resume preview...' });
        onClose();
        setShowResumeModal(true);
        break;
      case 'curl resume':
        newHistory.push({ type: 'output', text: 'Initiating download request...' });
        window.open(personalInfo.resumePath, '_blank');
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      default:
        newHistory.push({ type: 'output', text: `bash: ${cmd}: command not found. Type "help" for available commands.` });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-2xl rounded-lg border shadow-2xl overflow-hidden flex flex-col ${isDark ? 'bg-[#0d1117] border-neutral-700' : 'bg-[#1e1e1e] border-neutral-600'}`}>
        <div className="bg-[#161b22] px-4 py-2 border-b border-neutral-700 flex justify-between items-center select-none">
          <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono">
            <Terminal size={14} />
            <span>vignesh@portfolio:~</span>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors cursor-pointer">
            <X size={14} />
          </button>
        </div>

        <div className="p-4 h-80 overflow-y-auto font-mono text-sm text-neutral-300 flex flex-col gap-1.5" onClick={() => terminalInputRef.current?.focus()}>
          {terminalHistory.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap break-words">
              {line.type === 'input' ? <span className="text-[#39d353]">{line.text}</span> : <span className="text-neutral-400">{line.text}</span>}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <form onSubmit={handleTerminalSubmit} className="flex items-center px-4 py-3 bg-[#0d1117] border-t border-neutral-800">
          <span className="text-[#39d353] font-mono text-sm mr-2">{'>'}</span>
          <input 
            ref={terminalInputRef}
            type="text" 
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="Type a command (e.g., help, projects, resume)..."
            className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder-neutral-600"
            spellCheck="false"
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};