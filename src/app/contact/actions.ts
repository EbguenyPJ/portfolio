'use server'

import { Resend } from 'resend'
import { contactSchema } from '@/lib/contact-schema'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

type ActionResult =
  | { success: true }
  | { success: false; errors?: Record<string, string>; serverError?: string }

export async function sendContactEmail(
  data: { name: string; email: string; message: string; website?: string },
): Promise<ActionResult> {
  // Honeypot: if the hidden "website" field is filled, it's a bot
  if (data.website) {
    // Pretend success so bots don't retry
    return { success: true }
  }

  const result = contactSchema.safeParse(data)
  if (!result.success) {
    const errors: Record<string, string> = {}
    result.error.issues.forEach((issue) => {
      const key = issue.path[0] as string
      errors[key] = issue.message
    })
    return { success: false, errors }
  }

  try {
    await getResend().emails.send({
      from: `Portfolio <${process.env.RESEND_FROM_EMAIL!}>`,
      to: process.env.CONTACT_EMAIL!,
      replyTo: result.data.email,
      subject: `[Portfolio] New message from ${result.data.name}`,
      text: [
        `Name: ${result.data.name}`,
        `Email: ${result.data.email}`,
        '',
        result.data.message,
      ].join('\n'),
    })
    return { success: true }
  } catch {
    return { success: false, serverError: 'Failed to send message. Please try copying my email directly.' }
  }
}

export async function getContactEmail(): Promise<string> {
  return process.env.CONTACT_EMAIL ?? ''
}
