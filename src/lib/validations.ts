import { z } from 'zod'

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email is too long')
  .toLowerCase()
  .trim()

// UTM parameters schema
export const utmParamsSchema = z.object({
  utm_source: z.string().max(500).optional(),
  utm_medium: z.string().max(500).optional(),
  utm_campaign: z.string().max(500).optional(),
  utm_content: z.string().max(500).optional(),
  utm_term: z.string().max(500).optional(),
}).optional()

// Subscriber creation schema (city-based)
export const subscriberSchema = z.object({
  email: emailSchema,
  citySlug: z.string().min(1, 'City is required').max(100),
  cityName: z.string().max(100).optional().nullable(),
  source: z.string().max(100).optional(),
  utmParams: utmParamsSchema,
  metaFbc: z.string().max(500).optional().nullable(),
  metaFbp: z.string().max(500).optional().nullable(),
})

// Contact form schema (for future use)
export const contactSchema = z.object({
  email: emailSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
})

// Helper to format Zod errors for API responses
export function formatZodError(error: z.ZodError): string {
  return error.issues.map(e => e.message).join(', ')
}

// Helper to validate and return result
export function validateEmail(email: unknown): { success: true; email: string } | { success: false; error: string } {
  const result = emailSchema.safeParse(email)
  if (result.success) {
    return { success: true, email: result.data }
  }
  return { success: false, error: formatZodError(result.error) }
}
