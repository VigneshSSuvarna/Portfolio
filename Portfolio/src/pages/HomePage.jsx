import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  X, ArrowUpRight, Download, Calendar, 
  Terminal, Compass, Code2, Award, Eye, Copy, Check 
} from 'lucide-react';
import { experienceData, achievementsData, skillsData, INITIAL_CF_SUBMISSIONS, personalInfo } from '../data/portfolioData';
import { formatDisplayDate, toLocalDateKey, computeMaxStreak, buildCalendarWeeks } from '../utils/calendarUtils';
import { CodeforcesModal } from '../components/CodeforcesModal';

export default function HomePage({ isDark, setCurrentPage, setPreviousPage, setShowResumeModal }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeHeatmap, setActiveHeatmap] = useState('github');
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [isSyncingCf, setIsSyncingCf] = useState(false);

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
            rating: personalInfo.cfFallbackRating,
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
        rating: personalInfo.cfFallbackRating,
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
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const syncLiveActivity = useCallback(async () => {
    const ghHandle = personalInfo.githubHandle;
    const cfHandle = personalInfo.codeforcesHandle;
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

    fetch(`https://github-contributions-api.jogruber.de/v4/${ghHandle}?y=last`)
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
        fetch(`https://codeforces.com/api/user.info?handles=${cfHandle}`).then(r => r.json()),
        fetch(`https://codeforces.com/api/user.status?handle=${cfHandle}&from=1&count=5000`).then(r => r.json()),
        fetch(`https://codeforces.com/api/user.rating?handle=${cfHandle}`).then(r => r.json())
      ]);

      let latestRating = personalInfo.cfFallbackRating;
      if (
        infoRes.status === 'fulfilled' &&
        infoRes.value?.status === 'OK' &&
        infoRes.value.result?.length > 0
      ) {
        latestRating = infoRes.value.result[0].rating || personalInfo.cfFallbackRating;
      }

      let firstAcceptedTimestamp = personalInfo.cfBaselineDate;

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
                  newRating: rawContests[0].oldRating || personalInfo.cfFallbackRating
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

  const getGitHubCellColor = (count) => {
    if (count <= 0) return isDark ? "bg-[#161b22]" : "bg-[#ebedf0]";
    if (count === 1) return isDark ? "bg-[#0e4429]" : "bg-[#9be9a8]";
    if (count <= 3) return isDark ? "bg-[#006d32]" : "bg-[#40c463]";
    if (count <= 5) return isDark ? "bg-[#26a641]" : "bg-[#30a14e]";
    return isDark ? "bg-[#39d353]" : "bg-[#216e39]";
  };

  const activeDataMap = activeHeatmap === 'github' ? ghContributions : cfSubmissions;
  const unitLabel = activeHeatmap === 'github' ? 'contribution' : 'submission';
  const selectedCount = selectedDateStr ? (activeDataMap[selectedDateStr] || 0) : 0;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* HERO PROFILE SECTION */}
      <section className={`p-6 sm:p-10 rounded-2xl border transition-all shadow-sm ${
        isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
      }`}>
        <div className="flex flex-col items-center text-center gap-6">
          <img
            src={personalInfo.profilePicture}
            alt={personalInfo.name}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 shrink-0 shadow-md ${
              isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-200 bg-neutral-100'
            }`}
          />
          <div className="space-y-4 w-full max-w-2xl">
            <div>
              <h1 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {personalInfo.name}
              </h1>
              <p className={`text-sm sm:text-base font-medium mt-1 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                {personalInfo.role} @ {personalInfo.university}
              </p>
            </div>
            <p className={`text-sm sm:text-lg leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
              {personalInfo.shortBio}
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowResumeModal(true)}
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono px-4 py-2.5 rounded-lg border font-medium cursor-pointer transition-colors ${
                  isDark
                    ? 'border-white bg-white text-black hover:bg-neutral-200'
                    : 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                <Eye size={16} /> Preview Resume
              </button>

              <a
                href={personalInfo.resumePath}
                download
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono px-4 py-2.5 rounded-lg border font-medium transition-colors ${
                  isDark
                    ? 'border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white'
                    : 'border-neutral-300 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                <Download size={16} /> Download Resume
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono px-4 py-2.5 rounded-lg border font-medium cursor-pointer transition-colors ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 hover:text-white'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:text-black'
                }`}
              >
                {copiedEmail ? <Check size={16} className={isDark ? 'text-white' : 'text-black'} /> : <Copy size={16} />}
                {copiedEmail ? 'Copied Email!' : personalInfo.email}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BOX 1: BACKGROUND */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all shadow-sm ${
        isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-white border-neutral-200'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Terminal size={20} className={isDark ? 'text-white' : 'text-neutral-900'} />
          <h2 className={`text-sm sm:text-base font-mono uppercase tracking-wider font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Background
          </h2>
        </div>
        <ul className={`space-y-3 text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
          <li className="flex items-start gap-3">
            <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-white' : 'bg-neutral-900'}`} />
            <span>I am a 3rd-year Computer Science & Engineering undergraduate.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-white' : 'bg-neutral-900'}`} />
            <span>Currently working on full-stack web architectures and applied AI systems, focusing on backend scalability, asynchronous processing, and intelligent document retrieval.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-white' : 'bg-neutral-900'}`} />
            <span>Driven by clean system design, I enjoy translating complex real-world problems into reliable, low-latency, and production-ready software.</span>
          </li>
        </ul>
      </div>

      {/* BOX 2: AREAS OF EXPLORATION */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all shadow-sm ${
        isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-white border-neutral-200'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Compass size={20} className={isDark ? 'text-white' : 'text-neutral-900'} />
          <h2 className={`text-sm sm:text-base font-mono uppercase tracking-wider font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Areas of Exploration
          </h2>
        </div>
        <ul className={`space-y-3 text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
          <li className="flex items-start gap-3">
            <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-white' : 'bg-neutral-900'}`} />
            <span><strong className={isDark ? 'text-white' : 'text-neutral-900'}>Competitive Programming:</strong> I actively practice algorithmic problem-solving on Codeforces, primarily writing solutions in C++ and Python.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-white' : 'bg-neutral-900'}`} />
            <span><strong className={isDark ? 'text-white' : 'text-neutral-900'}>AI Architecture & Full-Stack Systems:</strong> Designing Retrieval-Augmented Generation (RAG) pipelines, working with vector embeddings, and deploying scalable backend infrastructure.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-white' : 'bg-neutral-900'}`} />
            <span><strong className={isDark ? 'text-white' : 'text-neutral-900'}>Beyond Coding:</strong> Exploring new AI capabilities, building accessible applications, and unwinding with video games.</span>
          </li>
        </ul>
      </div>

      {/* BOX 3: EXPERIENCE & ONGOING WORK */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all shadow-sm ${
        isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-white border-neutral-200'
      }`}>
        <div className="flex items-center gap-2 mb-6">
          <Code2 size={20} className={isDark ? 'text-white' : 'text-neutral-900'} />
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
                    ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-500' 
                    : 'bg-neutral-50 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className={`font-semibold text-lg group-hover:underline underline-offset-4 transition-colors ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {exp.organization}
                    </h3>
                    <ArrowUpRight size={18} className={`text-neutral-500 shrink-0 transition-colors ${isDark ? 'group-hover:text-white' : 'group-hover:text-black'}`} />
                  </div>
                  <span className={`text-xs font-mono px-2.5 py-1 rounded inline-block mb-3 ${
                    isDark ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-200 text-neutral-800'
                  }`}>
                    {exp.role}
                  </span>
                  <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {exp.description}
                  </p>
                </div>
                <div className={`mt-6 pt-4 border-t border-neutral-800/40 text-xs sm:text-sm font-mono flex items-center justify-between ${
                  isDark ? 'text-neutral-200 group-hover:text-white' : 'text-neutral-800 group-hover:text-black'
                }`}>
                  <span>View {exp.projectTitle}</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOX 4: LEADERSHIP & ACHIEVEMENTS */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all shadow-sm ${
        isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-white border-neutral-200'
      }`}>
        <div className="flex items-center gap-2 mb-6">
          <Award size={20} className={isDark ? 'text-white' : 'text-neutral-900'} />
          <h2 className={`text-sm sm:text-base font-mono uppercase tracking-wider font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Leadership & Highlights
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievementsData.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-xl border ${
                isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className={`font-semibold text-sm sm:text-base mb-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {item.title}
              </div>
              <div className={`text-xs font-mono mb-2.5 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {item.subtitle}
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {item.description}
              </p>
            </div>
          ))}
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
                <a href={`https://github.com/${personalInfo.githubHandle}`} target="_blank" rel="noreferrer" className={`hover:underline ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                  github.com/{personalInfo.githubHandle}
                </a>
                <span className={isDark ? 'text-[#8b949e]' : 'text-neutral-500'}>
                  {ghTotal > 0 ? `${ghTotal} contributions • ` : ''}up to {formatDisplayDate(toLocalDateKey(new Date()))}
                </span>
              </div>

              <div className="space-y-3">
                <div className={`overflow-x-auto overflow-y-hidden pb-3 border-b ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                  <div className="pt-6 w-full flex justify-center">
                    <div className="flex flex-col">
                      <div className="flex gap-[3px] pl-8 mb-1.5 h-4 items-end">
                        {mainCalendarWeeks.map((week) => (
                          <div key={week.weekIdx} className="w-[13px] relative shrink-0">
                            {week.monthLabel && (
                              <span className={`absolute bottom-0 left-0 text-[11px] font-mono leading-none select-none ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                                {week.monthLabel}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 items-start">
                        <div className={`flex flex-col gap-[3px] text-[11px] font-mono w-6 shrink-0 select-none ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
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
                                      onClick={() => setSelectedDateStr(prev => (prev === day.dateStr ? null : day.dateStr))}
                                      aria-label={`${formatDisplayDate(day.dateStr)}: ${count} ${unitLabel}${count === 1 ? '' : 's'}`}
                                      title={`${formatDisplayDate(day.dateStr)} — ${count} ${unitLabel}${count === 1 ? '' : 's'}`}
                                      className={`block w-[13px] h-[13px] rounded-[3px] cursor-pointer transition-transform duration-150 focus:outline-none ${colorClass} ${
                                        isSelected
                                          ? isDark ? 'ring-2 ring-white scale-125 z-20 relative' : 'ring-2 ring-neutral-900 scale-125 z-20 relative'
                                          : 'hover:scale-125 hover:z-10'
                                      }`}
                                    />
                                    {isSelected && (
                                      <div className="absolute bottom-full mb-2 z-30 px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap shadow-lg pointer-events-none border bg-neutral-900 text-white border-neutral-700">
                                        <span className="font-semibold">{formatDisplayDate(day.dateStr)}</span>
                                        <span className="text-neutral-400"> • </span>
                                        <span className="text-white font-semibold">{count} {unitLabel}{count === 1 ? '' : 's'}</span>
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
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded border ${isDark ? 'bg-neutral-900/90 border-neutral-800 text-neutral-200' : 'bg-neutral-100 border-neutral-200 text-neutral-800'}`}>
                      <Calendar size={13} className={isDark ? 'text-white shrink-0' : 'text-neutral-900 shrink-0'} />
                      <span>
                        <strong className={isDark ? 'text-white' : 'text-black'}>{formatDisplayDate(selectedDateStr)}</strong>
                        {' — '}
                        {selectedCount} {unitLabel}{selectedCount === 1 ? '' : 's'}
                      </span>
                      <button type="button" onClick={() => setSelectedDateStr(null)} className="ml-1 text-neutral-500 hover:text-neutral-300 cursor-pointer">
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
                      <span key={lvl} className={`w-[12px] h-[12px] rounded-[2px] inline-block ${getGitHubCellColor(lvl)}`} />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm mb-2 font-mono gap-1">
                <a href={`https://codeforces.com/profile/${personalInfo.codeforcesHandle}`} target="_blank" rel="noreferrer" className={`hover:underline ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                  codeforces.com/profile/{personalInfo.codeforcesHandle}
                </a>
                <span className={isDark ? 'text-[#8b949e]' : 'text-neutral-500'}>
                  active up to {formatDisplayDate(toLocalDateKey(new Date()))}
                </span>
              </div>

              <div className="space-y-3">
                <div className={`overflow-x-auto overflow-y-hidden pb-3 border-b ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                  <div className="pt-6 w-full flex justify-center">
                    <div className="flex flex-col">
                      <div className="flex gap-[3px] pl-8 mb-1.5 h-4 items-end">
                        {mainCalendarWeeks.map((week) => (
                          <div key={week.weekIdx} className="w-[13px] relative shrink-0">
                            {week.monthLabel && (
                              <span className={`absolute bottom-0 left-0 text-[11px] font-mono leading-none select-none ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
                                {week.monthLabel}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 items-start">
                        <div className={`flex flex-col gap-[3px] text-[11px] font-mono w-6 shrink-0 select-none ${isDark ? 'text-[#8b949e]' : 'text-neutral-500'}`}>
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
                                const count = cfSubmissions[day.dateStr] || 0;
                                const isSelected = selectedDateStr === day.dateStr;
                                const colorClass = getGitHubCellColor(count);

                                return (
                                  <div key={day.dateStr} className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedDateStr(prev => (prev === day.dateStr ? null : day.dateStr))}
                                      aria-label={`${formatDisplayDate(day.dateStr)}: ${count} submission${count === 1 ? '' : 's'}`}
                                      title={`${formatDisplayDate(day.dateStr)} — ${count} submission${count === 1 ? '' : 's'}`}
                                      className={`block w-[13px] h-[13px] rounded-[3px] cursor-pointer transition-transform duration-150 focus:outline-none ${colorClass} ${
                                        isSelected ? 'ring-2 ring-white scale-125 z-20 relative' : 'hover:scale-125 hover:z-10'
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
                </div>
              </div>

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

      {/* Codeforces Analytics Modal */}
      <CodeforcesModal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
        isDark={isDark}
        cfRatingHistory={cfRatingHistory}
        cfSubmissions={cfSubmissions}
        cfDetailedStats={cfDetailedStats}
        isSyncingCf={isSyncingCf}
        syncLiveActivity={syncLiveActivity}
      />
    </div>
  );
}