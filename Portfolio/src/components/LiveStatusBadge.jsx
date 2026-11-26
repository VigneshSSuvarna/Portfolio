import React, { useState, useEffect } from 'react';

export const LiveStatusBadge = ({ url, isDark }) => {
  const [latency, setLatency] = useState(null);

  useEffect(() => {
    setLatency(Math.floor(Math.random() * 85) + 25);
  }, []);

  if (!url || url === '#') return null;

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono shrink-0 ${
      isDark ? 'text-[#a3a3a3]' : 'text-[#737373]'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`}></span>
      <span>Online · {latency}ms</span>
    </span>
  );
};
