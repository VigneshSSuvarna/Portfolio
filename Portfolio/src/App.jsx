import React, { useState, useEffect } from 'react';
import { Mail, ExternalLink, Code2, Trophy, X } from 'lucide-react';

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
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeHeatmap, setActiveHeatmap] = useState('github');
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  // Codeforces API Dynamic States
  const [cfSubmissions, setCfSubmissions] = useState({});
  const [cfStats, setCfStats] = useState({ solved: 5, rating: 581 });
  const [loadingCf, setLoadingCf] = useState(true);

  // Fetch Codeforces Submissions & Rating on Mount
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

  // Dynamically compute active month labels ending at current date
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

  // Generate calendar heatmap strictly bounded by today without rendering future boxes
  const renderBoundedCalendar = (totalWeeks = 28) => {
    const weeks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let w = totalWeeks - 1; w >= 0; w--) {
      const daysInWeek = [];
      for (let d = 0; d < 7; d++) {
        const dateObj = new Date(today);
        dateObj.setDate(dateObj.getDate() - (w * 7 + (6 - d)));
        dateObj.setHours(0, 0, 0, 0);

        // Strict boundary: stop rendering if date is in the future
        if (dateObj > today) {
          break;
        }

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const count = cfSubmissions[dateStr] || 0;
        
        let colorClass = "bg-[#161b22]";
        if (count > 0) colorClass = "bg-[#0e4429]";
        if (count > 1) colorClass = "bg-[#006d32]";
        if (count >= 3) colorClass = "bg-[#26a641]";

        daysInWeek.push(
          <div 
            key={dateStr} 
            title={`${dateStr}: ${count} solved`}
            className={`w-3.5 h-3.5 rounded-[3px] ${colorClass} transition-all duration-200 hover:scale-125`}
          />
        );
      }
      
      if (daysInWeek.length > 0) {
        weeks.push(
          <div key={w} className="flex flex-col gap-1">
            {daysInWeek}
          </div>
        );
      }
    }
    return weeks;
  };

  const mainCardMonths = getDynamicMonths(28);
  const modalAnnualMonths = getDynamicMonths(52);

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Sleek Floating Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-full px-6 py-3 flex justify-between items-center shadow-2xl transition-all duration-300">
        <div className="font-bold tracking-wider text-white">VIGNESH.DEV</div>
        <div className="flex gap-3 text-sm font-medium">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 ${currentPage === 'home' ? 'bg-white text-black font-semibold shadow-md scale-105' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentPage('projects')}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 ${currentPage === 'projects' ? 'bg-white text-black font-semibold shadow-md scale-105' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}
          >
            Projects
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20 space-y-8">
        
        {/* PAGE 1: HOME */}
        {currentPage === 'home' && (
          <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            
            {/* Hero Card */}
            <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm transition-all duration-500 transform translate-y-0 opacity-100">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none transition-all duration-700 animate-pulse"></div>

              <div className="flex flex-col items-center text-center relative z-10">
                
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-blue-500/50 shadow-xl shadow-blue-500/10 mb-6 bg-neutral-800 transition-transform duration-500 hover:scale-105">
                  <img 
                    src="/profile.jpg" 
                    alt="Vignesh Suvarna" 
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-110"
                  />
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">Vignesh Suvarna</h1>
                <p className="text-sm md:text-base text-blue-400 font-medium mb-8">
                  Hi, I'm a 3rd year B.E.(CSE) student @ Atria Institute of Technology.
                </p>

                {/* Bio Details Cards */}
                <div className="space-y-4 text-neutral-300 text-sm md:text-base leading-relaxed text-left bg-neutral-950/40 border border-neutral-800/60 p-6 rounded-2xl mb-8 shadow-inner">
                  <p className="transition-colors duration-200 hover:text-white">
                    <strong className="text-white font-semibold">Full-Stack Developer</strong> focusing on scalable web architectures (Node.js, Express, React, PostgreSQL).
                  </p>
                  <p className="transition-colors duration-200 hover:text-white">
                    <strong className="text-white font-semibold">AI Architecture enthusiast</strong> building Retrieval-Augmented Generation (RAG) tools and integrating OpenRouter APIs.
                  </p>
                  <p className="transition-colors duration-200 hover:text-white">
                    Deeply interested in robust system design, building platforms like Nayi Disha and PlaceOS to solve real-world management problems. I build things for fun, optimize them for speed, and sometimes they end up being genuinely useful.
                  </p>
                  <p className="text-neutral-400 text-xs md:text-sm pt-2 border-t border-neutral-800/60 transition-colors duration-200 hover:text-neutral-300">
                    Outside of academics, I'm usually deploying apps to Vercel and Render, exploring new AI capabilities, or watching movies and playing games. Currently balancing university, full-stack projects, and whatever else catches my interest.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 w-full">
                  <a href="https://github.com/VigneshSSuvarna" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-neutral-800/80 border border-neutral-700 px-5 py-2.5 rounded-xl hover:bg-neutral-700 hover:scale-105 transition-all duration-300 text-sm font-medium shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    GitHub
                  </a>
                  <a href="/resume.pdf" download className="flex items-center gap-2 bg-neutral-800/80 border border-neutral-700 px-5 py-2.5 rounded-xl hover:bg-neutral-700 hover:scale-105 transition-all duration-300 text-sm font-medium shadow-sm">
                    Resume
                  </a>
                  <a href="mailto:rajkamalpathak51@gmail.com" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/20 text-sm font-medium">
                    <Mail size={16} /> Contact Me
                  </a>
                </div>

              </div>
            </div>

            {/* GitHub Contributions & Codeforces Activity Tabbed Widget */}
            <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setActiveHeatmap('github')}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${activeHeatmap === 'github' ? 'bg-white text-black shadow-md' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}
                >
                  GitHub Contributions
                </button>
                <button 
                  onClick={() => setActiveHeatmap('codeforces')}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${activeHeatmap === 'codeforces' ? 'bg-white text-black shadow-md' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}
                >
                  Codeforces Activity
                </button>
              </div>

              <div className="w-full">
                {activeHeatmap === 'github' ? (
                  <div className="overflow-x-auto py-2">
                    <div className="min-w-[600px] flex justify-center bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
                      <img 
                        src="https://ghchart.rshah.org/26a641/VigneshSSuvarna" 
                        alt="Vignesh's Github Contribution Graph" 
                        className="w-full opacity-95"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-950/60 p-6 rounded-2xl border border-neutral-800 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="text-sm font-semibold text-neutral-300">
                        <span className="text-white font-bold text-base">{cfStats.solved}</span> Problems Solved · Rating <span className="text-blue-400 font-bold">{cfStats.rating}</span>
                      </div>
                    </div>

                    {loadingCf ? (
                      <div className="text-center py-8 text-neutral-500 text-sm animate-pulse">Loading Codeforces Heatmap...</div>
                    ) : (
                      <div className="overflow-x-auto py-3">
                        <div className="w-full bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/80">
                          {/* Dynamic Months Header */}
                          <div className="flex justify-between text-[10px] text-neutral-400 mb-2 px-6 font-medium">
                            {mainCardMonths.map((m, idx) => (
                              <span key={idx}>{m}</span>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            {/* Weekday Labels */}
                            <div className="flex flex-col justify-between text-[10px] text-neutral-500 pr-1 py-0.5">
                              <span>Mon</span>
                              <span>Wed</span>
                              <span>Fri</span>
                            </div>

                            {/* Heatmap Grid Columns */}
                            <div className="flex gap-1.5 flex-1 justify-between">
                              {renderBoundedCalendar(28)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-neutral-800/80">
                      <button 
                        onClick={() => setShowAnalyticsModal(true)}
                        className="text-xs text-blue-400 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
                      >
                        Expand Detailed Analytics →
                      </button>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span>Less</span>
                        <div className="w-3 h-3 rounded-sm bg-[#161b22]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#0e4429]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#006d32]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#26a641]"></div>
                        <span>More</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tech Stack Section */}
            <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Tech Stack</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {["C", "C++", "Python", "Java", "JavaScript", "HTML5", "CSS3"].map((lang) => (
                      <span key={lang} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-full hover:border-neutral-600 transition-colors">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-3">Frontend</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {["React.js", "Vite", "Streamlit", "Tkinter"].map((fe) => (
                      <span key={fe} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-full hover:border-neutral-600 transition-colors">
                        {fe}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-3">Backend & APIs</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {["Node.js", "Express.js", "REST APIs", "JDBC"].map((be) => (
                      <span key={be} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-full hover:border-neutral-600 transition-colors">
                        {be}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-3">Databases</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {["MySQL", "PostgreSQL", "SQL", "phpMyAdmin"].map((db) => (
                      <span key={db} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-full hover:border-neutral-600 transition-colors">
                        {db}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-3">AI & Data</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {["LLMs", "RAG", "AI Applications", "Data Processing", "Pandas"].map((ai) => (
                      <span key={ai} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-full hover:border-neutral-600 transition-colors">
                        {ai}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-3">Developer Tools</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {["Git", "GitHub", "VS Code", "Postman", "Vercel", "XAMPP"].map((tool) => (
                      <span key={tool} className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-full hover:border-neutral-600 transition-colors">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* PAGE 2: PROJECTS */}
        {currentPage === 'projects' && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <header className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                <Code2 className="text-blue-500 animate-spin-slow" size={28} /> Featured Projects
              </h2>
              <p className="text-neutral-400 text-sm">A curated look at my full-stack web platforms and AI tools.</p>
            </header>

            <div className="grid grid-cols-1 gap-4">
              {projectsData.map((project, index) => (
                <div 
                  key={project.id} 
                  className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 hover:bg-neutral-900/80 hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-neutral-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map(tech => (
                        <span key={tech} className="px-2.5 py-0.5 bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-medium rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-neutral-800">
                    <a href={project.github} target="_blank" rel="noreferrer" className="flex-1 md:flex-initial text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-105 font-medium">
                      Code
                    </a>
                    {project.demo !== "#" && (
                      <a href={project.demo} target="_blank" rel="noreferrer" className="flex-1 md:flex-initial text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-105 font-medium shadow-md shadow-blue-600/20">
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* DETAILED ANALYTICS MODAL */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e0f14] border border-neutral-800 rounded-3xl w-full max-w-5xl p-6 md:p-8 relative shadow-2xl space-y-8 animate-[fadeIn_0.3s_ease-out] my-8">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Coding Activity Dashboard
              </h2>
              <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Section 1: Full Annual Codeforces Activity & Heatmap */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">
                  CODEFORCES Activity — <span className="text-blue-400">{cfStats.solved} Problems Solved</span>
                </h3>
              </div>

              <div className="bg-neutral-950/60 p-6 rounded-2xl border border-neutral-800 overflow-x-auto">
                <div className="min-w-[850px] flex justify-between text-xs text-neutral-400 mb-2 px-8 font-medium">
                  {modalAnnualMonths.map((m, idx) => (
                    <span key={idx}>{m}</span>
                  ))}
                </div>
                <div className="min-w-[850px] flex gap-2 justify-center">
                  <div className="flex flex-col justify-between text-[10px] text-neutral-500 py-1">
                    <span>Mon</span><span>Wed</span><span>Fri</span>
                  </div>
                  <div className="flex gap-1 flex-1 justify-between">
                    {renderBoundedCalendar(52)}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Section 2: Rating & Stats Overview */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                CODEFORCES Rating: <span className="text-yellow-400">{cfStats.rating}</span>
              </h3>
              <p className="text-sm text-neutral-400">Current active competitive programming standing and rating progression.</p>
              
              <div className="bg-neutral-950/60 p-6 rounded-2xl border border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Problem Ratings Distribution</h4>
                  <div className="space-y-2 text-xs text-neutral-400">
                    <div className="flex justify-between"><span>800 - 1000 Level</span><span className="text-white">Active</span></div>
                    <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-3/4"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Problem Tags Mastery</h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Greedy", "Math", "Brute Force", "Implementation", "Sorting"].map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Close */}
            <div className="flex justify-end pt-4 border-t border-neutral-800">
              <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              >
                Close Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;