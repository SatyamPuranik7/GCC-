import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  MapPin, TrendingUp, Building2, Globe, Users, CheckSquare, ArrowLeft,
  ExternalLink, Bookmark, BookmarkCheck, GitCompare, Calculator
} from 'lucide-react'
import { useLocationDetail } from '../hooks/useLocationDetail'
import usePlanStore from '../store/usePlanStore'
import {
  Badge, ConfidenceBadge, SourceTag, MissingData, CaveatNote,
  SkeletonCard, Skeleton, Button,
} from '../components/ui'

const TABS = [
  { key: 'overview',   label: 'Overview',   icon: MapPin },
  { key: 'talent',     label: 'Talent & Salaries', icon: TrendingUp },
  { key: 'cost',       label: 'Real Estate & Cost', icon: Building2 },
  { key: 'ecosystem',  label: 'GCC Ecosystem', icon: Globe },
  { key: 'providers',  label: 'Providers',  icon: Users },
  { key: 'checklist',  label: 'Setup Checklist', icon: CheckSquare },
]

// ─── Tab components ───────────────────────────────────────────────────────────

function OverviewTab({ location, metrics, candidates, incentives }) {
  return (
    <div className="space-y-6">
      {location.short_description && (
        <div className="card p-5 bg-white">
          <h3 className="text-xs font-semibold text-navy-muted uppercase tracking-wider mb-2">City Profile</h3>
          <p className="text-navy leading-relaxed text-sm">{location.short_description}</p>
        </div>
      )}

      {/* Candidate Basis */}
      {candidates.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-navy text-sm">Selection &amp; Candidate Basis</h3>
          {candidates.map((c) => (
            <div key={c.id} className="card p-4 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Badge variant="teal" className="capitalize">
                  {c.candidate_basis.replace(/_/g, ' ')}
                </Badge>
                {c.period_label && <span className="text-xs text-navy-faint">{c.period_label}</span>}
              </div>
              {c.notes && <p className="text-sm text-navy">{c.notes}</p>}
              {c.source && (
                <div className="pt-2 border-t border-ivory-border">
                  <SourceTag publisher={c.source.publisher} date={c.source.published_at} url={c.source.source_url} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Key metrics grid */}
      {metrics.length > 0 && (
        <div>
          <h3 className="font-semibold text-navy text-sm mb-3">Key Evidence Metrics</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div key={m.id} className="card p-4 space-y-1.5">
                <p className="text-xs text-navy-muted">{m.label}</p>
                <p className="font-bold text-navy text-xl">
                  {m.value_low != null ? m.value_low : ''}
                  {m.value_high != null && m.value_high !== m.value_low ? ` – ${m.value_high}` : ''}
                  {m.value_text && !m.value_low ? m.value_text : ''}
                  {m.value_low == null && !m.value_text ? <MissingData /> : ''}
                  <span className="text-xs font-normal text-navy-muted ml-1.5">{m.unit}</span>
                </p>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <ConfidenceBadge confidence={m.confidence} />
                  {m.source && (
                    <SourceTag publisher={m.source.publisher} date={m.source.published_at} url={m.source.source_url} />
                  )}
                </div>
                {m.notes && <p className="text-xs text-navy-faint mt-1">{m.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TalentTab({ salaries }) {
  const sorted = [...salaries].sort((a, b) => {
    const order = ['junior', 'middle', 'senior']
    const getO = (s) => order.findIndex((k) => s.seniority?.toLowerCase().includes(k))
    return getO(a) - getO(b)
  })

  return (
    <div className="space-y-4">
      <CaveatNote>
        Salary data is sourced from Randstad Annual Salary Trends 2024–25. Figures represent cross-industry
        city averages across three experience tiers, rather than specialized compensation for a single tech or finance role.
      </CaveatNote>

      {sorted.length === 0 ? (
        <div className="card p-8 text-center text-navy-muted">
          <p>No Randstad salary benchmarks recorded for this city in the dataset.</p>
        </div>
      ) : (
        <div className="card overflow-hidden shadow-card">
          <table className="w-full">
            <thead>
              <tr className="bg-ivory-dark border-b border-ivory-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-navy-muted uppercase tracking-wide">Experience Tier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-navy-muted uppercase tracking-wide">Average CTC (Annual)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-navy-muted uppercase tracking-wide">In Lakhs</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-navy-muted uppercase tracking-wide">Source Citation</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s.id} className="border-b border-ivory-border hover:bg-ivory/60 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-navy capitalize">
                    {s.seniority}
                  </td>
                  <td className="px-4 py-3 text-sm text-navy font-semibold">
                    ₹{Number(s.annual_average).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-sm text-teal font-bold">
                    ₹{(Number(s.annual_average) / 100000).toFixed(1)} L
                  </td>
                  <td className="px-4 py-3">
                    <SourceTag
                      publisher={s.source?.publisher || 'Randstad'}
                      date={s.period_label || s.source?.published_at}
                      url={s.source?.source_url}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function CostTab({ metrics, costs }) {
  // Extract real estate metrics from location_metrics
  const rentMetrics = metrics.filter((m) =>
    m.metric_key.includes('rent') ||
    m.metric_key.includes('office') ||
    m.metric_key.includes('vacancy') ||
    m.metric_key.includes('leasing')
  )

  return (
    <div className="space-y-5">
      <CaveatNote>
        Office market data is sourced from JLL India Q1 2025. These are macro commercial real estate indicators,
        not specific commercial lease quotations. Vacancy rates and leasing velocities change quarterly.
      </CaveatNote>

      {rentMetrics.length === 0 && costs.length === 0 ? (
        <div className="card p-8 text-center text-navy-muted">
          <p>No Grade A office metrics available in JLL dataset for this location.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {rentMetrics.map((m) => (
            <div key={m.id} className="card p-5 space-y-2">
              <span className="text-xs font-medium text-navy-muted">{m.label}</span>
              <div className="text-2xl font-bold text-navy">
                {m.value_low != null ? (
                  <>
                    ₹{m.value_low}
                    {m.value_high != null && m.value_high !== m.value_low ? ` – ₹${m.value_high}` : ''}
                  </>
                ) : (
                  m.value_text || <MissingData />
                )}
                <span className="text-xs font-normal text-navy-muted ml-1.5">{m.unit}</span>
              </div>
              <div className="pt-2 border-t border-ivory-border flex items-center justify-between">
                <SourceTag publisher={m.source?.publisher || 'JLL India'} date={m.period_label} url={m.source?.source_url} />
                <ConfidenceBadge confidence={m.confidence} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EcosystemTab({ gccRecords, metrics }) {
  const verifiedCount = metrics.find((m) => m.metric_key === 'gccpros_verified_gcc_count')
  const zinnovUnits = metrics.find((m) => m.metric_key === 'zinnov_gcc_units_fy26e_lower_bound')
  const jobPostings = metrics.find((m) => m.metric_key === 'gcc_explorer_live_job_postings_snapshot')

  return (
    <div className="space-y-6">
      {/* Ecosystem KPI summary */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="card p-4">
          <p className="text-xs text-navy-muted">GCCPROs Verified Count</p>
          <p className="text-2xl font-bold text-teal mt-1">
            {verifiedCount?.value_low ?? <MissingData />}
          </p>
          <p className="text-[10px] text-navy-faint mt-1">Centres in verified database</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-navy-muted">Zinnov FY26E Estimate</p>
          <p className="text-2xl font-bold text-navy mt-1">
            {zinnovUnits?.value_low ? `${zinnovUnits.value_low}+` : <MissingData />}
          </p>
          <p className="text-[10px] text-navy-faint mt-1">Lower bound projection</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-navy-muted">Live Hiring Activity</p>
          <p className="text-2xl font-bold text-navy mt-1">
            {jobPostings?.value_low ? `${jobPostings.value_low} jobs` : <MissingData />}
          </p>
          <p className="text-[10px] text-navy-faint mt-1">GCC Explorer snapshot</p>
        </div>
      </div>

      {/* Verified GCC Company Records */}
      {gccRecords.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-semibold text-navy text-sm">Verified Operating Centres ({gccRecords.length})</h3>
          {gccRecords.map((r) => (
            <div key={r.id} className="card p-4 flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="font-semibold text-navy text-base">{r.company_name}</p>
                {r.parent_company && <p className="text-xs text-navy-muted">Parent: {r.parent_company}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(r.functions ?? []).map((f) => (
                    <Badge key={f} variant="teal">{f}</Badge>
                  ))}
                  {r.sector && <Badge variant="muted">{r.sector}</Badge>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge variant={r.stage === 'operating' ? 'green' : 'amber'}>{r.stage}</Badge>
                {r.opened_on && <p className="text-[10px] text-navy-faint mt-1">Opened: {r.opened_on}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-navy-muted">
          Individual company name records are currently seeded for select hub case studies.
          Refer to aggregate verified centre totals above.
        </p>
      )}
    </div>
  )
}

function ProvidersTab({ providers }) {
  return (
    <div className="space-y-4">
      <CaveatNote>
        Provider profiles represent established ecosystem participants (real estate, corporate advisory,
        operations). Inclusion does not constitute endorsement or commercial guarantee.
      </CaveatNote>

      {providers.length === 0 ? (
        <div className="card p-8 text-center text-navy-muted">
          <p>No regional service provider records linked to this market yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {providers.map((p) => (
            <div key={p.id} className="card p-5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-navy text-base">{p.name}</h4>
                  <Badge variant="teal" className="capitalize">{p.category?.replace(/_/g, ' ')}</Badge>
                </div>
                {p.summary && <p className="text-xs text-navy-muted mt-2 leading-relaxed">{p.summary}</p>}
              </div>
              {p.website_url && (
                <div className="pt-3 border-t border-ivory-border">
                  <a
                    href={p.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-teal font-medium hover:underline"
                  >
                    Visit Website <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ChecklistTab({ approvals }) {
  return (
    <div className="space-y-4">
      <CaveatNote>
        Regulatory checklists are derived from the Government of India National Single Window System (NSWS)
        and DPIIT guidance. Changes made during exploration are not persisted on the server.
      </CaveatNote>

      {approvals.length === 0 ? (
        <div className="card p-8 text-center text-navy-muted">
          <p>No regulatory prompts recorded for this jurisdiction.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map((a) => (
            <div key={a.id} className="card p-5 space-y-2">
              <div className="flex items-start gap-3">
                <CheckSquare size={18} className="text-teal mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="font-semibold text-navy text-sm">{a.title}</h4>
                    <Badge variant="muted">{a.jurisdiction}</Badge>
                  </div>
                  <p className="text-xs text-navy-muted mt-1 leading-relaxed">{a.description}</p>
                  {a.applies_to && (
                    <p className="text-xs text-teal mt-1.5 font-medium">
                      Applies to: {a.applies_to}
                    </p>
                  )}
                  {a.last_checked_at && (
                    <span className="text-[10px] text-navy-faint block mt-1">
                      Verified via NSWS: {a.last_checked_at}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main LocationDetail Page ─────────────────────────────────────────────────

export default function LocationDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const { shortlisted, toggleShortlist, compareList, toggleCompare } = usePlanStore()

  const { data, isLoading, error } = useLocationDetail(slug)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <SkeletonCard lines={6} />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-navy font-semibold text-lg">Location not found</p>
        <Button variant="secondary" onClick={() => navigate('/recommendations')} className="mt-4">
          Back to Recommendations
        </Button>
      </div>
    )
  }

  const { location, metrics, salaries, costs, incentives, gccRecords, providers, candidates, approvals } = data
  const isShortlisted = shortlisted.includes(location.id)
  const inCompare = compareList.includes(location.id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-slide-up">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-navy-muted hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Header banner */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-teal bg-teal-muted px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {location.region || 'Candidate Market'}
            </span>
            <span className="text-xs text-navy-faint">India</span>
          </div>
          <h1 className="font-serif text-4xl text-navy">{location.city}</h1>
          <p className="text-navy-muted mt-0.5">{location.state}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleShortlist(location.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
              isShortlisted
                ? 'border-teal bg-teal-muted text-teal'
                : 'border-ivory-border text-navy-muted hover:border-teal/40 hover:text-navy'
            }`}
          >
            {isShortlisted ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {isShortlisted ? 'Shortlisted' : 'Shortlist'}
          </button>
          <button
            onClick={() => toggleCompare(location.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
              inCompare
                ? 'border-teal bg-teal-muted text-teal'
                : 'border-ivory-border text-navy-muted hover:border-teal/40 hover:text-navy'
            }`}
          >
            <GitCompare size={14} />
            {inCompare ? 'In Compare' : 'Add to Compare'}
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto border-b border-ivory-border pb-0">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px ${
              activeTab === key
                ? 'border-teal text-teal'
                : 'border-transparent text-navy-muted hover:text-navy'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      <div className="animate-fade-in" key={activeTab}>
        {activeTab === 'overview'   && <OverviewTab location={location} metrics={metrics} candidates={candidates} incentives={incentives} />}
        {activeTab === 'talent'     && <TalentTab salaries={salaries} />}
        {activeTab === 'cost'       && <CostTab metrics={metrics} costs={costs} />}
        {activeTab === 'ecosystem'  && <EcosystemTab gccRecords={gccRecords} metrics={metrics} />}
        {activeTab === 'providers'  && <ProvidersTab providers={providers} />}
        {activeTab === 'checklist'  && <ChecklistTab approvals={approvals} />}
      </div>

      {/* Interactive Scenario Banner */}
      <div className="mt-8 card p-6 bg-gradient-to-r from-teal-faint to-white border-teal/30 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h4 className="font-semibold text-navy text-base flex items-center gap-2">
            <Calculator size={18} className="text-teal" /> Model a Partial Operating Scenario
          </h4>
          <p className="text-xs text-navy-muted mt-1">
            Simulate 1-year people CTC and Grade A office rent for {location.city} based on verified Randstad and JLL data.
          </p>
        </div>
        <Button onClick={() => navigate(`/cost-scenario?location=${location.id}`)}>
          Launch Cost Calculator →
        </Button>
      </div>
    </div>
  )
}
