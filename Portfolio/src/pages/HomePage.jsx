import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X, ChevronRight, Download, Calendar,
  Eye, Copy, Check
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

  const getHeatmapCellColor = (count) => {
    if (count <= 0) return isDark ? "bg-[#1f1f1f]" : "bg-[#ebedf0]";
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

  const hairline = isDark ? 'border-neutral-800' : 'border-neutral-200';
  const divider = isDark ? 'divide-neutral-800' : 'divide-neutral-200';
  const mutedText = 'text-[#737373]';
  const bodyText = isDark ? 'text-[#a3a3a3]' : 'text-[#525252]';
  const headingText = isDark ? 'text-white' : 'text-black';

  return (
    <div className="space-y-11">
      {/* HERO PROFILE SECTION */}
      <section className="flex flex-col items-center text-center space-y-4">
        <img
          src={personalInfo.profilePicture}
          alt={personalInfo.name}
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border ${
            isDark ? 'border-neutral-800 bg-[#1f1f1f]' : 'border-neutral-200 bg-neutral-100'
          }`}
        />
        <div>
          <h1 className={`text-4xl sm:text-[42px] font-bold tracking-tight ${headingText}`}>
            {personalInfo.name}
          </h1>
          <p className={`text-sm font-mono mt-1.5 ${mutedText}`}>
            {personalInfo.role} · {personalInfo.university}
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm font-mono">
          <button
            type="button"
            onClick={() => setShowResumeModal(true)}
            className={`inline-flex items-center gap-1.5 underline underline-offset-4 cursor-pointer ${headingText}`}
          >
            <Eye size={15} /> Preview Resume
          </button>

          <a
            href={personalInfo.resumePath}
            download
            className={`inline-flex items-center gap-1.5 underline underline-offset-4 ${isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#525252] hover:text-black'}`}
          >
            <Download size={15} /> Download PDF
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            className={`inline-flex items-center gap-1.5 underline underline-offset-4 cursor-pointer ${isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#525252] hover:text-black'}`}
          >
            {copiedEmail ? <Check size={15} className={headingText} /> : <Copy size={15} />}
            {copiedEmail ? 'Copied' : personalInfo.email}
          </button>
        </div>
      </section>

      {/* BACKGROUND */}
      <section className="space-y-4">
        <h2 className={`text-xl sm:text-2xl font-semibold ${headingText}`}>
          Background
        </h2>
        <ul className={`list-disc pl-6 space-y-2.5 text-base sm:text-[17px] leading-relaxed ${bodyText}`}>
          <li>
            I am a 3rd-year Computer Science & Engineering undergraduate.
          </li>
          <li>
            Currently working on full-stack web architectures and applied AI systems, focusing on backend scalability, asynchronous processing, and intelligent document retrieval.
          </li>
          <li>
            Driven by clean system design, I enjoy translating complex real-world problems into reliable, low-latency, and production-ready software.
          </li>
        </ul>
      </section>

      {/* AREAS OF EXPLORATION */}
      <section className="space-y-4">
        <h2 className={`text-xl sm:text-2xl font-semibold ${headingText}`}>
          Areas of Exploration
        </h2>
        <ul className={`list-disc pl-6 space-y-2.5 text-base sm:text-[17px] leading-relaxed ${bodyText}`}>
          <li>
            Competitive Programming. I actively participate in Codeforces contests, primarily writing solutions in C++ and Python.
          </li>
          <li>
            AI Infrastructure & Full-Stack Systems. Designing RAG pipelines, working with vector embeddings, and deploying scalable backend infrastructure.
          </li>
          <li>
            Beyond Coding. Exploring new AI capabilities, building accessible applications, and unwinding with video games.
          </li>
        </ul>
      </section>

      {/* ONGOING WORK */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className={`text-xl sm:text-2xl font-semibold ${headingText}`}>
            Ongoing Work
          </h2>
          <button
            type="button"
            onClick={() => setCurrentPage('projects')}
            className={`text-sm underline underline-offset-4 cursor-pointer ${isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#525252] hover:text-black'}`}
          >
            See all projects
          </button>
        </div>
        <div className="space-y-3">
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
                className={`border rounded-md px-5 py-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                  isDark
                    ? 'border-neutral-800 hover:border-neutral-600'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="space-y-1">
                  <div className={`font-medium text-base sm:text-lg ${headingText}`}>
                    {exp.projectTitle}
                  </div>
                  <div className={`text-sm font-mono ${mutedText}`}>
                    {exp.organization} · {exp.role}
                  </div>
                </div>
                <ChevronRight size={18} className={mutedText} />
              </div>
            );
          })}
        </div>
      </section>

      {/* LEADERSHIP & HIGHLIGHTS */}
      <section className="space-y-4">
        <h2 className={`text-xl sm:text-2xl font-semibold ${headingText}`}>
          Leadership & Highlights
        </h2>
        <ul className={`list-disc pl-6 space-y-2.5 text-base sm:text-[17px] leading-relaxed ${bodyText}`}>
          {achievementsData.map((item) => (
            <li key={item.id}>
              <span className={headingText}>{item.title}</span> — {item.description}
            </li>
          ))}
        </ul>
      </section>

      {/* CODING ACTIVITY */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className={`text-xl sm:text-2xl font-semibold ${headingText}`}>
            Coding Activity
          </h2>
          <div className="flex gap-5 text-sm font-mono">
            <button
              onClick={() => setActiveHeatmap('github')}
              className={`cursor-pointer ${
                activeHeatmap === 'github'
                  ? `${headingText} underline underline-offset-4`
                  : `${mutedText} hover:text-current`
              }`}
            >
              GitHub
            </button>
            <button
              onClick={() => setActiveHeatmap('codeforces')}
              className={`cursor-pointer ${
                activeHeatmap === 'codeforces'
                  ? `${headingText} underline underline-offset-4`
                  : `${mutedText} hover:text-current`
              }`}
            >
              Codeforces
            </button>
          </div>
        </div>

        <div className={`py-1 ${isDark ? 'text-[#e5e5e5]' : 'text-[#171717]'}`}>
          {activeHeatmap === 'github' ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs mb-3 font-mono gap-1">
                <a href={`https://github.com/${personalInfo.githubHandle}`} target="_blank" rel="noreferrer" className={`hover:underline underline-offset-4 ${mutedText}`}>
                  github.com/{personalInfo.githubHandle}
                </a>
                <span className={mutedText}>
                  {ghTotal > 0 ? `${ghTotal} contributions · ` : ''}up to {formatDisplayDate(toLocalDateKey(new Date()))}
                </span>
              </div>

              <div className="space-y-3">
                <div className={`overflow-x-auto overflow-y-hidden pb-3 border-b ${hairline}`}>
                  <div className="pt-5 w-full flex justify-center">
                    <div className="flex flex-col">
                      <div className="flex gap-[3px] pl-8 mb-1.5 h-4 items-end">
                        {mainCalendarWeeks.map((week) => (
                          <div key={week.weekIdx} className="w-[13px] relative shrink-0">
                            {week.monthLabel && (
                              <span className={`absolute bottom-0 left-0 text-[11px] font-mono leading-none select-none ${mutedText}`}>
                                {week.monthLabel}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 items-start">
                        <div className={`flex flex-col gap-[3px] text-[11px] font-mono w-6 shrink-0 select-none ${mutedText}`}>
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
                                const colorClass = getHeatmapCellColor(count);

                                return (
                                  <div key={day.dateStr} className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedDateStr(prev => (prev === day.dateStr ? null : day.dateStr))}
                                      aria-label={`${formatDisplayDate(day.dateStr)}: ${count} ${unitLabel}${count === 1 ? '' : 's'}`}
                                      title={`${formatDisplayDate(day.dateStr)} — ${count} ${unitLabel}${count === 1 ? '' : 's'}`}
                                      className={`block w-[13px] h-[13px] rounded-[2px] cursor-pointer transition-transform duration-150 focus:outline-none ${colorClass} ${
                                        isSelected
                                          ? isDark ? 'ring-1 ring-white scale-125 z-20 relative' : 'ring-1 ring-black scale-125 z-20 relative'
                                          : 'hover:scale-125 hover:z-10'
                                      }`}
                                    />
                                    {isSelected && (
                                      <div className={`absolute bottom-full mb-2 z-30 px-2.5 py-1 rounded-sm text-[11px] font-mono whitespace-nowrap pointer-events-none border ${isDark ? 'bg-[#171717] text-white border-neutral-700' : 'bg-white text-black border-neutral-300'}`}>
                                        <span className="font-semibold">{formatDisplayDate(day.dateStr)}</span>
                                        <span className={mutedText}> · </span>
                                        <span className="font-semibold">{count} {unitLabel}{count === 1 ? '' : 's'}</span>
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
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border ${isDark ? 'bg-[#171717] border-neutral-800 text-[#e5e5e5]' : 'bg-neutral-50 border-neutral-200 text-[#171717]'}`}>
                      <Calendar size={12} className={`${headingText} shrink-0`} />
                      <span>
                        <strong className={headingText}>{formatDisplayDate(selectedDateStr)}</strong>
                        {' — '}
                        {selectedCount} {unitLabel}{selectedCount === 1 ? '' : 's'}
                      </span>
                      <button type="button" onClick={() => setSelectedDateStr(null)} className={`ml-1 cursor-pointer ${mutedText} hover:${headingText}`}>
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className={mutedText}>
                      Click any square to inspect date
                    </div>
                  )}

                  <div className={`flex items-center gap-1.5 ${mutedText}`}>
                    <span>Less</span>
                    {[0, 1, 2, 4, 6].map((lvl) => (
                      <span key={lvl} className={`w-[11px] h-[11px] rounded-[2px] inline-block ${getHeatmapCellColor(lvl)}`} />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs mb-3 font-mono gap-1">
                <a href={`https://codeforces.com/profile/${personalInfo.codeforcesHandle}`} target="_blank" rel="noreferrer" className={`hover:underline underline-offset-4 ${mutedText}`}>
                  codeforces.com/profile/{personalInfo.codeforcesHandle}
                </a>
                <span className={mutedText}>
                  active up to {formatDisplayDate(toLocalDateKey(new Date()))}
                </span>
              </div>

              <div className="space-y-3">
                <div className={`overflow-x-auto overflow-y-hidden pb-3 border-b ${hairline}`}>
                  <div className="pt-5 w-full flex justify-center">
                    <div className="flex flex-col">
                      <div className="flex gap-[3px] pl-8 mb-1.5 h-4 items-end">
                        {mainCalendarWeeks.map((week) => (
                          <div key={week.weekIdx} className="w-[13px] relative shrink-0">
                            {week.monthLabel && (
                              <span className={`absolute bottom-0 left-0 text-[11px] font-mono leading-none select-none ${mutedText}`}>
                                {week.monthLabel}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 items-start">
                        <div className={`flex flex-col gap-[3px] text-[11px] font-mono w-6 shrink-0 select-none ${mutedText}`}>
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
                                const colorClass = getHeatmapCellColor(count);

                                return (
                                  <div key={day.dateStr} className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedDateStr(prev => (prev === day.dateStr ? null : day.dateStr))}
                                      aria-label={`${formatDisplayDate(day.dateStr)}: ${count} submission${count === 1 ? '' : 's'}`}
                                      title={`${formatDisplayDate(day.dateStr)} — ${count} submission${count === 1 ? '' : 's'}`}
                                      className={`block w-[13px] h-[13px] rounded-[2px] cursor-pointer transition-transform duration-150 focus:outline-none ${colorClass} ${
                                        isSelected
                                          ? isDark ? 'ring-1 ring-white scale-125 z-20 relative' : 'ring-1 ring-black scale-125 z-20 relative'
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
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4 pt-3 text-xs font-mono">
                <div className="flex gap-6">
                  <div>
                    <span className={mutedText}>solved: </span>
                    <span className={headingText}>{cfDetailedStats.solvedAllTime}</span>
                  </div>
                  <div>
                    <span className={mutedText}>rating: </span>
                    <span className={headingText}>{cfDetailedStats.rating}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAnalyticsModal(true)}
                  className={`underline underline-offset-4 cursor-pointer transition-colors ${isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#525252] hover:text-black'}`}
                >
                  Detailed stats →
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* TECHNICAL SKILLS */}
      <section className="space-y-4">
        <h2 className={`text-xl sm:text-2xl font-semibold ${headingText}`}>
          Technical Skills
        </h2>
        <div className={`divide-y border-t border-b ${divider} ${hairline}`}>
          {skillsData.map((group) => (
            <div
              key={group.category}
              className="py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-8"
            >
              <span className={`font-mono text-sm sm:w-44 shrink-0 ${mutedText}`}>
                {group.category}
              </span>
              <span className={`text-base ${isDark ? 'text-[#e5e5e5]' : 'text-[#171717]'}`}>
                {group.items.join(' · ')}
              </span>
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
