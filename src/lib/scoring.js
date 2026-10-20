/**
 * GCC Atlas — Deterministic Scoring Engine
 *
 * Rankings are deterministic and based solely on comparable available evidence
 * and user-selected weights. AI may explain results but must not calculate
 * or change rankings. Missing values stay missing and are not assumed to be zero.
 */

// ─── Normalization ────────────────────────────────────────────────────────────

function normalize(values, inverse = false) {
  const valid = values.filter((v) => v !== null && v !== undefined && !isNaN(v))
  if (valid.length === 0) return values.map(() => null)

  const min = Math.min(...valid)
  const max = Math.max(...valid)

  return values.map((v) => {
    if (v === null || v === undefined || isNaN(v)) return null
    if (max === min) return 50
    const pct = ((v - min) / (max - min)) * 100
    return inverse ? 100 - pct : pct
  })
}

// ─── Metric Extractors (Mapped to exact Supabase seeded schema) ────────────────

function talentRaw(loc, metricsMap, recordsCountMap) {
  const metrics = metricsMap[loc.id] ?? []
  
  // 1. GCCPROs verified GCC count
  const gccpros = metrics.find((x) => x.metric_key === 'gccpros_verified_gcc_count')
  if (gccpros?.value_low != null) return Number(gccpros.value_low)

  // 2. Zinnov FY26 lower bound estimate
  const zinnov = metrics.find((x) => x.metric_key === 'zinnov_gcc_units_fy26e_lower_bound')
  if (zinnov?.value_low != null) return Number(zinnov.value_low)

  // 3. GCC Explorer live job postings snapshot
  const explorer = metrics.find((x) => x.metric_key === 'gcc_explorer_live_job_postings_snapshot')
  if (explorer?.value_low != null) return Number(explorer.value_low)

  // 4. Fallback to individual GCC company records count
  const cnt = recordsCountMap[loc.id] ?? 0
  return cnt > 0 ? cnt : null
}

function salaryRaw(loc, salaryMap) {
  const rows = salaryMap[loc.id] ?? []
  if (!rows.length) return null
  return rows.reduce((s, r) => s + Number(r.annual_average), 0) / rows.length
}

function rentRaw(loc, metricsMap, costMap) {
  const metrics = metricsMap[loc.id] ?? []

  // Check JLL average Grade A rent
  const avgRent = metrics.find((x) => x.metric_key === 'grade_a_average_rent_inr_psf_month')
  if (avgRent?.value_low != null) return Number(avgRent.value_low)

  // Check JLL indicative rent range
  const rentRange = metrics.find((x) => x.metric_key === 'jll_indicative_office_rent_range_inr_psf_month')
  if (rentRange) {
    const lo = rentRange.value_low != null ? Number(rentRange.value_low) : null
    const hi = rentRange.value_high != null ? Number(rentRange.value_high) : null
    if (lo !== null && hi !== null) return (lo + hi) / 2
    if (lo !== null) return lo
    if (hi !== null) return hi
  }

  // Fallback to location_cost_components table if present
  const costs = costMap[loc.id] ?? []
  const row = costs.find(
    (c) =>
      c.component_key?.toLowerCase().includes('rent') ||
      c.component_label?.toLowerCase().includes('rent')
  )
  if (!row) return null
  const lo = row.value_low != null ? Number(row.value_low) : null
  const hi = row.value_high != null ? Number(row.value_high) : null
  if (lo !== null && hi !== null) return (lo + hi) / 2
  return lo ?? hi
}

function ecosystemRaw(loc, metricsMap, recordsCountMap, candidateEvidenceMap, providersCountMap) {
  const metrics = metricsMap[loc.id] ?? []
  const records = recordsCountMap[loc.id] ?? 0
  const candidateEv = (candidateEvidenceMap[loc.id] ?? []).length
  const providers = providersCountMap[loc.id] ?? 0

  // Check office leasing scale (Grade A leasing volume indicates ecosystem depth)
  const leasing = metrics.find((x) => x.metric_key === 'office_gross_leasing_h1_2025')
  const leasingVol = leasing?.value_low != null ? Number(leasing.value_low) : 0

  const total = records * 3 + candidateEv * 2 + providers * 2 + (leasingVol > 0 ? 5 : 0)
  return total > 0 ? total : null
}

