'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getContactEmail } from '@/app/contact/actions'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hey — I'm Ebgueny's AI assistant. Tell me what brought you here: a role, a project, a collaboration idea? I'll make sure the right message gets to him.",
}

export default function ContactChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput]       = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent]         = useState(false)
  const [copied, setCopied]     = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const scrollRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isLoading || sent) return

    setError(null)
    const userMsg: Message = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setIsLoading(true)

    try {
      const apiMessages = updated.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to get response')
      }

      const data = await res.json()

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])

      if (data.sent) {
        setSent(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const copyEmail = async () => {
    const email = await getContactEmail()
    if (!email) return
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 420 }}>
      {/* Chat header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingBottom: '1rem',
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Pulse dot */}
        <div style={{ position: 'relative', width: 10, height: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: sent ? 'var(--accent-green)' : 'var(--accent-green)',
            opacity: sent ? 0.4 : 1,
          }} />
          {!sent && (
            <div style={{
              position: 'absolute', inset: -2,
              borderRadius: '50%',
              border: '1.5px solid var(--accent-green)',
              animation: 'pulse-ring 2s ease-out infinite',
            }} />
          )}
        </div>
        <span style={{
          fontFamily: 'var(--font-syne)',
          fontSize: '0.6rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: sent ? 'rgba(242,240,236,0.3)' : 'var(--accent-green)',
        }}>
          {sent ? 'Message delivered' : 'AI Assistant — Online'}
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          paddingRight: 4,
          marginBottom: '1rem',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--muted) transparent',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: msg.role === 'user'
                  ? 'rgba(110,255,42,0.08)'
                  : 'rgba(242,240,236,0.04)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(110,255,42,0.15)' : 'var(--border)'}`,
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '0.88rem',
                fontWeight: 300,
                lineHeight: 1.65,
                color: msg.role === 'user' ? 'var(--fg)' : 'rgba(242,240,236,0.75)',
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <div style={{
              padding: '14px 20px',
              borderRadius: '14px 14px 14px 4px',
              background: 'rgba(242,240,236,0.04)',
              border: '1px solid var(--border)',
              display: 'flex',
              gap: 5,
              alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--accent-green)',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '10px 14px',
              marginBottom: '0.75rem',
              background: 'rgba(255,107,107,0.06)',
              border: '1px solid rgba(255,107,107,0.15)',
              borderRadius: 10,
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '0.8rem',
              color: '#FF6B6B',
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      {!sent ? (
        <div style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-end',
          padding: '0.75rem 0 0',
          borderTop: '1px solid var(--border)',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            style={{
              flex: 1,
              background: 'rgba(242,240,236,0.03)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '12px 16px',
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '0.88rem',
              fontWeight: 300,
              color: 'var(--fg)',
              outline: 'none',
              resize: 'none',
              minHeight: 44,
              maxHeight: 120,
              transition: 'border-color 0.2s',
              lineHeight: 1.5,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-green)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
          <motion.button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            whileHover={isLoading || !input.trim() ? {} : { scale: 1.05 }}
            whileTap={isLoading || !input.trim() ? {} : { scale: 0.95 }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: input.trim() && !isLoading ? 'var(--accent-green)' : 'rgba(242,240,236,0.05)',
              border: 'none',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke={input.trim() && !isLoading ? 'var(--bg)' : 'rgba(242,240,236,0.2)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: '1.25rem 0 0.5rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--accent-green)',
              opacity: 0.6,
            }} />
            <span style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '0.8rem',
              fontWeight: 300,
              color: 'rgba(242,240,236,0.4)',
            }}>
              Ebgueny will reply within 24h
            </span>
          </div>
          <button
            onClick={copyEmail}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '0.75rem',
              color: copied ? 'var(--accent-green)' : 'rgba(242,240,236,0.25)',
              transition: 'color 0.2s',
              padding: '4px 0',
            }}
          >
            {copied ? '✓ Email copied' : 'Or copy email directly ↗'}
          </button>
        </motion.div>
      )}

      <style jsx global>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
