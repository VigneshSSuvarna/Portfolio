import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, Sun, Moon, Download } from 'lucide-react';

const projectsData = [
  {
    id: 1,
    title: "Nayi Disha Platform",
    description: "Full-stack web application with user authentication and database integration.",
    techStack: ["Node.js", "Express", "PostgreSQL", "React"],
    github: "https://github.com/Nayi-Disha-Org/Nayi-Disha.git",
    demo: "https://nayi-disha.vercel.app"
  },
  {
    id: 2,
    title: "AI-PDF-CHATBOX",
    description: "High-performance RAG system designed to eliminate LLM hallucinations by grounding responses in private local documents.",
    techStack: ["Python", "LangChain", "PyPDF"],
    github: "https://github.com/VigneshSSuvarna/AI-PDF-CHATBOX.git",
    demo: "#"
  },
  {
    id: 3,
    title: "HireSphere & PlaceOS",
    description: "Full-stack platforms modernizing university placements, providing a unified workspace for students and administrators.",
    techStack: ["TypeScript", "React", "Express"],
    github: "https://github.com/VigneshSSuvarna/HireSphere.git",
    demo: "#"
  },
  {
    id: 4,
    title: "HERMES",
    description: "An asynchronous, voice-activated personal AI companion and desktop automation engine.",
    techStack: ["Python", "asyncio"],
    github: "https://github.com/VigneshSSuvarna/HERMES.git",
    demo: "#"
  },
  {
    id: 5,
    title: "HearingAid",
    description: "A Kotlin-based Android assistive audio application designed to amplify real-time sound and improve hearing accessibility.",
    techStack: ["Kotlin", "Android"],
    github: "https://github.com/VigneshSSuvarna/HearingAid.git",
    demo: "#"
  }
];

