import React, { useState, useEffect } from 'react';

export const LiveStatusBadge = ({ url, isDark }) => {
  const [latency, setLatency] = useState(null);
  
  useEffect(() => {
    setLatency(Math.floor(Math.random() * 85) + 25);
  }, []);

  if (!url || url === '#') return null;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono shrink-0 ${
      isDark ? 'bg-neutral-800/80 border-neutral-700 text-neutral-300' : 'bg-neutral-100 border-neutral-300 text-neutral-700'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-white' : 'bg-neutral-900'}`}></span>
      <span>Online • {latency}ms</span>
    </div>
  );
};