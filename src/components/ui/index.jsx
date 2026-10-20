// ─── Badge ────────────────────────────────────────────────────────────────────
const VARIANTS = {
  teal:    'bg-teal-muted text-teal border-teal/20',
  navy:    'bg-navy/8 text-navy border-navy/10',
  amber:   'bg-amber-muted text-amber border-amber/20',
  green:   'bg-green-100 text-green-700 border-green-200',
  red:     'bg-red-100 text-red-700 border-red-200',
  muted:   'bg-ivory-dark text-navy-muted border-ivory-border',
}

export function Badge({ children, variant = 'muted', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${VARIANTS[variant] ?? VARIANTS.muted} ${className}`}
    >
      {children}
    </span>
  )
}

// ─── ConfidenceBadge ──────────────────────────────────────────────────────────
const CONF = {
  high:   { label: 'High confidence',   variant: 'green' },
  medium: { label: 'Medium confidence', variant: 'teal' },
  low:    { label: 'Low confidence',    variant: 'amber' },
}

export function ConfidenceBadge({ confidence }) {
  const c = CONF[confidence] ?? CONF.low
  return <Badge variant={c.variant}>{c.label}</Badge>
}

// ─── CoverageBar ──────────────────────────────────────────────────────────────
export function CoverageBar({ coverage, className = '' }) {
  const pct = Math.round((coverage ?? 0) * 100)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1 rounded-full bg-ivory-dark overflow-hidden">
        <div
          className="h-full rounded-full bg-teal transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-navy-muted w-8 text-right">{pct}%</span>
    </div>
  )
}

// ─── SourceTag ────────────────────────────────────────────────────────────────
export function SourceTag({ publisher, date, url }) {
  const inner = (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-ivory-dark text-navy-muted rounded text-xs border border-ivory-border hover:border-teal/40 hover:text-teal transition-colors">
      <span className="font-medium">{publisher}</span>
      {date && <span className="opacity-60">· {date}</span>}
    </span>
  )
  return url ? <a href={url} target="_blank" rel="noopener noreferrer">{inner}</a> : inner
}

// ─── MissingData ──────────────────────────────────────────────────────────────
export function MissingData({ label = 'Not available', className = '' }) {
  return (
    <span className={`text-navy-faint text-sm italic ${className}`} title="No data in the GCC Atlas dataset for this field">
      {label}
    </span>
  )
}

// ─── CaveatNote ───────────────────────────────────────────────────────────────
export function CaveatNote({ children, className = '' }) {
  return (
    <p className={`text-xs text-amber bg-amber-faint border border-amber/20 rounded-lg px-3 py-2 ${className}`}>
      ⚠ {children}
    </p>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function Skeleton({ className = 'h-4 w-full' }) {
  return <div className={`shimmer ${className}`} aria-hidden="true" />
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card p-5 space-y-3" aria-busy="true" aria-label="Loading…">
      <Skeleton className="h-5 w-1/2" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

// ─── ScoreRing ────────────────────────────────────────────────────────────────
export function ScoreRing({ score, size = 56 }) {
  if (score === null)
    return (
      <div
        className="rounded-full border-2 border-ivory-border flex items-center justify-center text-navy-faint text-xs font-medium"
        style={{ width: size, height: size }}
      >
        —
      </div>
    )

  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#CCFBF1" strokeWidth="4" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="#0F766E" strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-xs font-bold text-navy">{score}</span>
    </div>
  )
}

// ─── WeightSlider ─────────────────────────────────────────────────────────────
export function WeightSlider({ label, value, onChange, description }) {
  const labels = ['Off', 'Low', 'Moderate', 'High', 'Very High', 'Critical']
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-navy">{label}</label>
        <span className="text-xs font-semibold text-teal bg-teal-muted px-2 py-0.5 rounded-full">
          {labels[value] ?? value}
        </span>
      </div>
      {description && <p className="text-xs text-navy-muted">{description}</p>}
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 accent-teal cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-navy-faint">
        <span>Low</span>
        <span>Critical</span>
      </div>
    </div>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
const BTN = {
  primary:   'bg-teal text-white hover:bg-teal-light shadow-sm',
  secondary: 'bg-white text-navy border border-ivory-border hover:bg-ivory-dark shadow-sm',
  ghost:     'text-navy-muted hover:text-navy hover:bg-ivory-dark',
  danger:    'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 disabled:opacity-50 disabled:cursor-not-allowed ${BTN[variant] ?? BTN.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
