import { NextRequest, NextResponse } from 'next/server'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { renderWelcomeEmail } from '@/emails/WelcomeEmail'
import { emailSchema, formatZodError } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cityName } = body

    // Validate email with Zod
    const validation = emailSchema.safeParse(body.email)
    if (!validation.success) {
      return NextResponse.json(
        { error: formatZodError(validation.error) },
        { status: 400 }
      )
    }

    const email = validation.data

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY not set. Skipping email send.')
      console.log(`Would send welcome email to: ${email}`)
      return NextResponse.json({
        success: true,
        message: 'Email skipped (API key not configured)',
      })
    }

    const resend = getResend()

    // Send the welcome email
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to Homebase Flights${cityName ? ` - ${cityName}` : ''}!`,
      html: renderWelcomeEmail({ cityName }),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    })
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
