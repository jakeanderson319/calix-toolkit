'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  WifiOff, 
  Gauge, 
  Activity, 
  Wifi, 
  Phone,
  Wrench,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  HelpCircle
} from 'lucide-react';
import treeData from '@/data/troubleshoot-tree.json';

type Category = {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
};

type Option = {
  label: string;
  next: string;
};

type QuestionNode = {
  type: 'question';
  text: string;
  help?: string;
  options: Option[];
};

type ResolutionNode = {
  type: 'resolution';
  status: 'critical' | 'warning' | 'action' | 'info';
  title: string;
  steps: string[];
  escalation?: string;
};

type TreeNode = QuestionNode | ResolutionNode;

type Tree = {
  start: string;
  nodes: Record<string, TreeNode>;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  WifiOff,
  Gauge,
  Activity,
  Wifi,
  Phone,
  Wrench
};

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  green: { 
    bg: 'bg-green-500/10', 
    border: 'border-green-500/30', 
    text: 'text-green-400',
    glow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]'
  },
  red: { 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/30', 
    text: 'text-red-400',
    glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]'
  },
  yellow: { 
    bg: 'bg-yellow-500/10', 
    border: 'border-yellow-500/30', 
    text: 'text-yellow-400',
    glow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]'
  },
  amber: { 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-500/30', 
    text: 'text-amber-400',
    glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]'
  },
  blue: { 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/30', 
    text: 'text-blue-400',
    glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]'
  },
  purple: { 
    bg: 'bg-purple-500/10', 
    border: 'border-purple-500/30', 
    text: 'text-purple-400',
    glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
  }
};

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  critical: { icon: XCircle, color: 'text-red-400', label: 'Critical' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', label: 'Warning' },
  action: { icon: CheckCircle, color: 'text-signal', label: 'Action Required' },
  info: { icon: Info, color: 'text-blue-400', label: 'Info' }
};

