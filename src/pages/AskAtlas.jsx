import { useState, useRef, useCallback } from 'react'
import { Send, Bot, User, AlertCircle, Loader2 } from 'lucide-react'
import { askAtlas, buildContext } from '../lib/openrouter'
import { useAtlasData } from '../hooks/useAtlasData'
import usePlanStore from '../store/usePlanStore'
import { CaveatNote, SkeletonCard } from '../components/ui'

const SUGGESTED = [
  'Which cities have the most verified GCCs in financial services?',
  'What are the salary ranges for mid-level engineers in Bengaluru vs Hyderabad?',
  'What Grade A office rents does JLL report for Pune in Q1 2025?',
  'Which cities have active government incentives for GCCs?',
  'What is the evidence for Coimbatore as a GCC location?',
]

function Bubble({ role, content, isStreaming }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${isUser ? 'bg-navy text-white' : 'bg-teal text-white'}`}>
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser ? 'bg-navy text-white rounded-tr-sm' : 'bg-white border border-ivory-border text-navy rounded-tl-sm shadow-card'
      }`}>
        {content}
        {isStreaming && <span className="inline-block w-1.5 h-3.5 bg-teal ml-0.5 animate-pulse rounded-sm" />}
      </div>
    </div>
  )
}

export default function AskAtlas() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm Atlas. Ask me anything about GCC locations, salary benchmarks, office rents, incentives, or the evidence in this dataset. I'll cite my sources and tell you when I don't have enough information.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  const weights = usePlanStore((s) => s.weights)
  const { data, isLoading: dataLoading } = useAtlasData(weights)

  const submit = useCallback(async (question) => {
    if (!question.trim() || loading) return
    setError(null)

    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setInput('')
    setLoading(true)

    // Build context from available data
    const ctx = buildContext({
      locations: data?.locations?.slice(0, 20) ?? [],
      metrics: data?.metrics?.slice(0, 50) ?? [],
      salaries: data?.salaries?.slice(0, 50) ?? [],
      costs: data?.costs?.slice(0, 30) ?? [],
      sources: data?.sources ?? [],
    })

    // Add streaming placeholder
    setMessages((prev) => [...prev, { role: 'assistant', content: '', streaming: true }])

    try {
      await askAtlas(question, ctx, (_, full) => {
        setMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: full, streaming: true }
          return copy
        })
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      })

      // Mark done
      setMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = { ...copy[copy.length - 1], streaming: false }
        return copy
      })
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1)) // remove placeholder
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [loading, data])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col" style={{ minHeight: 'calc(100vh - 128px)' }}>
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-navy">Ask Atlas</h1>
        <p className="text-navy-muted text-sm mt-1">
          Answers are grounded in the GCC Atlas dataset. Atlas cites its sources and says when it
          can't answer.
        </p>
      </div>

      <CaveatNote className="mb-4">
        Atlas answers from retrieved evidence only. It does not have live internet access.
        Rankings are not influenced by AI — the scoring engine is deterministic.
      </CaveatNote>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-navy-muted uppercase tracking-wide mb-2">Suggested questions</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((q) => (
              <button
                key={q}
                onClick={() => submit(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-ivory-border bg-white text-navy-muted hover:border-teal/40 hover:text-teal transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto mb-4">
        {dataLoading && <SkeletonCard lines={2} />}
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} content={m.content} isStreaming={m.streaming} />
        ))}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); submit(input) }}
        className="flex gap-2 items-end"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(input) }
          }}
          placeholder="Ask about a city, salary, rent, incentive or source…"
          rows={2}
          className="flex-1 px-4 py-3 rounded-2xl border border-ivory-border bg-white text-navy text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 resize-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3 rounded-2xl bg-teal text-white hover:bg-teal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  )
}
