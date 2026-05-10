## Day 1 — 2025-05-07

**Hours worked:** (fill this in honestly)

**What I did:**
Received the assignment on Day 0 but had a scheduled exam so could not begin.
Started today by carefully reading the full brief. Set up the Next.js project 
with TypeScript and Tailwind CSS. Created the GitHub repository and pushed the 
initial project. Created all required markdown placeholder files. Conducted 3 
user interviews with peers to understand AI tool usage patterns.

**What I learned:** 
I learned that most students use free ChatGPT and don't realize paid alternatives exist.

**Blockers / what I'm stuck on:**
Started late due to exam. Need to move fast over the next 6 days 
to meet the 5-day commit requirement.

**Plan for tomorrow:**
Build the spend input form with all 8 required AI tools.
Implement form state persistence using localStorage.
Begin collecting real pricing data for PRICING_DATA.md.


## Day 2 — 2025-05-08

**Hours worked:** 1

**What I did:**
Built the landing page with hero section, headline, subheadline,
stats row and CTA button. Built the audit input form at /audit 
with all 8 AI tools supported, plan selectors for each tool,
monthly spend and seats inputs, team size and use case selector.
Implemented localStorage persistence so form data survives page reloads.

**What I learned:**
I learned how useEffect works with localStorage to save and load form data automatically

**Blockers / what I'm stuck on:**
Understanding how TypeScript types connect 
across different files was confusing at first

**Plan for tomorrow:**
Build the audit engine logic in lib/auditEngine.ts.
Build the results page showing savings breakdown.

## Day 3 — 2025-05-10

**Hours worked:** approx 2 hrs

**What I did:**
Built audit engine in lib/auditEngine.ts with official pricing 
data and rules for detecting overspend. Built results page 
showing per-tool breakdown, total monthly and annual savings.
Added AI summary with graceful fallback template when API 
is unavailable. Documented all pricing sources in PRICING_DATA.md.

**What I learned:**
Learned how to handle API failures gracefully using try/catch 
and fallback functions

**Blockers / what I'm stuck on:**
Could not get Anthropic API free credits. Built fallback 
template summary instead. Will try to get API access tomorrow.

**Plan for tomorrow:**
Add shareable URLs for each audit result.
Set up Supabase for lead capture.
Add email confirmation using Resend.

## Day 4 — 2025-05-11

**Hours worked:** 2

**What I did:**
Set up Supabase database and created audits table with SQL.
Built lead capture form on results page with email, company 
name and role fields. Added honeypot field for spam protection.
Connected audit saving to Supabase database. Fixed RLS policy 
issue by disabling row level security for public table.
Fixed Supabase URL misconfiguration by removing /rest/v1/ suffix.
Built shareable URL page at /share/[id] with Open Graph and 
Twitter card meta tags. Added email confirmation using Resend 
that sends audit summary and Credex CTA for high savings cases.
Debugged API errors using browser Network tab.

**What I learned:**
 Learned that Supabase RLS blocks all inserts by default and must be configured for public tools
**Blockers / what I'm stuck on:**
Anthropic API free credits unavailable — using fallback 
summary template instead. Email initially not received due 
to incorrect Resend sender configuration.

**Plan for tomorrow:**
Write 5+ tests for audit engine.
Set up GitHub Actions CI pipeline.
Deploy to Vercel with environment variables.
Fill in all required documentation files.