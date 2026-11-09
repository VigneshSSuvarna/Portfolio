import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  X, ArrowUpRight, Sun, Moon, Download, Calendar, RefreshCw, 
  ArrowLeft, Code2, Compass, Terminal, Search, Command 
} from 'lucide-react';

const projectsData = [
  {
    id: 1,
    title: "Nayi Disha Platform",
    category: "Full-Stack Web App",
    description: "Full-stack web application with user authentication and database integration.",
    techStack: ["Node.js", "Express", "PostgreSQL", "React"],
    github: "https://github.com/Nayi-Disha-Org/Nayi-Disha.git",
    demo: "https://nayi-disha-web.vercel.app",
    pageKey: "sama-foundation"
  },
  {
    id: 2,
    title: "AI-PDF-CHATBOX",
    category: "Applied AI",
    description: "High-performance RAG system designed to eliminate LLM hallucinations by grounding responses in private local documents.",
    techStack: ["Python", "LangChain", "PyPDF"],
    github: "https://github.com/VigneshSSuvarna/AI-PDF-CHATBOX.git",
    demo: "#",
    pageKey: "project-ai-chatbox"
  },
  {
    id: 3,
    title: "HireSphere & PlaceOS",
    category: "Full-Stack Web App",
    description: "Full-stack platforms modernizing university placements, providing a unified workspace for students and administrators.",
    techStack: ["TypeScript", "React", "Express"],
    github: "https://github.com/VigneshSSuvarna/HireSphere.git",
    demo: "#",
    pageKey: "project-hiresphere"
  },
  {
    id: 4,
    title: "HERMES",
    category: "Applied AI",
    description: "An asynchronous, voice-activated personal AI companion and desktop automation engine.",
    techStack: ["Python", "asyncio"],
    github: "https://github.com/VigneshSSuvarna/HERMES.git",
    demo: "#",
    pageKey: "project-hermes"
  },
  {
    id: 5,
    title: "HearingAid",
    category: "Android App",
    description: "A Kotlin-based Android assistive audio application designed to amplify real-time sound and improve hearing accessibility.",
    techStack: ["Kotlin", "Android"],
    github: "https://github.com/VigneshSSuvarna/HearingAid.git",
    demo: "#",
    pageKey: "cit-hearingaid"
  }
];

const experienceData = [
  {
    id: 1,
    organization: "Sama Foundation",
    role: "Full-Stack Developer",
    description: "Developing full-stack web applications and digital infrastructure to support community outreach and NGO management operations.",
    projectTitle: "Nayi Disha Care & Support Platform",
    pageKey: "sama-foundation"
  },
  {
    id: 2,
    organization: "Dr. S. R. Chandrasekhar Institute of Speech and Hearing",
    role: "Software Developer",
    description: "Building institutional management platforms to streamline academic administration, student workflows, and resource allocation.",
    projectTitle: "HearingAid Pro",
    pageKey: "cit-hearingaid"
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

const INITIAL_CF_SUBMISSIONS = {
  "2025-11-20": 2,
  "2026-03-31": 1,
  "2026-04-03": 2,
  "2026-04-04": 2,
  "2026-05-13": 2,
  "2026-05-18": 2
};

const INITIAL_CF_RATING_HISTORY = [
  {
    contestId: 1,
    contestName: "Codeforces Round (Div. 4)",
    dateStr: "2025-11-20",
    timestamp: new Date(2025, 10, 20).getTime(),
    oldRating: 0,
    newRating: 385
  },
  {
    contestId: 2,
    contestName: "Codeforces Round (Div. 3)",
    dateStr: "2026-04-04",
    timestamp: new Date(2026, 3, 4).getTime(),
    oldRating: 385,
    newRating: 581
  }
];

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function formatDisplayDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const monthShort = dateObj.toLocaleString('en-US', { month: 'short' });
  const weekdayShort = dateObj.toLocaleString('en-US', { weekday: 'short' });
  return `${day}${getOrdinalSuffix(day)} ${monthShort} ${year} (${weekdayShort})`;
}

function toLocalDateKey(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDateKey(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function computeMaxStreak(dateKeys) {
  if (!dateKeys || dateKeys.length === 0) return 0;
  const sorted = [...new Set(dateKeys)].sort();
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = parseLocalDateKey(sorted[i - 1]);
    const curr = parseLocalDateKey(sorted[i]);
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }
  return maxStreak;
}

function buildDynamicRatingTicks(startTime, endTime) {
  const ticks = [];
  const count = 9;
  const padStart = startTime + (endTime - startTime) * 0.08;
  const padEnd = endTime - (endTime - startTime) * 0.02;

  for (let i = 0; i < count; i++) {
    const t = padStart + ((padEnd - padStart) * i) / (count - 1);
    const d = new Date(t);
    const dayStr = String(d.getDate()).padStart(2, '0');
    const monthStr = d.toLocaleString('en-US', { month: 'short' });
    ticks.push({
      labelTop: `${dayStr} ${monthStr}`,
      labelBottom: String(d.getFullYear()),
      time: t
    });
  }
  return ticks;
}

function buildCalendarWeeks(yearFilter = 'rolling') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let endDate = new Date(today);
  let startDate;

  if (yearFilter === 'rolling') {
    const currentWeekSunday = new Date(today);
    currentWeekSunday.setDate(today.getDate() - today.getDay());
    currentWeekSunday.setHours(0, 0, 0, 0);

    startDate = new Date(currentWeekSunday);
    startDate.setDate(currentWeekSunday.getDate() - 52 * 7);
  } else {
    const yr = Number(yearFilter);
    const jan1 = new Date(yr, 0, 1);
    startDate = new Date(jan1);
    startDate.setDate(jan1.getDate() - jan1.getDay());

    const dec31 = new Date(yr, 11, 31);
    endDate = dec31 > today ? new Date(today) : dec31;
  }

  const weeks = [];
  let cursor = new Date(startDate);
  let weekIdx = 0;
  let lastLabeledWeekIdx = -10;

  while (cursor <= endDate) {
    const weekSunday = new Date(cursor);
    const days = [];
    let monthLabel = null;

    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(weekSunday);
      cellDate.setDate(weekSunday.getDate() + d);
      cellDate.setHours(0, 0, 0, 0);

      if (cellDate > endDate) {
        break;
      }

      if (yearFilter !== 'rolling' && cellDate.getFullYear() !== Number(yearFilter)) {
        days.push({
          dateStr: toLocalDateKey(cellDate),
          dateObj: cellDate,
          dayOfWeek: d,
          isPadding: true
        });
        continue;
      }

      const dateStr = toLocalDateKey(cellDate);

      if (cellDate.getDate() === 1) {
        monthLabel = cellDate.toLocaleString('en-US', { month: 'short' });
        lastLabeledWeekIdx = weekIdx;
      }

      days.push({
        dateStr,
        dateObj: cellDate,
        dayOfWeek: d,
        isPadding: false
      });
    }

    if (weekIdx === 0 && !monthLabel && days.length > 0) {
      const firstActive = days.find(x => !x.isPadding) || days[0];
      monthLabel = firstActive.dateObj.toLocaleString('en-US', { month: 'short' });
      lastLabeledWeekIdx = 0;
    } else if (monthLabel && weekIdx - lastLabeledWeekIdx < 2 && weekIdx !== lastLabeledWeekIdx) {
      monthLabel = null;
    }

    if (days.length > 0) {
      weeks.push({
        weekIdx,
        monthLabel,
        days
      });
    }

    cursor.setDate(cursor.getDate() + 7);
    weekIdx++;
  }

  return weeks;
}

