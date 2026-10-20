import { useNavigate } from 'react-router-dom'
import { MapPin, BarChart3, GitCompare, MessageSquare, Shield, ArrowRight, Zap, Presentation } from 'lucide-react'
import { useAtlasData } from '../hooks/useAtlasData'
import { Button, SkeletonCard } from '../components/ui'

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Evidence-backed rankings',
    body: 'Every rank is deterministic, based on real source-named data and your weights — not guesswork.',
  },
  {
    icon: GitCompare,
    title: 'Side-by-side compare',
    body: 'Compare up to five cities using the same metric definitions. Missing values are shown clearly.',
  },
  {
    icon: Shield,
    title: 'Transparent sources',
    body: 'Every data point shows its publisher, date, geography, unit and caveats. No hidden assumptions.',
  },
  {
    icon: MessageSquare,
    title: 'Ask Atlas AI',
    body: 'Ask questions in plain English. Atlas answers from retrieved evidence and cites its sources.',
  },
]

const SOURCES = [
  { name: 'GCCPROs', coverage: 'Verified center counts', cities: '37+ markets' },
  { name: 'NASSCOM / Zinnov', coverage: 'GCC landscape & emerging cities', cities: 'National' },
  { name: 'Randstad', coverage: 'Salary benchmarks 2024–25', cities: '27 cities' },
  { name: 'JLL', coverage: 'Grade A office rents Q1 2025', cities: '12 markets' },
  { name: 'GCC Explorer', coverage: 'Job-posting activity signal', cities: '6 markets' },
  { name: 'Zinnov Tier-II', coverage: 'Emerging location ranking', cities: 'Tier II cities' },
]

export default function Home() {
  const navigate = useNavigate()
  const { data, isLoading } = useAtlasData({ talent: 3, cost: 3, rent: 2, ecosystem: 3, readiness: 2 })

  const totalLocations = data?.locations?.length ?? 45
  const totalSources = data?.sources?.length ?? 22

  return (
    <div className="animate-fade-in">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-light to-teal">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #14B8A6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0F766E 0%, transparent 50%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-teal-muted text-xs font-semibold">
                <Zap size={13} /> PM Internship Assignment Deliverable
              </span>
              <button
                onClick={() => navigate('/deck')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber text-navy text-xs font-bold hover:bg-amber-light transition-colors shadow-sm"
              >
                <Presentation size={13} /> View Executive Pitch Deck →
              </button>
            </div>

            <h1 className="font-serif text-5xl lg:text-6xl text-white leading-tight mb-4 text-balance">
              Find your GCC location.<br />
              <span className="text-teal-light">Backed by evidence.</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-2xl">
              GCC Atlas aggregates fragmented data on talent, salaries, office rents, GCC activity and
              incentives across {totalLocations} candidate cities in India — and scores them deterministically against your
              specific hiring plan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate('/plan')}
                className="bg-white text-navy hover:bg-ivory text-sm px-6 py-2.5 shadow-md"
              >
                Start Your GCC Plan <ArrowRight size={15} />
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/deck')}
                className="text-white hover:bg-white/10 border border-white/30 text-sm px-6 py-2.5"
              >
                Open Pitch Deck
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/recommendations')}
                className="text-white hover:bg-white/10 border border-white/30 text-sm px-6 py-2.5"
              >
                Explore Locations
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { n: totalLocations, label: 'Candidate cities' },
              { n: totalSources, label: 'Named source records' },
              { n: '2,000+', label: 'Operating India GCCs' },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-white">{n}</div>
                <div className="text-xs text-white/60 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-serif text-3xl text-navy mb-2">Built for decision-makers</h2>
        <p className="text-navy-muted mb-10">
          One place for strategy, talent, finance, real estate and legal teams to align on GCC location.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-5 space-y-3 hover:shadow-card-hover transition-shadow duration-200">
              <div className="w-9 h-9 rounded-xl bg-teal-faint border border-teal/20 flex items-center justify-center">
                <Icon size={18} className="text-teal" />
              </div>
              <h3 className="font-semibold text-navy text-sm">{title}</h3>
              <p className="text-xs text-navy-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Top locations preview ── */}
      <section className="bg-ivory-dark border-y border-ivory-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl text-navy">Top-ranked locations</h2>
              <p className="text-navy-muted text-sm mt-1">Default weights — adjust in your plan.</p>
            </div>
            <button
              onClick={() => navigate('/recommendations')}
              className="text-teal text-sm font-medium flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {(data?.scored ?? []).slice(0, 5).map((s, i) => (
                <button
                  key={s.location.id}
                  onClick={() => navigate(`/location/${s.location.slug}`)}
                  className="card p-4 text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-bold text-teal bg-teal-muted px-2 py-0.5 rounded-full">
                      #{i + 1}
                    </span>
                    {s.totalScore !== null && (
                      <span className="text-lg font-bold text-navy">{s.totalScore}</span>
                    )}
                  </div>
                  <p className="font-semibold text-navy text-sm group-hover:text-teal transition-colors">
                    {s.location.city}
                  </p>
                  <p className="text-xs text-navy-muted mt-0.5">{s.location.state}</p>
                  <div className="mt-3 h-1 rounded-full bg-teal-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal"
                      style={{ width: `${s.totalScore ?? 0}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Sources ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="font-serif text-2xl text-navy mb-1">Evidence coverage</h2>
        <p className="text-navy-muted text-sm mb-8">
          Each source contributes a different slice of evidence. Coverage varies by city.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOURCES.map((src) => (
            <div key={src.name} className="card p-4 flex gap-3">
              <div className="w-2 rounded-full bg-teal flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-navy">{src.name}</p>
                <p className="text-xs text-navy-muted mt-0.5">{src.coverage}</p>
                <p className="text-xs text-navy-faint mt-1">{src.cities}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-navy-faint mt-6 max-w-2xl leading-relaxed">
          GCC Atlas covers 45 source-named candidate cities. This is not an exhaustive list of every
          GCC-capable Indian city. Coverage gaps are shown where data is unavailable rather than filled
          with estimates.
        </p>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="card p-10 bg-gradient-to-br from-teal-faint to-white text-center">
          <MapPin className="w-10 h-10 text-teal mx-auto mb-4" />
          <h2 className="font-serif text-3xl text-navy mb-2">Ready to find your location?</h2>
          <p className="text-navy-muted mb-6 max-w-md mx-auto">
            Tell Atlas your functions, headcount and priorities. Get a ranked, source-backed shortlist in seconds.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button onClick={() => navigate('/plan')} className="px-8 py-3 text-base">
              Create My GCC Plan <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" onClick={() => navigate('/deck')} className="px-6 py-3 text-base">
              View Executive Pitch Deck
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
