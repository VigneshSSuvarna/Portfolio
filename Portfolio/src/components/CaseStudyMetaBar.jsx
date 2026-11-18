import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const CaseStudyMetaBar = ({ role, domain, status, github, demo, isDark }) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-5 rounded-xl border font-mono text-xs ${
      isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
    }`}>
      <div>
        <div className="text-neutral-500 uppercase mb-1">Role</div>
        <div className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{role}</div>
      </div>
      <div>
        <div className="text-neutral-500 uppercase mb-1">Domain</div>
        <div className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{domain}</div>
      </div>
      <div>
        <div className="text-neutral-500 uppercase mb-1">Status</div>
        <div className="text-[#39d353] font-semibold">{status}</div>
      </div>
      <div>
        <div className="text-neutral-500 uppercase mb-1">Links</div>
        <div className="flex items-center gap-3">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1 underline underline-offset-4 ${
                isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              GitHub <ArrowUpRight size={13} />
            </a>
          )}
          {demo && demo !== '#' && (
            <a
              href={demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#39d353] underline underline-offset-4"
            >
              Live <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};