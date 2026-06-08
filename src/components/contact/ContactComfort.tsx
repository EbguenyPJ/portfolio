'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { contactSchema, type ContactFormData } from '@/lib/contact-schema'
import { sendContactEmail } from '@/app/contact/actions'

type FormErrors = Partial<Record<keyof ContactFormData, string>>

export default function ContactComfort() {
  const [form, setForm]               = useState<ContactFormData>({ name: '', email: '', message: '' })
  const [errors, setErrors]           = useState<FormErrors>({})
  const [focused, setFocused]         = useState<keyof ContactFormData | null>(null)
  const [sent, setSent]               = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [honeypot, setHoneypot]       = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const validate = (): boolean => {
    const result = contactSchema.safeParse(form)
    if (result.success) { setErrors({}); return true }
    const errs: FormErrors = {}
    result.error.issues.forEach((issue) => {
      const key = issue.path[0] as keyof ContactFormData
      errs[key] = issue.message
    })
    setErrors(errs)
    return false
  }

  const handleChange = (key: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
    if (serverError) setServerError(null)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitting) return
    if (!validate()) return

    setIsSubmitting(true)
    setServerError(null)

    const result = await sendContactEmail({ ...form, website: honeypot })

    setIsSubmitting(false)

    if (result.success) {
      setSent(true)
    } else if (result.errors) {
      setErrors(result.errors as FormErrors)
    } else if (result.serverError) {
      setServerError(result.serverError)
    }
  }

  const handleGlobalKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const hasValue = (key: keyof ContactFormData) => form[key].length > 0

  const isTextarea = (key: keyof ContactFormData) => key === 'message'
  const showLabel = (key: keyof ContactFormData) => hasValue(key) || focused === key

  const inputStyle = (key: keyof ContactFormData): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(242,240,236,0.02)',
    border: `1px solid ${errors[key] ? 'rgba(255,107,107,0.3)' : focused === key ? 'var(--accent-green)' : 'rgba(242,240,236,0.06)'}`,
    borderRadius: 10,
    padding: isTextarea(key)
      ? `${showLabel(key) ? 28 : 20}px 24px 20px 24px`
      : `0 24px`,
    height: isTextarea(key) ? undefined : 56,
    paddingTop: isTextarea(key) ? (showLabel(key) ? 28 : 20) : showLabel(key) ? 8 : 0,
    fontFamily: 'var(--font-space-grotesk)',
    fontSize: '0.95rem',
    fontWeight: 300,
    color: isSubmitting ? 'rgba(242,240,236,0.3)' : 'var(--fg)',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: focused === key
      ? errors[key]
        ? '0 0 0 1px rgba(255,107,107,0.4), 0 0 12px rgba(255,107,107,0.08)'
        : '0 0 0 1px var(--accent-green), 0 0 15px rgba(110,255,42,0.12)'
      : 'none',
    resize: 'none' as const,
    lineHeight: isTextarea(key) ? 1.6 : '56px',
    caretColor: 'var(--accent-green)',
  })

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 1.5rem' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 64, height: 64, borderRadius: '50%',
            border: '2px solid var(--accent-green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 0 30px rgba(110,255,42,0.06)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <p style={{ fontFamily: 'var(--font-syne)', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent-green)', marginBottom: '0.5rem' }}>
          Delivered
        </p>
        <h3 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Message sent.
        </h3>
        <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.85rem', fontWeight: 300, color: 'rgba(242,240,236,0.4)', textAlign: 'center', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '32ch' }}>
          I'll get back to you within 24 hours.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
          style={{
            padding: '12px 40px', background: 'transparent', color: 'var(--fg)',
            border: '1px solid rgba(242,240,236,0.1)', borderRadius: 8,
            fontFamily: 'var(--font-syne)', fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-green)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(242,240,236,0.1)' }}
        >
          Send another
        </motion.button>
      </motion.div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={handleGlobalKeyDown}
      noValidate
      style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {/* Honeypot */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, width: 0, overflow: 'hidden' }}>
        <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} autoComplete="off" tabIndex={-1} />
      </div>

      {/* Name */}
      <div style={{ position: 'relative' }}>
        <AnimatePresence>
          {(hasValue('name') || focused === 'name') && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              style={{
                position: 'absolute', top: 10, right: 20, zIndex: 1,
                fontFamily: 'var(--font-syne)', fontSize: '0.55rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: errors.name ? '#FF6B6B' : focused === 'name' ? 'var(--accent-green)' : 'rgba(242,240,236,0.25)',
              }}
            >
              Name
            </motion.span>
          )}
        </AnimatePresence>
        <input
          type="text" value={form.name} onChange={handleChange('name')}
          onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
          placeholder="Your name" style={inputStyle('name')} disabled={isSubmitting}
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.72rem', color: '#FF6B6B', marginTop: '0.35rem', paddingLeft: 4 }}>
              {errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email */}
      <div style={{ position: 'relative' }}>
        <AnimatePresence>
          {(hasValue('email') || focused === 'email') && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              style={{
                position: 'absolute', top: 10, right: 20, zIndex: 1,
                fontFamily: 'var(--font-syne)', fontSize: '0.55rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: errors.email ? '#FF6B6B' : focused === 'email' ? 'var(--accent-green)' : 'rgba(242,240,236,0.25)',
              }}
            >
              Email
            </motion.span>
          )}
        </AnimatePresence>
        <input
          type="email" value={form.email} onChange={handleChange('email')}
          onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
          placeholder="your@email.com" style={inputStyle('email')} disabled={isSubmitting}
        />
        <AnimatePresence>
          {errors.email && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.72rem', color: '#FF6B6B', marginTop: '0.35rem', paddingLeft: 4 }}>
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Message */}
      <div style={{ position: 'relative' }}>
        <AnimatePresence>
          {(hasValue('message') || focused === 'message') && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              style={{
                position: 'absolute', top: 10, right: 20, zIndex: 1,
                fontFamily: 'var(--font-syne)', fontSize: '0.55rem', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: errors.message ? '#FF6B6B' : focused === 'message' ? 'var(--accent-green)' : 'rgba(242,240,236,0.25)',
              }}
            >
              Message
            </motion.span>
          )}
        </AnimatePresence>
        <textarea
          rows={4} value={form.message} onChange={handleChange('message')}
          onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
          placeholder="Tell me about your project..." style={inputStyle('message')} disabled={isSubmitting}
        />
        <AnimatePresence>
          {errors.message && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '0.72rem', color: '#FF6B6B', marginTop: '0.35rem', paddingLeft: 4 }}>
              {errors.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Server error */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              padding: '12px 16px', background: 'rgba(255,107,107,0.05)',
              border: '1px solid rgba(255,107,107,0.15)', borderRadius: 10,
              fontFamily: 'var(--font-space-grotesk)', fontSize: '0.82rem', color: '#FF6B6B',
            }}
          >
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button
        type="submit" disabled={isSubmitting}
        whileHover={isSubmitting ? {} : { scale: 1.01 }}
        whileTap={isSubmitting ? {} : { scale: 0.99 }}
        style={{
          width: '100%', padding: '16px 20px',
          background: 'transparent',
          color: 'var(--accent-green)',
          border: '1px solid var(--accent-green)',
          borderRadius: 10,
          fontFamily: 'var(--font-syne)', fontSize: '0.8rem', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          opacity: isSubmitting ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.background = 'rgba(110,255,42,0.08)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(110,255,42,0.12)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {isSubmitting ? (
          <>
            <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(110,255,42,0.15)" strokeWidth="2.5" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" />
            </motion.svg>
            <span>Sending</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: '0.65rem', fontWeight: 400,
              letterSpacing: '0.05em', fontFamily: 'var(--font-space-grotesk)',
              color: 'var(--accent-green)',
              opacity: 0.6,
            }}>
              <kbd style={{ padding: '3px 6px', borderRadius: 4, border: '1px solid rgba(110,255,42,0.3)', background: 'rgba(110,255,42,0.06)', lineHeight: 1 }}>⌘</kbd>
              <kbd style={{ padding: '3px 6px', borderRadius: 4, border: '1px solid rgba(110,255,42,0.3)', background: 'rgba(110,255,42,0.06)', lineHeight: 1 }}>↵</kbd>
            </span>
          </>
        )}
      </motion.button>
    </form>
  )
}
