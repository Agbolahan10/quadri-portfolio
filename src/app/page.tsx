'use client';

import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Layers,
  ArrowRight,
  Copy,
  Send,
  Zap,
  ChevronRight,
  FileText,
  BookOpen,
  Cpu,
  Search,
  Sun,
  Moon,
  Check,
} from 'lucide-react';
import { PROFILE, SKILLS, CASE_STUDIES, ARTICLES } from '@/data/portfolioData';
import { SkillCategory, TechnicalArticle } from '@/types/portfolio';
import CommandPalette from '@/components/layout/CommandPalette';
import ArticleReaderModal from '@/components/ui/ArticleReaderModal';
import ResumeModal from '@/components/ui/ResumeModal';
import ApprovalSandbox from '@/components/sections/ApprovalSandbox';

export default function PortfolioPage() {
  const [isLightMode, setIsLightMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all');
  const [activeTabByProject, setActiveTabByProject] = useState<Record<string, 'ui' | 'arch'>>({
    'enterprise-workflow-engine': 'arch',
    'industrial-telemetry-hub': 'ui',
    'automated-lead-intelligence': 'arch',
  });

  // Interactive Modals & Drawers State
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<TechnicalArticle | null>(null);

  // Global Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real Workflow State Machine (Connected to /api/workflow)
  const [workflowStage, setWorkflowStage] = useState(0);
  const [workflowLogs, setWorkflowLogs] = useState<string[]>([
    'Maker initiated payment batch #TXN-99482',
    'Awaiting compliance rule verification...',
  ]);
  const [latency, setLatency] = useState('14ms');
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Copy email feedback
  const [copied, setCopied] = useState(false);

  // Prototype Quick Message Builder State
  const [inquiryContext, setInquiryContext] = useState<
    'Engineering Role / Opportunity' | 'Enterprise Workflow Architecture' | 'Technical Collaboration'
  >('Engineering Role / Opportunity');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [briefMessage, setBriefMessage] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchFeedback, setDispatchFeedback] = useState<string | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAllToArch = () => {
    const updated: Record<string, 'ui' | 'arch'> = {};
    CASE_STUDIES.forEach((c) => {
      updated[c.id] = 'arch';
    });
    setActiveTabByProject(updated);
  };

  const advanceWorkflow = async () => {
    setIsAdvancing(true);
    try {
      const res = await fetch('/api/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStageIndex: workflowStage }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkflowStage(data.stageIndex);
        setLatency(data.telemetry.latencyMs);
        setWorkflowLogs((prev) => [
          `[${data.stage.status}] by ${data.stage.actor} (${data.telemetry.latencyMs})`,
          ...prev.slice(0, 3),
        ]);
      }
    } catch {
      setWorkflowStage((prev) => (prev + 1) % 4);
    } finally {
      setIsAdvancing(false);
    }
  };

  const handlePrepareDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const mappedIntent =
      inquiryContext === 'Engineering Role / Opportunity'
        ? 'Enterprise Role'
        : inquiryContext === 'Enterprise Workflow Architecture'
        ? 'Digital Transformation / Consulting'
        : 'Technical Collaboration';

    setIsDispatching(true);
    setDispatchFeedback('Validating & transmitting payload via Resend API...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: senderName.trim() || 'Recruiter / Engineering Lead',
          senderEmail: senderEmail.trim(),
          intent: mappedIntent,
          message: briefMessage.trim(),
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setDispatchFeedback(
          `✓ Dispatch Confirmed [${result.dispatchId}] (${
            result.mode === 'LIVE_RESEND_DELIVERY' ? 'Delivered to Inbox' : 'Simulated Mode — Add RESEND_API_KEY for live email'
          })`
        );
        setBriefMessage('');
      } else {
        setDispatchFeedback(`⚠ ${result.error || 'Please check your email and message length.'}`);
      }
    } catch {
      setDispatchFeedback('⚠ Network error while communicating with /api/contact.');
    } finally {
      setIsDispatching(false);
    }
  };

  const filteredSkills =
    activeCategory === 'all' ? SKILLS : SKILLS.filter((s) => s.category === activeCategory);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 selection:bg-emerald-500/30 selection:text-emerald-300 ${
        isLightMode ? 'theme-light bg-[#F8FAFC] text-[#0F172A]' : 'bg-[#07090B] text-[#F3F4F6]'
      }`}
      style={{
        backgroundImage: isLightMode
          ? 'linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)'
          : 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    >
      {/* Interactive Overlays */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        onOpenResume={() => setIsResumeOpen(true)}
        onToggleAllArch={toggleAllToArch}
      />
      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Exact Prototype Top Navigation Bar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#07090B]/85 border-b border-white/10 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left Brand Box */}
          <a href="#overview" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono text-sm font-bold text-emerald-400 group-hover:border-emerald-400 transition-all">
              QO
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-wider text-white">
                  QO <span className="text-zinc-500">//</span> ENG
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-xs text-zinc-400">{PROFILE.name}</div>
            </div>
          </a>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-medium text-zinc-300">
            <a href="#overview" className="hover:text-emerald-400 transition-colors">
              Overview
            </a>
            <a href="#stack" className="hover:text-emerald-400 transition-colors">
              Stack
            </a>
            <a href="#work" className="hover:text-emerald-400 transition-colors">
              Case Studies
            </a>
            <a href="#sandbox" className="hover:text-emerald-400 transition-colors">
              Sandbox
            </a>
            <a href="#writing" className="hover:text-emerald-400 transition-colors">
              Writing
            </a>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCmdOpen(true)}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs text-zinc-300 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Command</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-zinc-300">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setIsResumeOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-medium text-white transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Resume</span>
            </button>

            <button
              onClick={() => setIsLightMode((prev) => !prev)}
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-amber-400 transition-all"
              title="Toggle Theme"
            >
              {isLightMode ? <Moon className="w-4 h-4 text-zinc-700" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-28">
        {/* Hero Section (Overview) */}
        <section id="overview" className="space-y-7 pt-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{PROFILE.availability}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.08] max-w-5xl">
            <span className="text-white block">Engineering Resilient Interfaces &</span>
            <span
              className={`bg-clip-text text-transparent block mt-1 ${
                isLightMode
                  ? 'bg-gradient-to-r from-emerald-700 via-teal-600 to-sky-700'
                  : 'bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400'
              }`}
            >
              Mission-Critical Enterprise Workflows.
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-3xl leading-relaxed">
            I’m <strong className="text-white font-semibold">{PROFILE.name}</strong>, a Software
            Engineer in Lagos bridging{' '}
            <span className="text-zinc-200">
              computational precision and high-velocity frontend architecture
            </span>{' '}
            with automated enterprise BPMN workflows, core banking API integrations, and
            zero-defect quality engineering.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#work"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <span>Explore Case Studies</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={copyEmail}
              className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-mono text-zinc-200 flex items-center gap-2.5 transition-all"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-emerald-400" />
              )}
              <span>{copied ? 'Copied to Clipboard!' : PROFILE.email}</span>
            </button>
          </div>
        </section>

        {/* Bento Grid: Live BPMN Simulator & Domain Core */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>LIVE SYSTEM TELEMETRY & ORCHESTRATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Live BPMN Workflow Sandbox Card */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-[#101216] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white text-base">
                    BPMN Multi-Level Approval State Machine
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Connected to Next.js API Route (/api/workflow)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500">GATEWAY LATENCY</span>
                  <div className="text-xs font-mono text-emerald-400 font-semibold">{latency}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {['01 Initiated', '02 Compliance', '03 Core API', '04 Settled'].map((step, idx) => (
                  <div
                    key={step}
                    className={`p-2.5 rounded-lg text-center text-xs font-mono transition-all border ${
                      workflowStage === idx
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold'
                        : workflowStage > idx
                        ? 'bg-white/5 border-white/10 text-zinc-400'
                        : 'bg-black/40 border-white/5 text-zinc-600'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>

              {/* Terminal Logs */}
              <div className="bg-black/60 rounded-xl p-3.5 border border-white/5 font-mono text-xs text-zinc-400 space-y-1.5 min-h-[80px]">
                {workflowLogs.map((log, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{log}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={advanceWorkflow}
                disabled={isAdvancing}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs text-zinc-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isAdvancing ? 'Executing State Transition...' : 'Trigger Next BPMN Stage →'}
                </span>
              </button>
            </div>

            {/* Engineering Radar Card */}
            <div className="p-6 rounded-2xl bg-[#101216] border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-white text-base">Domain Focus</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Core architectural pillars
                </p>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-zinc-300">Enterprise Workflows & BPMN</span>
                    <span className="font-mono text-emerald-400">Production</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-zinc-300">Frontend State Architecture</span>
                    <span className="font-mono text-emerald-400">Strict TS</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-zinc-300">Zero-Defect Exploratory QA</span>
                    <span className="font-mono text-emerald-400">Verified</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-zinc-300">Upstream & Telemetry Systems</span>
                    <span className="font-mono text-sky-400">Analytics</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-zinc-500">
                Lagos, Nigeria (WAT) • Global Ready
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Filterable Skills & Stack Matrix */}
        <section id="stack" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 tracking-wider">
                CAPABILITY MATRIX
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Production Tech Stack & Verification
              </h2>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-1.5 bg-[#101216] p-1.5 rounded-xl border border-white/10 text-xs font-mono">
              {(
                [
                  { id: 'all', label: 'All Systems' },
                  { id: 'frontend', label: 'Frontend' },
                  { id: 'workflow', label: 'BPMN & APIs' },
                  { id: 'devops', label: 'Python & Cloud' },
                  { id: 'qa', label: 'Zero-Defect QA' },
                ] as { id: SkillCategory; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeCategory === tab.id
                      ? 'bg-emerald-500 text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.name}
                className="p-5 rounded-2xl bg-[#101216] border border-white/10 hover:border-emerald-500/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {skill.level}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm pt-1">{skill.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{skill.context}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Work: CAR Framework Case Studies */}
        <section id="work" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-emerald-400 tracking-wider">
                SELECTED WORK
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Case Studies & System Architectures
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500 hidden sm:block">
              CAR FRAMEWORK // CONTEXT • ACTION • RESULT
            </span>
          </div>

          <div className="space-y-8">
            {CASE_STUDIES.map((project) => {
              const currentTab = activeTabByProject[project.id] || 'arch';
              return (
                <div
                  key={project.id}
                  className="rounded-2xl bg-[#101216] border border-white/10 overflow-hidden transition-all hover:border-white/20"
                >
                  {/* Card Header & View Toggle */}
                  <div className="p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-emerald-400">
                          {project.index} //
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-white">{project.title}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="text-xs text-zinc-400 font-mono">{project.domain}</span>
                        {project.metrics.map((m) => (
                          <span
                            key={m}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Mode Toggle Button */}
                    <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono">
                      <button
                        onClick={() =>
                          setActiveTabByProject((prev) => ({ ...prev, [project.id]: 'ui' }))
                        }
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          currentTab === 'ui'
                            ? 'bg-white/15 text-white font-medium'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        UI Preview
                      </button>
                      <button
                        onClick={() =>
                          setActiveTabByProject((prev) => ({ ...prev, [project.id]: 'arch' }))
                        }
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          currentTab === 'arch'
                            ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        System Architecture
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: CAR Description */}
                    <div className="lg:col-span-5 space-y-4 text-xs leading-relaxed">
                      <div>
                        <span className="font-mono text-[10px] text-zinc-500 tracking-wider">
                          01 // CONTEXT
                        </span>
                        <p className="text-zinc-300 mt-1">{project.car.context}</p>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] text-emerald-400 tracking-wider">
                          02 // ACTION
                        </span>
                        <p className="text-zinc-300 mt-1">{project.car.action}</p>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] text-amber-400 tracking-wider">
                          03 // RESULT
                        </span>
                        <p className="text-zinc-300 mt-1">{project.car.result}</p>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {project.stack.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] font-mono text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Dynamic Interactive View */}
                    <div className="lg:col-span-7 bg-black/50 rounded-xl border border-white/10 p-5 flex flex-col justify-center min-h-[240px]">
                      {currentTab === 'arch' ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-b border-white/5 pb-2">
                            <span>ARCHITECTURE & DATA FLOW NODES</span>
                            <span className="text-emerald-400">DETERMINISTIC PIPELINE</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {project.architectureNodes.map((node, index) => (
                              <div
                                key={node.id}
                                className="p-3 rounded-xl bg-[#14171C] border border-white/10 space-y-1.5 hover:border-emerald-500/40 transition-all"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-semibold text-xs text-white">
                                    0{index + 1}. {node.label}
                                  </span>
                                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                                    {node.latency}
                                  </span>
                                </div>
                                <div className="text-[10px] font-mono text-sky-400">{node.sub}</div>
                                <p className="text-[11px] text-zinc-400 leading-normal">
                                  {node.detail}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 p-4">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                              <span className="font-mono text-xs text-white font-semibold">
                                LIVE INTERFACE SIMULATION // {project.index}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                              RBAC: ACTIVE
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-left font-mono text-xs">
                            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                              <div className="text-[10px] text-zinc-500">QUEUE STATUS</div>
                              <div className="text-emerald-400 font-bold mt-1">SYNCED</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                              <div className="text-[10px] text-zinc-500">VALIDATION</div>
                              <div className="text-white font-bold mt-1">ZOD STRICT</div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                              <div className="text-[10px] text-zinc-500">AUDIT TRAIL</div>
                              <div className="text-amber-400 font-bold mt-1">IMMUTABLE</div>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-400 font-mono">
                            Switch to &ldquo;System Architecture&rdquo; above to inspect the backend BPMN & API nodes.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Restored Approval Rule Matrix & Throughput Validator Sandbox */}
        <ApprovalSandbox />

        {/* Technical Writing & Dispatches */}
        <section id="writing" className="space-y-6">
          <div>
            <span className="text-xs font-mono text-emerald-400 tracking-wider">PUBLICATIONS</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Technical Dispatches & Architecture Notes
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Click any dispatch to open the slide-over technical reader →
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ARTICLES.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="p-6 rounded-2xl bg-[#101216] border border-white/10 flex flex-col justify-between hover:border-emerald-500/40 transition-all space-y-4 cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span className="text-emerald-400">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{article.summary}</p>
                </div>

                <div className="pt-2 space-y-3">
                  <div className="bg-black/60 rounded-xl p-3 border border-white/5 font-mono text-[11px] text-emerald-300/90 overflow-x-auto">
                    <code>{article.codeSnippet}</code>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Full Dispatch →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exact Prototype Footer & Quick Message Builder Section */}
        <section
          id="contact"
          className="rounded-3xl bg-[#0B0D10] border border-white/10 p-8 sm:p-12 space-y-8"
        >
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>System Status: All Pipelines Nominal (99.99%)</span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Let’s Engineer Your Next Mission-Critical System.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Whether you’re scaling enterprise workflow automation, modernizing banking/FinTech
              frontend architecture, or hiring a systems-minded Software Engineer, let’s connect.
            </p>
          </div>

          {/* Primary Social & Email Action Pills */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={copyEmail}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-semibold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-lg shadow-emerald-500/10"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : PROFILE.email}</span>
            </button>

            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs sm:text-sm flex items-center gap-2.5 transition-all"
            >
              <svg
                className="w-4 h-4 text-sky-400 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>LinkedIn</span>
            </a>

            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs sm:text-sm flex items-center gap-2.5 transition-all"
            >
              <svg
                className="w-4 h-4 text-zinc-300 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </a>
          </div>

          {/* QUICK_MESSAGE_BUILDER // DIRECT DISPATCH Card */}
          <form
            onSubmit={handlePrepareDispatch}
            className="rounded-2xl bg-[#101216] border border-white/10 p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold tracking-wider">
                QUICK_MESSAGE_BUILDER // DIRECT DISPATCH
              </span>
              <span className="text-zinc-400">Lagos, NG (WAT)</span>
            </div>

            {/* Select Inquiry Context Pills */}
            <div className="space-y-2.5">
              <label className="block text-xs font-mono text-zinc-400">
                Select Inquiry Context
              </label>
              <div className="flex flex-wrap gap-2.5">
                {(
                  [
                    'Engineering Role / Opportunity',
                    'Enterprise Workflow Architecture',
                    'Technical Collaboration',
                  ] as const
                ).map((ctx) => {
                  const active = inquiryContext === ctx;
                  return (
                    <button
                      key={ctx}
                      type="button"
                      onClick={() => setInquiryContext(ctx)}
                      className={`px-4 py-2 rounded-xl font-mono text-xs border transition-all ${
                        active
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold'
                          : 'bg-black/40 border-white/10 text-zinc-300 hover:border-white/25'
                      }`}
                    >
                      {ctx}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sender Name & Reply-To Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-zinc-400">
                  Your Name / Organization
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Sarah Chen (VP Engineering)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08090C] border border-white/10 text-xs sm:text-sm font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-zinc-400">
                  Reply-To Email Address
                </label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="sarah@company.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08090C] border border-white/10 text-xs sm:text-sm font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Message / Architectural Brief */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-zinc-400">
                Message / Architectural Brief
              </label>
              <textarea
                rows={4}
                value={briefMessage}
                onChange={(e) => setBriefMessage(e.target.value)}
                placeholder="Hi Quadri, we're looking for a Software Engineer to lead our workflow & frontend platform..."
                className="w-full p-4 rounded-xl bg-[#08090C] border border-white/10 text-xs sm:text-sm font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <span className="text-xs font-mono text-zinc-400">
                {dispatchFeedback || 'Instant response within 24h'}
              </span>

              <button
                type="submit"
                disabled={isDispatching}
                className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-black font-mono font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{isDispatching ? 'Dispatching...' : 'Prepare Dispatch'}</span>
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Exact Prototype Bottom Bar */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div>© 2026 {PROFILE.name}. Built with Precision Engineering.</div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            100% Lighthouse Spec
          </span>
          <button
            onClick={() => setIsCmdOpen(true)}
            className="hover:text-white transition-colors"
          >
            ⌘K Command Ready
          </button>
        </div>
      </footer>
    </div>
  );
}