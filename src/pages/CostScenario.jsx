import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { AlertTriangle, Info } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import usePlanStore from '../store/usePlanStore'
import { CaveatNote, MissingData, Button } from '../components/ui'

const SENIORITIES = [
  { key: 'junior', label: 'Junior (0–5 yrs)', match: 'junior' },
  { key: 'mid', label: 'Mid-level (6–14 yrs)', match: 'middle' },
  { key: 'senior', label: 'Senior (15+ yrs)', match: 'senior' },
]

function fmt(n) {
  return n != null ? Number(n).toLocaleString('en-IN') : null
}

function useLocationOptions() {
  return useQuery({
    queryKey: ['locations-simple'],
    queryFn: async () => {
      const { data } = await supabase.from('locations').select('id, city, state, slug').order('city')
      return data ?? []
    },
  })
}

function useSalaryForLocation(locationId) {
  return useQuery({
    queryKey: ['salary-for-location', locationId],
    queryFn: async () => {
      if (!locationId) return []
      const { data } = await supabase
        .from('salary_benchmarks')
        .select('*, source:sources(publisher,published_at)')
        .eq('location_id', locationId)
      return data ?? []
    },
    enabled: !!locationId,
  })
}

function useRentForLocation(locationId) {
  return useQuery({
    queryKey: ['rent-for-location', locationId],
    queryFn: async () => {
      if (!locationId) return []
      // Query metrics where rent is recorded
      const { data: metrics = [] } = await supabase
        .from('location_metrics')
        .select('*, source:sources(publisher,published_at)')
        .eq('location_id', locationId)
        .in('metric_key', [
          'grade_a_average_rent_inr_psf_month',
          'jll_indicative_office_rent_range_inr_psf_month',
        ])
      return metrics ?? []
    },
    enabled: !!locationId,
  })
}

