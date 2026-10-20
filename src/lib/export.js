// ─── Helpers ──────────────────────────────────────────────────────────────────

function csv(v) {
  if (v === null || v === undefined) return ''
  const s = String(v)
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

function row(fields) {
  return fields.map(csv).join(',')
}

function blob(content, filename, type = 'text/csv') {
  const b = new Blob([content], { type })
  const url = URL.createObjectURL(b)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function downloadLocationsCSV(scoredLocations) {
  const header = row([
    'Rank', 'City', 'State', 'Region', 'Score', 'Confidence', 'Coverage %',
    'Talent Score', 'Cost Score', 'Rent Score', 'Ecosystem Score', 'Readiness Score',
    'Description',
  ])

  const rows = scoredLocations.map((s, i) => {
    const dim = (key) => {
      const d = s.dims.find((x) => x.key === key)
      return d?.score !== null ? Math.round(d.score) : ''
    }
    return row([
      i + 1,
      s.location.city,
      s.location.state,
      s.location.region ?? '',
      s.totalScore ?? '',
      s.confidence,
      `${Math.round(s.coverage * 100)}%`,
      dim('talent'),
      dim('cost'),
      dim('rent'),
      dim('ecosystem'),
      dim('readiness'),
      s.location.short_description ?? '',
    ])
  })

  blob([header, ...rows].join('\n'), 'gcc-atlas-locations.csv')
}

export function downloadSalaryCSV(salaries) {
  const header = row([
    'City', 'State', 'Seniority', 'Role / Scope', 'Annual CTC (INR)', 'Currency',
    'Period', 'Source', 'Methodology', 'Notes',
  ])
  const rows = salaries.map((s) =>
    row([
      s.city ?? s.location_id,
      s.state ?? '',
      s.seniority,
      s.role_title ?? 'Cross-industry average',
      s.annual_average,
      s.currency,
      s.period_label,
      s.publisher ?? '',
      s.methodology ?? '',
      s.notes ?? '',
    ])
  )
  blob([header, ...rows].join('\n'), 'gcc-atlas-salary-benchmarks.csv')
}

export function downloadPlanJSON(plan, scoredLocations = []) {
  const data = {
    exportedAt: new Date().toISOString(),
    tool: 'GCC Atlas — MVP Prototype',
    disclaimer:
      'Scores are deterministic and based only on available evidence. Missing values are excluded from scoring. This is a partial scenario estimate, not a complete operating-cost total.',
    plan,
    weights: plan.weights,
    rankedLocations: scoredLocations.slice(0, 5).map((s, i) => ({
      rank: i + 1,
      city: s.location.city,
      state: s.location.state,
      score: s.totalScore,
      confidence: s.confidence,
      coveragePct: `${Math.round(s.coverage * 100)}%`,
      dimensions: s.dims.map((d) => ({
        dimension: d.label,
        normalizedScore: d.score !== null ? Math.round(d.score) : null,
        weight: d.weight,
        hasData: d.score !== null,
      })),
      reasons: s.reasons,
      tradeoffs: s.tradeoffs,
    })),
  }
  blob(JSON.stringify(data, null, 2), 'gcc-atlas-plan.json', 'application/json')
}

export async function shareApp() {
  const url = window.location.href
  if (navigator.share) {
    await navigator.share({ title: 'GCC Atlas', url })
    return 'shared'
  }
  await navigator.clipboard.writeText(url)
  return 'copied'
}

export function encodePlan(plan) {
  return btoa(encodeURIComponent(JSON.stringify(plan)))
}

export function decodePlan(encoded) {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)))
  } catch {
    return null
  }
}
