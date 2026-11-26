import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyMetaBar } from '../components/CaseStudyMetaBar';

export default function KalkiPage({ isDark, setCurrentPage }) {
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
          Kalki
        </h1>
        <p className={`text-xs sm:text-sm font-mono mt-1 ${mutedText}`}>
          Systems & AIOps · Zero-Raw-Egress Fleet Telemetry Platform
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

      <div className={`max-w-3xl space-y-8 pt-2 text-sm sm:text-base leading-relaxed ${bodyText}`}>
        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            1. Abstract
          </h3>
          <p>
            Kalki is a two-tier, multi-tenant infrastructure monitoring and AIOps platform engineered so raw logs, hostnames, and credentials never leave the monitored device. Instead of shipping raw telemetry to a central server, edge collectors scrub secrets, pseudonymize identities, and aggregate metrics locally before transmitting policy-approved metadata over TLS to a regional ingestion engine and real-time operations console.
          </p>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            2. Five-Module Two-Tier Architecture
          </h3>
          <p className="mb-3">
            The platform separates edge collection (Tier 1) from regional ingestion, analysis, and visualization (Tier 2):
          </p>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              <span className={`font-medium ${headingText}`}>Prana (Collection):</span> Captures live OS metrics (CPU, memory, disk, network bandwidth), TCP reachability probes, and NAB/Loghub dataset replays.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Kavach (Privacy Membrane):</span> Redacts AWS keys, JWTs, bearer tokens, private keys, and high-entropy strings using regex and Shannon entropy, applies tenant-isolated HMAC-SHA256 pseudonymization, and enforces a fail-closed YAML allowlist.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Nadi (Edge Aggregation):</span> Computes 5-second statistical rollups (min, max, avg, p95) and runs local sliding-window brute-force detection.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Setu (Durable Transport):</span> Uses a local disk Write-Ahead Log (WAL) for zero-loss outage recovery, idempotent deduplication, event-time ordering, and cryptographic SHA-256 egress proofs verified against receiver echoes.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Medha (AIOps & Console):</span> Delivers EWMA/MAD anomaly detection, four-state fleet health tracking, tamper-evident hash-linked audit logs, approval-gated remediation simulations, and a React + TypeScript console streamed over header-authenticated SSE.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
            3. Verified Benchmarks & Reliability
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <span className={`font-medium ${headingText}`}>Simulated Scale:</span> 500 collectors across 20 tenants — 49,181 batches accepted in 10 seconds (~4,917 batches/sec) with zero failures.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>Low Overhead:</span> 1.02 ms p95 ingest latency and 94 MiB peak sampled heap.
            </li>
            <li>
              <span className={`font-medium ${headingText}`}>End-to-End Verification:</span> Full Go race-detector test suite (<code className="font-mono text-xs">go test -race</code>) passing across Tier 1 and Tier 2, including 30-second outage recovery, tenant isolation, and audit-chain tamper detection.
            </li>
          </ul>
        </div>

        <div>
          <h3 className={`font-mono text-xs uppercase tracking-widest mb-2.5 ${mutedText}`}>
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
