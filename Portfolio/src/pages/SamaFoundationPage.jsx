import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function SamaFoundationPage({ isDark, previousPage, setCurrentPage }) {
  const headingText = isDark ? 'text-white' : 'text-black';
  const bodyText = isDark ? 'text-[#a3a3a3]' : 'text-[#525252]';
  const mutedText = 'text-[#737373]';

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => setCurrentPage(previousPage)}
          className={`inline-flex items-center gap-1.5 text-xs font-mono mb-6 cursor-pointer hover:underline underline-offset-4 transition-colors ${
            isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#525252] hover:text-black'
          }`}
        >
          <ArrowLeft size={14} /> Back to {previousPage === 'home' ? 'About' : 'Projects'}
        </button>
        <h1 className={`text-2xl sm:text-3xl font-semibold tracking-tight ${headingText}`}>
          Nayi Disha Care & Support Platform
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${mutedText}`}>
          Sama Foundation · Full-Stack Developer Project
        </p>
      </div>

      <CaseStudyMetaBar
        role="Full-Stack Developer"
        domain="Care Platform & IoT"
        status="Production Live"
        github="https://github.com/Nayi-Disha-Org/Nayi-Disha.git"
        demo="https://nayi-disha-web.vercel.app"
        isDark={isDark}
      />

      <div className={`max-w-3xl space-y-8 pt-2 text-sm sm:text-base leading-relaxed ${bodyText}`}>
        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            1. Abstract
          </h3>
          <p>
            Nayi Disha is a comprehensive full-stack care and support platform built to connect families, caretakers, health professionals, administrators, and connected IoT hardware through a unified ecosystem. By combining modern web technologies with secure database management and micro-controller integration, the platform streamlines care coordination, clinical tracking, and daily routines.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            2. Role-Based Workspace Architecture
          </h3>
          <p className="mb-3">To address the diverse needs of users within special needs care networks, the platform is structured into tailored portals:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${headingText}`}>Parent Workspace:</span> Empowers families with tools like ABC behavioral logging, dynamic child passports, weather-based sensory risk warnings, voice quick-logging, and low-demand mode controls.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Caretaker Floor:</span> Provides real-time classroom telemetry, morning handover summaries, quick-stamp status broadcasts, and caseload calendar coordination.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Admin Command Center:</span> Offers robust administrative oversight including clinical triage, IEP routine architectures, IoT device fleet tracking, global safety kill-switches, and verified user overrides.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            3. Core Technical & Hardware Integration
          </h3>
          <p className="mb-3">The system leverages a robust, production-ready technology stack to ensure secure, low-latency performance:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${headingText}`}>Full-Stack Implementation:</span> Built using React 18, Vite, and Tailwind CSS for a responsive frontend, supported by a Node.js, Express, and Aiven PostgreSQL backend.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>ESP32 Wearable Connectivity:</span> Integrates real-time hardware telemetry from ESP32-based band hardware to mirror sensory alerts and status updates.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Intelligent Automation:</span> Incorporates automated database connection pooling, auto-recovering database heartbeats, and environment-aware data management.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            Conclusion
          </h3>
          <p>
            Nayi Disha bridges critical gaps in special needs support by uniting families, caretakers, and hardware into a cohesive, secure, and highly scalable digital platform.
          </p>
        </div>
      </div>
    </div>
  );
}
