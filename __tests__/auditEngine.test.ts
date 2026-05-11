import { describe, it, expect } from '@jest/globals'
import { runAudit } from '../lib/auditEngine'
import { AuditFormData } from '../types'

// ================================
// TEST 1: Basic audit runs without errors
// ================================
describe('runAudit', () => {
  it('should return audit result with correct structure', () => {
    const formData: AuditFormData = {
      tools: [{
        id: '1',
        toolName: 'cursor',
        plan: 'Pro',
        monthlySpend: 20,
        seats: 1
      }],
      teamSize: 1,
      useCase: 'coding'
    }

    const result = runAudit(formData)

    expect(result).toHaveProperty('toolResults')
    expect(result).toHaveProperty('totalMonthlySavings')
    expect(result).toHaveProperty('totalAnnualSavings')
    expect(result).toHaveProperty('isHighSavings')
  })

  // ================================
  // TEST 2: Annual savings = monthly x 12
  // ================================
  it('should calculate annual savings as 12x monthly savings', () => {
    const formData: AuditFormData = {
      tools: [{
        id: '1',
        toolName: 'cursor',
        plan: 'Business',
        monthlySpend: 40,
        seats: 1
      }],
      teamSize: 1,
      useCase: 'coding'
    }

    const result = runAudit(formData)
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })

  // ================================
  // TEST 3: Detects overpayment correctly
  // ================================
  it('should detect overpayment when user pays more than official price', () => {
    const formData: AuditFormData = {
      tools: [{
        id: '1',
        toolName: 'claude',
        plan: 'Pro',
        monthlySpend: 50, // Official is $20
        seats: 1
      }],
      teamSize: 1,
      useCase: 'writing'
    }

    const result = runAudit(formData)
    expect(result.totalMonthlySavings).toBeGreaterThan(0)
    expect(result.toolResults[0].severity).not.toBe('optimal')
  })

  // ================================
  // TEST 4: Optimal spend returns no savings
  // ================================
  it('should return zero savings for correctly priced tools', () => {
    const formData: AuditFormData = {
      tools: [{
        id: '1',
        toolName: 'cursor',
        plan: 'Pro',
        monthlySpend: 20, // Exactly the official price
        seats: 1
      }],
      teamSize: 5,
      useCase: 'coding'
    }

    const result = runAudit(formData)
    expect(result.toolResults[0].severity).toBe('optimal')
    expect(result.toolResults[0].estimatedSavings).toBe(0)
  })

  // ================================
// TEST 5: High savings flag works correctly
// ================================
it('should flag isHighSavings as true when savings exceed $500', () => {
  const formData: AuditFormData = {
    tools: [
      {
        id: '1',
        toolName: 'cursor',
        plan: 'Pro',
        monthlySpend: 300,
        seats: 1
      },
      {
        id: '2',
        toolName: 'claude',
        plan: 'Pro',
        monthlySpend: 300,
        seats: 1
      },
      {
        id: '3',
        toolName: 'chatgpt',
        plan: 'Plus',
        monthlySpend: 200,
        seats: 1
      }
    ],
    teamSize: 3,
    useCase: 'coding'
  }

  const result = runAudit(formData)
  expect(result.totalMonthlySavings).toBeGreaterThan(500)
  expect(result.isHighSavings).toBe(true)
})

  // ================================
  // TEST 6: Multiple tools adds up correctly
  // ================================
  it('should sum savings across multiple tools', () => {
    const formData: AuditFormData = {
      tools: [
        {
          id: '1',
          toolName: 'cursor',
          plan: 'Pro',
          monthlySpend: 100, // Overpaying by $80
          seats: 1
        },
        {
          id: '2',
          toolName: 'claude',
          plan: 'Pro',
          monthlySpend: 80, // Overpaying by $60
          seats: 1
        }
      ],
      teamSize: 1,
      useCase: 'coding'
    }

    const result = runAudit(formData)
    expect(result.toolResults).toHaveLength(2)
    expect(result.totalMonthlySavings).toBeGreaterThan(0)
  })

  // ================================
  // TEST 7: Empty tools returns zero savings
  // ================================
  it('should return zero savings for empty tools list', () => {
    const formData: AuditFormData = {
      tools: [],
      teamSize: 1,
      useCase: 'coding'
    }

    const result = runAudit(formData)
    expect(result.totalMonthlySavings).toBe(0)
    expect(result.toolResults).toHaveLength(0)
  })
})
