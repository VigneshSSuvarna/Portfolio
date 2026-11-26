import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const CaseStudyMetaBar = ({ role, domain, status, github, demo, isDark }) => {
  const hairline = isDark ? 'border-neutral-800' : 'border-neutral-200';
  const headingText = isDark ? 'text-white' : 'text-black';

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 py-4 border-t border-b font-mono text-xs ${hairline}`}>
      <div>
        <div className="text-[#737373] uppercase mb-1">Role</div>
        <div className={`font-medium ${headingText}`}>{role}</div>
      </div>
      <div>
        <div className="text-[#737373] uppercase mb-1">Domain</div>
        <div className={`font-medium ${headingText}`}>{domain}</div>
      </div>
      <div>
        <div className="text-[#737373] uppercase mb-1">Status</div>
        <div className={`font-medium ${headingText}`}>{status}</div>
      </div>
      <div>
        <div className="text-[#737373] uppercase mb-1">Links</div>
        <div className="flex items-center gap-4">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1 underline underline-offset-4 ${
                isDark ? 'text-[#e5e5e5] hover:text-white' : 'text-[#171717] hover:text-black'
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
              className={`inline-flex items-center gap-1 underline underline-offset-4 ${headingText}`}
            >
              Live <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
