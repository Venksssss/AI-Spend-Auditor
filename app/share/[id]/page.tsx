import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data } = await supabase
    .from('audits')
    .select('total_monthly_savings, total_annual_savings')
    .eq('share_id', id)
    .single()

  if (!data) return { title: 'Audit Not Found' }

  return {
    title: `AI Spend Audit — $${data.total_monthly_savings}/mo savings found`,
    description: `This team could save $${data.total_monthly_savings}/month ($${data.total_annual_savings}/year) on AI tools.`,
    openGraph: {
      title: `AI Spend Audit — $${data.total_monthly_savings}/mo savings found`,
      description: `This team could save $${data.total_monthly_savings}/month on AI tools. Run your free audit now.`,
    },
    twitter: {
      card: 'summary',
      title: `AI Spend Audit — $${data.total_monthly_savings}/mo savings found`,
      description: `This team could save $${data.total_monthly_savings}/month on AI tools.`,
    }
  }
}

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: audit } = await supabase
    .from('audits')
    .select('*')
    .eq('share_id', id)
    .single()

  if (!audit) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-emerald-400 text-sm mb-2">Shared AI Spend Audit</p>
          <h1 className="text-3xl font-bold text-white mb-2">
            Audit Results
          </h1>
          <p className="text-slate-400 text-sm">
            Use case: {audit.use_case} · Team size: {audit.team_size}
          </p>
        </div>

        {/* Hero Savings */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 mb-8 text-center">
          <p className="text-emerald-400 text-sm mb-2">Total Potential Savings</p>
          <div className="text-6xl font-bold text-white mb-2">
            ${audit.total_monthly_savings}
            <span className="text-2xl text-slate-400">/mo</span>
          </div>
          <div className="text-emerald-400 text-xl">
            ${audit.total_annual_savings} per year
          </div>
        </div>

        {/* Tools Breakdown */}
        <h2 className="text-white font-bold text-xl mb-4">Tool Breakdown</h2>
        <div className="space-y-4 mb-8">
          {(audit.tools as Array<{toolName: string; plan: string; seats: number; monthlySpend: number}>).map((tool, i) => (
            <div key={i} className={`rounded-2xl p-6 border ${SEVERITY_COLORS['low']}`}>
              <h3 className="text-white font-semibold">
                {TOOL_LABELS[tool.toolName] || tool.toolName}
              </h3>
              <p className="text-slate-400 text-sm">
                Plan: {tool.plan} · Seats: {tool.seats} · 
                Spend: ${tool.monthlySpend}/mo
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
          <p className="text-white font-bold mb-2">
            Want to audit your own AI spend?
          </p>
          <p className="text-slate-400 text-sm mb-4">
            Free, no login required, takes 2 minutes.
          </p>
          
          <Link
            href="/"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
          >
            Run My Free Audit →
          </Link>
        </div>

      </div>
    </div>
  )
}