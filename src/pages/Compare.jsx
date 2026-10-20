import { useNavigate } from 'react-router-dom'
import { X, Plus, ExternalLink } from 'lucide-react'
import { useAtlasData } from '../hooks/useAtlasData'
import usePlanStore from '../store/usePlanStore'
import { MissingData, CaveatNote, SkeletonCard, Button } from '../components/ui'

const SENIORITIES = [
  { key: 'junior', label: 'Junior (0–5 yrs)', match: 'junior' },
  { key: 'middle', label: 'Mid-level (6–14 yrs)', match: 'middle' },
  { key: 'senior', label: 'Senior (15+ yrs)', match: 'senior' },
]

function Cell({ value, unit, missing = false, isHeader = false }) {
  if (isHeader) return <th className="px-4 py-3 text-left text-xs font-semibold text-navy-muted uppercase tracking-wide bg-ivory-dark border-b border-ivory-border">{value}</th>
  if (missing || value === null || value === undefined)
    return <td className="px-4 py-3 border-b border-ivory-border"><MissingData /></td>
  return (
    <td className="px-4 py-3 border-b border-ivory-border text-sm text-navy">
      {value}{unit ? <span className="text-navy-faint ml-1 text-xs">{unit}</span> : ''}
    </td>
  )
}

export default function Compare() {
  const navigate = useNavigate()
  const { compareList, clearCompare, toggleCompare } = usePlanStore()
  const weights = usePlanStore((s) => s.weights)
  const { data, isLoading } = useAtlasData(weights)

  const locations = (data?.locations ?? []).filter((l) => compareList.includes(l.id))
  const scored = (data?.scored ?? []).filter((s) => compareList.includes(s.location.id))
  const scored_map = Object.fromEntries(scored.map((s) => [s.location.id, s]))

  // Build salary lookup
  const salaryMap = {}
  for (const sb of data?.salaries ?? []) {
    ;(salaryMap[sb.location_id] ??= []).push(sb)
  }

  // Build metrics lookup
  const metricsMap = {}
  for (const m of data?.metrics ?? []) {
    ;(metricsMap[m.location_id] ??= []).push(m)
  }

  const lids = locations.map((l) => l.id)

  if (compareList.length < 2) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <p className="text-navy font-semibold text-lg mb-2">No locations to compare</p>
        <p className="text-navy-muted text-sm mb-6">
          Add 2 to 5 locations from the Recommendations or Location Detail pages to compare them side by side.
        </p>
        <Button onClick={() => navigate('/recommendations')}>Explore Recommendations</Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-navy">Compare Locations</h1>
          <p className="text-navy-muted text-sm mt-1">
            Side-by-side comparison using uniform metric definitions, sources, and units.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/recommendations')} className="text-xs">
            <Plus size={13} /> Add More
          </Button>
          <Button variant="secondary" onClick={clearCompare} className="text-xs text-red-600 border-red-200 hover:bg-red-50">
            Clear Compare
          </Button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonCard lines={8} />
      ) : (
        <div className="card overflow-x-auto shadow-card">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <Cell isHeader value="Metric / Dimension" />
                {locations.map((loc) => (
                  <th key={loc.id} className="px-4 py-3 bg-ivory-dark border-b border-ivory-border">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-left">
                        <p className="font-semibold text-navy text-sm">{loc.city}</p>
                        <p className="text-xs text-navy-muted">{loc.state}</p>
                      </div>
                      <button
                        onClick={() => toggleCompare(loc.id)}
                        className="p-1 rounded hover:bg-ivory-border transition-colors"
                        title="Remove"
                      >
                        <X size={13} className="text-navy-faint" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Atlas Score */}
              <tr className="bg-teal-faint font-semibold">
                <td className="px-4 py-3 border-b border-ivory-border text-sm text-navy">
                  Atlas Score
                  <span className="block text-[10px] text-navy-faint font-normal">Deterministic weighted score</span>
                </td>
                {lids.map((lid) => {
                  const s = scored_map[lid]
                  return (
                    <td key={lid} className="px-4 py-3 border-b border-ivory-border">
                      {s?.totalScore !== null && s?.totalScore !== undefined ? (
                        <span className="font-bold text-teal text-xl">{s.totalScore}</span>
                      ) : (
                        <MissingData />
                      )}
                    </td>
                  )
                })}
              </tr>

              {/* Confidence */}
              <tr className="hover:bg-ivory/60 transition-colors">
                <td className="px-4 py-3 border-b border-ivory-border text-sm font-medium text-navy-muted">
                  Evidence Confidence
                </td>
                {lids.map((lid) => {
                  const s = scored_map[lid]
                  const conf = s?.confidence
                  return (
                    <td key={lid} className="px-4 py-3 border-b border-ivory-border text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-medium ${
                        conf === 'high' ? 'bg-green-100 text-green-700' :
                        conf === 'medium' ? 'bg-teal-muted text-teal' : 'bg-amber-muted text-amber'
                      }`}>
                        {conf ? `${conf.toUpperCase()} (${Math.round((s?.coverage ?? 0) * 100)}% cov)` : '—'}
                      </span>
                    </td>
                  )
                })}
              </tr>

              {/* Verified GCC Centers */}
              <tr className="hover:bg-ivory/60 transition-colors">
                <td className="px-4 py-3 border-b border-ivory-border text-sm font-medium text-navy-muted">
                  Verified GCC Centres
                  <span className="block text-[10px] text-navy-faint">GCCPROs Verified Database</span>
                </td>
                {lids.map((lid) => {
                  const m = (metricsMap[lid] ?? []).find((x) => x.metric_key === 'gccpros_verified_gcc_count')
                  return (
                    <td key={lid} className="px-4 py-3 border-b border-ivory-border text-sm text-navy font-medium">
                      {m ? `${m.value_low} centres` : <MissingData />}
                    </td>
                  )
                })}
              </tr>

              {/* Zinnov FY26 Lower Bound */}
              <tr className="hover:bg-ivory/60 transition-colors">
                <td className="px-4 py-3 border-b border-ivory-border text-sm font-medium text-navy-muted">
                  Zinnov GCC Units (FY26E)
                  <span className="block text-[10px] text-navy-faint">NASSCOM / Zinnov Emerging Hubs</span>
                </td>
                {lids.map((lid) => {
                  const m = (metricsMap[lid] ?? []).find((x) => x.metric_key === 'zinnov_gcc_units_fy26e_lower_bound')
                  return (
                    <td key={lid} className="px-4 py-3 border-b border-ivory-border text-sm text-navy">
                      {m ? `${m.value_low}+ units (lower bound)` : <MissingData />}
                    </td>
                  )
                })}
              </tr>

              {/* Section: Randstad Salaries */}
              <tr>
                <td colSpan={lids.length + 1} className="px-4 py-2 bg-ivory-dark text-xs font-semibold text-navy-muted uppercase tracking-wide">
                  Cross-Industry Salary Benchmarks (Randstad 2024–25, Average CTC)
                </td>
              </tr>
              {SENIORITIES.map((sen) => (
                <tr key={sen.key} className="hover:bg-ivory/60 transition-colors">
                  <td className="px-4 py-3 border-b border-ivory-border text-sm font-medium text-navy-muted">
                    {sen.label}
                  </td>
                  {lids.map((lid) => {
                    const rows = salaryMap[lid] ?? []
                    const row = rows.find((r) => r.seniority?.toLowerCase().includes(sen.match))
                    return (
                      <td key={lid} className="px-4 py-3 border-b border-ivory-border text-sm text-navy">
                        {row ? (
                          <div>
                            <span className="font-semibold">₹{(Number(row.annual_average) / 100000).toFixed(1)} Lakhs</span>
                            <span className="block text-[10px] text-navy-faint">₹{Number(row.annual_average).toLocaleString('en-IN')}/yr</span>
                          </div>
                        ) : (
                          <MissingData />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {/* Section: JLL Office Indicators */}
              <tr>
                <td colSpan={lids.length + 1} className="px-4 py-2 bg-ivory-dark text-xs font-semibold text-navy-muted uppercase tracking-wide">
                  Grade A Office Real Estate (JLL Q1 2025)
                </td>
              </tr>
              <tr className="hover:bg-ivory/60 transition-colors">
                <td className="px-4 py-3 border-b border-ivory-border text-sm font-medium text-navy-muted">
                  Average Rent
                  <span className="block text-[10px] text-navy-faint">INR / sq ft / month</span>
                </td>
                {lids.map((lid) => {
                  const m = (metricsMap[lid] ?? []).find((x) => x.metric_key === 'grade_a_average_rent_inr_psf_month')
                  const rangeM = (metricsMap[lid] ?? []).find((x) => x.metric_key === 'jll_indicative_office_rent_range_inr_psf_month')
                  return (
                    <td key={lid} className="px-4 py-3 border-b border-ivory-border text-sm text-navy">
                      {m?.value_low != null ? (
                        <span className="font-semibold">₹{m.value_low} / sq ft</span>
                      ) : rangeM?.value_low != null ? (
                        <span>₹{rangeM.value_low}–{rangeM.value_high} / sq ft</span>
                      ) : (
                        <MissingData />
                      )}
                    </td>
                  )
                })}
              </tr>
              <tr className="hover:bg-ivory/60 transition-colors">
                <td className="px-4 py-3 border-b border-ivory-border text-sm font-medium text-navy-muted">
                  Grade A Vacancy %
                </td>
                {lids.map((lid) => {
                  const m = (metricsMap[lid] ?? []).find((x) => x.metric_key === 'grade_a_office_vacancy_pct')
                  return (
                    <td key={lid} className="px-4 py-3 border-b border-ivory-border text-sm text-navy">
                      {m?.value_low != null ? `${m.value_low}%` : <MissingData />}
                    </td>
                  )
                })}
              </tr>
              <tr className="hover:bg-ivory/60 transition-colors">
                <td className="px-4 py-3 border-b border-ivory-border text-sm font-medium text-navy-muted">
                  Gross Office Leasing (H1 2025)
                </td>
                {lids.map((lid) => {
                  const m = (metricsMap[lid] ?? []).find((x) => x.metric_key === 'office_gross_leasing_h1_2025')
                  return (
                    <td key={lid} className="px-4 py-3 border-b border-ivory-border text-sm text-navy">
                      {m?.value_low != null ? `${m.value_low} mn sq ft` : <MissingData />}
                    </td>
                  )
                })}
              </tr>

              {/* Action row */}
              <tr className="bg-ivory-dark/40">
                <td className="px-4 py-3 text-sm font-medium text-navy-muted">Actions</td>
                {locations.map((loc) => (
                  <td key={loc.id} className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/location/${loc.slug}`)}
                      className="text-xs text-teal font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Full Profile <ExternalLink size={11} />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <CaveatNote className="mt-6">
        All figures reflect their respective publication snapshots. Randstad salaries represent cross-industry
        city averages, not dedicated software or finance role compensation. JLL figures represent commercial
        market benchmarks rather than specific building lease terms. Missing values remain blank.
      </CaveatNote>
    </div>
  )
}