function readinessRaw(loc, candidateEvidenceMap, providersCountMap) {
  const candidateEv = (candidateEvidenceMap[loc.id] ?? []).length
  const providers = providersCountMap[loc.id] ?? 0
  const total = candidateEv * 2 + providers * 3
  return total > 0 ? total : null
}

// ─── Reasons & Trade-offs Generation ──────────────────────────────────────────

function makeReasons(loc, dims, metricsMap) {
  const reasons = []
  const get = (key) => dims.find((d) => d.key === key)
  const metrics = metricsMap[loc.id] ?? []

  const gccpros = metrics.find((x) => x.metric_key === 'gccpros_verified_gcc_count')
  if (gccpros?.value_low != null) {
    reasons.push(`${gccpros.value_low} verified GCC centres recorded by GCCPROs`)
  } else {
    const zinnov = metrics.find((x) => x.metric_key === 'zinnov_gcc_units_fy26e_lower_bound')
    if (zinnov?.value_low != null) {
      reasons.push(`Estimated ${zinnov.value_low}+ GCC units by FY26 (Zinnov)`)
    }
  }

  if ((get('cost')?.score ?? -1) >= 60) {
    reasons.push('Competitive salary benchmarks across junior & mid bands')
  }

  if ((get('rent')?.score ?? -1) >= 60) {
    reasons.push('Favourable Grade A office lease rates vs top tier markets')
  }

  const leasing = metrics.find((x) => x.metric_key === 'office_gross_leasing_h1_2025')
  if (leasing?.value_low != null && Number(leasing.value_low) > 4) {
    reasons.push(`High office absorption (${leasing.value_low} mn sq ft H1 2025, JLL)`)
  }

  if (!reasons.length) {
    reasons.push(`Included as a candidate market for India GCC expansion`)
  }

  return reasons
}

function makeTradeoffs(dims, metricsMap, loc) {
  const tradeoffs = []
  const get = (key) => dims.find((d) => d.key === key)
  const metrics = metricsMap[loc.id] ?? []

  const cost = get('cost')
  if (cost?.score !== null && cost.score < 40) {
    tradeoffs.push('Higher average CTC benchmarks across seniority tiers')
  }

  const rent = get('rent')
  if (rent?.score !== null && rent.score < 40) {
    tradeoffs.push('Premium Grade A office rents (JLL benchmarks)')
  }

  const vacancy = metrics.find((x) => x.metric_key === 'grade_a_office_vacancy_pct')
  if (vacancy?.value_low != null && Number(vacancy.value_low) < 8) {
    tradeoffs.push(`Tight office vacancy (${vacancy.value_low}%), limited immediate space`)
  }

  if (get('talent')?.score === null) {
    tradeoffs.push('Verified GCC center counts not published in available snapshot')
  }

  if (get('rent')?.score === null) {
    tradeoffs.push('Grade A office rent benchmarks missing in JLL coverage')
  }

  return tradeoffs
}

// ─── Main scoring function ────────────────────────────────────────────────────

