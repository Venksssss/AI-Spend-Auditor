import { supabase } from './supabase'
import { AuditResult } from './auditEngine'
import { AuditFormData } from '@/types'
import { generateShareId } from './shareId'
export async function saveAudit(params: SaveAuditParams): Promise<SaveAuditResponse> {
  const shareId = generateShareId()

  console.log('Attempting to save audit with shareId:', shareId)
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

  const { data, error } = await supabase.from('audits').insert({
    email: params.email,
    company_name: params.companyName || null,
    role: params.role || null,
    team_size: params.formData.teamSize,
    use_case: params.formData.useCase,
    tools: params.formData.tools,
    total_monthly_savings: params.result.totalMonthlySavings,
    total_annual_savings: params.result.totalAnnualSavings,
    is_high_savings: params.result.isHighSavings,
    share_id: shareId
  }).select()

  console.log('Insert result - data:', data, 'error:', error)

  if (error) {
    console.error('Error saving audit:', error)
    return { shareId: '', error: error.message }
  }

  return { shareId }
}