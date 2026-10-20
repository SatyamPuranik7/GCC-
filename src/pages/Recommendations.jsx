import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUpDown, Bookmark, BookmarkCheck, GitCompare,
  SlidersHorizontal, Download, Info, ChevronDown, ChevronUp,
} from 'lucide-react'
import { useAtlasData } from '../hooks/useAtlasData'
import usePlanStore from '../store/usePlanStore'
import {
  Badge, ConfidenceBadge, CoverageBar, SourceTag,
  MissingData, CaveatNote, SkeletonCard, ScoreRing, WeightSlider, Button,
} from '../components/ui'
import { downloadLocationsCSV } from '../lib/export'

const DIM_COLORS = {
  talent: 'bg-blue-100 text-blue-700',
  cost: 'bg-green-100 text-green-700',
  rent: 'bg-purple-100 text-purple-700',
  ecosystem: 'bg-teal-muted text-teal',
  readiness: 'bg-amber-muted text-amber',
}

function DimBar({ dim }) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-navy-muted">{dim.label}</span>
        {dim.score !== null ? (
          <span className="text-xs font-semibold text-navy">{Math.round(dim.score)}</span>
        ) : (
          <span className="text-xs text-navy-faint italic">No data</span>
        )}
      </div>
      <div className="h-1 rounded-full bg-ivory-dark overflow-hidden">
        <div
          className="h-full rounded-full bg-teal transition-all duration-700"
          style={{ width: `${dim.score ?? 0}%`, opacity: dim.score !== null ? 1 : 0 }}
        />
      </div>
    </div>
  )
}