export function scoreLocations(locations, dataContext, weights) {
  const {
    metricsMap = {},
    salaryMap = {},
    costMap = {},
    recordsCountMap = {},
    candidateEvidenceMap = {},
    providersCountMap = {},
  } = dataContext

  const W = {
    talent: weights?.talent ?? 3,
    cost: weights?.cost ?? 3,
    rent: weights?.rent ?? 2,
    ecosystem: weights?.ecosystem ?? 3,
    readiness: weights?.readiness ?? 2,
  }

  const raw = locations.map((loc) => ({
    loc,
    talent: talentRaw(loc, metricsMap, recordsCountMap),
    salary: salaryRaw(loc, salaryMap),
    rent: rentRaw(loc, metricsMap, costMap),
    ecosystem: ecosystemRaw(loc, metricsMap, recordsCountMap, candidateEvidenceMap, providersCountMap),
    readiness: readinessRaw(loc, candidateEvidenceMap, providersCountMap),
  }))

  const talentN = normalize(raw.map((d) => d.talent))
  const salaryN = normalize(raw.map((d) => d.salary), true) // inverse: lower salary -> higher score
  const rentN = normalize(raw.map((d) => d.rent), true)     // inverse: lower rent -> higher score
  const ecosystemN = normalize(raw.map((d) => d.ecosystem))
  const readinessN = normalize(raw.map((d) => d.readiness))

  return raw
    .map((d, i) => {
      const dims = [
        { key: 'talent',    label: 'Talent Availability', score: talentN[i],    weight: W.talent,    raw: d.talent },
        { key: 'cost',      label: 'Salary Advantage',    score: salaryN[i],    weight: W.cost,      raw: d.salary },
        { key: 'rent',      label: 'Office Rent Value',   score: rentN[i],      weight: W.rent,      raw: d.rent },
        { key: 'ecosystem', label: 'GCC Ecosystem',       score: ecosystemN[i], weight: W.ecosystem, raw: d.ecosystem },
        { key: 'readiness', label: 'Setup Readiness',     score: readinessN[i], weight: W.readiness, raw: d.readiness },
      ]

      const scored = dims.filter((d) => d.score !== null)
      const wSum = scored.reduce((s, d) => s + d.weight, 0)

      let totalScore = null
      if (wSum > 0) {
        totalScore = Math.round(
          scored.reduce((s, d) => s + d.score * d.weight, 0) / wSum
        )
      }

      const coverage = dims.length ? scored.length / dims.length : 0
      const confidence =
        coverage >= 0.8 ? 'high' : coverage >= 0.5 ? 'medium' : 'low'

      return {
        location: d.loc,
        totalScore,
        dims,
        coverage,
        confidence,
        reasons: makeReasons(d.loc, dims, metricsMap),
        tradeoffs: makeTradeoffs(dims, metricsMap, d.loc),
      }
    })
    .sort((a, b) => {
      if (a.totalScore === null && b.totalScore === null) return 0
      if (a.totalScore === null) return 1
      if (b.totalScore === null) return -1
      return b.totalScore - a.totalScore
    })
}

// ─── Data map builder ─────────────────────────────────────────────────────────

export function buildDataMaps(
  allMetrics = [],
  allSalaries = [],
  allCosts = [],
  allRecords = [],
  allIncentives = [],
  allProviderLocations = [],
  allCandidateEvidence = []
) {
  const metricsMap = {}
  const salaryMap = {}
  const costMap = {}
  const recordsCountMap = {}
  const incentivesMap = {}
  const providersCountMap = {}
  const candidateEvidenceMap = {}

  for (const m of allMetrics) {
    ;(metricsMap[m.location_id] ??= []).push(m)
  }
  for (const s of allSalaries) {
    ;(salaryMap[s.location_id] ??= []).push(s)
  }
  for (const c of allCosts) {
    ;(costMap[c.location_id] ??= []).push(c)
  }
  for (const r of allRecords) {
    recordsCountMap[r.location_id] = (recordsCountMap[r.location_id] ?? 0) + 1
  }
  for (const inc of allIncentives) {
    ;(incentivesMap[inc.location_id] ??= []).push(inc)
  }
  for (const pl of allProviderLocations) {
    providersCountMap[pl.location_id] =
      (providersCountMap[pl.location_id] ?? 0) + 1
  }
  for (const ce of allCandidateEvidence) {
    ;(candidateEvidenceMap[ce.location_id] ??= []).push(ce)
  }

  return {
    metricsMap,
    salaryMap,
    costMap,
    recordsCountMap,
    incentivesMap,
    providersCountMap,
    candidateEvidenceMap,
  }
}