export default function CostScenario() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const plan = usePlanStore((s) => s.getPlan())

  const { data: locations = [] } = useLocationOptions()

  const [selectedLocationId, setSelectedLocationId] = useState(searchParams.get('location') ?? '')
  const [headcount, setHeadcount] = useState(plan.year1Headcount ?? 50)
  const [sqftPerPerson, setSqftPerPerson] = useState(100)

  // Salary overrides (INR lakhs/year, per seniority)
  const [salaryOverrides, setSalaryOverrides] = useState({})

  const { data: salaries = [] } = useSalaryForLocation(selectedLocationId)
  const { data: rentMetrics = [] } = useRentForLocation(selectedLocationId)

  const seniorityMix = plan.seniorityMix ?? { junior: 30, mid: 50, senior: 20 }

  // Extract rent from metrics
  const rentMetric = rentMetrics.find(m => m.metric_key === 'grade_a_average_rent_inr_psf_month') || rentMetrics[0]
  const rentMid = rentMetric
    ? rentMetric.value_low != null && rentMetric.value_high != null
      ? (Number(rentMetric.value_low) + Number(rentMetric.value_high)) / 2
      : Number(rentMetric.value_low ?? rentMetric.value_high ?? 0)
    : null

  // Salary by seniority
  const salaryBySeniority = useMemo(() => {
    const map = {}
    for (const sen of SENIORITIES) {
      const row = salaries.find((s) => s.seniority?.toLowerCase().includes(sen.match))
      map[sen.key] = salaryOverrides[sen.key] != null
        ? salaryOverrides[sen.key]
        : row?.annual_average != null
        ? Number(row.annual_average) / 100000 // to lakhs
        : null
    }
    return map
  }, [salaries, salaryOverrides])

  // People cost calculation
  const peopleCost = useMemo(() => {
    const hasAnySalary = SENIORITIES.some((s) => salaryBySeniority[s.key] != null)
    if (!hasAnySalary) return null

    let total = 0
    for (const sen of SENIORITIES) {
      const pct = seniorityMix[sen.key] ?? 0
      const salary = salaryBySeniority[sen.key]
      if (salary != null) {
        total += (pct / 100) * headcount * salary * 100000
      }
    }
    return total
  }, [salaryBySeniority, seniorityMix, headcount])

  // Office rent calculation: rent psf month * sqft per person * headcount * 12
  const officeRentAnnual = useMemo(() => {
    if (rentMid == null || rentMid <= 0) return null
    return rentMid * sqftPerPerson * headcount * 12
  }, [rentMid, sqftPerPerson, headcount])

  const subtotal = peopleCost != null && officeRentAnnual != null
    ? peopleCost + officeRentAnnual
    : null

  const selectedLoc = locations.find((l) => l.id === selectedLocationId)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-slide-up">
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-navy">Partial Cost Scenario</h1>
        <p className="text-navy-muted text-sm mt-1">
          A bottom-up estimate using verified salary and Grade A office rent benchmarks.
        </p>
      </div>

      <CaveatNote className="mb-6">
        This scenario calculates: (Salary × Headcount) + (Rent per sq ft × Sq ft per person × Headcount × 12).
        It excludes employer statutory contributions, healthcare, recruitment, utilities, fit-out, transport,
        and taxes. It is a partial scenario, not a complete operating-cost total.
      </CaveatNote>

      {/* Location selector */}
      <div className="card p-5 mb-5 space-y-4">
        <h2 className="font-semibold text-navy text-sm">Location &amp; Headcount</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-navy-muted mb-1.5">City</label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
            >
              <option value="">Select city…</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.city}, {l.state}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-muted mb-1.5">First-Year Headcount</label>
            <input
              type="number" min={1} max={10000}
              value={headcount}
              onChange={(e) => setHeadcount(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
          </div>
        </div>
      </div>

      {/* Salary assumptions */}
      <div className="card p-5 mb-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy text-sm">Salary Benchmarks (Randstad 2024–25)</h2>
          <span className="text-xs text-navy-faint">₹ Lakhs / employee / year (CTC)</span>
        </div>
        {SENIORITIES.map((sen) => {
          const dbRow = salaries.find((s) => s.seniority?.toLowerCase().includes(sen.match))
          const dbVal = dbRow?.annual_average
          const src = dbRow?.source
          const valInLakhs = dbVal != null ? (Number(dbVal) / 100000).toFixed(1) : ''

          return (
            <div key={sen.key} className="flex items-center gap-3">
              <label className="text-sm text-navy-muted w-36 flex-shrink-0">{sen.label}</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={salaryOverrides[sen.key] ?? valInLakhs}
                onChange={(e) => setSalaryOverrides((prev) => ({ ...prev, [sen.key]: Number(e.target.value) }))}
                placeholder={valInLakhs ? `${valInLakhs}` : 'Enter manual CTC'}
                className="flex-1 px-3 py-2 rounded-xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
              />
              <span className="text-xs text-navy-faint w-10 text-right">{seniorityMix[sen.key]}%</span>
              {dbVal != null && !salaryOverrides[sen.key] && (
                <span className="text-[10px] text-teal bg-teal-muted px-2 py-0.5 rounded whitespace-nowrap">
                  {src?.publisher ? src.publisher.slice(0, 15) : 'Randstad'}
                </span>
              )}
            </div>
          )
        })}
        {salaries.length === 0 && selectedLocationId && (
          <p className="text-xs text-amber flex items-center gap-1.5">
            <AlertTriangle size={12} /> No salary benchmarks in dataset for this city — enter CTC figures manually.
          </p>
        )}
      </div>

      {/* Rent assumptions */}
      <div className="card p-5 mb-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy text-sm">Grade A Office Rent (JLL Q1 2025)</h2>
          <span className="text-xs text-navy-faint">Market indicator</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-navy-muted mb-1.5">
              Rent (₹ / sq ft / month)
              {rentMetric && (
                <span className="ml-1.5 text-teal text-[10px] bg-teal-muted px-1.5 py-0.5 rounded">
                  {rentMetric.source?.publisher || 'JLL'}
                </span>
              )}
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={rentMid != null ? Math.round(rentMid) : ''}
              readOnly={rentMid != null}
              placeholder={rentMid == null ? 'No rent data — enter manually' : ''}
              className="w-full px-3 py-2.5 rounded-xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 read-only:bg-ivory-dark"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-muted mb-1.5">
              Workspace (Sq ft / person)
            </label>
            <input
              type="number" min={50} max={500} step={10}
              value={sqftPerPerson}
              onChange={(e) => setSqftPerPerson(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
          </div>
        </div>
        {!rentMetric && selectedLocationId && (
          <p className="text-xs text-amber flex items-center gap-1.5">
            <AlertTriangle size={12} /> No Grade A rent data for this city in JLL coverage.
          </p>
        )}
      </div>

      {/* Output */}
      {selectedLocationId && (
        <div className="card p-6 border-teal/30 bg-teal-faint space-y-4">
          <h2 className="font-semibold text-navy">
            Partial Estimate — {selectedLoc?.city ?? '…'}
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-navy-muted">Annual People Cost ({headcount} FTEs)</span>
              <span className="font-semibold text-navy">
                {peopleCost != null ? `₹${fmt(Math.round(peopleCost / 100000))} Lakhs` : <MissingData label="Salary data missing" />}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-navy-muted">
                Annual Office Rent ({sqftPerPerson} sq ft/person · {rentMid != null ? `₹${Math.round(rentMid)}/sq ft/mo` : 'rate missing'})
              </span>
              <span className="font-semibold text-navy">
                {officeRentAnnual != null ? `₹${fmt(Math.round(officeRentAnnual / 100000))} Lakhs` : <MissingData label="Rent data missing" />}
              </span>
            </div>
            <div className="border-t border-teal/20 pt-3 flex justify-between">
              <span className="font-semibold text-navy">People + Rent Subtotal</span>
              <span className="font-bold text-teal text-lg">
                {subtotal != null ? `₹${(subtotal / 10000000).toFixed(2)} Crore / year` : <MissingData label="Incomplete inputs" />}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-navy-muted bg-white/70 rounded-xl p-3">
            <Info size={13} className="flex-shrink-0 mt-0.5 text-navy-faint" />
            <p>
              <strong>Exclusions:</strong> employer statutory benefits (PF/ESI/Gratuity), medical insurance,
              recruitment fees, fit-out capital expenditure, CAM (common area maintenance), utilities,
              telecom, corporate taxes, and applicable state incentives.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3 flex-wrap">
        <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
        {selectedLocationId && (
          <Button variant="secondary" onClick={() => navigate(`/location/${selectedLoc?.slug ?? selectedLocationId}`)}>
            View City Profile
          </Button>
        )}
      </div>
    </div>
  )
}
