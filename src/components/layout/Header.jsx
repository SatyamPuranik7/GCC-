import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  MapPin, SlidersHorizontal, BarChart3, GitCompare,
  BookOpen, MessageSquare, Share2, Menu, X, Presentation,
} from 'lucide-react'
import { shareApp } from '../../lib/export'
import usePlanStore from '../../store/usePlanStore'

const NAV = [
  { to: '/deck', label: 'Pitch Deck', icon: Presentation, badge: 'Deck' },
  { to: '/plan', label: 'Plan', icon: SlidersHorizontal },
  { to: '/recommendations', label: 'Recommendations', icon: BarChart3 },
  { to: '/compare', label: 'Compare', icon: GitCompare },
  { to: '/sources', label: 'Sources', icon: BookOpen },
  { to: '/ask', label: 'Ask Atlas', icon: MessageSquare },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [shareMsg, setShareMsg] = useState('')
  const compareList = usePlanStore((s) => s.compareList)
  const navigate = useNavigate()

  async function handleShare() {
    const result = await shareApp()
    setShareMsg(result === 'shared' ? 'Shared!' : 'Link copied!')
    setTimeout(() => setShareMsg(''), 2500)
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-ivory-border no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center shadow-sm group-hover:bg-teal-light transition-colors">
              <MapPin size={16} className="text-white" />
            </div>
            <span className="font-serif text-navy text-xl tracking-tight">
              GCC <span className="text-teal">Atlas</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal text-white shadow-sm'
                      : to === '/deck'
                      ? 'text-teal font-semibold hover:bg-teal-muted/40'
                      : 'text-navy-muted hover:text-navy hover:bg-ivory-dark'
                  }`
                }
              >
                <Icon size={14} />
                {label}
                {to === '/compare' && compareList.length > 0 && (
                  <span className="ml-0.5 w-4 h-4 rounded-full bg-amber text-white text-[10px] font-bold flex items-center justify-center">
                    {compareList.length}
                  </span>
                )}
                {badge && (
                  <span className="ml-1 text-[10px] bg-amber-muted text-amber px-1.5 py-0.2 rounded-full font-bold">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-navy-muted hover:text-navy hover:bg-ivory-dark transition-colors"
            >
              <Share2 size={14} />
              {shareMsg || 'Share'}
            </button>

            <button
              onClick={() => navigate('/plan')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-teal text-white hover:bg-teal-light transition-colors shadow-sm"
            >
              Start Plan
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-navy-muted hover:bg-ivory-dark transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden border-t border-ivory-border py-3 space-y-1 animate-fade-in">
            {NAV.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal text-white'
                      : 'text-navy-muted hover:text-navy hover:bg-ivory-dark'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <Icon size={15} />
                  {label}
                </div>
                {badge && (
                  <span className="text-[10px] bg-amber-muted text-amber px-2 py-0.5 rounded-full font-bold">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => { handleShare(); setOpen(false) }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-ivory-border text-navy-muted hover:bg-ivory-dark transition-colors"
              >
                <Share2 size={14} /> Share
              </button>
              <button
                onClick={() => { navigate('/plan'); setOpen(false) }}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold bg-teal text-white hover:bg-teal-light transition-colors"
              >
                Start Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