export default function TroubleshootPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedCategory) {
          handleBack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCategory, history]);

  const categories = treeData.categories as Category[];
  const trees = treeData.trees as Record<string, Tree>;

  const handleCategorySelect = (categoryId: string) => {
    const tree = trees[categoryId];
    if (tree) {
      setSelectedCategory(categoryId);
      setCurrentNodeId(tree.start);
      setHistory([tree.start]);
    }
  };

  const handleOptionSelect = (nextNodeId: string) => {
    setCurrentNodeId(nextNodeId);
    setHistory(prev => [...prev, nextNodeId]);
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentNodeId(newHistory[newHistory.length - 1]);
    } else {
      handleReset();
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setCurrentNodeId(null);
    setHistory([]);
  };

  const getCurrentNode = (): TreeNode | null => {
    if (!selectedCategory || !currentNodeId) return null;
    return trees[selectedCategory]?.nodes[currentNodeId] || null;
  };

  const currentNode = getCurrentNode();
  const currentCategory = categories.find(c => c.id === selectedCategory);

  if (!mounted) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-carbon-700 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-carbon-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/" 
            className="p-2 rounded-lg bg-carbon-800 border border-carbon-700 hover:border-carbon-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-carbon-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-carbon-100 font-mono">
              Troubleshooting Tree
            </h1>
            <p className="text-carbon-400 text-sm">
              Symptom-based diagnostic flowchart
            </p>
          </div>
        </div>

        {/* Category Selection */}
        {!selectedCategory && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-carbon-200 mb-4">
              What's the issue?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category, index) => {
                const IconComponent = iconMap[category.icon] || HelpCircle;
                const colors = colorMap[category.color] || colorMap.blue;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`
                      group p-5 rounded-xl border text-left transition-all duration-300
                      ${colors.bg} ${colors.border} ${colors.glow}
                      hover:border-opacity-60 hover:scale-[1.02]
                      animate-fadeIn
                    `}
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                        <IconComponent className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-carbon-100 mb-1 flex items-center gap-2">
                          {category.title}
                          <ChevronRight className="w-4 h-4 text-carbon-500 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-sm text-carbon-400">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Troubleshooting Flow */}
        {selectedCategory && currentNode && (
          <div className="space-y-6 animate-fadeIn">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={handleReset}
                  className="text-carbon-400 hover:text-carbon-200 transition-colors"
                >
                  Start
                </button>
                {currentCategory && (
                  <>
                    <ChevronRight className="w-4 h-4 text-carbon-600" />
                    <span className={colorMap[currentCategory.color]?.text || 'text-carbon-300'}>
                      {currentCategory.title}
                    </span>
                  </>
                )}
                <span className="text-carbon-600 ml-2">
                  Step {history.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm
                    bg-carbon-800 border border-carbon-700 text-carbon-300
                    hover:border-carbon-600 hover:text-carbon-100 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm
                    bg-carbon-800 border border-carbon-700 text-carbon-300
                    hover:border-carbon-600 hover:text-carbon-100 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart
                </button>
              </div>
            </div>

            {/* Question Node */}
            {currentNode.type === 'question' && (
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-carbon-800/50 border border-carbon-700">
                  <div className="flex items-start gap-3 mb-4">
                    <HelpCircle className="w-6 h-6 text-signal shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-carbon-100">
                        {currentNode.text}
                      </h3>
                      {currentNode.help && (
                        <p className="text-sm text-carbon-400 mt-2">
                          💡 {currentNode.help}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  {currentNode.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(option.next)}
                      className="group flex items-center justify-between p-4 rounded-xl
                        bg-carbon-800 border border-carbon-700 text-left
                        hover:border-signal/50 hover:bg-carbon-800/80 
                        transition-all duration-200"
                    >
                      <span className="text-carbon-200 group-hover:text-carbon-100">
                        {option.label}
                      </span>
                      <ChevronRight className="w-5 h-5 text-carbon-500 group-hover:text-signal group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resolution Node */}
            {currentNode.type === 'resolution' && (
              <div className="space-y-4">
                {/* Status Badge */}
                <div className={`
                  inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                  ${currentNode.status === 'critical' ? 'bg-red-500/20 text-red-400' : ''}
                  ${currentNode.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                  ${currentNode.status === 'action' ? 'bg-signal/20 text-signal' : ''}
                  ${currentNode.status === 'info' ? 'bg-blue-500/20 text-blue-400' : ''}
                `}>
                  {(() => {
                    const StatusIcon = statusConfig[currentNode.status]?.icon || Info;
                    return <StatusIcon className="w-4 h-4" />;
                  })()}
                  {statusConfig[currentNode.status]?.label || 'Info'}
                </div>

                {/* Resolution Card */}
                <div className={`
                  p-6 rounded-xl border
                  ${currentNode.status === 'critical' ? 'bg-red-500/5 border-red-500/30' : ''}
                  ${currentNode.status === 'warning' ? 'bg-yellow-500/5 border-yellow-500/30' : ''}
                  ${currentNode.status === 'action' ? 'bg-signal/5 border-signal/30' : ''}
                  ${currentNode.status === 'info' ? 'bg-blue-500/5 border-blue-500/30' : ''}
                `}>
                  <h3 className="text-xl font-bold text-carbon-100 mb-4">
                    {currentNode.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <h4 className="text-sm font-semibold text-carbon-400 uppercase tracking-wider">
                      Steps to Resolve
                    </h4>
                    <ol className="space-y-2">
                      {currentNode.steps.map((step, index) => (
                        <li 
                          key={index}
                          className="flex items-start gap-3 text-carbon-200"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-carbon-700 
                            flex items-center justify-center text-xs font-mono text-carbon-300">
                            {index + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {currentNode.escalation && (
                    <div className="pt-4 border-t border-carbon-700">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-amber-400 mb-1">
                            Escalation
                          </h4>
                          <p className="text-sm text-carbon-300">
                            {currentNode.escalation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-xl font-semibold
                      bg-signal text-carbon-950 hover:bg-signal/90
                      transition-colors"
                  >
                    Start New Issue
                  </button>
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-xl font-semibold
                      bg-carbon-800 border border-carbon-700 text-carbon-200
                      hover:border-carbon-600 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keyboard Hints */}
        <div className="mt-12 pt-6 border-t border-carbon-800">
          <p className="text-center text-carbon-500 text-sm">
            Press <kbd className="px-2 py-1 rounded bg-carbon-800 border border-carbon-700 text-carbon-400 font-mono text-xs">Esc</kbd> to go back
          </p>
        </div>
      </div>
    </main>
  );
}
