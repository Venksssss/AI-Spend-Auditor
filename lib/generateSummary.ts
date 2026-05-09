import { AuditResult } from './auditEngine'

// Fallback template - works without API key
function generateFallbackSummary(result: AuditResult): string {
  const savings = result.totalMonthlySavings.toFixed(0)
  const annual = result.totalAnnualSavings.toFixed(0)
  const toolCount = result.toolResults.length
  const highCount = result.toolResults.filter(t => t.severity === 'high').length

  if (result.totalMonthlySavings === 0) {
    return `Your AI stack across ${toolCount} tool${toolCount > 1 ? 's' : ''} 
    appears well-optimized. You're on the right plans for your team size 
    and use case. Keep an eye on usage as your team grows — plan 
    mismatches often appear gradually.`
  }

  if (highCount > 0) {
    return `Our audit found significant overspending across your 
    ${toolCount} AI tool${toolCount > 1 ? 's' : ''}. You could save 
    $${savings}/month ($${annual}/year) with the recommended changes. 
    ${highCount} tool${highCount > 1 ? 's have' : ' has'} high-priority 
    savings opportunities that should be addressed immediately.`
  }

  return `Your AI spend audit is complete. Across ${toolCount} 
  tool${toolCount > 1 ? 's' : ''}, we found $${savings}/month 
  ($${annual}/year) in potential savings through plan optimizations 
  and smarter tool selection. These are low-risk changes that won't 
  impact your team's productivity.`
}

// Main function - tries API first, falls back to template
export async function generateSummary(result: AuditResult): Promise<string> {
  // Try Anthropic API if key exists
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY

  if (apiKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: `Write a 80-100 word personalized audit summary for a team with these results:
- Total monthly savings found: $${result.totalMonthlySavings}
- Total annual savings: $${result.totalAnnualSavings}
- Tools analyzed: ${result.toolResults.length}
- High priority issues: ${result.toolResults.filter(t => t.severity === 'high').length}

Be specific, professional, and encouraging. Focus on the opportunity, not the problem.`
          }]
        })
      })

      const data = await response.json()
      if (data.content?.[0]?.text) {
        return data.content[0].text
      }
    } catch (error) {
      console.error('Anthropic API failed, using fallback:', error)
    }
  }

  // Fallback if no API key or API fails
  return generateFallbackSummary(result)
}