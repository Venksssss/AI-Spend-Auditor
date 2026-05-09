'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuditFormData } from '@/types'
import { runAudit, AuditResult } from '@/lib/auditEngine'
import { generateSummary } from '@/lib/generateSummary'
const TOOL_LABELS: Record<string, string> = {
  cursor: 'Cursor',
  github_copilot: 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  anthropic_api: 'Anthropic API',
  openai_api: 'OpenAI API',
  gemini: 'Gemini',
  windsurf: 'Windsurf',
}

const SEVERITY_COLORS: Record<string, string> = {
  high: 'border-red-500/50 bg-red-500/5',
  medium: 'border-yellow-500/50 bg-yellow-500/5',
  low: 'border-blue-500/50 bg-blue-500/5',
  optimal: 'border-emerald-500/50 bg-emerald-500/5',
}

const SEVERITY_BADGE: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-blue-500/20 text-blue-400',
  optimal: 'bg-emerald-500/20 text-emerald-400',
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<AuditResult | null>(null)
  const [summary, setSummary] = useState<string>('')
  useEffect(() => {
  const saved = localStorage.getItem('auditFormData')
  if (!saved) {
    router.push('/audit')
    return
  }
  const formData: AuditFormData = JSON.parse(saved)
  if (formData.tools.length === 0) {
    router.push('/audit')
    return
  }
  const auditResult = runAudit(formData)
  setResult(auditResult)
  generateSummary(auditResult).then(setSummary)
}, [router])

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Analyzing your spend...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Hero Savings */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 mb-8 text-center">
          <p className="text-emerald-400 text-sm mb-2">Total Potential Savings</p>
          <div className="text-6xl font-bold text-white mb-2">
            ${result.totalMonthlySavings.toFixed(0)}
            <span className="text-2xl text-slate-400">/mo</span>
          </div>
          <div className="text-emerald-400 text-xl">
            ${result.totalAnnualSavings.toFixed(0)} per year
          </div>
        </div>

        {/* Credex CTA for high savings */}
        {result.isHighSavings && (
          <div className="bg-slate-800 border border-emerald-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-bold text-lg mb-2">
              💰 You could save even more with Credex
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Credex sells discounted AI credits for Cursor, Claude, ChatGPT and more.
              Book a free consultation to see how much more you can save.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
            >
              Book Free Credex Consultation →
            </a>
          </div>
        )}

        {/* Per Tool Breakdown */}
        {/* AI Summary */}
        {summary && (
          <div className="bg-slate-800 border border-slate-700 
            rounded-2xl p-6 mb-8">
            <p className="text-emerald-400 text-xs font-semibold 
              uppercase tracking-wider mb-3">
              AI Analysis
            </p>
            <p className="text-slate-300 leading-relaxed">
              {summary}
            </p>
          </div>
        )}
        <h2 className="text-white font-bold text-xl mb-4">Tool-by-Tool Breakdown</h2>
        <div className="space-y-4 mb-8">
          {result.toolResults.map((tool, i) => (
            <div key={i} className={`rounded-2xl p-6 border ${SEVERITY_COLORS[tool.severity]}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white font-semibold">{TOOL_LABELS[tool.toolName]}</h3>
                  <p className="text-slate-400 text-sm">Current spend: ${tool.currentSpend}/mo</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${SEVERITY_BADGE[tool.severity]}`}>
                    {tool.severity === 'optimal' ? '✓ Optimal' : `Save $${tool.estimatedSavings.toFixed(0)}/mo`}
                  </span>
                </div>
              </div>
              <p className="text-white text-sm font-medium mb-1">{tool.recommendedAction}</p>
              <p className="text-slate-400 text-sm">{tool.reason}</p>
            </div>
          ))}
        </div>

        {/* Low savings message */}
        {result.totalMonthlySavings < 100 && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 text-center">
            <p className="text-emerald-400 font-semibold mb-2">✓ You are spending well!</p>
            <p className="text-slate-400 text-sm">
              Your AI stack looks optimized. Sign up to get notified when new savings opportunities apply to your stack.
            </p>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => router.push('/audit')}
          className="w-full border border-slate-600 hover:border-slate-500 text-slate-400 hover:text-white font-semibold py-4 rounded-xl transition-colors duration-200"
        >
          ← Modify My Audit
        </button>

      </div>
    </div>
  )
}
