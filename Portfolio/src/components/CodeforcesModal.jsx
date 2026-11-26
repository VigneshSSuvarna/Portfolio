import React, { useState } from 'react';
import { X, Calendar, RefreshCw } from 'lucide-react';
import { formatDisplayDate, buildCalendarWeeks, buildDynamicRatingTicks } from '../utils/calendarUtils';

export const CodeforcesModal = ({
  isOpen,
  onClose,
  isDark,
  cfRatingHistory,
  cfSubmissions,
  cfDetailedStats,
  isSyncingCf,
  syncLiveActivity
}) => {
  const [modalSelectedDateStr, setModalSelectedDateStr] = useState(null);
  const [modalYearFilter, setModalYearFilter] = useState('rolling');
  const [ratingFilter, setRatingFilter] = useState('rated');
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [hoveredContest, setHoveredContest] = useState(null);

  if (!isOpen) return null;

  const modalCalendarWeeks = buildCalendarWeeks(modalYearFilter);

  const getCfCellColor = (count) => {
    if (count <= 0) return isDark ? "bg-[#1f1f1f]" : "bg-[#ebedf0]";
    if (count === 1) return isDark ? "bg-[#0e4429]" : "bg-[#9be9a8]";
    if (count === 2) return isDark ? "bg-[#006d32]" : "bg-[#40c463]";
    if (count <= 4) return isDark ? "bg-[#26a641]" : "bg-[#30a14e]";
    return isDark ? "bg-[#39d353]" : "bg-[#216e39]";
  };

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
        { low: minRating, high: 1200, color: "#111111" },
        { low: 1200, high: 1400, color: "#171717" },
        { low: 1400, high: 1600, color: "#1f1f1f" },
        { low: 1600, high: 1900, color: "#262626" },
        { low: 1900, high: maxRating, color: "#2e2e2e" }
      ]
    : [
        { low: minRating, high: 1200, color: "#ffffff" },
        { low: 1200, high: 1400, color: "#fafafa" },
        { low: 1400, high: 1600, color: "#f5f5f5" },
        { low: 1600, high: 1900, color: "#eeeeee" },
        { low: 1900, high: maxRating, color: "#e5e5e5" }
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
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`border rounded-sm w-full max-w-4xl p-4 sm:p-6 space-y-4 my-auto max-h-[94vh] overflow-y-auto transition-colors ${
          isDark ? 'bg-[#111111] border-neutral-800' : 'bg-white border-neutral-200'
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-3 ${
            isDark ? 'border-neutral-800' : 'border-neutral-200'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2
              className={`text-sm sm:text-base font-mono font-medium ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              codeforces_analytics
            </h2>
            <span className="text-xs font-mono text-[#737373]">
              @VigneshSSuvarna
            </span>
            <button
              onClick={syncLiveActivity}
              title="Sync latest data from Codeforces API"
              className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-sm border cursor-pointer transition-colors ${
                isDark
                  ? 'border-neutral-800 bg-[#171717] text-[#a3a3a3] hover:text-white hover:border-neutral-600'
                  : 'border-neutral-200 bg-[#fafafa] text-[#737373] hover:text-black hover:border-neutral-400'
              }`}
            >
              <RefreshCw size={11} className={isSyncingCf ? 'animate-spin' : ''} />
              {isSyncingCf ? 'syncing' : 'live'}
            </button>
          </div>
          <button
            onClick={onClose}
            aria-label="Close analytics modal"
            className={`cursor-pointer p-1 transition-colors ${
              isDark ? 'text-[#737373] hover:text-white' : 'text-[#737373] hover:text-black'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Rating Graph */}
        <div
          className={`border rounded-sm p-3.5 transition-colors overflow-x-auto ${
            isDark
              ? 'bg-[#111111] border-neutral-800 text-[#e5e5e5]'
              : 'bg-white border-neutral-200 text-[#171717]'
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1.5 text-xs font-mono gap-2">
            <span className="text-[#737373]">
              Click on the graph to toggle zoom.
            </span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className={`border rounded-sm px-2 py-0.5 text-xs font-mono focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#171717] border-neutral-800 text-white'
                  : 'bg-white border-neutral-200 text-black'
              }`}
            >
              <option value="rated">Only rated</option>
              <option value="all">All contests</option>
            </select>
          </div>

          <div className="relative min-w-[600px] sm:min-w-0">
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
                      stroke={isDark ? "#262626" : "#e5e5e5"}
                      strokeWidth="0.8"
                    />
                    <text
                      x={padLeft - 6}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="11"
                      fill="#737373"
                      fontFamily="var(--font-mono)"
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
                      stroke={isDark ? "#262626" : "#e5e5e5"}
                      strokeWidth="0.8"
                    />
                    <text
                      x={x}
                      y={padTop + plotH + 15}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#737373"
                      fontFamily="var(--font-mono)"
                    >
                      {tick.labelTop}
                    </text>
                    <text
                      x={x}
                      y={padTop + plotH + 29}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#737373"
                      fontFamily="var(--font-mono)"
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
                stroke={isDark ? "#262626" : "#d4d4d4"}
                strokeWidth="1.2"
              />

              <polyline
                fill="none"
                stroke={isDark ? "#ffffff" : "#000000"}
                strokeWidth="2"
                points={polylinePoints}
              />

              {points.map((pt, idx) => {
                const isLast = idx === points.length - 1;
                return (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={isLast ? 4.5 : 3.5}
                    fill={isLast ? (isDark ? "#ffffff" : "#000000") : (isDark ? "#111111" : "#ffffff")}
                    stroke={isDark ? "#ffffff" : "#000000"}
                    strokeWidth="1.8"
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
                  fill={isDark ? "#111111" : "#ffffff"}
                  stroke={isDark ? "#262626" : "#e5e5e5"}
                  strokeWidth="0.8"
                />
                <rect
                  x="4"
                  y="3.5"
                  width="12"
                  height="11"
                  fill={isDark ? "#ffffff" : "#000000"}
                />
                <text
                  x="20"
                  y="13"
                  fontSize="10.5"
                  fill={isDark ? "#e5e5e5" : "#171717"}
                  fontFamily="var(--font-mono)"
                >
                  VigneshSSuvarna
                </text>
              </g>
            </svg>

            {hoveredContest && (
              <div className={`absolute top-3 left-14 text-xs font-mono px-2.5 py-1.5 rounded-sm pointer-events-none z-20 border ${
                isDark ? 'bg-[#171717] text-white border-neutral-700' : 'bg-white text-black border-neutral-300'
              }`}>
                <div className="font-semibold">{hoveredContest.contestName}</div>
                <div className={isDark ? 'text-[#a3a3a3]' : 'text-[#525252]'}>
                  Rating: <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{hoveredContest.newRating}</span> ({formatDisplayDate(hoveredContest.dateStr)})
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Stats Box */}
        <div
          className={`border rounded-sm p-4 sm:p-5 space-y-5 transition-colors ${
            isDark ? 'bg-[#111111] border-neutral-800 text-[#e5e5e5]' : 'bg-white border-neutral-200 text-[#171717]'
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {modalSelectedDateStr ? (
              <div
                className={`inline-flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded-sm border ${
                  isDark
                    ? 'bg-[#171717] border-neutral-800 text-white'
                    : 'bg-[#fafafa] border-neutral-200 text-black'
                }`}
              >
                <Calendar size={13} className={isDark ? 'text-white' : 'text-black'} />
                <span>
                  <strong>{formatDisplayDate(modalSelectedDateStr)}</strong> —{' '}
                  {cfSubmissions[modalSelectedDateStr] || 0} submission
                  {(cfSubmissions[modalSelectedDateStr] || 0) === 1 ? '' : 's'}
                </span>
                <button
                  type="button"
                  onClick={() => setModalSelectedDateStr(null)}
                  className="text-[#737373] hover:text-white cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <span className="text-xs font-mono text-[#737373]">
                Click any box to inspect date
              </span>
            )}

            <select
              value={modalYearFilter}
              onChange={(e) => {
                setModalYearFilter(e.target.value);
                setModalSelectedDateStr(null);
              }}
              className={`border rounded-sm px-2.5 py-1 text-xs font-mono focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#171717] border-neutral-800 text-white'
                  : 'bg-white border-neutral-200 text-black'
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
                      <span className="absolute bottom-0 left-0 text-[11px] font-mono leading-none select-none text-[#737373]">
                        {week.monthLabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 items-start">
                <div className="flex flex-col gap-[2px] text-[11px] font-mono w-6 shrink-0 select-none text-[#737373]">
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
                                    ? 'ring-1 ring-white scale-125 z-20 relative'
                                    : 'ring-1 ring-black scale-125 z-20 relative'
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
              <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-black'}`}>
                {cfDetailedStats.solvedAllTime} problems
              </div>
              <div className="text-xs mt-0.5 text-[#737373]">
                solved for all time
              </div>
            </div>

            <div>
              <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-black'}`}>
                {cfDetailedStats.solvedLastYear} problems
              </div>
              <div className="text-xs mt-0.5 text-[#737373]">
                solved for the last year
              </div>
            </div>

            <div>
              <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-black'}`}>
                {cfDetailedStats.solvedLastMonth} problems
              </div>
              <div className="text-xs mt-0.5 text-[#737373]">
                solved for the last month
              </div>
            </div>

            <div>
              <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-black'}`}>
                {cfDetailedStats.streakMax} days
              </div>
              <div className="text-xs mt-0.5 text-[#737373]">
                in a row max.
              </div>
            </div>

            <div>
              <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-black'}`}>
                {cfDetailedStats.streakLastYear} days
              </div>
              <div className="text-xs mt-0.5 text-[#737373]">
                in a row for the last year
              </div>
            </div>

            <div>
              <div className={`text-xl sm:text-2xl font-normal ${isDark ? 'text-white' : 'text-black'}`}>
                {cfDetailedStats.streakLastMonth} days
              </div>
              <div className="text-xs mt-0.5 text-[#737373]">
                in a row for the last month
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 pt-1 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#737373]">Focus Areas:</span>
            <span className={isDark ? 'text-[#e5e5e5]' : 'text-[#171717]'}>
              {(cfDetailedStats.tags || ["Greedy", "Math", "Brute Force", "Implementation", "Sorting"]).join(' · ')}
            </span>
          </div>
          <div className="text-[#737373]">
            Primary Languages:{' '}
            <span className={isDark ? 'text-white font-medium' : 'text-black font-medium'}>
              {cfDetailedStats.languages || "C++, Python"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
