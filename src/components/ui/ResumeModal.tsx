'use client';

import React from 'react';
import { X, Printer, CheckCircle2, Briefcase, GraduationCap, Award } from 'lucide-react';
import { PROFILE, SKILLS } from '@/data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[88vh] rounded-xl bg-[#121316] border border-white/15 flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div>
            <span className="text-[10px] font-mono text-emerald-400 tracking-wider">EXECUTIVE SUMMARY // CV</span>
            <h3 className="text-base font-bold text-white">{PROFILE.name}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300 leading-relaxed">
          {/* Experience */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs border-b border-white/10 pb-1.5">
              <Briefcase className="w-4 h-4" />
              <span>ENGINEERING & ENTERPRISE WORKFLOW EXPERIENCE</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between font-semibold text-white text-sm">
                  <span>Software Engineer & Business Automation Developer</span>
                  <span className="font-mono text-xs text-emerald-400">Enterprise Banking Sector</span>
                </div>
                <ul className="list-disc list-inside text-zinc-400 mt-1.5 space-y-1">
                  <li>Architected and migrated mission-critical enterprise workflows and multi-level approval processes using modern BPMN orchestration and reactive frontend portals.</li>
                  <li>Integrated front-office applications with Core Banking APIs, enforcing idempotency, schema validation, and audit traceability.</li>
                  <li>Collaborated cross-functionally with senior engineering leadership and department heads to deliver high-priority digital transformation milestones under tight deadlines.</li>
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between font-semibold text-white text-sm">
                  <span>Quality Engineering & Exploratory Testing Specialist</span>
                  <span className="font-mono text-xs text-zinc-400">Independent / Crowdtesting Platforms</span>
                </div>
                <ul className="list-disc list-inside text-zinc-400 mt-1.5 space-y-1">
                  <li>Executed structured exploratory testing, bug reproduction, bug classification, and Human Experience (HX) evaluations across production web systems.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Education & Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                <GraduationCap className="w-4 h-4" />
                <span>EDUCATION</span>
              </div>
              <div className="font-semibold text-white text-sm">B.Sc. Industrial Chemistry</div>
              <div className="text-zinc-400 text-xs">Obafemi Awolowo University (OAU)</div>
              <p className="text-[11px] text-zinc-500 pt-1">
                Strong quantitative foundation in process systems, analytical modeling, and industrial operations.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                <Award className="w-4 h-4" />
                <span>CORE COMPETENCIES</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SKILLS.map((s) => (
                  <span
                    key={s.name}
                    className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-zinc-300"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}