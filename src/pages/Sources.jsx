import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, Search, Filter } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Badge, SkeletonCard, CaveatNote } from '../components/ui'

const TYPE_COLORS = {
  report:      'navy',
  government:  'teal',
  database:    'green',
  press:       'muted',
  survey:      'amber',
}

function useSources() {
  return useQuery({
    queryKey: ['sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .order('published_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    staleTime: 10 * 60 * 1000,
  })
}

export default function Sources() {
  const { data: sources = [], isLoading } = useSources()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  const types = ['all', ...new Set(sources.map((s) => s.source_type).filter(Boolean))]

  const filtered = sources.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.publisher.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || s.source_type === filterType
    return matchSearch && matchType
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-navy">Sources &amp; Evidence</h1>
        <p className="text-navy-muted text-sm mt-1">
          Every data point in GCC Atlas traces back to a named source with a date and geography.
        </p>
      </div>

      <CaveatNote className="mb-6">
        Sources vary in scope, date and methodology. A center counted by one publisher may differ
        from another's tally. Cross-publisher comparisons should be made with caution. Dates shown
        are publication or access dates, not necessarily data collection dates.
      </CaveatNote>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-faint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search publisher or title…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-ivory-border bg-white text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/40"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
                filterType === t
                  ? 'bg-teal text-white border-teal'
                  : 'border-ivory-border text-navy-muted hover:border-teal/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-navy-muted">
          <p>No sources match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((src) => (
            <div key={src.id} className="card p-5 hover:shadow-card-hover transition-shadow duration-200">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={TYPE_COLORS[src.source_type] ?? 'muted'} className="capitalize">
                      {src.source_type ?? 'unknown'}
                    </Badge>
                    {src.reliability_score != null && (
                      <span className="text-xs text-navy-faint">
                        Reliability: {Number(src.reliability_score).toFixed(1)}/5
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-navy text-sm leading-snug">{src.title}</h3>
                  <p className="text-sm text-teal font-medium mt-0.5">{src.publisher}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-navy-faint flex-wrap">
                    {src.published_at && <span>Published: {src.published_at}</span>}
                    {src.accessed_at && (
                      <span>Accessed: {new Date(src.accessed_at).toLocaleDateString('en-IN')}</span>
                    )}
                  </div>
                  {src.notes && (
                    <p className="text-xs text-navy-muted mt-2 leading-relaxed">{src.notes}</p>
                  )}
                </div>
                {src.source_url && (
                  <a
                    href={src.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs text-teal font-medium hover:underline"
                  >
                    View source <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-navy-faint mt-8 leading-relaxed max-w-2xl">
        {filtered.length} source{filtered.length !== 1 ? 's' : ''} shown.{' '}
        GCC Atlas uses these sources to populate its dataset. Coverage is uneven — not every city has
        data from every source. Where evidence is absent, values remain blank rather than being inferred.
      </p>
    </div>
  )
}
