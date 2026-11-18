import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function SamaFoundationPage({ isDark, previousPage, setCurrentPage }) {
  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => setCurrentPage(previousPage)}
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-mono mb-6 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
            isDark
              ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
              : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:text-black hover:bg-neutral-200'
          }`}
        >
          <ArrowLeft size={16} /> Back to {previousPage === 'home' ? 'About' : 'Projects'}
        </button>
        <h1 className={`text-2xl sm:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          Nayi Disha Care & Support Platform
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${isDark ? 'text-[#39d353]' : 'text-emerald-700'}`}>
          Sama Foundation • Full-Stack Developer Project
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

      <div className={`space-y-6 text-sm sm:text-base leading-relaxed p-6 sm:p-10 rounded-2xl border ${
        isDark ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
      }`}>
        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            1. Abstract
          </h3>
          <p>
            Nayi Disha is a comprehensive full-stack care and support platform built to connect families, caretakers, health professionals, administrators, and connected IoT hardware through a unified ecosystem. By combining modern web technologies with secure database management and micro-controller integration, the platform streamlines care coordination, clinical tracking, and daily routines.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            2. Role-Based Workspace Architecture
          </h3>
          <p className="mb-3">To address the diverse needs of users within special needs care networks, the platform is structured into tailored portals:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Parent Workspace:</span> Empowers families with tools like ABC behavioral logging, dynamic child passports, weather-based sensory risk warnings, voice quick-logging, and low-demand mode controls.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Caretaker Floor:</span> Provides real-time classroom telemetry, morning handover summaries, quick-stamp status broadcasts, and caseload calendar coordination.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Admin Command Center:</span> Offers robust administrative oversight including clinical triage, IEP routine architectures, IoT device fleet tracking, global safety kill-switches, and verified user overrides.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            3. Core Technical & Hardware Integration
          </h3>
          <p className="mb-3">The system leverages a robust, production-ready technology stack to ensure secure, low-latency performance:</p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Full-Stack Implementation:</span> Built using React 18, Vite, and Tailwind CSS for a responsive frontend, supported by a Node.js, Express, and Aiven PostgreSQL backend.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>ESP32 Wearable Connectivity:</span> Integrates real-time hardware telemetry from ESP32-based band hardware to mirror sensory alerts and status updates.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Intelligent Automation:</span> Incorporates automated database connection pooling, auto-recovering database heartbeats, and environment-aware data management.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
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