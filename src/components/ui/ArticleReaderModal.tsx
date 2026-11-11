'use client';

import React from 'react';
import { X, BookOpen, Clock, Calendar, Terminal } from 'lucide-react';
import { TechnicalArticle } from '@/types/portfolio';

interface ArticleReaderModalProps {
  article: TechnicalArticle | null;
  onClose: () => void;
}

export default function ArticleReaderModal({ article, onClose }: ArticleReaderModalProps) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0E0F12] border-l border-white/10 h-full flex flex-col justify-between overflow-y-auto p-6 sm:p-8 space-y-6">
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <BookOpen className="w-4 h-4" />
              <span>{article.category}</span>
            </div>
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1"
            >
              <span>CLOSE</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Metadata & Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {article.readTime}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              {article.title}
            </h2>

            <p className="text-sm text-emerald-400/90 font-mono border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-500/5">
              {article.summary}
            </p>
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed pt-2">
            {article.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Architectural Implementation Block */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>PRODUCTION PATTERN REFERENCE</span>
            </div>
            <pre className="p-4 rounded-lg bg-black border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
              <code>{article.codeSnippet}</code>
            </pre>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>Authored by Quadri Olaniyan</span>
          <button
            onClick={onClose}
            className="text-emerald-400 hover:underline"
          >
            ← Back to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}