import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Model to use for curation (Haiku is fast and cost-effective)
export const CURATION_MODEL = 'claude-3-haiku-20240307'

export interface CurationMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Call Claude for deal curation
 */
export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  options?: {
    maxTokens?: number
    temperature?: number
  }
): Promise<string> {
  const { maxTokens = 1024, temperature = 0.3 } = options || {}

  try {
    const response = await anthropic.messages.create({
      model: CURATION_MODEL,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    // Extract text from response
    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    return textBlock.text
  } catch (error) {
    console.error('Error calling Claude:', error)
    throw error
  }
}

/**
 * Parse JSON from Claude's response
 * Handles cases where Claude wraps JSON in markdown code blocks
 */
export function parseClaudeJSON<T>(response: string): T {
  // Try to extract JSON from markdown code blocks
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  const jsonString = jsonMatch ? jsonMatch[1] : response

  try {
    return JSON.parse(jsonString.trim())
  } catch (error) {
    console.error('Failed to parse Claude response as JSON:', response)
    throw new Error(`Invalid JSON from Claude: ${error}`)
  }
}

export default anthropic
