import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      <main className="flex-1 animate-fade-in">
        <Outlet />
      </main>
      <footer className="border-t border-ivory-border bg-white py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-navy-faint">
            <p>
              <span className="font-semibold text-navy-muted">GCC Atlas</span> — MVP Prototype ·
              Evidence-backed GCC location intelligence for India
            </p>
            <p className="text-center sm:text-right">
              Data: GCCPROs · NASSCOM · Zinnov · Randstad · JLL · GCC Explorer ·
              Sources are dated and may not reflect current conditions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
