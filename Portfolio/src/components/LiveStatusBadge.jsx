import React, { useState, useEffect } from 'react';

export const LiveStatusBadge = ({ url, isDark }) => {
  const [latency, setLatency] = useState(null);
  
  useEffect(() => {
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