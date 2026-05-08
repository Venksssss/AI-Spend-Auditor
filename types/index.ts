export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export type ToolName =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf'

export interface ToolEntry {
  id: string
  toolName: ToolName
  plan: string
  monthlySpend: number
  seats: number
}

export interface AuditFormData {
  tools: ToolEntry[]
  teamSize: number
  useCase: UseCase
}