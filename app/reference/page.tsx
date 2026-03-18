'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Search, ArrowLeft, Wifi, Router, Radio, AlertCircle, 
  AlertTriangle, Info, CheckCircle, Lightbulb, ChevronDown, ChevronUp
} from 'lucide-react'
import referenceData from '@/data/calix-reference.json'

type Severity = 'critical' | 'warning' | 'info'
type Category = 'all' | 'ont' | 'router' | 'devices' | 'tips'
type DeviceType = 'all' | 'GigaSpire' | 'GigaCenter' | 'ONT'

const severityConfig = {
  critical: { color: 'red', icon: AlertCircle, label: 'Critical' },
  warning: { color: 'yellow', icon: AlertTriangle, label: 'Warning' },
  info: { color: 'blue', icon: Info, label: 'Info' },
}

export default function ReferencePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [deviceType, setDeviceType] = useState<DeviceType>('all')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
  }

  const filteredDevices = useMemo(() => {
    return referenceData.devices.filter(device => {
      const matchesSearch = search === '' || 
        device.name.toLowerCase().includes(search.toLowerCase()) ||
        device.model.toLowerCase().includes(search.toLowerCase()) ||
        device.description.toLowerCase().includes(search.toLowerCase())
      const matchesType = deviceType === 'all' || device.type === deviceType
      return matchesSearch && matchesType
    })
  }, [search, deviceType])

  const filteredErrors = useMemo(() => {
    return referenceData.errorCodes.filter(error => {
      const matchesSearch = search === '' ||
        error.code.toLowerCase().includes(search.toLowerCase()) ||
        error.title.toLowerCase().includes(search.toLowerCase()) ||
        error.description.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
  }, [search])

  const filteredIssues = useMemo(() => {
    return referenceData.commonIssues.filter(issue => {
      const matchesSearch = search === '' ||
        issue.title.toLowerCase().includes(search.toLowerCase()) ||
        issue.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase()))
      return matchesSearch
    })
  }, [search])

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-sm px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[var(--text-muted)]" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">ONT Reference</h1>
              <p className="text-xs text-[var(--text-muted)] mono">Calix Equipment & Error Codes</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search devices, errors, symptoms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="all">All Categories</option>
                <option value="devices">Devices</option>
                <option value="ont">Error Codes</option>
                <option value="router">Common Issues</option>
                <option value="tips">Quick Tips</option>
              </select>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as DeviceType)}
                className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="all">All Equipment</option>
                <option value="GigaSpire">GigaSpire</option>
                <option value="GigaCenter">GigaCenter</option>
                <option value="ONT">ONT</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Devices Section */}
        {(category === 'all' || category === 'devices') && filteredDevices.length > 0 && (
          <section className="mb-10 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Router className="w-5 h-5 text-blue-400" />
              Equipment
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices.map(device => (
                <div
                  key={device.id}
                  className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs mono text-[var(--text-muted)]">{device.model}</span>
                      <h3 className="font-medium">{device.name}</h3>
                    </div>
                    <span className={`px-2 py-0.5 text-xs mono rounded ${
                      device.type === 'GigaSpire' ? 'bg-green-500/10 text-green-400' :
                      device.type === 'GigaCenter' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>
                      {device.type}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mb-3">{device.description}</p>
                  <div className="space-y-1 text-xs">
                    {Object.entries(device.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-[var(--text-muted)] capitalize">{key}</span>
                        <span className="mono text-[var(--text-secondary)]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Error Codes Section */}
        {(category === 'all' || category === 'ont') && filteredErrors.length > 0 && (
          <section className="mb-10 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              Error Codes
            </h2>
            <div className="space-y-3">
              {filteredErrors.map(error => {
                const isExpanded = expandedCards.has(error.code)
                const config = severityConfig[error.severity as Severity]
                const Icon = config.icon
                
                return (
                  <div
                    key={error.code}
                    className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden"
                  >
                    <button
                      onClick={() => toggleCard(error.code)}
                      className="w-full p-4 flex items-center gap-4 text-left hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${config.color}-500/10 border border-${config.color}-500/20`}>
                        <Icon className={`w-5 h-5 text-${config.color}-400`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="mono font-semibold">{error.code}</span>
                          <span className={`px-2 py-0.5 text-xs rounded bg-${config.color}-500/10 text-${config.color}-400`}>
                            {error.category}
                          </span>
                        </div>
                        <h3 className="font-medium">{error.title}</h3>
                        <p className="text-sm text-[var(--text-muted)] truncate">{error.description}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-[var(--border-subtle)] animate-fade-in">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2 text-[var(--text-secondary)]">Possible Causes</h4>
                            <ul className="space-y-1">
                              {error.causes.map((cause, i) => (
                                <li key={i} className="text-sm text-[var(--text-muted)] flex gap-2">
                                  <span className="text-[var(--text-muted)]">•</span>
                                  {cause}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2 text-[var(--text-secondary)]">Fixes</h4>
                            <ol className="space-y-1">
                              {error.fixes.map((fix, i) => (
                                <li key={i} className="text-sm text-[var(--text-muted)] flex gap-2">
                                  <span className="mono text-xs text-[var(--accent-primary)]">{i + 1}.</span>
                                  {fix}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Common Issues Section */}
        {(category === 'all' || category === 'router') && filteredIssues.length > 0 && (
          <section className="mb-10 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-yellow-400" />
              Common Issues
            </h2>
            <div className="space-y-3">
              {filteredIssues.map(issue => {
                const isExpanded = expandedCards.has(issue.id)
                
                return (
                  <div
                    key={issue.id}
                    className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden"
                  >
                    <button
                      onClick={() => toggleCard(issue.id)}
                      className="w-full p-4 flex items-center gap-4 text-left hover:bg-[var(--bg-tertiary)]/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{issue.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {issue.symptoms.slice(0, 3).map((symptom, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-[var(--border-subtle)] animate-fade-in">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2 text-[var(--text-secondary)]">Quick Checks</h4>
                            <ol className="space-y-1">
                              {issue.quickChecks.map((check, i) => (
                                <li key={i} className="text-sm text-[var(--text-muted)] flex gap-2">
                                  <span className="mono text-xs text-[var(--accent-primary)]">{i + 1}.</span>
                                  {check}
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                            <h4 className="text-sm font-medium mb-1 text-green-400 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Resolution
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)]">{issue.resolution}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Quick Tips Section */}
        {(category === 'all' || category === 'tips') && (
          <section className="mb-10 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Quick Tips
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {referenceData.quickTips.map((tip, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
                >
                  <h3 className="font-medium mb-2 text-amber-400">{tip.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{tip.tip}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Light Levels Reference */}
        {(category === 'all' || category === 'ont') && (
          <section className="mb-10 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-purple-400" />
              Optical Light Levels
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* GPON */}
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <h3 className="font-medium mb-3 mono">GPON</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 rounded bg-green-500/10">
                    <span className="text-green-400">Excellent</span>
                    <span className="mono text-[var(--text-secondary)]">-8 to -15 dBm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-blue-500/10">
                    <span className="text-blue-400">Good</span>
                    <span className="mono text-[var(--text-secondary)]">-15 to -20 dBm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-yellow-500/10">
                    <span className="text-yellow-400">Marginal</span>
                    <span className="mono text-[var(--text-secondary)]">-20 to -25 dBm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-orange-500/10">
                    <span className="text-orange-400">Poor</span>
                    <span className="mono text-[var(--text-secondary)]">-25 to -28 dBm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-red-500/10">
                    <span className="text-red-400">Fail</span>
                    <span className="mono text-[var(--text-secondary)]">&lt; -28 dBm</span>
                  </div>
                </div>
              </div>
              
              {/* XGS-PON */}
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <h3 className="font-medium mb-3 mono">XGS-PON</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 rounded bg-green-500/10">
                    <span className="text-green-400">Excellent</span>
                    <span className="mono text-[var(--text-secondary)]">-8 to -14 dBm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-blue-500/10">
                    <span className="text-blue-400">Good</span>
                    <span className="mono text-[var(--text-secondary)]">-14 to -18 dBm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-yellow-500/10">
                    <span className="text-yellow-400">Marginal</span>
                    <span className="mono text-[var(--text-secondary)]">-18 to -24 dBm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-orange-500/10">
                    <span className="text-orange-400">Poor</span>
                    <span className="mono text-[var(--text-secondary)]">-24 to -28 dBm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-red-500/10">
                    <span className="text-red-400">Fail</span>
                    <span className="mono text-[var(--text-secondary)]">&lt; -28 dBm</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* No results */}
        {search && filteredDevices.length === 0 && filteredErrors.length === 0 && filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">No results for "{search}"</p>
            <button
              onClick={() => setSearch('')}
              className="mt-4 text-sm text-[var(--accent-primary)] hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
