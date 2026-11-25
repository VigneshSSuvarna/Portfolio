import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function KalkiPage({ isDark, setCurrentPage }) {
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
          Kalki
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${isDark ? 'text-[#39d353]' : 'text-emerald-700'}`}>
          Systems & AIOps • Zero-Raw-Egress Fleet Telemetry Platform
        </p>
      </div>

      <CaseStudyMetaBar
        role="Systems & Full-Stack Architect"
        domain="Distributed Systems & AIOps"
        status="Production Live"
        github="https://github.com/VigneshSSuvarna/kalki"
        demo="https://kalki-systems.vercel.app/"
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
            Kalki is a two-tier, multi-tenant infrastructure monitoring and AIOps platform engineered so raw logs, hostnames, and credentials never leave the monitored device. Instead of shipping raw telemetry to a central server, edge collectors scrub secrets, pseudonymize identities, and aggregate metrics locally before transmitting policy-approved metadata over TLS to a regional ingestion engine and real-time operations console.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            2. Five-Module Two-Tier Architecture
          </h3>
          <p className="mb-3">
            The platform separates edge collection (Tier 1) from regional ingestion, analysis, and visualization (Tier 2):
          </p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Prana (Collection):</span> Captures live OS metrics (CPU, memory, disk, network bandwidth), TCP reachability probes, and NAB/Loghub dataset replays.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Kavach (Privacy Membrane):</span> Redacts AWS keys, JWTs, bearer tokens, private keys, and high-entropy strings using regex and Shannon entropy, applies tenant-isolated HMAC-SHA256 pseudonymization, and enforces a fail-closed YAML allowlist.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Nadi (Edge Aggregation):</span> Computes 5-second statistical rollups (min, max, avg, p95) and runs local sliding-window brute-force detection.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Setu (Durable Transport):</span> Uses a local disk Write-Ahead Log (WAL) for zero-loss outage recovery, idempotent deduplication, event-time ordering, and cryptographic SHA-256 egress proofs verified against receiver echoes.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Medha (AIOps & Console):</span> Delivers EWMA/MAD anomaly detection, four-state fleet health tracking, tamper-evident hash-linked audit logs, approval-gated remediation simulations, and a React + TypeScript console streamed over header-authenticated SSE.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            3. Verified Benchmarks & Reliability
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Simulated Scale:</span> 500 collectors across 20 tenants — 49,181 batches accepted in 10 seconds (~4,917 batches/sec) with zero failures.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>Low Overhead:</span> 1.02 ms p95 ingest latency and 94 MiB peak sampled heap.
            </li>
            <li>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>End-to-End Verification:</span> Full Go race-detector test suite (<code className="font-mono text-xs">go test -race</code>) passing across Tier 1 and Tier 2, including 30-second outage recovery, tenant isolation, and audit-chain tamper detection.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs sm:text-sm uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Conclusion
          </h3>
          <p>
            Kalki proves that high-throughput fleet observability and explainable AIOps do not require sacrificing data privacy—combining cryptographic egress verification, durable edge buffering, and strict multi-tenant isolation in a lightweight Go and React stack.
          </p>
        </div>
      </div>
    </div>
  );
}