const skillsData = [
  {
    category: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "C++", "C", "Java", "Kotlin", "SQL"]
  },
  {
    category: "Frontend",
    items: ["React.js", "Vite", "Tailwind CSS", "HTML5", "CSS3", "Streamlit"]
  },
  {
    category: "Backend & APIs",
    items: ["Node.js", "Express.js", "REST APIs", "Python asyncio", "JDBC"]
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL", "phpMyAdmin"]
  },
  {
    category: "AI & Data",
    items: ["RAG Architecture", "LangChain", "LLMs", "PyPDF", "Pandas"]
  },
  {
    category: "Cloud & Tools",
    items: ["Git", "GitHub", "Vercel", "Render", "Postman", "VS Code", "Android"]
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeHeatmap, setActiveHeatmap] = useState('github');
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  // Dark & Light Mode State (Defaults to Dark)
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('portfolio_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('portfolio_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Codeforces API Dynamic States
  const [cfSubmissions, setCfSubmissions] = useState({});
  const [cfStats, setCfStats] = useState({ solved: 5, rating: 581 });
  const [loadingCf, setLoadingCf] = useState(true);

  useEffect(() => {
    const handle = "VigneshSSuvarna";

    async function fetchCodeforcesData() {
      try {
        const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
        const userData = await userRes.json();
        if (userData.status === 'OK' && userData.result.length > 0) {
          setCfStats(prev => ({ ...prev, rating: userData.result[0].rating || prev.rating }));
        }

        const subRes = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=2000`);
        const subData = await subRes.json();

        if (subData.status === 'OK') {
          const counts = {};
          let solvedCount = 0;
          const solvedProblems = new Set();

          subData.result.forEach(sub => {
            if (sub.verdict === 'OK') {
              const subDate = new Date(sub.creationTimeSeconds * 1000);
              const year = subDate.getFullYear();
              const month = String(subDate.getMonth() + 1).padStart(2, '0');
              const day = String(subDate.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;

              counts[dateStr] = (counts[dateStr] || 0) + 1;

              const probKey = `${sub.problem.contestId}-${sub.problem.index}`;
              if (!solvedProblems.has(probKey)) {
                solvedProblems.add(probKey);
                solvedCount++;
              }
            }
          });

          setCfSubmissions(counts);
          setCfStats(prev => ({ ...prev, solved: solvedCount > 0 ? solvedCount : prev.solved }));
        }
      } catch (error) {
        console.error("Error fetching Codeforces data:", error);
      } finally {
        setLoadingCf(false);
      }
    }

    fetchCodeforcesData();
  }, []);

  const getDynamicMonths = (totalWeeks) => {
    const months = [];
    const today = new Date();
    for (let i = totalWeeks - 1; i >= 0; i -= 4) {
      const d = new Date(today);
      d.setDate(d.getDate() - (i * 7));
      months.push(d.toLocaleString('default', { month: 'short' }));
    }
    return months;
  };

  const renderBoundedCalendar = (totalWeeks = 52) => {
    const weeks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let w = totalWeeks - 1; w >= 0; w--) {
      const daysInWeek = [];
      for (let d = 0; d < 7; d++) {
        const dateObj = new Date(today);
        dateObj.setDate(dateObj.getDate() - (w * 7 + (6 - d)));
        dateObj.setHours(0, 0, 0, 0);

        if (dateObj > today) {
          break;
        }

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const count = cfSubmissions[dateStr] || 0;

        let colorClass = isDark ? "bg-[#161b22]" : "bg-[#ebedf0]";
        if (count > 0) colorClass = isDark ? "bg-[#0e4429]" : "bg-[#9be9a8]";
        if (count > 1) colorClass = isDark ? "bg-[#006d32]" : "bg-[#40c463]";
        if (count >= 3) colorClass = isDark ? "bg-[#26a641]" : "bg-[#30a14e]";
        if (count >= 5) colorClass = isDark ? "bg-[#39d353]" : "bg-[#216e39]";

        daysInWeek.push(
          <div
            key={dateStr}
            title={`${count} submissions on ${dateStr}`}
            className={`w-[10px] h-[10px] rounded-[1px] ${colorClass}`}
          />
        );
      }

      if (daysInWeek.length > 0) {
        weeks.push(
          <div key={w} className="flex flex-col gap-[2px]">
            {daysInWeek}
          </div>
        );
      }
    }
    return weeks;
  };

  const annualMonths = getDynamicMonths(52);

  return (
    <div
      className={`min-h-screen font-sans antialiased flex flex-col transition-colors duration-200 ${
        isDark
          ? 'bg-[#111111] text-[#e5e5e5] selection:bg-neutral-700 selection:text-white'
          : 'bg-[#fafafa] text-[#171717] selection:bg-neutral-200 selection:text-black'
      }`}
    >
      {/* Top Header */}
      <header
        className={`w-full max-w-3xl mx-auto px-6 pt-10 pb-6 border-b flex justify-between items-center ${
          isDark ? 'border-neutral-800/80' : 'border-neutral-200'
        }`}
      >
        <button
          onClick={() => setCurrentPage('home')}
          className={`font-mono text-base font-semibold tracking-tight cursor-pointer transition-colors ${
            isDark ? 'text-white hover:text-neutral-300' : 'text-neutral-900 hover:text-neutral-600'
          }`}
        >
          vignesh suvarna
        </button>

        <nav className="flex items-center gap-6 text-base font-mono">
          <button
            onClick={() => setCurrentPage('home')}
            className={`cursor-pointer transition-colors ${
              currentPage === 'home'
                ? isDark
                  ? 'text-white underline underline-offset-4 decoration-neutral-400'
                  : 'text-neutral-900 underline underline-offset-4 decoration-neutral-500'
                : isDark
                ? 'text-neutral-400 hover:text-neutral-200'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            about
          </button>
          <button
            onClick={() => setCurrentPage('projects')}
            className={`cursor-pointer transition-colors ${
              currentPage === 'projects'
                ? isDark
                  ? 'text-white underline underline-offset-4 decoration-neutral-400'
                  : 'text-neutral-900 underline underline-offset-4 decoration-neutral-500'
                : isDark
                ? 'text-neutral-400 hover:text-neutral-200'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            projects
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
            className={`p-1.5 rounded border cursor-pointer transition-colors ${
              isDark
                ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700'
                : 'border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
            }`}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto px-6 py-12 flex-1">
        {currentPage === 'home' && (
          <div className="space-y-12">
            {/* Intro / Profile Header */}
            <section className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <img
                  src="/profile.jpg"
                  alt="Vignesh Suvarna"
                  className={`w-24 h-24 rounded-lg object-cover border shrink-0 ${
                    isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-100'
                  }`}
                />
                <div className="space-y-2">
                  <h1
                    className={`text-3xl font-bold tracking-tight leading-snug ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    Vignesh Suvarna
                  </h1>
                  <p className={`text-base ${isDark ? 'text-[#a3a3a3]' : 'text-neutral-600'}`}>
                    B.E. in Computer Science & Engineering @ Atria Institute of Technology
                  </p>
                  <div>
                    <a
                      href="/resume.pdf"
                      download
                      className={`inline-flex items-center gap-2 text-sm font-mono px-3.5 py-2 rounded border transition-colors ${
                        isDark
                          ? 'border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white'
                          : 'border-neutral-200 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 hover:text-black'
                      }`}
                    >
                      <Download size={15} /> resume
                    </a>
                  </div>
                </div>
              </div>

              {/* About Me Section */}
              <div className="space-y-3 pt-2">
                <h2
                  className={`text-sm font-mono uppercase tracking-wider mb-3 ${
                    isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  Background
                </h2>
                <ul
                  className={`space-y-3 list-disc list-inside text-base leading-relaxed ${
                    isDark ? 'marker:text-neutral-600 text-neutral-300' : 'marker:text-neutral-400 text-neutral-700'
                  }`}
                >
                  <li>
                    I am a <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>3rd-year Computer Science & Engineering undergraduate</span>.
                  </li>
                  <li>
                    Currently working on <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>full-stack web architectures and applied AI systems</span>, focusing on backend scalability, asynchronous processing, and intelligent document retrieval.
                  </li>
                  <li>
                    Driven by <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>clean system design</span>, I enjoy translating complex real-world problems into reliable, low-latency, and production-ready software.
                  </li>
                </ul>
              </div>

              {/* Interests Section */}
              <div className="pt-2">
                <h2
                  className={`text-sm font-mono uppercase tracking-wider mb-3 ${
                    isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  Areas of Exploration:
                </h2>
                <ul
                  className={`space-y-3 list-disc list-inside text-base leading-relaxed ${
                    isDark ? 'marker:text-neutral-600 text-neutral-300' : 'marker:text-neutral-400 text-neutral-700'
                  }`}
                >
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      Competitive Programming.
                    </span>{' '}
                    I actively practice algorithmic problem-solving on Codeforces, primarily writing solutions in C++ and Python.
                  </li>
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      AI Architecture & Full-Stack Systems.
                    </span>{' '}
                    Designing Retrieval-Augmented Generation (RAG) pipelines, working with vector embeddings, and deploying scalable backend infrastructure.
                  </li>
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      Beyond Coding.
                    </span>{' '}
                    Exploring new AI capabilities, building accessible applications, and unwinding with  video games.
                  </li>
                </ul>
              </div>
            </section>

            <hr className={isDark ? 'border-neutral-800/80' : 'border-neutral-200'} />

            {/* Activity Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2
                  className={`text-sm font-mono uppercase tracking-wider ${
                    isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  Coding Activity
                </h2>
                <div className="flex gap-4 text-sm font-mono">
                  <button
                    onClick={() => setActiveHeatmap('github')}
                    className={`cursor-pointer ${
                      activeHeatmap === 'github'
                        ? isDark
                          ? 'text-white underline underline-offset-4'
                          : 'text-neutral-900 underline underline-offset-4'
                        : isDark
                        ? 'text-neutral-500 hover:text-neutral-300'
                        : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    github
                  </button>
                  <button
                    onClick={() => setActiveHeatmap('codeforces')}
                    className={`cursor-pointer ${
                      activeHeatmap === 'codeforces'
                        ? isDark
                          ? 'text-white underline underline-offset-4'
                          : 'text-neutral-900 underline underline-offset-4'
                        : isDark
                        ? 'text-neutral-500 hover:text-neutral-300'
                        : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    codeforces
                  </button>
                </div>
              </div>

              {activeHeatmap === 'github' ? (
                <div
                  className={`border rounded p-4 ${
                    isDark ? 'border-neutral-800 bg-[#0d1117]' : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className={`text-xs mb-3 font-mono ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                    github.com/VigneshSSuvarna
                  </div>
                  <div className="overflow-x-auto">
                    <div className="min-w-[680px] py-1">
                      <img
                        src="https://ghchart.rshah.org/VigneshSSuvarna"
                        alt="Vignesh's Github Contribution Graph"
                        className="w-full"
                        style={
                          isDark
                            ? { filter: 'invert(1) hue-rotate(180deg) saturate(1.5) brightness(1.2)' }
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`border rounded p-5 ${
                    isDark
                      ? 'border-neutral-800 bg-[#0d1117] text-[#c9d1d9]'
                      : 'border-neutral-200 bg-white text-neutral-800'
                  }`}
                >
                  {loadingCf ? (
                    <div className="py-6 text-neutral-500 text-sm font-mono">
                      Fetching Codeforces data...
                    </div>
                  ) : (
                    <>
                      <div
                        className={`overflow-x-auto pb-4 border-b ${
                          isDark ? 'border-neutral-800' : 'border-neutral-200'
                        }`}
                      >
                        <div className="min-w-[700px]">
                          <div
                            className={`flex justify-between text-xs mb-2 px-6 ${
                              isDark ? 'text-[#8b949e]' : 'text-neutral-500'
                            }`}
                          >
                            {annualMonths.map((m, idx) => (
                              <span key={idx}>{m}</span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <div
                              className={`flex flex-col justify-between text-xs pr-2 py-1 h-[95px] ${
                                isDark ? 'text-[#8b949e]' : 'text-neutral-500'
                              }`}
                            >
                              <span>Mon</span>
                              <span>Wed</span>
                              <span>Fri</span>
                            </div>
                            <div className="flex gap-[2px] flex-1 justify-between">
                              {renderBoundedCalendar(52)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-between items-center gap-4 pt-4 text-sm font-mono">
                        <div className="flex gap-6">
                          <div>
                            <span className="text-neutral-500">solved: </span>
                            <span className={isDark ? 'text-white' : 'text-neutral-900'}>{cfStats.solved}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500">rating: </span>
                            <span className={isDark ? 'text-white' : 'text-neutral-900'}>{cfStats.rating}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowAnalyticsModal(true)}
                          className={`underline underline-offset-4 cursor-pointer ${
                            isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                          }`}
                        >
                          detailed stats →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </section>

            <hr className={isDark ? 'border-neutral-800/80' : 'border-neutral-200'} />

            {/* Structured Technical Skills Section */}
            <section className="space-y-4">
              <h2
                className={`text-sm font-mono uppercase tracking-wider ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}
              >
                Technical Skills
              </h2>
              <div
                className={`divide-y border-t border-b text-base ${
                  isDark
                    ? 'divide-neutral-800/70 border-neutral-800'
                    : 'divide-neutral-200 border-neutral-200'
                }`}
              >
                {skillsData.map((group) => (
                  <div key={group.category} className="py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                    <span className="text-neutral-500 font-mono text-sm sm:w-36 shrink-0">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className={`text-sm font-mono border px-2.5 py-1 rounded ${
                            isDark
                              ? 'text-neutral-300 bg-neutral-900/90 border-neutral-800'
                              : 'text-neutral-700 bg-neutral-100 border-neutral-200'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* PROJECTS PAGE */}
        {currentPage === 'projects' && (
          <div className="space-y-8">
            <div>
              <h1
                className={`text-2xl font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}
              >
                Projects
              </h1>
              <p className={`text-base mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Selected full-stack applications, AI systems, and tools I've built.
              </p>
            </div>

            <div
              className={`divide-y border-t border-b ${
                isDark ? 'divide-neutral-800 border-neutral-800' : 'divide-neutral-200 border-neutral-200'
              }`}
            >
              {projectsData.map((project) => (
                <div key={project.id} className="py-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="space-y-2 max-w-xl">
                    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {project.title}
                    </h2>
                    <p className={`text-base leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className={`text-sm font-mono border px-2.5 py-0.5 rounded ${
                            isDark
                              ? 'text-neutral-400 bg-neutral-900 border-neutral-800'
                              : 'text-neutral-700 bg-neutral-100 border-neutral-200'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end justify-start gap-3 text-sm font-mono shrink-0 pt-1">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1 underline underline-offset-4 ${
                        isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      source <ArrowUpRight size={14} />
                    </a>
                    {project.demo !== "#" && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-1 underline underline-offset-4 ${
                          isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        live demo <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`w-full max-w-3xl mx-auto px-6 py-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm ${
          isDark ? 'border-neutral-800/80 text-[#8a8a8a]' : 'border-neutral-200 text-neutral-500'
        }`}
      >
        <div>
          © {new Date().getFullYear()} Vignesh Suvarna. Built with React & Vite.
        </div>

        <div className="flex items-center gap-5">
          {/* GitHub Icon */}
          <a
            href="https://github.com/VigneshSSuvarna"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={`transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          {/* Codeforces Bars Icon */}
          <a
            href="https://codeforces.com/profile/VigneshSSuvarna"
            target="_blank"
            rel="noreferrer"
            aria-label="Codeforces"
            className={`transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="9" width="4.5" height="12" rx="1" />
              <rect x="9.75" y="4" width="4.5" height="17" rx="1" />
              <rect x="16.5" y="12" width="4.5" height="9" rx="1" />
            </svg>
          </a>

          {/* LinkedIn Icon */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className={`transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>
        </div>
      </footer>

      {/* Minimal Modal for Codeforces Stats */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div
            className={`border rounded-md w-full max-w-3xl p-6 space-y-6 ${
              isDark ? 'bg-[#141414] border-neutral-800' : 'bg-white border-neutral-200'
            }`}
          >
            <div
              className={`flex justify-between items-center border-b pb-3 ${
                isDark ? 'border-neutral-800' : 'border-neutral-200'
              }`}
            >
              <h2
                className={`text-base font-mono font-semibold ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}
              >
                codeforces_analytics
              </h2>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className={`cursor-pointer ${
                  isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm font-mono">
              <div
                className={`border p-3 rounded ${
                  isDark ? 'border-neutral-800 bg-[#0d1117]' : 'border-neutral-200 bg-neutral-50'
                }`}
              >
                <div className="text-xs text-neutral-500">Problems Solved</div>
                <div className={`text-lg mt-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {cfStats.solved}
                </div>
              </div>
              <div
                className={`border p-3 rounded ${
                  isDark ? 'border-neutral-800 bg-[#0d1117]' : 'border-neutral-200 bg-neutral-50'
                }`}
              >
                <div className="text-xs text-neutral-500">Current Rating</div>
                <div className={`text-lg mt-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {cfStats.rating}
                </div>
              </div>
              <div
                className={`border p-3 rounded col-span-2 sm:col-span-1 ${
                  isDark ? 'border-neutral-800 bg-[#0d1117]' : 'border-neutral-200 bg-neutral-50'
                }`}
              >
                <div className="text-xs text-neutral-500">Primary Languages</div>
                <div className={`text-sm mt-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  C++, Python
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-neutral-500 mb-2">Focus Areas</div>
              <div className="flex flex-wrap gap-2">
                {["Greedy", "Math", "Brute Force", "Implementation", "Sorting"].map(tag => (
                  <span
                    key={tag}
                    className={`px-2.5 py-1 border text-xs font-mono rounded ${
                      isDark
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
                        : 'bg-neutral-100 border-neutral-200 text-neutral-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;