import { AuditFormData, ToolEntry, ToolName } from '@/types'

// ============================================
// OFFICIAL PRICING DATA (per seat/month)
// Sources in PRICING_DATA.md
// ============================================
export const PRICING: Record<ToolName, Record<string, number>> = {
  cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
    Enterprise: 80
  },
  github_copilot: {
    Individual: 10,
    Business: 19,
    Enterprise: 39
  },
  claude: {
    Free: 0,
    Pro: 20,
    Max: 100,
    Team: 30,
    Enterprise: 60,
    API: 0
  },
  chatgpt: {
    Plus: 20,
    Team: 30,
    Enterprise: 60,
    API: 0
  },
  anthropic_api: {
    'Pay as you go': 0
  },
  openai_api: {
    'Pay as you go': 0
  },
  gemini: {
    Pro: 20,
    Ultra: 300,
    API: 0
  },
  windsurf: {
    Free: 0,
    Pro: 15,
    Teams: 35
  }
}

// ============================================
// AUDIT RESULT TYPE
// ============================================
export interface ToolAuditResult {
  toolName: ToolName
  currentSpend: number
  recommendedAction: string
  estimatedSavings: number
  reason: string
  severity: 'high' | 'medium' | 'low' | 'optimal'
}

export interface AuditResult {
  toolResults: ToolAuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  isHighSavings: boolean
}

// ============================================
// AUDIT RULES
// ============================================
function auditTool(tool: ToolEntry, teamSize: number, useCase: string): ToolAuditResult {
  const officialPrice = PRICING[tool.toolName][tool.plan] ?? 0
  const expectedSpend = officialPrice * tool.seats
  const overpayAmount = tool.monthlySpend - expectedSpend

  // Rule 1: Overpaying vs official price
  if (overpayAmount > 5) {
    return {
      toolName: tool.toolName,
      currentSpend: tool.monthlySpend,
      recommendedAction: `You're paying $${tool.monthlySpend}/mo but the ${tool.plan} plan costs $${expectedSpend}/mo for ${tool.seats} seats.`,
      estimatedSavings: overpayAmount,
      reason: `Official ${tool.plan} pricing is $${officialPrice}/seat/month. Check your billing.`,
      severity: overpayAmount > 100 ? 'high' : 'medium'
    }
  }

  // Rule 2: Team plan for very few users
  if (tool.toolName === 'claude' && tool.plan === 'Team' && tool.seats <= 2) {
    const proSavings = tool.monthlySpend - (20 * tool.seats)
    if (proSavings > 0) {
      return {
        toolName: tool.toolName,
        currentSpend: tool.monthlySpend,
        recommendedAction: 'Downgrade to Claude Pro — Team plan is overkill for 2 or fewer users.',
        estimatedSavings: proSavings,
        reason: 'Claude Team adds collaboration features only useful for 3+ person teams.',
        severity: 'medium'
      }
    }
  }

  // Rule 3: ChatGPT Team for small teams — Claude is cheaper
  if (tool.toolName === 'chatgpt' && tool.plan === 'Team' && useCase === 'coding') {
    return {
      toolName: tool.toolName,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'Consider switching to Cursor or Claude for coding use cases.',
      estimatedSavings: tool.monthlySpend * 0.3,
      reason: 'For coding teams, Cursor Pro at $20/seat offers better code completion than ChatGPT Team.',
      severity: 'medium'
    }
  }

  // Rule 4: Cursor Business for small teams
  if (tool.toolName === 'cursor' && tool.plan === 'Business' && tool.seats <= 3) {
    const savings = (40 - 20) * tool.seats
    return {
      toolName: tool.toolName,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'Downgrade to Cursor Pro — Business plan is for larger teams.',
      estimatedSavings: savings,
      reason: 'Cursor Business adds admin controls only needed for 5+ person teams.',
      severity: 'medium'
    }
  }

  // Rule 5: GitHub Copilot for coding — compare with Cursor
  if (tool.toolName === 'github_copilot' && tool.plan === 'Business' && useCase === 'coding') {
    return {
      toolName: tool.toolName,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'Consider Cursor Pro as an alternative at same price point.',
      estimatedSavings: 0,
      reason: 'Cursor Pro ($20/seat) offers similar features with better context awareness for most coding workflows.',
      severity: 'low'
    }
  }

  // Rule 6: Gemini Ultra — very expensive
  if (tool.toolName === 'gemini' && tool.plan === 'Ultra') {
    return {
      toolName: tool.toolName,
      currentSpend: tool.monthlySpend,
      recommendedAction: 'Evaluate if Ultra features are actually used — Pro may suffice.',
      estimatedSavings: (300 - 20) * tool.seats,
      reason: 'Gemini Ultra is $300/seat vs $20 for Pro. Significant savings if Ultra-only features are unused.',
      severity: 'high'
    }
  }

  // Default: Spending looks optimal
  return {
    toolName: tool.toolName,
    currentSpend: tool.monthlySpend,
    recommendedAction: 'No changes needed.',
    estimatedSavings: 0,
    reason: 'Your current plan appears well-matched to your team size and use case.',
    severity: 'optimal'
  }
}

// ============================================
// MAIN AUDIT FUNCTION
// ============================================
export function runAudit(formData: AuditFormData): AuditResult {
  const toolResults = formData.tools.map(tool =>
    auditTool(tool, formData.teamSize, formData.useCase)
  )

  const totalMonthlySavings = toolResults.reduce(
    (sum, r) => sum + r.estimatedSavings, 0
  )

  return {
    toolResults,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    isHighSavings: totalMonthlySavings > 500
  }
}