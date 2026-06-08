import { z } from 'zod'

export const contactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.email('Enter a valid email address'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>
