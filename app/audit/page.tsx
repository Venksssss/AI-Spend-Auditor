'use client'

import { useState, useEffect } from 'react'
import { AuditFormData, ToolEntry, ToolName, UseCase } from '@/types'

const TOOLS_CONFIG: Record<ToolName, { label: string; plans: string[] }> = {
  cursor: {
    label: 'Cursor',
    plans: ['Hobby', 'Pro', 'Business', 'Enterprise']
  },
  github_copilot: {
    label: 'GitHub Copilot',
    plans: ['Individual', 'Business', 'Enterprise']
  },
  claude: {
    label: 'Claude',
    plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API']
  },
  chatgpt: {
    label: 'ChatGPT',
    plans: ['Plus', 'Team', 'Enterprise', 'API']
  },
  anthropic_api: {
    label: 'Anthropic API',
    plans: ['Pay as you go']
  },
  openai_api: {
    label: 'OpenAI API',
    plans: ['Pay as you go']
  },
  gemini: {
    label: 'Gemini',
    plans: ['Pro', 'Ultra', 'API']
  },
  windsurf: {
    label: 'Windsurf',
    plans: ['Free', 'Pro', 'Teams']
  }
}

const DEFAULT_FORM: AuditFormData = {
  tools: [],
  teamSize: 1,
  useCase: 'mixed'
}

export default function AuditPage() {
  const [formData, setFormData] = useState<AuditFormData>(DEFAULT_FORM)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('auditFormData')
    if (saved) setFormData(JSON.parse(saved))
  }, [])

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('auditFormData', JSON.stringify(formData))
  }, [formData])

  const addTool = () => {
    const newTool: ToolEntry = {
      id: Date.now().toString(),
      toolName: 'cursor',
      plan: 'Pro',
      monthlySpend: 0,
      seats: 1
    }
    setFormData(prev => ({ ...prev, tools: [...prev.tools, newTool] }))
  }

  const removeTool = (id: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t.id !== id)
    }))
  }

  const updateTool = (id: string, field: keyof ToolEntry, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.map(t => t.id === id ? { ...t, [field]: value } : t)
    }))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Your AI Spend Audit
          </h1>
          <p className="text-slate-400 mt-2">
            Add the AI tools your team pays for
          </p>
        </div>

        {/* Team Info */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 
          border border-slate-700">
          <h2 className="text-white font-semibold mb-4">
            Team Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-2 block">
                Team Size
              </label>
              <input
                type="number"
                min={1}
                value={formData.teamSize}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  teamSize: parseInt(e.target.value) || 1
                }))}
                className="w-full bg-slate-700 text-white rounded-lg 
                  px-4 py-2 border border-slate-600 
                  focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-2 block">
                Primary Use Case
              </label>
              <select
                value={formData.useCase}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  useCase: e.target.value as UseCase
                }))}
                className="w-full bg-slate-700 text-white rounded-lg 
                  px-4 py-2 border border-slate-600 
                  focus:outline-none focus:border-emerald-500"
              >
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="data">Data</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tools List */}
        <div className="space-y-4 mb-6">
          {formData.tools.map(tool => (
            <div key={tool.id} className="bg-slate-800 rounded-2xl p-6 
              border border-slate-700">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Tool Name */}
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Tool
                  </label>
                  <select
                    value={tool.toolName}
                    onChange={e => updateTool(
                      tool.id, 
                      'toolName', 
                      e.target.value
                    )}
                    className="w-full bg-slate-700 text-white rounded-lg 
                      px-4 py-2 border border-slate-600 
                      focus:outline-none focus:border-emerald-500"
                  >
                    {Object.entries(TOOLS_CONFIG).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>

                {/* Plan */}
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Plan
                  </label>
                  <select
                    value={tool.plan}
                    onChange={e => updateTool(tool.id, 'plan', e.target.value)}
                    className="w-full bg-slate-700 text-white rounded-lg 
                      px-4 py-2 border border-slate-600 
                      focus:outline-none focus:border-emerald-500"
                  >
                    {TOOLS_CONFIG[tool.toolName].plans.map(plan => (
                      <option key={plan} value={plan}>{plan}</option>
                    ))}
                  </select>
                </div>

                {/* Monthly Spend */}
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Monthly Spend ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={tool.monthlySpend}
                    onChange={e => updateTool(
                      tool.id, 
                      'monthlySpend', 
                      parseFloat(e.target.value) || 0
                    )}
                    className="w-full bg-slate-700 text-white rounded-lg 
                      px-4 py-2 border border-slate-600 
                      focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Seats */}
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Number of Seats
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={tool.seats}
                    onChange={e => updateTool(
                      tool.id, 
                      'seats', 
                      parseInt(e.target.value) || 1
                    )}
                    className="w-full bg-slate-700 text-white rounded-lg 
                      px-4 py-2 border border-slate-600 
                      focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeTool(tool.id)}
                className="text-red-400 hover:text-red-300 text-sm 
                  transition-colors"
              >
                Remove tool
              </button>
            </div>
          ))}
        </div>

        {/* Add Tool Button */}
        <button
          onClick={addTool}
          className="w-full border-2 border-dashed border-slate-600 
            hover:border-emerald-500 text-slate-400 hover:text-emerald-400 
            rounded-2xl py-4 transition-colors duration-200 mb-6"
        >
          + Add AI Tool
        </button>

        {/* Submit Button */}
        <button
          onClick={() => alert('Audit engine coming next!')}
          disabled={formData.tools.length === 0}
          className="w-full bg-emerald-500 hover:bg-emerald-400 
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-semibold py-4 rounded-xl text-lg 
            transition-colors duration-200"
        >
          Generate My Audit →
        </button>

      </div>
    </main>
  )
}