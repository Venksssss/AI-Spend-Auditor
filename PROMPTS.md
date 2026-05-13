# Prompts

## AI Summary Prompt

Used in `lib/generateSummary.ts` to generate personalized audit summary.

### Prompt:
Write a 80-100 word personalized audit summary for a team
with these results:

Total monthly savings found: $X
Total annual savings: $X
Tools analyzed: X
High priority issues: X

Be specific, professional, and encouraging.
Focus on the opportunity, not the problem.

### Why this prompt:
- Short and specific — gives Claude enough context
- Asks for encouraging tone — users more likely to act
- Specifies word count — keeps summary scannable
- Focus on opportunity — matches Credex brand voice

### What didn't work:
- Longer prompts with tool names caused inconsistent formatting
- Asking for bullet points made it feel robotic
- Without word limit responses were too long for the UI

### Fallback:
When API is unavailable, a template-based summary is generated
in `generateFallbackSummary()` using the same data points.