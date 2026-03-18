'use client'

import Link from 'next/link'
import { BookOpen, GitBranch, Wifi, Signal } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Wifi className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Calix Toolkit</h1>
            <p className="text-xs text-[var(--text-muted)] mono">ISP Support Reference</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          {/* Hero */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] status-pulse"></span>
              <span className="text-xs text-[var(--text-secondary)] mono">v1.0.0</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Quick Reference.<br />
              <span className="text-[var(--text-secondary)]">Fast Troubleshooting.</span>
            </h2>
            <p className="text-[var(--text-muted)] max-w-md mx-auto">
              Everything you need for Calix ONT and router support, searchable and interactive.
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/reference" className="group">
              <div className="card-glow relative p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] transition-all duration-300 hover:border-[var(--border-medium)] hover:translate-y-[-2px]">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <Signal className="w-5 h-5 text-[var(--text-muted)] group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold mb-2">ONT Reference</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Error codes, light levels, device specs, and common fixes. Search and filter by equipment.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs mono rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">GigaCenter</span>
                  <span className="px-2 py-1 text-xs mono rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">GigaSpire</span>
                  <span className="px-2 py-1 text-xs mono rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">ONT</span>
                </div>
              </div>
            </Link>

            <Link href="/troubleshoot" className="group">
              <div className="card-glow relative p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] transition-all duration-300 hover:border-[var(--border-medium)] hover:translate-y-[-2px]">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <GitBranch className="w-6 h-6 text-green-400" />
                  </div>
                  <Signal className="w-5 h-5 text-[var(--text-muted)] group-hover:text-green-400 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Troubleshooting Tree</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  Interactive decision tree. Pick symptoms, follow steps, get resolutions or escalation notes.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs mono rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">No Internet</span>
                  <span className="px-2 py-1 text-xs mono rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">Slow Speeds</span>
                  <span className="px-2 py-1 text-xs mono rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">Wi-Fi</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Footer hint */}
          <p className="text-center text-xs text-[var(--text-muted)] mt-8">
            Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] mono">/</kbd> to search anywhere
          </p>
        </div>
      </div>
    </main>
  )
}
