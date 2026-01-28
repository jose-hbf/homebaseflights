import { z } from 'zod'

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email is too long')
  .toLowerCase()
  .trim()

// Subscriber creation schema
export const subscriberSchema = z.object({
  email: emailSchema,
  citySlug: z.string().max(100).optional().nullable(),
  cityName: z.string().max(100).optional().nullable(),
  airportCode: z.string().length(3, 'Airport code must be 3 characters').toUpperCase().optional().nullable(),
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