const LiveStatusBadge = ({ url, isDark }) => {
  const [latency, setLatency] = useState(null);
  
  useEffect(() => {
    // Generate a realistic fake latency between 25ms and 110ms
    setLatency(Math.floor(Math.random() * 85) + 25);
  }, []);

  if (!url || url === '#') return null;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono shrink-0 ${
      isDark ? 'bg-emerald-500/10 border-emerald-900/50 text-[#39d353]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-[#39d353]' : 'bg-emerald-600'}`}></span>
      <span>Online • {latency}ms</span>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [previousPage, setPreviousPage] = useState('home');
  const [activeHeatmap, setActiveHeatmap] = useState('github');
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [isSyncingCf, setIsSyncingCf] = useState(false);
  const [visitorCount, setVisitorCount] = useState(198);
  const [preloaderStep, setPreloaderStep] = useState(1);

  // --- NEW: Command Palette / Terminal State ---
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', text: 'Welcome to VSSh v1.0.0.' },
    { type: 'output', text: 'Type "help" to see available commands.' }
  ]);
  const terminalInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // --- NEW: Project Filter State ---
  const [projectFilter, setProjectFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories for the filter chips
  const projectCategories = ['All', ...new Set(projectsData.map(p => p.category).filter(Boolean))];

  // Filter logic for projects
  const filteredProjects = projectsData.filter(project => {
    const matchesFilter = projectFilter === 'All' || project.category === projectFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [modalSelectedDateStr, setModalSelectedDateStr] = useState(null);
  const [modalYearFilter, setModalYearFilter] = useState('rolling');
  const [ratingFilter, setRatingFilter] = useState('rated');
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [hoveredContest, setHoveredContest] = useState(null);

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('portfolio_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('portfolio_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    try {
      const hasVisitedSession = sessionStorage.getItem('portfolio_session_counted');
      let currentViews = parseInt(localStorage.getItem('portfolio_total_visits') || '197', 10);

      if (!hasVisitedSession) {
        currentViews += 1;
        sessionStorage.setItem('portfolio_session_counted', 'true');
        localStorage.setItem('portfolio_total_visits', currentViews.toString());
      }
      setVisitorCount(currentViews);
    } catch {
      setVisitorCount(198);
    }
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => setPreloaderStep(2), 1500);
    const timer2 = setTimeout(() => setPreloaderStep(3), 2500);
    const timer3 = setTimeout(() => setPreloaderStep(4), 3300);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Terminal Keyboard Shortcut (Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isTerminalOpen) {
        setIsTerminalOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isTerminalOpen]);

  // Auto-focus terminal input when opened
  useEffect(() => {
    if (isTerminalOpen && terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, [isTerminalOpen]);

  // Auto-scroll terminal history
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, isTerminalOpen]);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...terminalHistory, { type: 'input', text: `vignesh@portfolio:~$ ${cmd}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({ type: 'output', text: 'Available commands:\n  projects - View all projects\n  skills   - List technical skills\n  contact  - Show contact info\n  clear    - Clear terminal\n  curl resume - Download resume' });
        break;
      case 'projects':
        newHistory.push({ type: 'output', text: 'Loading projects...' });
        setCurrentPage('projects');
        setTimeout(() => setIsTerminalOpen(false), 600);
        break;
      case 'skills':
        newHistory.push({ type: 'output', text: 'Frontend: React, Tailwind\nBackend: Node, Python\nAI: RAG, LangChain\nDB: PostgreSQL' });
        break;
      case 'contact':
        newHistory.push({ type: 'output', text: 'Email: 1at24cs251@atria.edu\nGitHub: github.com/VigneshSSuvarna' });
        break;
      case 'curl resume':
        newHistory.push({ type: 'output', text: 'Initiating download request...' });
        window.open('/resume.pdf', '_blank');
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      default:
        newHistory.push({ type: 'output', text: `bash: ${cmd}: command not found` });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const [ghContributions, setGhContributions] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_gh_contrib');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });
  const [ghTotal, setGhTotal] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_gh_total');
      return cached ? Number(cached) : 0;
    } catch {
      return 0;
    }
  });

  const [cfSubmissions, setCfSubmissions] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_cf_submissions');
      return cached ? JSON.parse(cached) : INITIAL_CF_SUBMISSIONS;
    } catch {
      return INITIAL_CF_SUBMISSIONS;
    }
  });

  const [cfDetailedStats, setCfDetailedStats] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_cf_detailed');
      return cached
        ? JSON.parse(cached)
        : {
            rating: 581,
            solvedAllTime: 5,
            solvedLastYear: 5,
            solvedLastMonth: 0,
            streakMax: 2,
            streakLastYear: 2,
            streakLastMonth: 0,
            tags: ["Greedy", "Math", "Brute Force", "Implementation", "Sorting"],
            languages: "C++, Python"
          };
    } catch {
      return {
        rating: 581,
        solvedAllTime: 5,
        solvedLastYear: 5,
        solvedLastMonth: 0,
        streakMax: 2,
        streakLastYear: 2,
        streakLastMonth: 0,
        tags: ["Greedy", "Math", "Brute Force", "Implementation", "Sorting"],
        languages: "C++, Python"
      };
    }
  });

  const [cfRatingHistory, setCfRatingHistory] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_cf_rating_history');
      return cached ? JSON.parse(cached) : INITIAL_CF_RATING_HISTORY;
    } catch {
      return INITIAL_CF_RATING_HISTORY;
    }
  });

  const syncLiveActivity = useCallback(async () => {
    const handle = "VigneshSSuvarna";
    setIsSyncingCf(true);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = toLocalDateKey(today);

    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    const oneYearAgoKey = toLocalDateKey(oneYearAgo);

    const oneMonthAgo = new Date(today);
    oneMonthAgo.setDate(today.getDate() - 30);
    const oneMonthAgoKey = toLocalDateKey(oneMonthAgo);

    fetch(`https://github-contributions-api.jogruber.de/v4/${handle}?y=last`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.contributions)) {
          const map = {};
          let total = 0;
          data.contributions.forEach(item => {
            if (item.date <= todayKey) {
              map[item.date] = item.count || 0;
              total += item.count || 0;
            }
          });
          setGhContributions(map);
          setGhTotal(total);
          localStorage.setItem('portfolio_gh_contrib', JSON.stringify(map));
          localStorage.setItem('portfolio_gh_total', String(total));
        }
      })
      .catch(() => {});

    try {
      const [infoRes, statusRes, ratingRes] = await Promise.allSettled([
        fetch(`https://codeforces.com/api/user.info?handles=${handle}`).then(r => r.json()),
        fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5000`).then(r => r.json()),
        fetch(`https://codeforces.com/api/user.rating?handle=${handle}`).then(r => r.json())
      ]);

      let latestRating = 581;
      if (
        infoRes.status === 'fulfilled' &&
        infoRes.value?.status === 'OK' &&
        infoRes.value.result?.length > 0
      ) {
        latestRating = infoRes.value.result[0].rating || 581;
      }

      let firstAcceptedTimestamp = new Date(2025, 10, 20).getTime();

      if (
        statusRes.status === 'fulfilled' &&
        statusRes.value?.status === 'OK' &&
        Array.isArray(statusRes.value.result)
      ) {
        const counts = {};
        const allTimeProbs = new Set();
        const lastYearProbs = new Set();
        const lastMonthProbs = new Set();
        const tagCounts = {};
        const langSet = new Set();

        statusRes.value.result.forEach(sub => {
          if (sub.verdict === 'OK') {
            const ts = sub.creationTimeSeconds * 1000;
            if (ts < firstAcceptedTimestamp) firstAcceptedTimestamp = ts;

            const subDate = new Date(ts);
            const dateStr = toLocalDateKey(subDate);

            if (dateStr <= todayKey) {
              counts[dateStr] = (counts[dateStr] || 0) + 1;
              const probKey = `${sub.problem.contestId}-${sub.problem.index}`;
              allTimeProbs.add(probKey);
              if (dateStr >= oneYearAgoKey) lastYearProbs.add(probKey);
              if (dateStr >= oneMonthAgoKey) lastMonthProbs.add(probKey);

              if (Array.isArray(sub.problem.tags)) {
                sub.problem.tags.forEach(t => {
                  const formatted = t
                    .split(' ')
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ');
                  tagCounts[formatted] = (tagCounts[formatted] || 0) + 1;
                });
              }

              if (sub.programmingLanguage) {
                if (sub.programmingLanguage.includes('C++')) langSet.add('C++');
                else if (sub.programmingLanguage.includes('Py')) langSet.add('Python');
                else if (sub.programmingLanguage.includes('Java')) langSet.add('Java');
              }
            }
          }
        });

        if (Object.keys(counts).length > 0) {
          const activeDatesAll = Object.keys(counts);
          const activeDatesYear = activeDatesAll.filter(d => d >= oneYearAgoKey);
          const activeDatesMonth = activeDatesAll.filter(d => d >= oneMonthAgoKey);

          const topTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([tag]) => tag);

          const updatedStats = {
            rating: latestRating,
            solvedAllTime: allTimeProbs.size,
            solvedLastYear: lastYearProbs.size,
            solvedLastMonth: lastMonthProbs.size,
            streakMax: computeMaxStreak(activeDatesAll),
            streakLastYear: computeMaxStreak(activeDatesYear),
            streakLastMonth: computeMaxStreak(activeDatesMonth),
            tags: topTags.length > 0 ? topTags : ["Greedy", "Math", "Brute Force", "Implementation", "Sorting"],
            languages: langSet.size > 0 ? Array.from(langSet).join(', ') : "C++, Python"
          };

          setCfSubmissions(counts);
          setCfDetailedStats(updatedStats);
          localStorage.setItem('portfolio_cf_submissions', JSON.stringify(counts));
          localStorage.setItem('portfolio_cf_detailed', JSON.stringify(updatedStats));
        }
      }

      if (
        ratingRes.status === 'fulfilled' &&
        ratingRes.value?.status === 'OK' &&
        Array.isArray(ratingRes.value.result) &&
        ratingRes.value.result.length > 0
      ) {
        const rawContests = ratingRes.value.result.map(item => {
          const d = new Date(item.ratingUpdateTimeSeconds * 1000);
          return {
            contestId: item.contestId,
            contestName: item.contestName,
            dateStr: toLocalDateKey(d),
            timestamp: d.getTime(),
            oldRating: item.oldRating,
            newRating: item.newRating
          };
        });

        const history =
          rawContests.length === 1
            ? [
                {
                  contestId: 0,
                  contestName: "Initial Baseline",
                  dateStr: toLocalDateKey(new Date(firstAcceptedTimestamp)),
                  timestamp: firstAcceptedTimestamp,
                  oldRating: 0,
                  newRating: rawContests[0].oldRating || 385
                },
                ...rawContests
              ]
            : rawContests;

        setCfRatingHistory(history);
        localStorage.setItem('portfolio_cf_rating_history', JSON.stringify(history));
      }
    } catch {
      // Retain cache if offline
    } finally {
      setIsSyncingCf(false);
    }
  }, []);

  useEffect(() => {
    syncLiveActivity();
    const interval = setInterval(syncLiveActivity, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [syncLiveActivity]);

  const mainCalendarWeeks = useMemo(() => buildCalendarWeeks('rolling'), []);
  const modalCalendarWeeks = useMemo(
    () => buildCalendarWeeks(modalYearFilter),
    [modalYearFilter]
  );

  const getGitHubCellColor = (count) => {
    if (count <= 0) return isDark ? "bg-[#161b22]" : "bg-[#ebedf0]";
    if (count === 1) return isDark ? "bg-[#0e4429]" : "bg-[#9be9a8]";
    if (count <= 3) return isDark ? "bg-[#006d32]" : "bg-[#40c463]";
    if (count <= 5) return isDark ? "bg-[#26a641]" : "bg-[#30a14e]";
    return isDark ? "bg-[#39d353]" : "bg-[#216e39]";
  };

  const getCfCellColor = (count) => {
    if (count <= 0) return isDark ? "bg-[#161b22]" : "bg-[#ebedf0]";
    if (count === 1) return isDark ? "bg-[#0e4429]" : "bg-[#85e89d]";
    if (count === 2) return isDark ? "bg-[#006d32]" : "bg-[#34d058]";
    if (count <= 4) return isDark ? "bg-[#26a641]" : "bg-[#28a745]";
    return isDark ? "bg-[#39d353]" : "bg-[#22863a]";
  };

  const activeDataMap = activeHeatmap === 'github' ? ghContributions : cfSubmissions;
  const unitLabel = activeHeatmap === 'github' ? 'contribution' : 'submission';
  const selectedCount = selectedDateStr ? (activeDataMap[selectedDateStr] || 0) : 0;

  const renderMainHeatmap = () => {
    return (
      <div className="space-y-3">
        <div
          className={`overflow-x-auto overflow-y-hidden pb-3 border-b ${
            isDark ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          <div className="pt-6 w-full flex justify-center">
            <div className="flex flex-col">
              <div className="flex gap-[3px] pl-8 mb-1.5 h-4 items-end">
                {mainCalendarWeeks.map((week) => (
                  <div key={week.weekIdx} className="w-[13px] relative shrink-0">
                    {week.monthLabel && (
                      <span
                        className={`absolute bottom-0 left-0 text-[11px] font-mono leading-none select-none ${
                          isDark ? 'text-[#8b949e]' : 'text-neutral-500'
                        }`}
                      >
                        {week.monthLabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 items-start">
                <div
                  className={`flex flex-col gap-[3px] text-[11px] font-mono w-6 shrink-0 select-none ${
                    isDark ? 'text-[#8b949e]' : 'text-neutral-500'
                  }`}
                >
                  <span className="h-[13px] leading-[13px] opacity-0">Sun</span>
                  <span className="h-[13px] leading-[13px]">Mon</span>
                  <span className="h-[13px] leading-[13px] opacity-0">Tue</span>
                  <span className="h-[13px] leading-[13px]">Wed</span>
                  <span className="h-[13px] leading-[13px] opacity-0">Thu</span>
                  <span className="h-[13px] leading-[13px]">Fri</span>
                  <span className="h-[13px] leading-[13px] opacity-0">Sat</span>
                </div>

                <div className="flex gap-[3px] flex-1 justify-center">
                  {mainCalendarWeeks.map((week) => (
                    <div key={week.weekIdx} className="flex flex-col gap-[3px] w-[13px] shrink-0">
                      {week.days.map((day) => {
                        const count = activeDataMap[day.dateStr] || 0;
                        const isSelected = selectedDateStr === day.dateStr;
                        const colorClass = getGitHubCellColor(count);

                        return (
                          <div key={day.dateStr} className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedDateStr(prev => (prev === day.dateStr ? null : day.dateStr))
                              }
                              aria-label={`${formatDisplayDate(day.dateStr)}: ${count} ${unitLabel}${count === 1 ? '' : 's'}`}
                              title={`${formatDisplayDate(day.dateStr)} — ${count} ${unitLabel}${count === 1 ? '' : 's'}`}
                              className={`block w-[13px] h-[13px] rounded-[3px] cursor-pointer transition-transform duration-150 focus:outline-none ${colorClass} ${
                                isSelected
                                  ? isDark
                                    ? 'ring-2 ring-white scale-125 z-20 relative'
                                    : 'ring-2 ring-neutral-900 scale-125 z-20 relative'
                                  : 'hover:scale-125 hover:z-10'
                              }`}
                            />

                            {isSelected && (
                              <div
                                className={`absolute bottom-full mb-2 z-30 px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap shadow-lg pointer-events-none border ${
                                  week.weekIdx > 42
                                    ? 'right-0'
                                    : week.weekIdx < 8
                                    ? 'left-0'
                                    : 'left-1/2 -translate-x-1/2'
                                } bg-neutral-900 text-white border-neutral-700`}
                              >
                                <span className="font-semibold">{formatDisplayDate(day.dateStr)}</span>
                                <span className="text-neutral-400"> • </span>
                                <span className="text-[#39d353]">
                                  {count} {unitLabel}{count === 1 ? '' : 's'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 text-xs font-mono pt-1">
          {selectedDateStr ? (
            <div
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded border ${
                isDark
                  ? 'bg-neutral-900/90 border-neutral-800 text-neutral-200'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-800'
              }`}
            >
              <Calendar size={13} className="text-[#39d353] shrink-0" />
              <span>
                <strong className={isDark ? 'text-white' : 'text-black'}>
                  {formatDisplayDate(selectedDateStr)}
                </strong>
                {' — '}
                {selectedCount} {unitLabel}{selectedCount === 1 ? '' : 's'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDateStr(null)}
                aria-label="Clear selected date"
                className="ml-1 text-neutral-500 hover:text-neutral-300 cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <div className={isDark ? 'text-[#8b949e]' : 'text-neutral-500'}>
              Click any square to view its exact date
            </div>
          )}

          <div className={`flex items-center gap-1.5 ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
            <span>Less</span>
            {[0, 1, 2, 4, 6].map((lvl) => (
              <span
                key={lvl}
                className={`w-[12px] h-[12px] rounded-[2px] inline-block ${getGitHubCellColor(lvl)}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    );
  };

  const renderCodeforcesRatingGraph = () => {
    const svgWidth = 760;
    const svgHeight = 250;
    const padLeft = 46;
    const padRight = 14;
    const padTop = 10;
    const padBottom = 38;
    const plotW = svgWidth - padLeft - padRight;
    const plotH = svgHeight - padTop - padBottom;

    const highestContestRating = Math.max(
      ...cfRatingHistory.map(c => c.newRating || 581),
      581
    );

    const minRating = zoomEnabled ? 300 : 250;
    const maxRating = zoomEnabled
      ? Math.max(1400, highestContestRating + 200)
      : Math.max(2050, highestContestRating + 250);

    const yForRating = (r) => {
      const clamped = Math.max(minRating, Math.min(maxRating, r));
      return padTop + plotH - ((clamped - minRating) / (maxRating - minRating)) * plotH;
    };

    const startTime =
      cfRatingHistory.length > 0
        ? cfRatingHistory[0].timestamp
        : new Date(2025, 10, 20).getTime();
    const endTime =
      cfRatingHistory.length > 1
        ? cfRatingHistory[cfRatingHistory.length - 1].timestamp
        : new Date(2026, 3, 5).getTime();

    const xForTime = (t) => {
      const ratio = (t - startTime) / Math.max(1, endTime - startTime);
      const clampedRatio = Math.max(0, Math.min(1, ratio));
      return padLeft + clampedRatio * plotW;
    };

    const xTicks = buildDynamicRatingTicks(startTime, endTime);

    const bands = isDark
      ? [
          { low: minRating, high: 1200, color: "#1f242d" },
          { low: 1200, high: 1400, color: "#0e3a20" },
          { low: 1400, high: 1600, color: "#0e363a" },
          { low: 1600, high: 1900, color: "#22254a" },
          { low: 1900, high: maxRating, color: "#451c45" }
        ]
      : [
          { low: minRating, high: 1200, color: "#cccccc" },
          { low: 1200, high: 1400, color: "#77ff77" },
          { low: 1400, high: 1600, color: "#77ddbb" },
          { low: 1600, high: 1900, color: "#aaaaff" },
          { low: 1900, high: maxRating, color: "#ff88ff" }
        ];

    const yTicks = zoomEnabled ? [400, 600, 800, 1000, 1200] : [1200, 1400, 1600, 1900];

    const points = cfRatingHistory.map((pt, idx) => ({
      ...pt,
      x:
        idx === 0
          ? padLeft + 2
          : idx === cfRatingHistory.length - 1
          ? padLeft + plotW - 2
          : xForTime(pt.timestamp),
      y: yForRating(pt.newRating)
    }));

    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
      <div
        className={`border rounded-md p-3.5 shadow-xs transition-colors overflow-x-auto ${
          isDark
            ? 'bg-[#0d1117] border-neutral-800 text-[#c9d1d9]'
            : 'bg-white border-neutral-300 text-neutral-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1.5 text-xs font-sans gap-2">
          <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>
            Click on the graph to enable the zoom feature.
          </span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className={`border rounded px-2 py-0.5 text-xs focus:outline-none cursor-pointer ${
              isDark
                ? 'bg-neutral-900 border-neutral-700 text-white'
                : 'bg-white border-neutral-300 text-neutral-800'
            }`}
          >
            <option value="rated">Only rated</option>
            <option value="all">All contests</option>
          </select>
        </div>

        <div className="relative min-w-[600px] sm:minw-0">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            onClick={() => setZoomEnabled(prev => !prev)}
            className="w-full h-auto select-none cursor-pointer overflow-visible"
          >
            {bands.map((b, i) => {
              if (b.high <= minRating || b.low >= maxRating) return null;
              const yTop = yForRating(Math.min(maxRating, b.high));
              const yBot = yForRating(Math.max(minRating, b.low));
              return (
                <rect
                  key={i}
                  x={padLeft}
                  y={yTop}
                  width={plotW}
                  height={Math.max(0, yBot - yTop)}
                  fill={b.color}
                />
              );
            })}

            {yTicks.map((val) => {
              const y = yForRating(val);
              return (
                <g key={val}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={padLeft + plotW}
                    y2={y}
                    stroke={isDark ? "#30363d" : "#999999"}
                    strokeWidth="0.7"
                    strokeOpacity="0.6"
                  />
                  <text
                    x={padLeft - 6}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill={isDark ? "#8b949e" : "#4b5563"}
                    fontFamily="sans-serif"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {xTicks.map((tick, idx) => {
              const x = xForTime(tick.time);
              return (
                <g key={idx}>
                  <line
                    x1={x}
                    y1={padTop}
                    x2={x}
                    y2={padTop + plotH}
                    stroke={isDark ? "#30363d" : "#888888"}
                    strokeWidth="0.7"
                    strokeOpacity="0.55"
                  />
                  <text
                    x={x}
                    y={padTop + plotH + 15}
                    textAnchor="middle"
                    fontSize="11"
                    fill={isDark ? "#8b949e" : "#4b5563"}
                    fontFamily="sans-serif"
                  >
                    {tick.labelTop}
                  </text>
                  <text
                    x={x}
                    y={padTop + plotH + 29}
                    textAnchor="middle"
                    fontSize="11"
                    fill={isDark ? "#8b949e" : "#4b5563"}
                    fontFamily="sans-serif"
                  >
                    {tick.labelBottom}
                  </text>
                </g>
              );
            })}

            <rect
              x={padLeft}
              y={padTop}
              width={plotW}
              height={plotH}
              fill="none"
              stroke={isDark ? "#30363d" : "#555555"}
              strokeWidth="1.5"
            />

            <polyline
              fill="none"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="3"
              points={points.map(p => `${p.x},${p.y + 1.5}`).join(' ')}
            />
            <polyline
              fill="none"
              stroke="#eab308"
              strokeWidth="2.4"
              points={polylinePoints}
            />

            {points.map((pt, idx) => {
              const isLast = idx === points.length - 1;
              return (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={isLast ? 4 : 3.5}
                  fill={isDark ? "#161b22" : "#ffffff"}
                  stroke={isLast ? "#ef4444" : "#eab308"}
                  strokeWidth={isLast ? "2.2" : "1.8"}
                  onMouseEnter={() => setHoveredContest(pt)}
                  onMouseLeave={() => setHoveredContest(null)}
                />
              );
            })}

            <g transform={`translate(${padLeft + plotW - 122}, ${padTop + 6})`}>
              <rect
                x="0"
                y="0"
                width="116"
                height="18"
                fill={isDark ? "rgba(22, 27, 34, 0.9)" : "rgba(255,255,255,0.88)"}
                stroke={isDark ? "#30363d" : "#d1d5db"}
                strokeWidth="0.8"
              />
              <rect
                x="4"
                y="3.5"
                width="12"
                height="11"
                fill="#eab308"
                stroke="#ca8a04"
                strokeWidth="0.7"
              />
              <text
                x="20"
                y="13"
                fontSize="11"
                fill={isDark ? "#c9d1d9" : "#374151"}
                fontFamily="sans-serif"
              >
                VigneshSSuvarna
              </text>
            </g>
          </svg>

          {hoveredContest && (
            <div className="absolute top-3 left-14 bg-neutral-900 text-white text-xs font-mono px-2.5 py-1.5 rounded shadow-md pointer-events-none z-20 border border-neutral-700">
              <div className="font-semibold">{hoveredContest.contestName}</div>
              <div className="text-neutral-300">
                Rating: <span className="text-yellow-400 font-bold">{hoveredContest.newRating}</span> ({formatDisplayDate(hoveredContest.dateStr)})
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen font-sans antialiased flex flex-col transition-colors duration-200 ${
        isDark
          ? 'bg-[#111111] text-[#e5e5e5] selection:bg-neutral-700 selection:text-white'
          : 'bg-[#fafafa] text-[#171717] selection:bg-neutral-200 selection:text-black'
      }`}
    >
      {preloaderStep < 4 && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out ${
            isDark ? 'bg-[#111111]' : 'bg-[#fafafa]'
          } ${preloaderStep === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <div
            className={`absolute flex items-center gap-3 transition-all duration-500 ease-in-out ${
              preloaderStep === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <span className={`text-2xl sm:text-4xl animate-pulse ${isDark ? 'text-[#39d353]' : 'text-emerald-600'}`}>
              {"<"}
            </span>
            <h1 className={`text-2xl sm:text-4xl font-mono font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Welcome to my portfolio
            </h1>
            <span className={`text-2xl sm:text-4xl animate-pulse ${isDark ? 'text-[#39d353]' : 'text-emerald-600'}`}>
              {"/>"}
            </span>
          </div>

          <div
            className={`absolute flex justify-center items-center transition-all duration-[800ms] ease-in-out ${
              preloaderStep === 1 
                ? 'opacity-0 scale-50' 
                : preloaderStep === 2
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-[5] blur-md'
            }`}
          >
            <img
              src="/logo-main.png" 
              alt="VS Logo"
              className={`w-48 sm:w-64 object-contain rounded-xl ${
                isDark ? 'shadow-[0_0_50px_rgba(57,211,83,0.15)]' : 'shadow-xl'
              }`}
            />
          </div>
        </div>
      )}

      {/* Top Header */}
      <header
        className={`w-full px-6 sm:px-12 pt-8 sm:pt-10 pb-6 border-b flex justify-between items-center ${
          isDark ? 'border-neutral-800/80' : 'border-neutral-200'
        }`}
      >
        <button
          onClick={() => setCurrentPage('home')}
          className={`font-mono text-base sm:text-lg font-semibold tracking-tight cursor-pointer transition-colors ${
            isDark ? 'text-white hover:text-neutral-300' : 'text-neutral-900 hover:text-neutral-600'
          }`}
        >
          Vignesh S Suvarna
        </button>

        <nav className="flex items-center gap-6 sm:gap-8 text-sm sm:text-base font-mono">
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

          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
            className={`p-2 rounded border cursor-pointer transition-colors ${
              isDark
                ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700'
                : 'border-neutral-200 bg-white text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
            }`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>
      </header>

      {/* Main Content - Full Screen Width */}
      <main className="w-full px-6 sm:px-12 py-10 sm:py-16 flex-1 max-w-7xl mx-auto">
        {currentPage === 'home' && (
          <div className="space-y-10 sm:space-y-12">
            {/* HERO PROFILE SECTION */}
            <section className={`p-6 sm:p-10 rounded-2xl border transition-all shadow-sm ${
              isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <div className="flex flex-col items-center text-center gap-6">
                <img
                  src="/profile.jpg"
                  alt="Vignesh Suvarna"
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 shrink-0 shadow-md ${
                    isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-200 bg-neutral-100'
                  }`}
                />
                <div className="space-y-4 w-full max-w-2xl">
                  <div>
                    <h1 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      Vignesh Suvarna
                    </h1>
                    <p className={`text-sm sm:text-base font-medium mt-1 ${isDark ? 'text-[#39d353]' : 'text-emerald-700'}`}>
                      B.E. Computer Science & Engineering @ Atria Institute of Technology
                    </p>
                  </div>
                  <p className={`text-sm sm:text-lg leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    Full-stack software architect & applied AI builder focused on backend scalability, asynchronous processing, and low-latency systems.
                  </p>
                  <div className="pt-2 flex justify-center">
                    <a
                      href="/resume.pdf"
                      download
                      className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono px-4 py-2.5 rounded-lg border font-medium transition-colors ${
                        isDark
                          ? 'border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white'
                          : 'border-neutral-300 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 hover:text-black'
                      }`}
                    >
                      <Download size={16} /> Download Resume
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* BOX 1: BACKGROUND */}
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all shadow-sm ${
              isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={20} className={isDark ? 'text-[#39d353]' : 'text-emerald-600'} />
                <h2 className={`text-sm sm:text-base font-mono uppercase tracking-wider font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Background
                </h2>
              </div>
              <ul className={`space-y-3 text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                <li className="flex items-start gap-3">
                  <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-[#39d353]' : 'bg-emerald-600'}`} />
                  <span>I am a 3rd-year Computer Science & Engineering undergraduate.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-[#39d353]' : 'bg-emerald-600'}`} />
                  <span>Currently working on full-stack web architectures and applied AI systems, focusing on backend scalability, asynchronous processing, and intelligent document retrieval.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-[#39d353]' : 'bg-emerald-600'}`} />
                  <span>Driven by clean system design, I enjoy translating complex real-world problems into reliable, low-latency, and production-ready software</span>
                </li>
              </ul>
            </div>

            {/* BOX 2: AREAS OF EXPLORATION */}
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all shadow-sm ${
              isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Compass size={20} className={isDark ? 'text-[#39d353]' : 'text-emerald-600'} />
                <h2 className={`text-sm sm:text-base font-mono uppercase tracking-wider font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Areas of Exploration
                </h2>
              </div>
              <ul className={`space-y-3 text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                <li className="flex items-start gap-3">
                  <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-[#39d353]' : 'bg-emerald-600'}`} />
                  <span><strong className={isDark ? 'text-white' : 'text-neutral-900'}>Competitive Programming:</strong> I actively practice algorithmic problem-solving on Codeforces, primarily writing solutions in C++ and Python.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-[#39d353]' : 'bg-emerald-600'}`} />
                  <span><strong className={isDark ? 'text-white' : 'text-neutral-900'}>AI Architecture & Full-Stack Systems:</strong> Designing Retrieval-Augmented Generation (RAG) pipelines, working with vector embeddings, and deploying scalable backend infrastructure.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-[#39d353]' : 'bg-emerald-600'}`} />
                  <span><strong className={isDark ? 'text-white' : 'text-neutral-900'}>Beyond Coding:</strong> Exploring new AI capabilities, building accessible applications, and unwinding with video games.</span>
                </li>
              </ul>
            </div>

            {/* BOX 3: EXPERIENCE & ONGOING WORK */}
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all shadow-sm ${
              isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <div className="flex items-center gap-2 mb-6">
                <Code2 size={20} className={isDark ? 'text-[#39d353]' : 'text-emerald-600'} />
                <h2 className={`text-sm sm:text-base font-mono uppercase tracking-wider font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Ongoing Work
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experienceData.map((exp) => {
                  const isSama = exp.organization.includes("Sama Foundation");
                  const isCit = exp.organization.includes("Dr. S. R. Chandrasekhar Institute of Speech and Hearing");
                  return (
                    <div
                      key={exp.id}
                      onClick={() => {
                        setPreviousPage('home'); 
                        if (isSama) setCurrentPage('sama-foundation');
                        if (isCit) setCurrentPage('cit-hearingaid');
                      }}
                      className={`p-6 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                        isDark 
                          ? 'bg-neutral-900/60 border-neutral-800 hover:border-[#39d353]' 
                          : 'bg-neutral-50 border-neutral-200 hover:border-emerald-600'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className={`font-semibold text-lg group-hover:text-[#39d353] transition-colors ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                            {exp.organization}
                          </h3>
                          <ArrowUpRight size={18} className="text-neutral-500 group-hover:text-[#39d353] shrink-0 transition-colors" />
                        </div>
                        <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-[#39d353] inline-block mb-3">
                          {exp.role}
                        </span>
                        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                          {exp.description}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-neutral-800/40 text-xs sm:text-sm font-mono text-[#39d353] flex items-center justify-between">
                        <span>View {exp.projectTitle}</span>
                        <span>→</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr className={isDark ? 'border-neutral-800/80' : 'border-neutral-200'} />

            {/* Coding Activity Section */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h2 className={`text-xs sm:text-sm font-mono uppercase tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Coding Activity
                </h2>
                <div className="flex gap-4 text-xs sm:text-sm font-mono">
                  <button
                    onClick={() => setActiveHeatmap('github')}
                    className={`cursor-pointer ${
                      activeHeatmap === 'github'
                        ? isDark ? 'text-white underline underline-offset-4' : 'text-neutral-900 underline underline-offset-4'
                        : isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    github
                  </button>
                  <button
                    onClick={() => setActiveHeatmap('codeforces')}
                    className={`cursor-pointer ${
                      activeHeatmap === 'codeforces'
                        ? isDark ? 'text-white underline underline-offset-4' : 'text-neutral-900 underline underline-offset-4'
                        : isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    codeforces
                  </button>
                </div>
              </div>

              <div className={`border rounded p-6 ${isDark ? 'border-neutral-800 bg-[#0d1117] text-[#c9d1d9]' : 'border-neutral-200 bg-white text-neutral-800'}`}>
                {activeHeatmap === 'github' ? (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm mb-2 font-mono gap-1">
                      <a href="https://github.com/VigneshSSuvarna" target="_blank" rel="noreferrer" className={`hover:underline ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                        github.com/VigneshSSuvarna
                      </a>
                      <span className={isDark ? 'text-[#8b949e]' : 'text-neutral-500'}>
                        {ghTotal > 0 ? `${ghTotal} contributions • ` : ''}up to {formatDisplayDate(toLocalDateKey(new Date()))}
                      </span>
                    </div>
                    {renderMainHeatmap()}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm mb-2 font-mono gap-1">
                      <a href="https://codeforces.com/profile/VigneshSSuvarna" target="_blank" rel="noreferrer" className={`hover:underline ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                        codeforces.com/profile/VigneshSSuvarna
                      </a>
                      <span className={isDark ? 'text-[#8b949e]' : 'text-neutral-500'}>
                        active up to {formatDisplayDate(toLocalDateKey(new Date()))}
                      </span>
                    </div>

                    {renderMainHeatmap()}

                    <div className={`flex flex-wrap justify-between items-center gap-4 pt-4 mt-4 border-t text-sm font-mono ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                      <div className="flex gap-6">
                        <div>
                          <span className="text-neutral-500">solved: </span>
                          <span className={isDark ? 'text-white' : 'text-neutral-900'}>{cfDetailedStats.solvedAllTime}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">rating: </span>
                          <span className={isDark ? 'text-white' : 'text-neutral-900'}>{cfDetailedStats.rating}</span>
                        </div>
                      </div>
                      <button onClick={() => setShowAnalyticsModal(true)} className={`underline underline-offset-4 cursor-pointer ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>
                        detailed stats →
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>

            <hr className={isDark ? 'border-neutral-800/80' : 'border-neutral-200'} />

            {/* Technical Skills Section */}
            <section className="space-y-4">
              <h2 className={`text-xs sm:text-sm font-mono uppercase tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Technical Skills
              </h2>
              <div className={`divide-y border-t border-b text-sm sm:text-base ${isDark ? 'divide-neutral-800/70 border-neutral-800' : 'divide-neutral-200 border-neutral-200'}`}>
                {skillsData.map((group) => (
                  <div key={group.category} className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                    <span className="text-neutral-500 font-mono text-sm sm:w-40 shrink-0">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span key={skill} className={`text-xs sm:text-sm font-mono border px-3 py-1 rounded-md ${isDark ? 'text-neutral-300 bg-neutral-900/90 border-neutral-800' : 'text-neutral-700 bg-neutral-100 border-neutral-200'}`}>
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Projects
                </h1>
                <p className={`text-sm sm:text-base mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Selected full-stack applications, AI systems, and tools I've built.
                </p>
              </div>

              {/* NEW: Search Bar */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full md:w-64 transition-colors ${
                isDark ? 'bg-neutral-900 border-neutral-800 focus-within:border-[#39d353]' : 'bg-white border-neutral-200 focus-within:border-emerald-600'
              }`}>
                <Search size={16} className={isDark ? 'text-neutral-500' : 'text-neutral-400'} />
                <input 
                  type="text"
                  placeholder="Search tech stack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent border-none outline-none text-sm w-full font-mono ${isDark ? 'text-white placeholder-neutral-600' : 'text-neutral-900 placeholder-neutral-400'}`}
                />
              </div>
            </div>

            {/* NEW: Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {projectCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setProjectFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors border cursor-pointer ${
                    projectFilter === cat 
                      ? (isDark ? 'bg-[#39d353]/10 border-[#39d353] text-[#39d353]' : 'bg-emerald-500/10 border-emerald-600 text-emerald-700')
                      : (isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:text-black')
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filtered Projects Map */}
            <div className="flex flex-col gap-6">
              {filteredProjects.length === 0 ? (
                <div className={`p-8 text-center font-mono text-sm border rounded-xl border-dashed ${isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-300 text-neutral-400'}`}>
                  No projects found matching your criteria.
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => {
                      if (project.pageKey) {
                        setPreviousPage('projects');
                        setCurrentPage(project.pageKey);
                      }
                    }}
                    className={`p-6 sm:p-8 rounded-xl border transition-all flex flex-col sm:flex-row sm:justify-between gap-4 shadow-sm cursor-pointer group ${
                      isDark
                        ? 'bg-neutral-900/40 border-[#39d353] hover:shadow-[0_0_15px_rgba(57,211,83,0.15)]'
                        : 'bg-white border-emerald-600 hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-3 max-w-2xl">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className={`text-lg sm:text-xl font-semibold group-hover:text-[#39d353] transition-colors ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          {project.title}
                        </h2>
                        {/* NEW: Live Status Badge injected next to category */}
                        <LiveStatusBadge url={project.demo} isDark={isDark} />
                      </div>
                      <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.techStack.map((tech) => (
                          <span key={tech} className={`text-xs sm:text-sm font-mono border px-2.5 py-1 rounded ${isDark ? 'text-neutral-400 bg-neutral-900 border-neutral-800' : 'text-neutral-700 bg-neutral-100 border-neutral-200'}`}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-start sm:items-end justify-start gap-3 text-xs sm:text-sm font-mono shrink-0 pt-1">
                      <a href={project.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className={`flex items-center gap-1.5 underline underline-offset-4 ${isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'}`}>
                        source <ArrowUpRight size={15} />
                      </a>
                      {project.demo !== "#" && (
                        <a href={project.demo} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className={`flex items-center gap-1.5 underline underline-offset-4 ${isDark ? 'text-[#39d353] hover:text-white' : 'text-emerald-600 hover:text-emerald-900'}`}>
                          live demo <ArrowUpRight size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* DEDICATED SUB-PAGE FOR SAMA FOUNDATION */}
        {currentPage === 'sama-foundation' && (
          <div className="space-y-8">
            <div>
              <button
                onClick={() => setCurrentPage(previousPage)}
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono mb-6 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:text-black hover:bg-neutral-200'
                }`}
              >
                <ArrowLeft size={16} /> Back to {previousPage === 'home' ? 'About' : 'Projects'}
              </button>
              <h1 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Nayi Disha Care & Support Platform
              </h1>
              <p className={`text-xs sm:text-sm font-mono mt-1 ${isDark ? 'text-[#39d353]' : 'text-emerald-700'}`}>
                Sama Foundation • Full-Stack Developer Project
              </p>
            </div>

            <div className={`space-y-6 text-sm sm:text-base leading-relaxed p-6 sm:p-10 rounded-2xl border ${
              isDark ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
            }`}>
              <div>
                <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  1. Abstract
                </h3>
                <p>
                  Nayi Disha is a comprehensive full-stack care and support platform built to connect families, caretakers, health professionals, administrators, and connected IoT hardware through a unified ecosystem. By combining modern web technologies with secure database management and micro-controller integration, the platform streamlines care coordination, clinical tracking, and daily routines.
                </p>
              </div>

              <div>
                <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  2. Role-Based Workspace Architecture
                </h3>
                <p className="mb-3">To address the diverse needs of users within special needs care networks, the platform is structured into tailored portals:</p>
                <ul className="space-y-3 list-disc list-inside">
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Parent Workspace:</span> Empowers families with tools like ABC behavioral logging, dynamic child passports, weather-based sensory risk warnings, voice quick-logging, and low-demand mode controls.
                  </li>
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Caretaker Floor:</span> Provides real-time classroom telemetry, morning handover summaries, quick-stamp status broadcasts, and caseload calendar coordination.
                  </li>
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Admin Command Center:</span> Offers robust administrative oversight including clinical triage, IEP routine architectures, IoT device fleet tracking, global safety kill-switches, and verified user overrides.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  3. Core Technical & Hardware Integration
                </h3>
                <p className="mb-3">The system leverages a robust, production-ready technology stack to ensure secure, low-latency performance:</p>
                <ul className="space-y-3 list-disc list-inside">
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Full-Stack Implementation:</span> Built using React 18, Vite, and Tailwind CSS for a responsive frontend, supported by a Node.js, Express, and Aiven PostgreSQL backend.
                  </li>
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>ESP32 Wearable Connectivity:</span> Integrates real-time hardware telemetry from ESP32-based band hardware to mirror sensory alerts and status updates.
                  </li>
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Intelligent Automation:</span> Incorporates automated database connection pooling, auto-recovering database heartbeats, and environment-aware data management.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Conclusion
                </h3>
                <p>
                  Nayi Disha bridges critical gaps in special needs support by uniting families, caretakers, and hardware into a cohesive, secure, and highly scalable digital platform.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DEDICATED SUB-PAGE FOR CIT HEARING AID */}
        {currentPage === 'cit-hearingaid' && (
          <div className="space-y-8">
            <div>
              <button
                onClick={() => setCurrentPage(previousPage)}
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono mb-6 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:text-black hover:bg-neutral-200'
                }`}
              >
                <ArrowLeft size={16} /> Back to {previousPage === 'home' ? 'About' : 'Projects'}
              </button>
              <h1 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                HearingAid Pro
              </h1>
              <p className={`text-xs sm:text-sm font-mono mt-1 ${isDark ? 'text-[#39d353]' : 'text-emerald-700'}`}>
                Dr. S. R. Chandrasekhar Institute of Speech and Hearing • Software Developer Project
              </p>
            </div>

            <div className={`space-y-6 text-sm sm:text-base leading-relaxed p-6 sm:p-10 rounded-2xl border ${
              isDark ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
            }`}>
              <div>
                <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  1. Abstract
                </h3>
                <p>
                  Hearing Aid Pro is a native Android application designed to transform mobile devices into real-time, customizable acoustic assistance tools. By implementing a custom digital signal processing (DSP) architecture, the system delivers high-fidelity sound amplification and personal sound profiling without relying on dedicated hardware.
                </p>
              </div>

              <div>
                <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  2. The Real-Time Audio Challenge
                </h3>
                <p>
                  Processing live audio introduces strict performance constraints regarding latency and feedback control. To ensure a seamless user experience, the system utilizes low-level native audio buffers and optimized processing threads, minimizing delay between environmental input and headphone output.
                </p>
              </div>

              <div>
                <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  3. Core DSP & Signal Pipeline
                </h3>
                <p className="mb-3">The application relies on an advanced software-driven signal chain to shape and clean audio streams:</p>
                <ul className="space-y-3 list-disc list-inside">
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Spectral Noise Suppression:</span> Implements frequency-domain filtering to dynamically reduce background ambient noise and adapt to room acoustics.
                  </li>
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Parametric Equalization:</span> Features configurable biquad filter bands for precise frequency shaping, paired with automated headroom scaling to prevent audio clipping.
                  </li>
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Live Visualizations:</span> Drives real-time time-domain waveforms and frequency spectrum analyzers via custom canvas rendering and optimized FFT processing.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Conclusion
                </h3>
                <p>
                  This project demonstrates how commodity mobile hardware can be leveraged to build sophisticated, low-latency audio accessibility tools entirely through software optimization.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* DEDICATED SUB-PAGE FOR AI-PDF-CHATBOX */}
        {currentPage === 'project-ai-chatbox' && (
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
        )}

        {/* DEDICATED SUB-PAGE FOR HIRESPHERE & PLACEOS */}
        {currentPage === 'project-hiresphere' && (
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
                HireSphere & PlaceOS
              </h1>
              <p className={`text-xs sm:text-sm font-mono mt-1 ${isDark ? 'text-[#39d353]' : 'text-emerald-700'}`}>
                Full-Stack Web App • University Placements Platform
              </p>
            </div>

            <div className={`space-y-6 text-sm sm:text-base leading-relaxed p-6 sm:p-10 rounded-2xl border ${
              isDark ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
            }`}>
              <div>
                <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  1. Abstract
                </h3>
                <p>
                  HireSphere and PlaceOS form a comprehensive full-stack ecosystem designed to modernize and streamline university campus placements. The platforms replace fragmented recruitment processes with a unified digital workspace, centralizing job applications, interview tracking, and administrative oversight into a single, cohesive environment.
                </p>
              </div>

              <div>
                <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  2. Role-Based Workspace Architecture
                </h3>
                <p className="mb-3">The system is divided into distinct operational workflows tailored to different stakeholders:</p>
                <ul className="space-y-3 list-disc list-inside">
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Student Workspace:</span> Provides an interactive dashboard for students to build profiles, track coding practice progress, monitor ongoing job applications, and prepare for upcoming corporate drives.
                  </li>
                  <li>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Coordinator Workspace:</span> Equips university placement officers with robust tools to manage company profiles, schedule recruitment drives, broadcast updates, and analyze cohort placement metrics.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Conclusion
                </h3>
                <p>
                  By creating a transparent and highly organized digital bridge between students and administrators, HireSphere and PlaceOS significantly reduce friction in the hiring pipeline, driving better placement outcomes and a smoother campus recruitment experience.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DEDICATED SUB-PAGE FOR HERMES */}
        {currentPage === 'project-hermes' && (
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
        )}
      </main>

      {/* Footer - Full Screen Width */}
      <footer
        className={`w-full px-6 sm:px-12 py-6 sm:py-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm max-w-7xl mx-auto ${
          isDark ? 'border-neutral-800/80 text-[#8a8a8a]' : 'border-neutral-200 text-neutral-500'
        }`}
      >
        <div className="text-center sm:text-left flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <span>© {new Date().getFullYear()} Vignesh Suvarna. Built with React & Vite.</span>
          
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs border ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
                : 'bg-neutral-100 border-neutral-200 text-neutral-700'
            }`}
            title="Total profile visitors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#39d353]">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="font-semibold text-[#39d353]">{visitorCount}</span>
            <span>visitors</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/VigneshSSuvarna"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={`transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          <a
            href="https://codeforces.com/profile/VigneshSSuvarna"
            target="_blank"
            rel="noreferrer"
            aria-label="Codeforces"
            className={`transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="9" width="4.5" height="12" rx="1" />
              <rect x="9.75" y="4" width="4.5" height="17" rx="1" />
              <rect x="16.5" y="12" width="4.5" height="9" rx="1" />
            </svg>
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className={`transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>
        </div>
      </footer>

      {/* CTRL+K HINT (Floating bottom right) */}
      <div className="fixed bottom-6 right-6 hidden sm:flex items-center gap-2 pointer-events-none opacity-50 font-mono text-xs z-40">
        <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>console</span>
        <kbd className={`px-2 py-1 rounded border flex items-center gap-1 ${isDark ? 'bg-neutral-900 border-neutral-700 text-neutral-300' : 'bg-white border-neutral-300 text-neutral-600'}`}>
          <Command size={10} /> K
        </kbd>
      </div>

      {/* TERMINAL OVERLAY */}
      {isTerminalOpen && (
        <div 
          className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsTerminalOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl rounded-lg border shadow-2xl overflow-hidden flex flex-col ${
              isDark ? 'bg-[#0d1117] border-neutral-700' : 'bg-[#1e1e1e] border-neutral-600'
            }`}
          >
            {/* Terminal Header */}
            <div className="bg-[#161b22] px-4 py-2 border-b border-neutral-700 flex justify-between items-center select-none">
              <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono">
                <Terminal size={14} />
                <span>vignesh@portfolio:~</span>
              </div>
              <button 
                onClick={() => setIsTerminalOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-4 h-80 overflow-y-auto font-mono text-sm text-neutral-300 flex flex-col gap-1.5" onClick={() => terminalInputRef.current?.focus()}>
              {terminalHistory.map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap break-words">
                  {line.type === 'input' ? (
                    <span className="text-[#39d353]">{line.text}</span>
                  ) : (
                    <span className="text-neutral-400">{line.text}</span>
                  )}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input */}
            <form onSubmit={handleTerminalSubmit} className="flex items-center px-4 py-3 bg-[#0d1117] border-t border-neutral-800">
              <span className="text-[#39d353] font-mono text-sm mr-2">{'>'}</span>
              <input 
                ref={terminalInputRef}
                type="text" 
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent text-white font-mono text-sm outline-none"
                spellCheck="false"
                autoComplete="off"
              />
            </form>
          </div>
        </div>
      )}

      {showAnalyticsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setShowAnalyticsModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-lg w-full max-w-4xl p-4 sm:p-6 space-y-4 my-auto max-h-[94vh] overflow-y-auto shadow-2xl transition-colors ${
              isDark ? 'bg-[#141414] border-neutral-800' : 'bg-white border-neutral-300'
            }`}
          >
            <div
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-3 ${
                isDark ? 'border-neutral-800' : 'border-neutral-200'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2
                  className={`text-base font-mono font-semibold ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  codeforces_analytics
                </h2>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded ${
                    isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  @VigneshSSuvarna
                </span>
                <button
                  onClick={syncLiveActivity}
                  title="Sync latest data from Codeforces API"
                  className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded border cursor-pointer transition-colors ${
                    isDark
                      ? 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      : 'border-neutral-300 bg-white text-neutral-600 hover:text-black'
                  }`}
                >
                  <RefreshCw size={11} className={isSyncingCf ? 'animate-spin' : ''} />
                  {isSyncingCf ? 'syncing' : 'live'}
                </button>
              </div>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className={`cursor-pointer p-1 rounded ${
                  isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {renderCodeforcesRatingGraph()}

            <div
              className={`border rounded-md p-4 sm:p-5 shadow-xs space-y-5 transition-colors ${
                isDark ? 'bg-[#0d1117] border-neutral-800 text-[#c9d1d9]' : 'bg-white border-neutral-300 text-neutral-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                {modalSelectedDateStr ? (
                  <div
                    className={`inline-flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded border ${
                      isDark
                        ? 'bg-neutral-900 border-neutral-700 text-white'
                        : 'bg-neutral-100 border-neutral-300 text-neutral-800'
                    }`}
                  >
                    <Calendar size={13} className="text-[#39d353]" />
                    <span>
                      <strong>{formatDisplayDate(modalSelectedDateStr)}</strong> —{' '}
                      {cfSubmissions[modalSelectedDateStr] || 0} submission
                      {(cfSubmissions[modalSelectedDateStr] || 0) === 1 ? '' : 's'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalSelectedDateStr(null)}
                      className="text-neutral-400 hover:text-white cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <span className={`text-xs font-sans ${isDark ? 'text-neutral-400' : 'text-neutral-400'}`}>
                    Click any box to inspect date
                  </span>
                )}

                <select
                  value={modalYearFilter}
                  onChange={(e) => {
                    setModalYearFilter(e.target.value);
                    setModalSelectedDateStr(null);
                  }}
                  className={`border rounded px-2.5 py-1 text-xs focus:outline-none cursor-pointer ${
                    isDark
                      ? 'bg-neutral-900 border-neutral-700 text-white'
                      : 'bg-white border-neutral-300 text-neutral-800'
                  }`}
                >
                  <option value="rolling">Choose year</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>

              <div className="overflow-x-auto overflow-y-hidden py-1">
                <div className="inline-block min-w-full">
                  <div className="flex gap-[2px] pl-8 mb-1.5 h-4 items-end">
                    {modalCalendarWeeks.map((week) => (
                      <div key={week.weekIdx} className="w-[11.5px] relative shrink-0">
                        {week.monthLabel && (
                          <span
                            className={`absolute bottom-0 left-0 text-[11px] font-sans leading-none select-none ${
                              isDark ? 'text-[#8b949e]' : 'text-neutral-500'
                            }`}
                          >
                            {week.monthLabel}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 items-start">
                    <div
                      className={`flex flex-col gap-[2px] text-[11px] font-sans w-6 shrink-0 select-none ${
                        isDark ? 'text-[#8b949e]' : 'text-neutral-500'
                      }`}
                    >
                      <span className="h-[11.5px] leading-[11.5px] opacity-0">Sun</span>
                      <span className="h-[11.5px] leading-[11.5px]">Mon</span>
                      <span className="h-[11.5px] leading-[11.5px] opacity-0">Tue</span>
                      <span className="h-[11.5px] leading-[11.5px]">Wed</span>
                      <span className="h-[11.5px] leading-[11.5px] opacity-0">Thu</span>
                      <span className="h-[11.5px] leading-[11.5px]">Fri</span>
                      <span className="h-[11.5px] leading-[11.5px] opacity-0">Sat</span>
                    </div>

                    <div className="flex gap-[2px]">
                      {modalCalendarWeeks.map((week) => (
                        <div key={week.weekIdx} className="flex flex-col gap-[2px] w-[11.5px] shrink-0">
                          {week.days.map((day) => {
                            if (day.isPadding) {
                              return (
                                <div
                                  key={day.dateStr}
                                  className="w-[11.5px] h-[11.5px] bg-transparent"
                                />
                              );
                            }

                            const count = cfSubmissions[day.dateStr] || 0;
                            const isSelected = modalSelectedDateStr === day.dateStr;
                            const colorClass = getCfCellColor(count);

                            return (
                              <div key={day.dateStr} className="relative">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setModalSelectedDateStr(prev =>
                                      prev === day.dateStr ? null : day.dateStr
                                    )
                                  }
                                  title={`${formatDisplayDate(day.dateStr)} — ${count} submission${count === 1 ? '' : 's'}`}
                                  className={`block w-[11.5px] h-[11.5px] rounded-[1px] cursor-pointer transition-transform duration-100 focus:outline-none ${colorClass} ${
                                    isSelected
                                      ? isDark
                                        ? 'ring-2 ring-white scale-125 z-20 relative'
                                        : 'ring-2 ring-neutral-900 scale-125 z-20 relative'
                                      : 'hover:scale-125 hover:z-10'
                                  }`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-8 pt-2 pl-2 font-sans">
                <div>
                  <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {cfDetailedStats.solvedAllTime} problems
                  </div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                    solved for all time
                  </div>
                </div>

                <div>
                  <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {cfDetailedStats.solvedLastYear} problems
                  </div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                    solved for the last year
                  </div>
                </div>

                <div>
                  <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {cfDetailedStats.solvedLastMonth} problems
                  </div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                    solved for the last month
                  </div>
                </div>

                <div>
                  <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {cfDetailedStats.streakMax} days
                  </div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                    in a row max.
                  </div>
                </div>

                <div>
                  <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {cfDetailedStats.streakLastYear} days
                  </div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                    in a row for the last year
                  </div>
                </div>

                <div>
                  <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {cfDetailedStats.streakLastMonth} days
                  </div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                    in a row for the last month
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 pt-1 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>Focus Areas:</span>
                {(cfDetailedStats.tags || ["Greedy", "Math", "Brute Force", "Implementation", "Sorting"]).map(tag => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 border rounded ${
                      isDark
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
                        : 'bg-white border-neutral-300 text-neutral-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
                Primary Languages:{' '}
                <span className={isDark ? 'text-white font-semibold' : 'text-black font-semibold'}>
                  {cfDetailedStats.languages || "C++, Python"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;