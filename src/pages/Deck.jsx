import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Maximize2, Minimize2,
  TrendingUp, ShieldAlert, Target, Award, Layers, Users, Zap,
  CheckCircle, ArrowRight, ExternalLink, Database, BarChart3,
  XCircle, Check, AlertTriangle, Scale
} from 'lucide-react'
import { Button, Badge } from '../components/ui'

const SLIDES = [
  {
    id: 'cover',
    tag: 'Executive Pitch Deck',
    title: 'GCC Atlas',
    subtitle: 'The Single Source of Truth for India’s Global Capability Centre Ecosystem',
    category: 'Product Strategy & Investment Memo',
    content: (
      <div className="space-y-8 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6 pt-6">
          <div className="card p-6 border-teal/20 bg-teal-faint/50">
            <span className="text-3xl font-serif text-teal font-bold">2,000+</span>
            <p className="text-sm font-semibold text-navy mt-1">Operating GCCs in India</p>
            <p className="text-xs text-navy-muted mt-1">
              Projected to surpass $64B+ in annual export revenue by 2026.
            </p>
          </div>
          <div className="card p-6 border-amber/20 bg-amber-faint/50">
            <span className="text-3xl font-serif text-amber font-bold">6–9 Mos</span>
            <p className="text-sm font-semibold text-navy mt-1">Average Decision Latency</p>
            <p className="text-xs text-navy-muted mt-1">
              Strategy teams spend $1.5M+ navigating fragmented advisor hearsay.
            </p>
          </div>
          <div className="card p-6 border-navy/20 bg-white">
            <span className="text-3xl font-serif text-navy font-bold">45 Cities</span>
            <p className="text-sm font-semibold text-navy mt-1">Mapped in GCC Atlas</p>
            <p className="text-xs text-navy-muted mt-1">
              Curated evidence across talent, rent, ecosystem, and setup readiness.
            </p>
          </div>
        </div>

        <div className="card p-6 bg-white border-ivory-border space-y-3">
          <h3 className="font-semibold text-navy text-sm uppercase tracking-wider text-teal">Executive Thesis</h3>
          <p className="text-navy text-base leading-relaxed">
            Establishing a GCC in India requires aligning strategy, finance, HR, legal, and commercial real estate.
            Today, these teams make multimillion-dollar 10-year location bets based on conflicting consultant reports,
            opaque broker fees, and informal referral networks.
            <strong> GCC Atlas</strong> bridges this information asymmetry by delivering an evidence-backed,
            deterministic decision engine grounded in verified data.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-navy-faint">
          <span>Author: Product Management Candidate</span>
          <span>•</span>
          <span>Prototype: Live connected to Supabase</span>
          <span>•</span>
          <span>Assignment Deliverable</span>
        </div>
      </div>
    ),
  },
  {
    id: 'problem',
    tag: '1. The Problem Space',
    title: 'Anatomy of a $60B Information Asymmetry',
    subtitle: 'High stakes, conflicting figures, and opaque referral black boxes',
    category: 'Market Friction',
    content: (
      <div className="space-y-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card p-5 space-y-3 border-red-100 bg-red-50/30">
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
              <ShieldAlert size={18} /> Discrepancies in Basic Truth
            </div>
            <p className="text-xs text-navy-muted leading-relaxed">
              Different industry reports quote wildly divergent counts (1,600 to 2,200 GCCs).
              No central registry tracks which global enterprises exist, which specific functions they run,
              or which tier-2 hubs are genuinely scaling versus marketing hype.
            </p>
          </div>

          <div className="card p-5 space-y-3 border-amber-100 bg-amber-50/30">
            <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
              <Users size={18} /> Fragmented Stakeholder Silos
            </div>
            <p className="text-xs text-navy-muted leading-relaxed">
              Companies deal with a disconnected chain: management consultants, local lawyers, statutory auditors,
              tenant brokers, executive search agencies, and state investment boards. Each operates with conflicting incentives.
            </p>
          </div>
        </div>

        <div className="card p-6 bg-white space-y-4">
          <h4 className="font-semibold text-navy text-sm">Who is Hurt &amp; The Quantified Impact</h4>
          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-ivory-dark/60 rounded-xl space-y-1">
              <p className="font-bold text-navy">Global Enterprises</p>
              <p className="text-navy-muted">
                <strong>$1.5M–$3M</strong> in advisory retainer burn; 6–9 month delays; risk of entering saturated Tier-1 micro-markets with 25%+ annual wage attrition.
              </p>
            </div>
            <div className="p-3 bg-ivory-dark/60 rounded-xl space-y-1">
              <p className="font-bold text-navy">Emerging Hubs / States</p>
              <p className="text-navy-muted">
                Tier-2 cities like Coimbatore, Vadodara, Kochi, and Bhubaneswar lose deals simply because verified hiring and real estate data is unindexed.
              </p>
            </div>
            <div className="p-3 bg-ivory-dark/60 rounded-xl space-y-1">
              <p className="font-bold text-navy">Legitimate Providers</p>
              <p className="text-navy-muted">
                High-quality regional operators are crowded out by Tier-1 consultancies relying on legacy Rolodexes rather than performance track records.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4 bg-teal-faint border-teal/20 text-xs text-navy flex items-center justify-between">
          <span><strong>What they do today:</strong> Pay $200k+ for static Big-4 slide decks, rely on WhatsApp/golf-course referrals, or run manual 6-city roadshows.</span>
        </div>
      </div>
    ),
  },
  {
    id: 'opportunities',
    tag: '2. Market Opportunities',
    title: 'The 4 Solution Options Evaluated',
    subtitle: 'Where can a single source of truth create disruption in the GCC lifecycle?',
    category: 'Opportunity Assessment',
    content: (
      <div className="space-y-6 max-w-4xl">
        <p className="text-sm text-navy-muted leading-relaxed">
          To solve this ecosystem friction, we explored four distinct product opportunities across the enterprise expansion journey:
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Option 1 */}
          <div className="card p-5 border-teal border-2 bg-white relative shadow-card">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 bg-teal text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              Selected Product Wedge
            </span>
            <div className="flex items-center gap-2 text-teal font-bold text-sm mb-1.5">
              <Target size={16} /> Option 1: Location Decision Engine (GCC Atlas)
            </div>
            <p className="text-xs text-navy-muted leading-relaxed">
              Multi-factor decision tool evaluating 45 candidate cities against custom hiring plans, Randstad salary benchmarks, JLL Grade A rents, and verified center presence.
            </p>
            <div className="mt-3 pt-2 border-t border-ivory-border flex justify-between text-[11px]">
              <span className="text-teal font-semibold">Focus: Apex Decision</span>
              <span className="text-navy-faint">Immediate Day-1 Value</span>
            </div>
          </div>

          {/* Option 2 */}
          <div className="card p-5 bg-white space-y-1.5 border-ivory-border">
            <div className="flex items-center gap-2 text-navy font-bold text-sm">
              <Database size={16} className="text-navy-light" /> Option 2: Verified GCC Registry &amp; Org Graph
            </div>
            <p className="text-xs text-navy-muted leading-relaxed">
              A "LinkedIn for GCCs" tracking all 2,000+ operating centers in India, parent companies, employee headcount bands, business functions, and leadership rosters.
            </p>
            <div className="mt-3 pt-2 border-t border-ivory-border flex justify-between text-[11px]">
              <span className="text-navy font-semibold">Focus: Company Database</span>
              <span className="text-amber font-medium">High Cold-Start Barrier</span>
            </div>
          </div>

          {/* Option 3 */}
          <div className="card p-5 bg-white space-y-1.5 border-ivory-border">
            <div className="flex items-center gap-2 text-navy font-bold text-sm">
              <Users size={16} className="text-navy-light" /> Option 3: Provider Performance Marketplace
            </div>
            <p className="text-xs text-navy-muted leading-relaxed">
              A "Clutch / G2 for GCCs" curating legal, EOR, real estate, design, and recruitment vendors backed by client reviews and verified delivery track records.
            </p>
            <div className="mt-3 pt-2 border-t border-ivory-border flex justify-between text-[11px]">
              <span className="text-navy font-semibold">Focus: Vendor Matchmaking</span>
              <span className="text-amber font-medium">Chicken-and-Egg Liquidity Trap</span>
            </div>
          </div>

          {/* Option 4 */}
          <div className="card p-5 bg-white space-y-1.5 border-ivory-border">
            <div className="flex items-center gap-2 text-navy font-bold text-sm">
              <Layers size={16} className="text-navy-light" /> Option 4: Regulatory &amp; Subsidy Concierge
            </div>
            <p className="text-xs text-navy-muted leading-relaxed">
              A "TurboTax for GCC Setup" digitizing state IT policy subsidies, stamp duty waivers, ROC entity formation, and NSWS regulatory approvals into a self-serve portal.
            </p>
            <div className="mt-3 pt-2 border-t border-ivory-border flex justify-between text-[11px]">
              <span className="text-navy font-semibold">Focus: Compliance &amp; Policy</span>
              <span className="text-amber font-medium">Bureaucratic &amp; Liability Friction</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'prioritization',
    tag: '3. Prioritization & Strategic Choice',
    title: 'Why Option 1 Was Chosen: The Prioritization Framework',
    subtitle: 'Evaluating the 4 options across five rigorous PM criteria',
    category: 'PM Decision Framework',
    content: (
      <div className="space-y-6 max-w-4xl">
        {/* Scorecard Table */}
        <div className="card overflow-hidden shadow-card">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-ivory-dark text-navy-muted uppercase font-semibold border-b border-ivory-border">
                <th className="p-3 text-left">Option Evaluated</th>
                <th className="p-3 text-center">Apex Decision Leverage</th>
                <th className="p-3 text-center">Data Cold-Start Feasibility</th>
                <th className="p-3 text-center">Willingness to Pay (WTP)</th>
                <th className="p-3 text-center">Defensibility Against Ad Bias</th>
                <th className="p-3 text-center font-bold text-navy">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-border">
              <tr className="bg-teal-faint/60 font-medium">
                <td className="p-3 text-teal font-bold flex items-center gap-1.5">
                  <Check size={14} className="text-teal" /> 1. Location Decision Engine (GCC Atlas)
                </td>
                <td className="p-3 text-center text-teal font-bold">Critical (Day 0)</td>
                <td className="p-3 text-center text-green-700 font-semibold">High (Seedable)</td>
                <td className="p-3 text-center text-green-700 font-semibold">High ($20M de-risking)</td>
                <td className="p-3 text-center text-teal font-semibold">High (Deterministic)</td>
                <td className="p-3 text-center"><Badge variant="teal">WINNING WEDGE</Badge></td>
              </tr>
              <tr className="hover:bg-ivory/50">
                <td className="p-3 text-navy font-medium">2. Verified GCC Registry</td>
                <td className="p-3 text-center text-navy-muted">Moderate (Research)</td>
                <td className="p-3 text-center text-amber font-semibold">Low (Private filings)</td>
                <td className="p-3 text-center text-navy-muted">Moderate (Directory)</td>
                <td className="p-3 text-center text-navy-muted">Moderate (Stale data)</td>
                <td className="p-3 text-center"><Badge variant="muted">Phase 2</Badge></td>
              </tr>
              <tr className="hover:bg-ivory/50">
                <td className="p-3 text-navy font-medium">3. Provider Marketplace</td>
                <td className="p-3 text-center text-navy-muted">Downstream (Day 90+)</td>
                <td className="p-3 text-center text-red-600 font-semibold">Very Low (2-sided trap)</td>
                <td className="p-3 text-center text-green-700 font-semibold">High (Take rate)</td>
                <td className="p-3 text-center text-red-600 font-semibold">Low (Pay-to-play ads)</td>
                <td className="p-3 text-center"><Badge variant="muted">Phase 2 / 3</Badge></td>
              </tr>
              <tr className="hover:bg-ivory/50">
                <td className="p-3 text-navy font-medium">4. Regulatory Workflow Portal</td>
                <td className="p-3 text-center text-navy-muted">Late Stage (Day 120+)</td>
                <td className="p-3 text-center text-amber font-semibold">Low (15 State Portals)</td>
                <td className="p-3 text-center text-navy-muted">Moderate (Legal retains)</td>
                <td className="p-3 text-center text-navy-muted">Moderate (Policy changes)</td>
                <td className="p-3 text-center"><Badge variant="muted">Long-Term</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* The Strong Why Narrative */}
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="card p-4 space-y-1.5 border-teal/30 bg-white">
            <h5 className="font-bold text-teal text-sm flex items-center gap-1.5">
              <Scale size={15} /> 1. The Apex Commitment
            </h5>
            <p className="text-navy-muted leading-relaxed">
              Choosing a city is the <strong>irreversible gateway decision</strong>. An enterprise cannot hire local staff, sign Grade A office leases, or file ROC incorporation until geography is fixed. Location controls 80% of downstream budget commitments.
            </p>
          </div>

          <div className="card p-4 space-y-1.5 border-teal/30 bg-white">
            <h5 className="font-bold text-teal text-sm flex items-center gap-1.5">
              <Zap size={15} /> 2. Overcoming the Cold Start
            </h5>
            <p className="text-navy-muted leading-relaxed">
              Marketplaces and registries suffer from brutal chicken-and-egg cold starts. In contrast, location intelligence can be <strong>curated immediately from public empirical benchmarks</strong> (JLL, Randstad, GCCPROs, Zinnov) with zero dependency on user-generated reviews.
            </p>
          </div>

          <div className="card p-4 space-y-1.5 border-teal/30 bg-white">
            <h5 className="font-bold text-teal text-sm flex items-center gap-1.5">
              <Target size={15} /> 3. Controlling the Funnel
            </h5>
            <p className="text-navy-muted leading-relaxed">
              By winning the executive at the location evaluation phase (CFO, VP Strategy, Head of Real Estate), GCC Atlas becomes the trusted platform that naturally channels high-intent RFP volume to providers and regulatory workflows in subsequent phases.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'solution',
    tag: '4. The Solution Architecture',
    title: 'GCC Atlas: Evidence-Backed Location Intelligence',
    subtitle: 'Transparent data, deterministic scoring, and grounded AI explanations',
    category: 'Product Overview',
    content: (
      <div className="space-y-6 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-5 space-y-2 bg-white">
            <div className="w-8 h-8 rounded-lg bg-teal-muted text-teal flex items-center justify-center font-bold">1</div>
            <h4 className="font-semibold text-navy text-sm">Plan Wizard &amp; Weights</h4>
            <p className="text-xs text-navy-muted leading-relaxed">
              Users specify target functions, headcount, seniority mix, and assign weights (1–5) to talent, salary, office rent, ecosystem, and readiness.
            </p>
          </div>

          <div className="card p-5 space-y-2 bg-white">
            <div className="w-8 h-8 rounded-lg bg-teal-muted text-teal flex items-center justify-center font-bold">2</div>
            <h4 className="font-semibold text-navy text-sm">Deterministic Shortlist</h4>
            <p className="text-xs text-navy-muted leading-relaxed">
              Ranks top 5 candidate cities deterministically using normalized indices. Generates contextual reasons, trade-offs, and evidence coverage bars.
            </p>
          </div>

          <div className="card p-5 space-y-2 bg-white">
            <div className="w-8 h-8 rounded-lg bg-teal-muted text-teal flex items-center justify-center font-bold">3</div>
            <h4 className="font-semibold text-navy text-sm">Ask Atlas AI with Citations</h4>
            <p className="text-xs text-navy-muted leading-relaxed">
              Conversational RAG agent grounded strictly in Supabase records. Refuses to hallucinate missing data and cites publisher, date, and unit.
            </p>
          </div>
        </div>

        <div className="card p-5 bg-white space-y-3">
          <h4 className="font-semibold text-navy text-sm">Target ICP for Initial GTM</h4>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 border border-ivory-border rounded-xl">
              <span className="font-bold text-navy block text-sm">Primary Buyer</span>
              <p className="text-navy-muted mt-1">
                Head of Global Real Estate / VP of Strategy / CFO at mid-market to enterprise global firms ($100M–$5B revenue) planning their first or second India centre (50–300 Year-1 FTEs).
              </p>
            </div>
            <div className="p-3 border border-ivory-border rounded-xl">
              <span className="font-bold text-navy block text-sm">Key Unfair Advantage</span>
              <p className="text-navy-muted mt-1">
                <strong>Zero black-box rankings.</strong> Every metric shows exact publisher (GCCPROs, Randstad, JLL, Zinnov), capture date, and caveats. Missing values stay blank instead of misleading the user with false zeros.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'positioning',
    tag: '5. Positioning & Value Exchange',
    title: 'How GCC Atlas Wins in the Ecosystem',
    subtitle: 'Why every stakeholder chooses Atlas over current fragmented alternatives',
    category: 'Competitive Advantage',
    content: (
      <div className="space-y-6 max-w-4xl">
        <div className="card overflow-hidden shadow-card">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-ivory-dark text-navy-muted uppercase font-semibold border-b border-ivory-border">
                <th className="p-3 text-left">Stakeholder</th>
                <th className="p-3 text-left">Alternative Used Today</th>
                <th className="p-3 text-left">Why They Choose GCC Atlas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-border">
              <tr className="hover:bg-ivory/50">
                <td className="p-3 font-semibold text-navy">Corporate Strategy &amp; Finance</td>
                <td className="p-3 text-navy-muted">Static consultant reports ($150k+), ad-hoc broker pitch decks</td>
                <td className="p-3 text-teal font-medium">Interactive scenario modeling, deterministic formulas, audit-ready source citations.</td>
              </tr>
              <tr className="hover:bg-ivory/50">
                <td className="p-3 font-semibold text-navy">Talent &amp; HR Teams</td>
                <td className="p-3 text-navy-muted">Generic salary surveys, recruiter claims</td>
                <td className="p-3 text-teal font-medium">Indexed Randstad benchmarks by seniority tier across 27+ candidate cities.</td>
              </tr>
              <tr className="hover:bg-ivory/50">
                <td className="p-3 font-semibold text-navy">Real Estate &amp; Facilities</td>
                <td className="p-3 text-navy-muted">Individual landlord brochures, delayed market reports</td>
                <td className="p-3 text-teal font-medium">Quarterly JLL Grade A rent ranges, office vacancy %, and leasing absorption side-by-side.</td>
              </tr>
              <tr className="hover:bg-ivory/50">
                <td className="p-3 font-semibold text-navy">Verified Service Providers</td>
                <td className="p-3 text-navy-muted">Paid lead aggregators, golf-course networking</td>
                <td className="p-3 text-teal font-medium">Contextual discovery directly alongside relevant cities and corporate approval prompts.</td>
              </tr>
              <tr className="hover:bg-ivory/50">
                <td className="p-3 font-semibold text-navy">Tier-2 State Governments</td>
                <td className="p-3 text-navy-muted">Expensive foreign roadshows with low conversion</td>
                <td className="p-3 text-teal font-medium">Equal-footing presence in the 45-city candidate set backed by Zinnov lower-bound evidence.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card p-5 bg-navy text-white space-y-3">
          <h4 className="font-serif text-lg text-teal-light">The Defensibility Flywheel</h4>
          <div className="grid sm:grid-cols-3 gap-4 text-xs text-white/80">
            <div>
              <span className="font-bold text-white block mb-1">1. User Search Signal</span>
              Enterprises run custom headcount scenarios revealing emerging function demand across specific cities.
            </div>
            <div>
              <span className="font-bold text-white block mb-1">2. Provider Inbound</span>
              Providers and state agencies contribute verified lease data and regulatory milestones to maintain visibility.
            </div>
            <div>
              <span className="font-bold text-white block mb-1">3. Grounded Network Moat</span>
              The dataset continuously expands, making GCC Atlas the authoritative source for India entry decisions.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'demo',
    tag: '6. Technical Implementation & Architecture',
    title: 'Dual-Engine Architecture: Math + Grounded AI',
    subtitle: 'Production-ready build connected to Supabase and OpenRouter AI',
    category: 'Architecture',
    content: (
      <div className="space-y-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-5 space-y-3 bg-white">
            <h4 className="font-semibold text-navy text-sm flex items-center gap-2">
              <Database size={16} className="text-teal" /> Live Supabase PostgreSQL Layer
            </h4>
            <ul className="text-xs text-navy-muted space-y-1.5 list-disc pl-4">
              <li><strong>45 Candidate Cities:</strong> Populated in <code className="text-teal font-mono">locations</code> table.</li>
              <li><strong>112 Location Metrics:</strong> GCCPROs verified centers, JLL Q1 2025 rents, Zinnov lower bounds.</li>
              <li><strong>77 Salary Benchmarks:</strong> Randstad 2024–25 cross-industry CTC across seniority bands.</li>
              <li><strong>71 Candidate Evidences:</strong> Documenting why tier-2/3 cities qualify as candidate hubs.</li>
              <li><strong>Verified Providers &amp; NSWS Approvals:</strong> Directly mapped to locations.</li>
            </ul>
          </div>

          <div className="card p-5 space-y-3 bg-white">
            <h4 className="font-semibold text-navy text-sm flex items-center gap-2">
              <Zap size={16} className="text-teal" /> AI Product Engineering Architecture
            </h4>
            <ul className="text-xs text-navy-muted space-y-1.5 list-disc pl-4">
              <li><strong>Deterministic Core:</strong> Mathematical normalization and weight balancing ensures zero LLM hallucinations in rankings.</li>
              <li><strong>Ask Atlas RAG:</strong> Real-time streaming over OpenRouter (Gemini Flash 1.5) with strict source citation prompt.</li>
              <li><strong>Auditability:</strong> Every metric displays source publisher, publication date, and methodology caveats.</li>
              <li><strong>Export Engine:</strong> Instant CSV and JSON decision brief generation with preserved audit trails.</li>
            </ul>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-r from-teal-faint to-ivory border-teal/30 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h4 className="font-semibold text-navy text-base">Test the Live Prototype</h4>
            <p className="text-xs text-navy-muted mt-0.5">
              Explore the 5-step plan wizard, deterministic recommendations, side-by-side compare, and live Ask Atlas chat.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.open('/recommendations', '_blank')}>
              Explore Recommendations <ExternalLink size={14} />
            </Button>
            <Button variant="secondary" onClick={() => window.open('/ask', '_blank')}>
              Ask Atlas AI <ExternalLink size={14} />
            </Button>
          </div>
        </div>
      </div>
    ),
  },
]

export default function Deck() {
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const navigate = useNavigate()

  const slide = SLIDES[current]

  // Keyboard navigation (arrows)
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrent((c) => Math.min(c + 1, SLIDES.length - 1))
      } else if (e.key === 'ArrowLeft') {
        setCurrent((c) => Math.max(c - 1, 0))
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className={`min-h-[calc(100vh-64px)] flex flex-col justify-between py-6 px-4 sm:px-8 max-w-6xl mx-auto animate-fade-in ${fullscreen ? 'fixed inset-0 z-50 bg-ivory max-w-full overflow-y-auto' : ''}`}>
      {/* Top navigation controls */}
      <div className="flex items-center justify-between pb-4 border-b border-ivory-border">
        <div className="flex items-center gap-3">
          <Badge variant="teal">{slide.tag}</Badge>
          <span className="text-xs text-navy-faint hidden sm:inline">{slide.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/deck.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal/30 bg-teal-faint text-teal text-xs font-semibold hover:bg-teal hover:text-white transition-colors shadow-sm mr-2"
            title="Open printable presentation and save as PDF"
          >
            📥 Printable / PDF Deck
          </a>
          <span className="text-xs font-semibold text-navy-muted mr-2">
            {current + 1} / {SLIDES.length}
          </span>
          <button
            onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
            disabled={current === 0}
            className="p-1.5 rounded-lg border border-ivory-border bg-white text-navy hover:bg-ivory-dark disabled:opacity-40 transition-colors"
            title="Previous slide (Left Arrow)"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrent((c) => Math.min(c + 1, SLIDES.length - 1))}
            disabled={current === SLIDES.length - 1}
            className="p-1.5 rounded-lg border border-ivory-border bg-white text-navy hover:bg-ivory-dark disabled:opacity-40 transition-colors"
            title="Next slide (Right Arrow)"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-1.5 rounded-lg border border-ivory-border bg-white text-navy hover:bg-ivory-dark transition-colors ml-1"
            title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen presentation'}
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="py-8 my-auto animate-fade-in" key={slide.id}>
        <div className="mb-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-navy tracking-tight">{slide.title}</h2>
          <p className="text-navy-muted text-sm sm:text-base mt-1">{slide.subtitle}</p>
        </div>

        <div>{slide.content}</div>
      </div>

      {/* Slide timeline footer */}
      <div className="pt-4 border-t border-ivory-border flex items-center justify-between text-xs text-navy-faint flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current ? 'w-8 bg-teal' : 'w-2 bg-ivory-border hover:bg-navy-faint'
              }`}
              title={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Use Arrow keys (← →) to navigate</span>
          <Button variant="secondary" onClick={() => navigate('/plan')} className="text-xs py-1.5 px-3">
            Open Interactive Prototype <ArrowRight size={13} />
          </Button>
        </div>
      </div>
    </div>
  )
}
