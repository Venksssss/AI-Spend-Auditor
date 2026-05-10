import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, monthlySavings, annualSavings, shareId, isHighSavings } = await req.json()

    const { error } = await resend.emails.send({
      from: 'AI Spend Auditor <onboarding@resend.dev>',
      to: email,
      subject: `Your AI Spend Audit — $${monthlySavings}/mo in savings found`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0f172a; color: #fff;">
          
          <h1 style="color: #10b981; font-size: 24px; margin-bottom: 8px;">
            Your AI Spend Audit is Ready
          </h1>
          
          <p style="color: #94a3b8; margin-bottom: 32px;">
            Here's a summary of what we found for your team.
          </p>

          <div style="background: #1e293b; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <p style="color: #10b981; font-size: 14px; margin-bottom: 8px;">
              Total Potential Savings
            </p>
            <p style="color: #fff; font-size: 48px; font-weight: bold; margin: 0;">
              $${monthlySavings}/mo
            </p>
            <p style="color: #10b981; font-size: 18px; margin-top: 8px;">
              $${annualSavings} per year
            </p>
          </div>

          ${isHighSavings ? `
          <div style="background: #1e293b; border: 1px solid #10b981; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #fff; font-size: 18px; margin-bottom: 8px;">
              💰 Save Even More with Credex
            </h2>
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 16px;">
              Credex sells discounted AI credits for Cursor, Claude, ChatGPT and more.
              A Credex consultant will reach out to help you capture even more savings.
            </p>
            <a href="https://credex.rocks" style="background: #10b981; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Learn About Credex →
            </a>
          </div>
          ` : ''}

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/share/${shareId}" 
              style="background: #1e293b; color: #10b981; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; border: 1px solid #10b981;">
              View & Share Your Audit →
            </a>
          </div>

          <p style="color: #475569; font-size: 12px; text-align: center;">
            AI Spend Auditor · Free tool by Credex
          </p>

        </div>
      `
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}