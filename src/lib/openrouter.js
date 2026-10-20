const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const BASE_URL = 'https://openrouter.ai/api/v1'
const MODEL = 'google/gemini-flash-1.5'

const SYSTEM_PROMPT = `You are Atlas, the AI assistant inside GCC Atlas — a decision-support tool for organisations evaluating Global Capability Centre (GCC) locations in India.

Your job is to answer questions based ONLY on the evidence provided in the context. You must:
1. Cite every data point with its publisher, approximate date and geography.
2. Clearly state when available evidence cannot answer the question.
3. Never invent statistics or fill gaps with assumptions.
4. Flag when data is from a snapshot date and may be stale.
5. Distinguish between market indicators and precise quotes or exact figures.
6. Use Indian number conventions (lakhs, crores) where relevant.
7. Be concise, direct and honest about confidence levels.

If the context contains no relevant information, respond exactly with:
"The available evidence in GCC Atlas does not answer this question. [Brief explanation of what data would be needed.]"`

/**
 * Stream a response from Ask Atlas.
 * @param {string}   question  - User's question
 * @param {string}   context   - Retrieved evidence string
 * @param {Function} onChunk   - Called with (deltaText, fullTextSoFar) for each SSE chunk
 * @returns {Promise<string>}  - Full response text
 */
export async function askAtlas(question, context, onChunk) {
  const userMessage = context
    ? `Context from GCC Atlas dataset:\n\n${context}\n\nQuestion: ${question}`
    : question

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://gcc-atlas.vercel.app',
      'X-Title': 'GCC Atlas',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      stream: true,
      max_tokens: 1200,
      temperature: 0.1,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter ${res.status}: ${err}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const lines = decoder
      .decode(value, { stream: true })
      .split('\n')
      .filter((l) => l.startsWith('data: '))

    for (const line of lines) {
      const payload = line.slice(6).trim()
      if (payload === '[DONE]') continue
      try {
        const delta = JSON.parse(payload).choices?.[0]?.delta?.content
        if (delta) {
          full += delta
          onChunk?.(delta, full)
        }
      } catch {
        /* skip malformed SSE chunks */
      }
    }
  }

  return full
}

/**
 * Build a concise evidence string for Ask Atlas from retrieved Supabase records.
 */
export function buildContext({ locations = [], metrics = [], salaries = [], costs = [], incentives = [], sources = [] }) {
  const parts = []

  if (locations.length) {
    parts.push(
      '### Locations\n' +
        locations
          .map((l) => `- ${l.city}, ${l.state}${l.short_description ? ': ' + l.short_description : ''}`)
          .join('\n')
    )
  }

  if (metrics.length) {
    parts.push(
      '### Location Metrics\n' +
        metrics
          .map(
            (m) =>
              `- ${m.city ?? m.location_id}: ${m.label} = ${m.value_low ?? ''}${m.value_high ? '–' + m.value_high : ''} ${m.unit} (${m.period_label ?? 'period unknown'}, confidence: ${m.confidence})`
          )
          .join('\n')
    )
  }

  if (salaries.length) {
    parts.push(
      '### Salary Benchmarks (Randstad 2024–25)\n' +
        salaries
          .map(
            (s) =>
              `- ${s.city ?? s.location_id}: ${s.seniority} ${s.role_title ?? 'cross-industry'} avg = ₹${Number(s.annual_average).toLocaleString('en-IN')} CTC/yr (${s.period_label})`
          )
          .join('\n')
    )
  }

  if (costs.length) {
    parts.push(
      '### Office Cost Data (JLL Q1 2025)\n' +
        costs
          .map(
            (c) =>
              `- ${c.city ?? c.location_id}: ${c.component_label} = ${c.value_low ?? ''}${c.value_high ? '–' + c.value_high : ''} ${c.unit} ${c.currency} (${c.period_label})`
          )
          .join('\n')
    )
  }

  if (incentives.length) {
    parts.push(
      '### Incentives\n' +
        incentives
          .map((i) => `- ${i.jurisdiction}: ${i.title} — ${i.summary} [${i.status}]`)
          .join('\n')
    )
  }

  if (sources.length) {
    parts.push(
      '### Sources\n' +
        sources
          .map((s) => `- ${s.publisher}: "${s.title}" (${s.published_at ?? 'date unknown'})`)
          .join('\n')
    )
  }

  return parts.join('\n\n') || 'No relevant evidence found in the GCC Atlas dataset.'
}
