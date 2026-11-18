import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function HireSpherePage({ isDark, setCurrentPage }) {
  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => setCurrentPage('projects')}
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono mb-6 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
            isDark
              ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
              : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:text-black hover:bg-neutral-200'
          }`}
        >
          <ArrowLeft size={16} /> Back to Projects
        </button>
        <h1 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          HireSphere & PlaceOS
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${isDark ? 'text-[#39d353]' : 'text-emerald-700'}`}>
          Full-Stack Web App • University Placements Platform
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

      <div className={`space-y-6 text-sm sm:text-base leading-relaxed p-6 sm:p-10 rounded-2xl border ${
        isDark ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
      }`}>
        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            1. Abstract
          </h3>
          <p>
            HireSphere and PlaceOS form a comprehensive full-stack ecosystem designed to modernize and streamline university campus placements. The platforms replace fragmented recruitment processes with a unified digital workspace, centralizing job applications, interview tracking, and administrative oversight into a single, cohesive environment.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            2. Role-Based Workspace Architecture
          </h3>
          <p className="mb-3">The system is divided into distinct operational workflows tailored to different stakeholders:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Student Workspace:</span> Provides an interactive dashboard for students to build profiles, track coding practice progress, monitor ongoing job applications, and prepare for upcoming corporate drives.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Coordinator Workspace:</span> Equips university placement officers with robust tools to manage company profiles, schedule recruitment drives, broadcast updates, and analyze cohort placement metrics.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
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