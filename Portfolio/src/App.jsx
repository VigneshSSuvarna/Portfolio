import React, { useState, useEffect } from 'react';
import { Sun, Moon, Terminal, Mail } from 'lucide-react';
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
    <div className={`min-h-screen font-sans antialiased flex flex-col ${isDark ? 'bg-[#141413] text-[#e5e5e5] selection:bg-white selection:text-black' : 'bg-[#ffffff] text-[#171717] selection:bg-black selection:text-white'}`}>
      <header className="w-full max-w-3xl mx-auto px-6 pt-10 pb-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage('home')}
          className={`font-sans text-sm font-medium cursor-pointer ${isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#525252] hover:text-black'}`}
        >
          {personalInfo.fullName}
        </button>

        <nav className="flex items-center gap-6 text-sm font-sans">
          <button
            onClick={() => setCurrentPage('home')}
            className={`cursor-pointer ${currentPage === 'home' ? (isDark ? 'text-white underline underline-offset-4' : 'text-black underline underline-offset-4') : 'text-[#737373] hover:text-current'}`}
          >
            About
          </button>
          <button
            onClick={() => setCurrentPage('projects')}
            className={`cursor-pointer ${currentPage === 'projects' ? (isDark ? 'text-white underline underline-offset-4' : 'text-black underline underline-offset-4') : 'text-[#737373] hover:text-current'}`}
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => setIsTerminalOpen(true)}
            className="inline-flex items-center gap-1.5 cursor-pointer text-[#737373] hover:text-current"
            title="Open console (Ctrl/Cmd + K)"
          >
            <Terminal size={14} />
            <span>Console</span>
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
            className="cursor-pointer text-[#737373] hover:text-current p-1"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </nav>
      </header>

      <main className="w-full max-w-3xl mx-auto px-6 py-10 flex-1">
        {currentPage === 'home' && <HomePage isDark={isDark} setCurrentPage={setCurrentPage} setPreviousPage={setPreviousPage} setShowResumeModal={setShowResumeModal} />}
        {currentPage === 'projects' && <ProjectsPage isDark={isDark} setCurrentPage={setCurrentPage} setPreviousPage={setPreviousPage} />}
        {currentPage === 'sama-foundation' && <SamaFoundationPage isDark={isDark} previousPage={previousPage} setCurrentPage={setCurrentPage} />}
        {currentPage === 'cit-hearingaid' && <HearingAidPage isDark={isDark} previousPage={previousPage} setCurrentPage={setCurrentPage} />}
        {currentPage === 'project-ai-chatbox' && <AiChatboxPage isDark={isDark} setCurrentPage={setCurrentPage} />}
        {currentPage === 'project-hiresphere' && <HireSpherePage isDark={isDark} setCurrentPage={setCurrentPage} />}
        {currentPage === 'project-hermes' && <HermesPage isDark={isDark} setCurrentPage={setCurrentPage} />}
        {currentPage === 'project-kalki' && <KalkiPage isDark={isDark} setCurrentPage={setCurrentPage} />}
      </main>

      <footer className={`w-full max-w-3xl mx-auto px-6 py-8 border-t flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-[#737373] ${isDark ? 'border-neutral-800/80' : 'border-neutral-200'}`}>
        <div className="flex items-center gap-x-2.5 whitespace-nowrap">
          <span>© {new Date().getFullYear()} {personalInfo.name}</span>
          <span>·</span>
          <span>{visitorCount} visitors</span>
        </div>
        <div className="flex items-center gap-4 whitespace-nowrap shrink-0">
          <a href={`https://github.com/${personalInfo.githubHandle}`} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
          <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </a>
          <a href={`https://codeforces.com/profile/${personalInfo.codeforcesHandle}`} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="1.5" y="9" width="4.5" height="12" rx="1" />
              <rect x="9.75" y="3" width="4.5" height="18" rx="1" />
              <rect x="18" y="12" width="4.5" height="9" rx="1" />
            </svg>
            <span>Codeforces</span>
          </a>
          <a href={`mailto:${personalInfo.email}`} className={`inline-flex items-center gap-1.5 ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
            <Mail size={13} />
            <span>Email</span>
          </a>
        </div>
      </footer>

      <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} setCurrentPage={setCurrentPage} setShowResumeModal={setShowResumeModal} isDark={isDark} />
      <ResumeModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} isDark={isDark} />
    </div>
  );
}
