'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  XCircle,
  Cpu,
  Activity,
  Lock,
} from 'lucide-react';

export default function ApprovalSandbox() {
  const [amount, setAmount] = useState<number>(15000000); // ₦15,000,000
  const [role, setRole] = useState<'MAKER' | 'CHECKER' | 'SNR_AUTHORIZER' | 'EXEC_COMMITTEE'>('CHECKER');
  const [riskScore, setRiskScore] = useState<number>(24);
  const [kycVerified, setKycVerified] = useState<boolean>(true);
  const [rpsLoad, setRpsLoad] = useState<number>(120);

  // Deterministic BPMN Approval Rule Evaluation Engine
  const evaluation = useMemo(() => {
    const reasons: string[] = [];
    let requiredRole: 'CHECKER' | 'SNR_AUTHORIZER' | 'EXEC_COMMITTEE' = 'CHECKER';
    let slaMinutes = 15;

    if (amount > 50_000_000) {
      requiredRole = 'EXEC_COMMITTEE';
      slaMinutes = 60;
      reasons.push('Amount exceeds ₦50M tier → Executive Committee sign-off required.');
    } else if (amount > 10_000_000) {
      requiredRole = 'SNR_AUTHORIZER';
      slaMinutes = 30;
      reasons.push('Amount exceeds ₦10M tier → Senior Authorizer escalation required.');
    } else {
      reasons.push('Standard tier (≤ ₦10M) → Branch Checker authority sufficient.');
    }

    const roleHierarchy = {
      MAKER: 1,
      CHECKER: 2,
      SNR_AUTHORIZER: 3,
      EXEC_COMMITTEE: 4,
    };

    const hasAuthority = roleHierarchy[role] >= roleHierarchy[requiredRole];
    if (!hasAuthority) {
      reasons.push(`Current actor (${role}) lacks clearance for ${requiredRole} gate.`);
    } else {
      reasons.push(`Actor clearance verified (${role} ≥ ${requiredRole}).`);
    }

    if (!kycVerified) {
      reasons.push('CRITICAL: AML/KYC verification flag is false. Auto-blocking settlement.');
    }

    if (riskScore >= 75) {
      reasons.push(`High Anomaly Risk Score (${riskScore}/100) → Routed to Compliance Hold Queue.`);
    }

    const approved = hasAuthority && kycVerified && riskScore < 75;
    const status = !kycVerified || riskScore >= 75
      ? 'COMPLIANCE_HOLD'
      : approved
      ? 'AUTHORIZED_FOR_CORE_SYNC'
      : 'ESCALATION_REQUIRED';

    // Simulated throughput calculation
    const estimatedLatencyMs = Math.round(14 + rpsLoad * 0.08 + (riskScore > 50 ? 12 : 0));

    return {
      approved,
      status,
      requiredRole,
      slaMinutes,
      estimatedLatencyMs,
      reasons,
      payload: {
        ruleEngine: 'BPMN-2.0-DETERMINISTIC',
        txAmountNGN: amount,
        actorRole: role,
        requiredAuthority: requiredRole,
        amlKycPassed: kycVerified,
        riskIndex: riskScore,
        decision: status,
        p99LatencyMs: `${estimatedLatencyMs}ms`,
      },
    };
  }, [amount, role, riskScore, kycVerified, rpsLoad]);

  return (
    <section id="sandbox" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>INTERACTIVE ENGINEERING SANDBOX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Approval Rule Matrix & Pipeline Throughput Validator
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Test how enterprise Maker-Checker-Authorizer state guards evaluate transaction thresholds, AML risk scores, and role hierarchies in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300">
          <Activity className="w-3.5 h-3.5" />
          <span>Deterministic Evaluation: 0ms Drift</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl bg-[#121316] border border-white/10 p-6">
        {/* Left Controls */}
        <div className="lg:col-span-6 space-y-5">
          {/* Amount Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">TRANSACTION AMOUNT (NGN)</span>
              <span className="text-emerald-400 font-bold text-sm">
                ₦{amount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={1000000}
              max={100000000}
              step={1000000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>₦1M (Branch)</span>
              <span>₦10M (Snr Auth)</span>
              <span>₦50M+ (Exec Committee)</span>
            </div>
          </div>

          {/* Actor Role Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-zinc-400">
              CURRENT ACTOR ROLE (RBAC CLAIM)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['MAKER', 'CHECKER', 'SNR_AUTHORIZER', 'EXEC_COMMITTEE'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-2.5 rounded-lg font-mono text-[11px] border transition-all ${
                    role === r
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Score & RPS Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">AML RISK SCORE</span>
                <span
                  className={
                    riskScore >= 75
                      ? 'text-red-400 font-bold'
                      : riskScore >= 40
                      ? 'text-amber-400 font-bold'
                      : 'text-emerald-400 font-bold'
                  }
                >
                  {riskScore} / 100
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={riskScore}
                onChange={(e) => setRiskScore(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">CONCURRENT LOAD</span>
                <span className="text-sky-400 font-bold">{rpsLoad} req/s</span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={rpsLoad}
                onChange={(e) => setRpsLoad(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>
          </div>

          {/* KYC Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-white">
                  BVN / KYC & Mandate Verification
                </div>
                <div className="text-[11px] text-zinc-500 font-mono">
                  Simulates pre-flight identity validation check
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setKycVerified((prev) => !prev)}
              className={`px-3 py-1 rounded font-mono text-xs border transition-all ${
                kycVerified
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-red-500/20 border-red-500/50 text-red-300'
              }`}
            >
              {kycVerified ? 'VERIFIED' : 'UNVERIFIED'}
            </button>
          </div>
        </div>

        {/* Right Decision Output & Live Telemetry */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-black/60 rounded-xl border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              {evaluation.status === 'AUTHORIZED_FOR_CORE_SYNC' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : evaluation.status === 'COMPLIANCE_HOLD' ? (
                <XCircle className="w-5 h-5 text-red-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block">
                  RULE ENGINE VERDICT
                </span>
                <span
                  className={`font-mono text-xs sm:text-sm font-bold ${
                    evaluation.status === 'AUTHORIZED_FOR_CORE_SYNC'
                      ? 'text-emerald-400'
                      : evaluation.status === 'COMPLIANCE_HOLD'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}
                >
                  {evaluation.status}
                </span>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-zinc-500 block">EST. P99 LATENCY</span>
              <span className="text-xs text-emerald-400 font-semibold">
                {evaluation.estimatedLatencyMs}ms
              </span>
            </div>
          </div>

          {/* Rule Trace Log */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
              EXECUTION AUDIT TRACE
            </span>
            {evaluation.reasons.map((r, i) => (
              <div
                key={i}
                className="text-xs font-mono text-zinc-300 flex items-start gap-2 bg-white/[0.02] p-2 rounded border border-white/5"
              >
                <span className="text-emerald-400">0{i + 1}</span>
                <span>{r}</span>
              </div>
            ))}
          </div>

          {/* Live JSON Output */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
              SIGNED ENGINE PAYLOAD
            </span>
            <pre className="p-3 rounded-lg bg-[#0A0A0C] border border-white/5 font-mono text-[11px] text-emerald-300/90 overflow-x-auto">
              <code>{JSON.stringify(evaluation.payload, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}