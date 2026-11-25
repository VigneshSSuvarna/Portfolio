import React, { useState, useEffect } from 'react';
import { Sun, Moon, Terminal, Command } from 'lucide-react';
import { VALID_PAGES, PAGE_TITLES, personalInfo } from './data/portfolioData';

// Pages
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import SamaFoundationPage from './pages/SamaFoundationPage';
import HearingAidPage from './pages/HearingAidPage';
import AiChatboxPage from './pages/AiChatboxPage';
import HireSpherePage from './pages/HireSpherePage';
import HermesPage from './pages/HermesPage';
import KalkiPage from './pages/KalkiPage';

// Components & Modals
import { TerminalModal } from './components/TerminalModal';
import { ResumeModal } from './components/ResumeModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return VALID_PAGES.includes(hash) ? hash : 'home';
  });
  const [previousPage, setPreviousPage] = useState('home');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [visitorCount, setVisitorCount] = useState(personalInfo.initialVisitorCount);

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('portfolio_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('portfolio_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const targetHash = currentPage === 'home' ? '' : `#${currentPage}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash || window.location.pathname);
    }
    document.title = PAGE_TITLES[currentPage] || personalInfo.name;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPage(VALID_PAGES.includes(hash) ? hash : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      const hasVisitedSession = sessionStorage.getItem('portfolio_session_counted');
      let currentViews = parseInt(localStorage.getItem('portfolio_total_visits') || String(personalInfo.initialVisitorCount - 1), 10);

      if (!hasVisitedSession) {
        currentViews += 1;
        sessionStorage.setItem('portfolio_session_counted', 'true');
        localStorage.setItem('portfolio_total_visits', currentViews.toString());
      }
      setVisitorCount(currentViews);
    } catch {
      setVisitorCount(personalInfo.initialVisitorCount);
    }
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        if (isTerminalOpen) setIsTerminalOpen(false);
        if (showResumeModal) setShowResumeModal(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isTerminalOpen, showResumeModal]);

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col transition-colors duration-200 ${isDark ? 'bg-[#111111] text-[#e5e5e5] selection:bg-neutral-700 selection:text-white' : 'bg-[#fafafa] text-[#171717] selection:bg-neutral-200 selection:text-black'}`}>
      <header className={`w-full px-6 sm:px-12 pt-8 sm:pt-10 pb-6 border-b flex justify-between items-center ${isDark ? 'border-neutral-800/80' : 'border-neutral-200'}`}>
        <button onClick={() => setCurrentPage('home')} className={`font-mono text-base sm:text-lg font-semibold tracking-tight cursor-pointer transition-colors ${isDark ? 'text-white hover:text-neutral-300' : 'text-neutral-900 hover:text-neutral-600'}`}>
          {personalInfo.fullName}
        </button>

        <nav className="flex items-center gap-6 sm:gap-8 text-sm sm:text-base font-mono">
          <button onClick={() => setCurrentPage('home')} className={`cursor-pointer transition-colors ${currentPage === 'home' ? (isDark ? 'text-white underline underline-offset-4 decoration-neutral-400' : 'text-neutral-900 underline underline-offset-4 decoration-neutral-500') : (isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-500 hover:text-neutral-900')}`}>about</button>
          <button onClick={() => setCurrentPage('projects')} className={`cursor-pointer transition-colors ${currentPage === 'projects' ? (isDark ? 'text-white underline underline-offset-4 decoration-neutral-400' : 'text-neutral-900 underline underline-offset-4 decoration-neutral-500') : (isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-500 hover:text-neutral-900')}`}>projects</button>
          <button onClick={() => setIsDark(!isDark)} aria-label="Toggle theme" className={`p-2 rounded border cursor-pointer transition-colors ${isDark ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700' : 'border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'}`}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>
      </header>

      <main className="w-full px-6 sm:px-12 py-10 sm:py-16 flex-1 max-w-7xl mx-auto">
        {currentPage === 'home' && <HomePage isDark={isDark} setCurrentPage={setCurrentPage} setPreviousPage={setPreviousPage} setShowResumeModal={setShowResumeModal} />}
        {currentPage === 'projects' && <ProjectsPage isDark={isDark} setCurrentPage={setCurrentPage} setPreviousPage={setPreviousPage} />}
        {currentPage === 'sama-foundation' && <SamaFoundationPage isDark={isDark} previousPage={previousPage} setCurrentPage={setCurrentPage} />}
        {currentPage === 'cit-hearingaid' && <HearingAidPage isDark={isDark} previousPage={previousPage} setCurrentPage={setCurrentPage} />}
        {currentPage === 'project-ai-chatbox' && <AiChatboxPage isDark={isDark} setCurrentPage={setCurrentPage} />}
        {currentPage === 'project-hiresphere' && <HireSpherePage isDark={isDark} setCurrentPage={setCurrentPage} />}
        {currentPage === 'project-hermes' && <HermesPage isDark={isDark} setCurrentPage={setCurrentPage} />}
        {currentPage === 'project-kalki' && <KalkiPage isDark={isDark} setCurrentPage={setCurrentPage} />}
      </main>

      <footer className={`w-full px-6 sm:px-12 py-6 sm:py-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm max-w-7xl mx-auto ${isDark ? 'border-neutral-800/80 text-[#8a8a8a]' : 'border-neutral-200 text-neutral-500'}`}>
        <div className="text-center sm:text-left flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <span>© {new Date().getFullYear()} {personalInfo.name}. Built with React & Vite.</span>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs border ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-700'}`}>
            <span className="font-semibold text-[#39d353]">{visitorCount}</span>
            <span>visitors</span>
          </div>
        </div>
      </footer>

      <button type="button" onClick={() => setIsTerminalOpen(true)} className={`fixed bottom-6 right-6 flex items-center gap-2 font-mono text-xs z-40 px-3 py-2 rounded-lg border shadow-lg cursor-pointer transition-all ${isDark ? 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:border-[#39d353] hover:text-white' : 'bg-white/90 border-neutral-300 text-neutral-700 hover:border-emerald-600 hover:text-black'}`}>
        <Terminal size={13} className={isDark ? 'text-[#39d353]' : 'text-emerald-600'} />
        <span>console</span>
        <kbd className={`hidden sm:inline-flex px-1.5 py-0.5 rounded border items-center gap-0.5 text-[10px] ${isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-400' : 'bg-neutral-100 border-neutral-300 text-neutral-500'}`}><Command size={9} /> K</kbd>
      </button>

      <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} setCurrentPage={setCurrentPage} setShowResumeModal={setShowResumeModal} isDark={isDark} />
      <ResumeModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} isDark={isDark} />
    </div>
  );
}