function LocationCard({ scored, rank, onShortlist, isShortlisted, onCompare, inCompare, compareDisabled }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const { location: loc, totalScore, dims, coverage, confidence, reasons, tradeoffs } = scored

  return (
    <div className={`card transition-all duration-200 ${isShortlisted ? 'border-teal/40' : ''}`}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Rank & score */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <span className="text-xs font-bold text-navy-muted">#{rank}</span>
            <ScoreRing score={totalScore} size={52} />
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3
                  className="font-semibold text-navy hover:text-teal cursor-pointer transition-colors"
                  onClick={() => navigate(`/location/${loc.slug}`)}
                >
                  {loc.city}
                </h3>
                <p className="text-xs text-navy-muted">{loc.state}{loc.region ? ` · ${loc.region}` : ''}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <ConfidenceBadge confidence={confidence} />
              </div>
            </div>

            {/* Reasons */}
            {reasons.length > 0 && (
              <ul className="mt-2 space-y-0.5">
                {reasons.slice(0, 2).map((r, i) => (
                  <li key={i} className="text-xs text-navy-muted flex items-start gap-1.5">
                    <span className="text-teal mt-0.5">✓</span> {r}
                  </li>
                ))}
              </ul>
            )}

            {/* Coverage */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-navy-faint uppercase tracking-wide">Evidence coverage</span>
              </div>
              <CoverageBar coverage={coverage} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-ivory-border">
          <button
            onClick={() => navigate(`/location/${loc.slug}`)}
            className="flex-1 text-xs font-medium text-teal hover:underline text-left"
          >
            View detail →
          </button>
          <button
            onClick={() => onShortlist(loc.id)}
            className={`p-1.5 rounded-lg transition-colors ${isShortlisted ? 'text-teal bg-teal-muted' : 'text-navy-faint hover:text-navy hover:bg-ivory-dark'}`}
            title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
          >
            {isShortlisted ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>
          <button
            onClick={() => onCompare(loc.id)}
            disabled={compareDisabled && !inCompare}
            className={`p-1.5 rounded-lg transition-colors ${inCompare ? 'text-teal bg-teal-muted' : 'text-navy-faint hover:text-navy hover:bg-ivory-dark disabled:opacity-40'}`}
            title={inCompare ? 'Remove from compare' : compareDisabled ? 'Compare list full (max 5)' : 'Add to compare'}
          >
            <GitCompare size={15} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-navy-faint hover:text-navy hover:bg-ivory-dark transition-colors"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Expanded dimension breakdown */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-ivory-border pt-4 space-y-3 animate-fade-in">
          <p className="text-xs font-semibold text-navy-muted uppercase tracking-wide">Dimension breakdown</p>
          {dims.map((d) => <DimBar key={d.key} dim={d} />)}
          {tradeoffs.length > 0 && (
            <div className="mt-3 pt-3 border-t border-ivory-border">
              <p className="text-xs font-semibold text-amber mb-1.5">Trade-offs to consider</p>
              {tradeoffs.map((t, i) => (
                <p key={i} className="text-xs text-amber flex items-start gap-1.5 mb-1">
                  <span className="mt-0.5">▲</span> {t}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Recommendations() {
  const navigate = useNavigate()
  const { weights, setWeights, shortlisted, toggleShortlist, compareList, toggleCompare } = usePlanStore()
  const [showWeights, setShowWeights] = useState(false)
  const [sortBy, setSortBy] = useState('score')

  const { data, isLoading, error } = useAtlasData(weights)

  const scored = useMemo(() => {
    if (!data?.scored) return []
    let list = [...data.scored]
    if (sortBy === 'score') return list // already sorted
    if (sortBy === 'city') return list.sort((a, b) => a.location.city.localeCompare(b.location.city))
    if (sortBy === 'coverage') return list.sort((a, b) => b.coverage - a.coverage)
    return list
  }, [data?.scored, sortBy])

  const top5 = scored.slice(0, 5)
  const compareDisabled = compareList.length >= 5

  function handleExport() {
    downloadLocationsCSV(scored)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-serif text-3xl text-navy">Recommendations</h1>
          <p className="text-navy-muted text-sm mt-1">
            Top 5 locations ranked by your weights. Rankings are deterministic — AI explains, not decides.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {compareList.length >= 2 && (
            <Button variant="secondary" onClick={() => navigate('/compare')} className="text-xs">
              <GitCompare size={13} /> Compare ({compareList.length})
            </Button>
          )}
          <Button variant="secondary" onClick={handleExport} className="text-xs">
            <Download size={13} /> Export CSV
          </Button>
          <Button
            variant={showWeights ? 'primary' : 'secondary'}
            onClick={() => setShowWeights(!showWeights)}
            className="text-xs"
          >
            <SlidersHorizontal size={13} /> Adjust weights
          </Button>
        </div>
      </div>

      {/* Weight panel */}
      {showWeights && (
        <div className="card p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-navy text-sm">Scoring weights</p>
            <p className="text-xs text-navy-muted">Changes re-rank immediately.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {Object.entries(weights).map(([key, val]) => (
              <WeightSlider
                key={key}
                label={{ talent: 'Talent', cost: 'Salary Cost', rent: 'Office Rent', ecosystem: 'Ecosystem', readiness: 'Readiness' }[key]}
                value={val}
                onChange={(v) => setWeights({ [key]: v })}
              />
            ))}
          </div>
          <CaveatNote className="mt-4">
            Scores use only available evidence. Missing data for a dimension is excluded from that city's score rather than assumed to be zero.
          </CaveatNote>
        </div>
      )}

      {/* Sort bar */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs text-navy-muted">Sort:</span>
        {['score', 'city', 'coverage'].map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              sortBy === s ? 'border-teal bg-teal text-white' : 'border-ivory-border text-navy-muted hover:border-teal/40'
            }`}
          >
            {s === 'score' ? 'Score' : s === 'city' ? 'City A–Z' : 'Coverage'}
          </button>
        ))}
        {isLoading && <span className="text-xs text-navy-faint ml-auto animate-pulse">Loading…</span>}
      </div>

      {/* Error */}
      {error && (
        <div className="card p-4 mb-6 border-red-200 bg-red-50 text-red-700 text-sm flex items-center gap-2">
          <Info size={15} /> Could not load data. Check your Supabase connection and RLS policies.
        </div>
      )}

      {/* Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} lines={4} />)}
        </div>
      ) : top5.length === 0 ? (
        <div className="card p-10 text-center text-navy-muted">
          <p className="font-medium">No scored locations found.</p>
          <p className="text-sm mt-1">Check that your Supabase tables have data and RLS allows public reads.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {top5.map((s, i) => (
            <LocationCard
              key={s.location.id}
              scored={s}
              rank={i + 1}
              isShortlisted={shortlisted.includes(s.location.id)}
              onShortlist={toggleShortlist}
              inCompare={compareList.includes(s.location.id)}
              onCompare={toggleCompare}
              compareDisabled={compareDisabled}
            />
          ))}
        </div>
      )}

      {/* All locations (collapsed) */}
      {!isLoading && scored.length > 5 && (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm text-teal font-medium hover:underline">
            Show all {scored.length} scored locations
          </summary>
          <div className="space-y-3 mt-4">
            {scored.slice(5).map((s, i) => (
              <LocationCard
                key={s.location.id}
                scored={s}
                rank={i + 6}
                isShortlisted={shortlisted.includes(s.location.id)}
                onShortlist={toggleShortlist}
                inCompare={compareList.includes(s.location.id)}
                onCompare={toggleCompare}
                compareDisabled={compareDisabled}
              />
            ))}
          </div>
        </details>
      )}

      <CaveatNote className="mt-8">
        Rankings shown here are for the 45 source-named candidate locations. This is not an exhaustive list of
        every GCC-capable Indian city. AI (Ask Atlas) explains retrieved evidence — it does not influence these rankings.
      </CaveatNote>
    </div>
  )
}
