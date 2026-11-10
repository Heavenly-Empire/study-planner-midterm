import OpenAI from 'openai'

// Errors from the provider layer. status is what the route returns to the browser.
export class AiError extends Error {
  constructor(message, status = 502) { super(message); this.name = 'AiError'; this.status = status }
}

const BASE_URL = 'https://openrouter.ai/api/v1'
const isZero = value => value === 0 || (typeof value === 'string' && value.trim() !== '' && Number(value) === 0)

// Returns null when the key or model is missing, so the route can answer 503.
// The client and the catalogue fetch can be replaced in tests.
export function createAiService({ apiKey, model, client, fetchImpl = fetch, log = console.log } = {}) {
  if (!apiKey?.trim() || !model?.trim()) return null
  const openai = client ?? new OpenAI({ apiKey, baseURL: BASE_URL, maxRetries: 0 })
  // Check current pricing before each provider call.
  async function verifyFreeModel(signal) {
    let listing
    try {
      const response = await fetchImpl(`${BASE_URL}/models`, { signal })
      if (!response.ok) throw new Error(`catalogue ${response.status}`)
      listing = await response.json()
    } catch (error) {
      if (signal?.aborted) throw error
      throw new AiError('The model catalogue could not be checked.', 502)
    }
    const entry = listing?.data?.find(item => item.id === model)
    if (!entry) throw new AiError('The configured AI model is not in the catalogue.', 503)
    const price = entry.pricing ?? {}
    if (!isZero(price.prompt) || !isZero(price.completion)
        || [price.request, price.image].some(value => value !== undefined && !isZero(value))) {
      throw new AiError('The configured AI model needs verified zero prices.', 503)
    }
  }

  return {
    async complete({ system, user, signal }) {
      await verifyFreeModel(signal)
      const started = Date.now()
      try {
        const result = await openai.chat.completions.create({
          model,
          temperature: 0.3,
          max_tokens: 600,
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
          provider: { allow_fallbacks: false, max_price: { prompt: 0, completion: 0, request: 0 } },
        }, { signal, maxRetries: 0 })
        const content = result?.choices?.[0]?.message?.content
        if (typeof content !== 'string' || !content.trim()) throw new AiError('The AI provider returned an empty answer.', 502)
        log(JSON.stringify({ event: 'ai-complete', model, ms: Date.now() - started, tokens: result.usage?.total_tokens ?? null }))
        return content
      } catch (error) {
        if (signal?.aborted || error instanceof AiError) throw error
        // Log only the status, never prompts or activity text.
        console.error('AI provider error', error?.status ?? error?.code ?? error?.name)
        throw new AiError('The AI provider could not complete the request.', 502)
      }
    },
  }
}
