import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Circle, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react'
import usePlanStore, { EXAMPLE_PLAN } from '../store/usePlanStore'
import { Button, WeightSlider, CaveatNote } from '../components/ui'

const STEPS = ['Context', 'Functions', 'Headcount', 'Priorities', 'Constraints', 'Review']

const SECTORS = [
  'Financial Services', 'Technology', 'Healthcare / Life Sciences',
  'Manufacturing', 'Retail / E-commerce', 'Media & Entertainment',
  'Energy & Utilities', 'Professional Services', 'Other',
]

const FUNCTIONS = [
  'Technology & Engineering', 'Finance & Accounting', 'Analytics & Data',
  'Operations & Supply Chain', 'Legal & Compliance', 'HR & Talent',
  'Customer Experience', 'Research & Development', 'Procurement',
]

const STATES = [
  'Karnataka', 'Telangana', 'Tamil Nadu', 'Maharashtra', 'NCT of Delhi',
  'Haryana', 'West Bengal', 'Gujarat', 'Kerala', 'Punjab', 'Rajasthan',
  'Madhya Pradesh', 'Uttar Pradesh', 'Odisha', 'Goa', 'No preference',
]

// ─── Step components ──────────────────────────────────────────────────────────

function Step1({ store }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-navy mb-1.5">Organisation name</label>
        <input
          type="text"
          value={store.orgName}
          onChange={(e) => store.setContext({ orgName: e.target.value })}
          placeholder="e.g. Acme Corp"
          className="w-full px-3 py-2.5 rounded-xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy mb-1.5">Sector</label>
        <select
          value={store.sector}
          onChange={(e) => store.setContext({ sector: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 transition"
        >
          <option value="">Select sector…</option>
          {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-navy mb-1.5">Primary GCC function</label>
        <select
          value={store.primaryFunction}
          onChange={(e) => store.setContext({ primaryFunction: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 transition"
        >
          <option value="">Select primary function…</option>
          {FUNCTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
    </div>
  )
}

function Step2({ store }) {
  const toggle = (fn) => {
    const current = store.functions
    store.setFunctions(
      current.includes(fn) ? current.filter((f) => f !== fn) : [...current, fn]
    )
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-navy-muted">Select all GCC functions you plan to establish.</p>
      <div className="grid sm:grid-cols-2 gap-2">
        {FUNCTIONS.map((fn) => {
          const checked = store.functions.includes(fn)
          return (
            <button
              key={fn}
              onClick={() => toggle(fn)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm text-left transition-all ${
                checked
                  ? 'border-teal bg-teal-faint text-teal font-medium'
                  : 'border-ivory-border bg-white text-navy-muted hover:border-teal/40 hover:text-navy'
              }`}
            >
              {checked ? <CheckCircle size={15} className="flex-shrink-0" /> : <Circle size={15} className="flex-shrink-0" />}
              {fn}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Step3({ store }) {
  const { year1Headcount, year3Target, seniorityMix } = store
  const total = Object.values(seniorityMix).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Year 1 headcount</label>
          <input
            type="number" min={1} max={5000}
            value={year1Headcount}
            onChange={(e) => store.setHeadcount({ year1Headcount: Number(e.target.value) })}
            className="w-full px-3 py-2.5 rounded-xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">3-year target headcount</label>
          <input
            type="number" min={1} max={50000}
            value={year3Target}
            onChange={(e) => store.setHeadcount({ year3Target: Number(e.target.value) })}
            className="w-full px-3 py-2.5 rounded-xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-navy mb-3">Seniority mix (% of headcount)</p>
        {total !== 100 && (
          <p className="text-xs text-amber mb-2 flex items-center gap-1">
            <AlertCircle size={12} /> Must total 100% (currently {total}%)
          </p>
        )}
        {[
          { key: 'junior', label: 'Junior (0–3 yrs)' },
          { key: 'mid', label: 'Mid-level (3–8 yrs)' },
          { key: 'senior', label: 'Senior (8+ yrs)' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3 mb-3">
            <label className="text-sm text-navy-muted w-36 flex-shrink-0">{label}</label>
            <input
              type="range" min={0} max={100} step={5}
              value={seniorityMix[key]}
              onChange={(e) =>
                store.setHeadcount({ seniorityMix: { ...seniorityMix, [key]: Number(e.target.value) } })
              }
              className="flex-1 accent-teal"
            />
            <span className="text-sm font-semibold text-navy w-10 text-right">{seniorityMix[key]}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Step4({ store }) {
  const { weights } = store
  const DIM_DESCS = {
    talent: 'How important is access to a large existing GCC talent pool?',
    cost: 'How important is keeping average salary costs low?',
    rent: 'How important is keeping Grade A office-rent costs low?',
    ecosystem: 'How important is an established GCC ecosystem with active incentives?',
    readiness: 'How important is ease of setup — available providers and active incentives?',
  }
  return (
    <div className="space-y-6">
      <p className="text-sm text-navy-muted">
        Drag each slider to set how much each factor should influence your ranking.
        These weights drive the deterministic scoring algorithm.
      </p>
      {Object.entries(weights).map(([key, val]) => (
        <WeightSlider
          key={key}
          label={{ talent: 'Talent Availability', cost: 'Salary Cost', rent: 'Office Rent', ecosystem: 'GCC Ecosystem', readiness: 'Setup Readiness' }[key]}
          value={val}
          onChange={(v) => store.setWeights({ [key]: v })}
          description={DIM_DESCS[key]}
        />
      ))}
      <CaveatNote>
        Rankings are calculated from available evidence only. Where data is missing, that dimension
        is excluded from scoring rather than assumed.
      </CaveatNote>
    </div>
  )
}

function Step5({ store }) {
  const toggle = (st) => {
    const cur = store.preferredStates
    store.setConstraints({
      preferredStates: cur.includes(st) ? cur.filter((s) => s !== st) : [...cur, st],
    })
  }
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-navy mb-3">Preferred states (optional)</p>
        <div className="flex flex-wrap gap-2">
          {STATES.map((st) => {
            const sel = store.preferredStates.includes(st)
            return (
              <button
                key={st}
                onClick={() => toggle(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  sel ? 'border-teal bg-teal text-white' : 'border-ivory-border bg-white text-navy-muted hover:border-teal/40'
                }`}
              >
                {st}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-navy mb-1.5">Additional notes</label>
        <textarea
          rows={3}
          value={store.notes}
          onChange={(e) => store.setConstraints({ notes: e.target.value })}
          placeholder="e.g. Must have direct flights from HQ, prefer proximity to existing vendor ecosystem…"
          className="w-full px-3 py-2.5 rounded-xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 resize-none"
        />
      </div>
    </div>
  )
}

function Review({ store, navigate }) {
  const plan = store.getPlan()
  return (
    <div className="space-y-5">
      {store.isExample && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-faint border border-amber/30 rounded-xl text-xs text-amber">
          <AlertCircle size={13} /> This is an example plan — clearly marked for reference only.
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div className="card p-4 space-y-2">
          <p className="font-semibold text-navy-muted text-xs uppercase tracking-wide">Organisation</p>
          <p className="font-medium text-navy">{plan.orgName || <span className="text-navy-faint italic">Not set</span>}</p>
          <p className="text-navy-muted">{plan.sector || '—'}</p>
        </div>
        <div className="card p-4 space-y-2">
          <p className="font-semibold text-navy-muted text-xs uppercase tracking-wide">Functions</p>
          {plan.functions.length ? (
            <div className="flex flex-wrap gap-1">
              {plan.functions.map((f) => (
                <span key={f} className="px-2 py-0.5 bg-teal-muted text-teal text-xs rounded-full">{f}</span>
              ))}
            </div>
          ) : <span className="text-navy-faint italic text-xs">None selected</span>}
        </div>
        <div className="card p-4 space-y-2">
          <p className="font-semibold text-navy-muted text-xs uppercase tracking-wide">Headcount</p>
          <p className="text-navy">Year 1: <strong>{plan.year1Headcount}</strong></p>
          <p className="text-navy">Year 3: <strong>{plan.year3Target}</strong></p>
          <p className="text-navy-muted text-xs">
            {plan.seniorityMix.junior}% junior · {plan.seniorityMix.mid}% mid · {plan.seniorityMix.senior}% senior
          </p>
        </div>
        <div className="card p-4 space-y-2">
          <p className="font-semibold text-navy-muted text-xs uppercase tracking-wide">Weights</p>
          {Object.entries(plan.weights).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-navy-muted capitalize">{k}</span>
              <span className="font-semibold text-teal">{v}/5</span>
            </div>
          ))}
        </div>
      </div>
      <Button
        onClick={() => navigate('/recommendations')}
        className="w-full py-3 text-base"
      >
        Generate Recommendations <ChevronRight size={16} />
      </Button>
    </div>
  )
}

// ─── Plan wizard shell ────────────────────────────────────────────────────────

export default function Plan() {
  const navigate = useNavigate()
  const store = usePlanStore()
  const { currentStep, nextStep, prevStep, setStep, loadExample, resetPlan, isExample } = store

  const steps = [
    { label: STEPS[0], component: <Step1 store={store} /> },
    { label: STEPS[1], component: <Step2 store={store} /> },
    { label: STEPS[2], component: <Step3 store={store} /> },
    { label: STEPS[3], component: <Step4 store={store} /> },
    { label: STEPS[4], component: <Step5 store={store} /> },
    { label: STEPS[5], component: <Review store={store} navigate={navigate} /> },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-navy">Create your GCC plan</h1>
          <p className="text-navy-muted text-sm mt-1">
            Your profile shapes the scoring. No data is sent to a server.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadExample}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber/40 bg-amber-faint text-amber hover:bg-amber-muted transition-colors"
          >
            Load example
          </button>
          <button
            onClick={resetPlan}
            className="text-xs px-3 py-1.5 rounded-lg border border-ivory-border text-navy-muted hover:bg-ivory-dark transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex gap-0.5 mb-8 overflow-x-auto">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i)}
            className={`flex-1 min-w-[60px] py-2 text-xs font-medium rounded-lg transition-all ${
              i === currentStep
                ? 'bg-teal text-white shadow-sm'
                : i < currentStep
                ? 'bg-teal-muted text-teal'
                : 'bg-ivory-dark text-navy-faint'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="card p-6 mb-6 animate-fade-in" key={currentStep}>
        <h2 className="font-semibold text-navy mb-4">{steps[currentStep].label}</h2>
        {steps[currentStep].component}
      </div>

      {/* Navigation */}
      {currentStep < 5 && (
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={15} /> Back
          </Button>
          <Button onClick={nextStep}>
            {currentStep === 4 ? 'Review' : 'Continue'} <ChevronRight size={15} />
          </Button>
        </div>
      )}
    </div>
  )
}
