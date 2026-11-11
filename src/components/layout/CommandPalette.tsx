'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Terminal,
  Copy,
  Layers,
  BookOpen,
  FileText,
  Send,
  X,
  CornerDownLeft,
  Check
} from 'lucide-react';
import { PROFILE } from '@/data/portfolioData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
  onToggleAllArch: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenResume,
  onToggleAllArch,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Listen for Cmd+K or Ctrl+K globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'work',
      label: 'Jump to Case Studies (CAR Framework)',
      category: 'Navigation',
      icon: Layers,
      shortcut: 'G W',
      perform: () => {
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'arch-toggle',
      label: 'Switch All Projects to System Architecture View',
      category: 'Engineering Actions',
      icon: Terminal,
      shortcut: 'A V',
      perform: () => {
        onToggleAllArch();
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'resume',
      label: 'Inspect Executive Engineering Resume / CV',
      category: 'Credentials',
      icon: FileText,
      shortcut: 'R V',
      perform: () => {
        onClose();
        onOpenResume();
      },
    },
    {
      id: 'writing',
      label: 'Read Technical Dispatches & Articles',
      category: 'Navigation',
      icon: BookOpen,
      shortcut: 'G B',
      perform: () => {
        document.getElementById('writing')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'copy-email',
      label: copied ? 'Email Copied to Clipboard!' : `Copy Direct Email (${PROFILE.email})`,
      category: 'Communication',
      icon: copied ? Check : Copy,
      shortcut: 'C E',
      perform: () => {
        navigator.clipboard.writeText(PROFILE.email);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          onClose();
        }, 900);
      },
    },
    {
      id: 'contact',
      label: 'Open Direct Dispatch Contact Builder',
      category: 'Communication',
      icon: Send,
      shortcut: 'G C',
      perform: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-xl bg-[#121316] border border-white/15 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 gap-3">
          <Search className="w-4 h-4 text-emerald-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search sections... (ESC to close)"
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-zinc-500">
              No matching engineering commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.perform}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 text-left group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-white/5 border border-white/5 text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-zinc-200 group-hover:text-white">
                        {item.label}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">{item.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-black/50 border border-white/10 font-mono text-[10px] text-zinc-400">
                      {item.shortcut}
                    </span>
                    <CornerDownLeft className="w-3 h-3 text-zinc-600 group-hover:text-emerald-400" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>QO // COMMAND PALETTE v1.0</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
}