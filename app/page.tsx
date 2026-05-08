import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        
        {/* Badge */}
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 
          rounded-full px-4 py-1 text-emerald-400 text-sm mb-8">
          Free AI Spend Audit Tool
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          Are you overpaying for
          <span className="text-emerald-400"> AI tools?</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Enter what you pay for Cursor, ChatGPT, Claude and more. 
          Get an instant audit showing exactly where you're overspending 
          and how much you could save.
        </p>

        {/* CTA Button */}
        <Link
          href="/audit"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 
            text-white font-semibold px-8 py-4 rounded-xl text-lg 
            transition-colors duration-200"
        >
          Start Free Audit →
        </Link>

        {/* Social Proof */}
        <p className="text-slate-500 text-sm mt-6">
          No login required · Takes 2 minutes · 100% free
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-8 mt-20 border-t 
          border-slate-700 pt-12">
          <div>
            <div className="text-3xl font-bold text-white">$500+</div>
            <div className="text-slate-400 text-sm mt-1">
              Average monthly savings found
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">8+</div>
            <div className="text-slate-400 text-sm mt-1">
              AI tools analyzed
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">2 min</div>
            <div className="text-slate-400 text-sm mt-1">
              To complete your audit
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}