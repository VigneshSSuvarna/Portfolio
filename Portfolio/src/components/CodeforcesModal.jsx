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
    if (count <= 0) return isDark ? "bg-[#161b22]" : "bg-[#ebedf0]";
    if (count === 1) return isDark ? "bg-[#0e4429]" : "bg-[#85e89d]";
    if (count === 2) return isDark ? "bg-[#006d32]" : "bg-[#34d058]";
    if (count <= 4) return isDark ? "bg-[#26a641]" : "bg-[#28a745]";
    return isDark ? "bg-[#39d353]" : "bg-[#22863a]";
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
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
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
            onClick={onClose}
            className={`cursor-pointer p-1 rounded ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Rating Graph */}
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

        {/* Detailed Stats Box */}
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
              <span className="text-xs text-neutral-400">
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
  );
};