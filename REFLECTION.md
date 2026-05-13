# Reflection

## 1. Hardest Bug I Hit This Week

The hardest bug was the Supabase RLS (Row Level Security) policy 
blocking all inserts. When I submitted the lead capture form, 
no data was being saved and no obvious error appeared on screen.

I opened the browser console (F12) and saw error code 42501 
with message "new row violates row-level security policy". 
I had never seen this before.

My first hypothesis was that the Supabase URL was wrong — I had 
accidentally included /rest/v1/ at the end. Fixing that helped 
with connection but inserts still failed.

Second hypothesis was the API key was wrong — checked it, was 
correct. Third hypothesis was the table name was wrong — also 
correct.

Finally I found that Supabase enables RLS by default on all 
tables, blocking all inserts from client-side code unless you 
define explicit policies. Since this is a public tool with no 
login, I disabled RLS entirely with:
ALTER TABLE audits DISABLE ROW LEVEL SECURITY;
That fixed it immediately.

## 2. A Decision I Reversed Mid-Week

(FILL THIS YOURSELF — what decision did you change this week?)

## 3. What I Would Build in Week 2

In week 2 I would build:

1. **PDF export** — a downloadable report a manager could 
   share in a board meeting or with their finance team.

2. **Benchmark mode** — "your AI spend per developer is $X, 
   companies your size average $Y." By week 2 we would have 
   enough audit data to compute real benchmarks.

3. **More tools** — Notion AI, Perplexity, GitHub Models, 
   Microsoft Copilot. The current 8 tools cover most teams 
   but missing tools reduce trust.

4. **Admin dashboard** — a simple view of all leads, savings 
   found, and consultation bookings for the Credex sales team.

5. **Referral codes** — share the tool, both parties get a 
   perk. This would accelerate the viral loop significantly.

## 4. How I Used AI Tools

I used Claude (via Claude.ai) throughout this project as a 
coding mentor and pair programmer.

**What I used it for:**
- Explaining concepts I did not understand such as Supabase 
  RLS, Next.js App Router, and TypeScript types
- Helping debug errors by pasting console output
- Generating boilerplate code for UI components
- Reviewing audit engine logic for correctness

**What I did not trust it with:**
- Pricing data — I verified every number myself on official 
  vendor pages because AI training data goes stale
- User interview notes — these had to be real conversations 
  with real people
- DEVLOG entries — had to reflect my actual daily experience
- Final architecture decisions — I made those myself after 
  understanding the tradeoffs

**One specific time the AI was wrong:**
Claude suggested using vitest for testing which caused 
ESM/CommonJS conflicts on Windows with Node 20. I had to 
switch to Jest instead. The AI did not account for the 
Windows environment and Node version constraints. I caught 
this by reading the error message carefully and researching 
the root cause myself.

## 5. Self Rating

| Dimension | Rating | Reason |
|---|---|---|
| Discipline | (7/10) | have many hobbies |
| Code Quality | (8/10) | could made it better |
| Design Sense | (8/10) | simple and usefull |
| Problem Solving | (9/10) | could made a better approach |
| Entrepreneurial Thinking | (9/10) | took all the nessasary steps |