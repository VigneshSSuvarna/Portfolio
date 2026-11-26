import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function HireSpherePage({ isDark, setCurrentPage }) {
  const headingText = isDark ? 'text-white' : 'text-black';
  const bodyText = isDark ? 'text-[#a3a3a3]' : 'text-[#525252]';
  const mutedText = 'text-[#737373]';

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => setCurrentPage('projects')}
          className={`inline-flex items-center gap-1.5 text-xs font-mono mb-6 cursor-pointer hover:underline underline-offset-4 transition-colors ${
            isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#525252] hover:text-black'
          }`}
        >
          <ArrowLeft size={14} /> Back to Projects
        </button>
        <h1 className={`text-2xl sm:text-3xl font-semibold tracking-tight ${headingText}`}>
          HireSphere & PlaceOS
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${mutedText}`}>
          Full-Stack Web App · University Placements Platform
        </p>
      </div>

      <CaseStudyMetaBar
        role="Full-Stack Architect"
        domain="Enterprise Web App"
        status="Ongoing"
        github="https://github.com/VigneshSSuvarna/HireSphere.git"
        demo="#"
        isDark={isDark}
      />

      <div className={`max-w-3xl space-y-8 pt-2 text-sm sm:text-base leading-relaxed ${bodyText}`}>
        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            1. Abstract
          </h3>
          <p>
            HireSphere and PlaceOS form a comprehensive full-stack ecosystem designed to modernize and streamline university campus placements. The platforms replace fragmented recruitment processes with a unified digital workspace, centralizing job applications, interview tracking, and administrative oversight into a single, cohesive environment.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            2. Role-Based Workspace Architecture
          </h3>
          <p className="mb-3">The system is divided into distinct operational workflows tailored to different stakeholders:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${headingText}`}>Student Workspace:</span> Provides an interactive dashboard for students to build profiles, track coding practice progress, monitor ongoing job applications, and prepare for upcoming corporate drives.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Coordinator Workspace:</span> Equips university placement officers with robust tools to manage company profiles, schedule recruitment drives, broadcast updates, and analyze cohort placement metrics.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            Conclusion
          </h3>
          <p>
            By creating a transparent and highly organized digital bridge between students and administrators, HireSphere and PlaceOS significantly reduce friction in the hiring pipeline, driving better placement outcomes and a smoother campus recruitment experience.
          </p>
        </div>
      </div>
    </div>
  );
}
