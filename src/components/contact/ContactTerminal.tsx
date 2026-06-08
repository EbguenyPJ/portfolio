'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { sendContactEmail } from '@/app/contact/actions'

type LineType = 'system' | 'command' | 'output' | 'prompt' | 'userInput' | 'error' | 'success'

type Line = {
  type: LineType
  text: string
  prefix?: string
}

type Phase = 'boot' | 'name' | 'email' | 'message' | 'confirm' | 'edit' | 'sending' | 'done'

function buildBootLines(): Line[] {
  return [
    { type: 'system', text: 'Last login: ' + new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' on ttys001' },
    { type: 'command', text: './initiate_contact.sh', prefix: '~' },
    { type: 'output', text: '' },
    { type: 'success', text: '[✓] Secure channel initialized' },
    { type: 'success', text: '[✓] Encryption: TLS 1.3 / AES-256-GCM' },
    { type: 'success', text: '[✓] Recipient: ebgueny@backend.architect' },
    { type: 'output', text: '' },
    { type: 'system', text: '── Fill in the fields below. Press Enter to continue. ──' },
    { type: 'output', text: '' },
  ]
}

export default function ContactTerminal() {
  const [lines, setLines] = useState<Line[]>([])
  const [phase, setPhase] = useState<Phase>('boot')
  const [input, setInput] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [bootIndex, setBootIndex] = useState(0)
  const [bootLines] = useState(buildBootLines)
  const [honeypot, setHoneypot] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [editing, setEditing] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [lines, phase, scrollToBottom])

  useEffect(() => {
    if (phase !== 'boot') return
    if (bootIndex >= bootLines.length) {
      setPhase('name')
      return
    }
    const delay = bootIndex === 1 ? 600 : bootIndex >= 3 && bootIndex <= 5 ? 300 : 80
    const timer = setTimeout(() => {
      setLines(prev => [...prev, bootLines[bootIndex]])
      setBootIndex(prev => prev + 1)
    }, delay)
    return () => clearTimeout(timer)
  }, [phase, bootIndex, bootLines])

  useEffect(() => {
    if (phase === 'message') {
      setTimeout(() => {
        const ta = textareaRef.current
        if (ta) {
          ta.focus()
          // Auto-resize if pre-filled (editing mode)
          ta.style.height = 'auto'
          ta.style.height = ta.scrollHeight + 'px'
        }
      }, 50)
    } else if (['name', 'email', 'confirm', 'edit', 'done'].includes(phase)) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [phase])

  const addLines = (...newLines: Line[]) => {
    setLines(prev => [...prev, ...newLines])
  }

  const pushHistory = (val: string) => {
    if (val.trim()) {
      setHistory(prev => [...prev, val.trim()])
    }
    setHistoryIdx(-1)
  }

  const resetSession = () => {
    setLines([])
    setPhase('boot')
    setInput('')
    setName('')
    setEmail('')
    setMessage('')
    setBootIndex(0)
    setHistory([])
    setHistoryIdx(-1)
    setEditing(false)
  }

  const showSummaryAndConfirm = (n: string, e: string, m: string) => {
    const label = editing ? 'Updated payload' : 'Payload summary'
    addLines(
      { type: 'output', text: '' },
      { type: 'system', text: `── ${label} ──────────────────────` },
      { type: 'output', text: `   name    → ${n}` },
      { type: 'output', text: `   email   → ${e}` },
      { type: 'output', text: `   message → "${m}"` },
      { type: 'system', text: '─────────────────────────────────────────' },
      { type: 'output', text: '' },
    )
    setEditing(false)
    setInput('')
    setPhase('confirm')
  }

  const handleNameSubmit = () => {
    const val = input.trim()
    pushHistory(val)
    if (val.length < 2) {
      addLines(
        { type: 'userInput', text: val || ' ', prefix: 'name' },
        { type: 'error', text: '[✗] Error: Name must be at least 2 characters. Try again.' },
      )
      setInput('')
      return
    }
    setName(val)
    addLines(
      { type: 'userInput', text: val, prefix: 'name' },
    )
    setInput('')
    if (editing) {
      showSummaryAndConfirm(val, email, message)
    } else {
      addLines({ type: 'output', text: '' })
      setPhase('email')
    }
  }

  const handleEmailSubmit = () => {
    const val = input.trim()
    pushHistory(val)
    const emailCheck = z.string().email()
    if (!emailCheck.safeParse(val).success) {
      addLines(
        { type: 'userInput', text: val || ' ', prefix: 'email' },
        { type: 'error', text: '[✗] Error: Enter a valid email address. Try again.' },
      )
      setInput('')
      return
    }
    setEmail(val)
    addLines(
      { type: 'userInput', text: val, prefix: 'email' },
    )
    setInput('')
    if (editing) {
      showSummaryAndConfirm(name, val, message)
    } else {
      addLines({ type: 'output', text: '' })
      setPhase('message')
    }
  }

  const handleMessageSubmit = () => {
    const val = input.trim()
    pushHistory(val)
    if (val.length < 20) {
      addLines(
        { type: 'userInput', text: val || ' ', prefix: 'message' },
        { type: 'error', text: `[✗] Error: Message too short (${val.length}/20 chars min). Try again.` },
      )
      setInput('')
      return
    }
    setMessage(val)
    addLines(
      { type: 'userInput', text: val, prefix: 'message' },
    )
    setInput('')
    showSummaryAndConfirm(name, email, val)
  }

  const showEditMenu = () => {
    addLines(
      { type: 'output', text: '' },
      { type: 'system', text: '── What would you like to edit? ─────────' },
      { type: 'output', text: '   [1] name' },
      { type: 'output', text: '   [2] email' },
      { type: 'output', text: '   [3] message' },
      { type: 'output', text: '   [4] abort session' },
      { type: 'system', text: '─────────────────────────────────────────' },
      { type: 'output', text: '' },
    )
    setPhase('edit')
  }

  const handleEditSubmit = () => {
    const val = input.trim()
    pushHistory(val)
    addLines({ type: 'userInput', text: val, prefix: 'edit' })

    if (val === '1' || val.toLowerCase() === 'name') {
      addLines(
        { type: 'system', text: `   current: "${name}"` },
        { type: 'output', text: '' },
      )
      setEditing(true)
      setInput(name)
      setPhase('name')
    } else if (val === '2' || val.toLowerCase() === 'email') {
      addLines(
        { type: 'system', text: `   current: "${email}"` },
        { type: 'output', text: '' },
      )
      setEditing(true)
      setInput(email)
      setPhase('email')
    } else if (val === '3' || val.toLowerCase() === 'message') {
      addLines(
        { type: 'system', text: `   current: "${message}"` },
        { type: 'output', text: '' },
      )
      setEditing(true)
      setInput(message)
      setPhase('message')
    } else if (val === '4' || val.toLowerCase() === 'abort') {
      addLines(
        { type: 'system', text: '[!] Session aborted.' },
        { type: 'system', text: 'Type "new" to start a new session.' },
        { type: 'output', text: '' },
      )
      setInput('')
      setName('')
      setEmail('')
      setMessage('')
      setPhase('done')
    } else {
      addLines({ type: 'error', text: '[✗] Error: Enter 1-4 or a field name.' })
      setInput('')
    }
  }

  const handleConfirmSubmit = async () => {
    const val = input.trim().toLowerCase()
    pushHistory(val)

    if (val === 'n' || val === 'no') {
      addLines(
        { type: 'userInput', text: val, prefix: 'send? [y/n]' },
      )
      setInput('')
      showEditMenu()
      return
    }

    if (val !== 'y' && val !== 'yes') {
      addLines(
        { type: 'userInput', text: val || ' ', prefix: 'send? [y/n]' },
        { type: 'error', text: '[✗] Error: Please enter y or n.' },
      )
      setInput('')
      return
    }

    addLines(
      { type: 'userInput', text: val, prefix: 'send? [y/n]' },
      { type: 'output', text: '' },
    )
    setInput('')
    setPhase('sending')

    const result = await sendContactEmail({
      name,
      email,
      message,
      website: honeypot,
    })

    if (result.success) {
      addLines(
        { type: 'success', text: '[▸] Establishing connection...' },
        { type: 'success', text: '[▸] Encrypting payload...' },
        { type: 'success', text: '[▸] Transmitting...' },
        { type: 'output', text: '' },
        { type: 'success', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
        { type: 'success', text: '  ✓ MESSAGE DELIVERED SUCCESSFULLY' },
        { type: 'success', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
        { type: 'output', text: '' },
        { type: 'system', text: 'Response ETA: ~24 hours.' },
        { type: 'system', text: 'Connection closed. Type "new" to start a new session.' },
      )
      setPhase('done')
    } else {
      const errMsg = result.serverError || 'Transmission failed. Network error.'
      addLines(
        { type: 'success', text: '[▸] Establishing connection...' },
        { type: 'error', text: `[✗] ${errMsg}` },
        { type: 'output', text: '' },
        { type: 'system', text: 'Fallback: copy email with the button below.' },
        { type: 'system', text: 'Type "new" to retry or start a new session.' },
      )
      setPhase('done')
    }
  }

  const handleDoneSubmit = () => {
    const val = input.trim().toLowerCase()
    pushHistory(val)
    if (val === 'new' || val === 'reset' || val === 'restart') {
      resetSession()
    } else {
      addLines(
        { type: 'userInput', text: val || ' ', prefix: '$' },
        { type: 'system', text: 'Session closed. Type "new" to start a new session.' },
      )
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (phase === 'name') handleNameSubmit()
      else if (phase === 'email') handleEmailSubmit()
      else if (phase === 'message') handleMessageSubmit()
      else if (phase === 'confirm') handleConfirmSubmit()
      else if (phase === 'edit') handleEditSubmit()
      else if (phase === 'done') handleDoneSubmit()
    }

    // Arrow up/down for history — disabled in message phase so
    // the textarea keeps native line-by-line cursor navigation
    if (phase !== 'message') {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (history.length === 0) return
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1)
        setHistoryIdx(nextIdx)
        setInput(history[nextIdx])
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (historyIdx === -1) return
        const nextIdx = historyIdx + 1
        if (nextIdx >= history.length) {
          setHistoryIdx(-1)
          setInput('')
        } else {
          setHistoryIdx(nextIdx)
          setInput(history[nextIdx])
        }
      }
    }
  }

  const getPromptLabel = (): string => {
    if (phase === 'name') return 'enter_name'
    if (phase === 'email') return 'enter_email'
    if (phase === 'message') return 'enter_message'
    if (phase === 'confirm') return 'send? [y/n]'
    if (phase === 'edit') return 'select [1-4]'
    if (phase === 'done') return '$'
    return ''
  }

  const renderLine = (line: Line, i: number) => {
    const colors: Record<LineType, string> = {
      system: 'rgba(242,240,236,0.35)',
      command: 'var(--fg)',
      output: 'rgba(242,240,236,0.6)',
      prompt: 'var(--accent-green)',
      userInput: 'var(--accent-rose)',
      error: '#FF6B6B',
      success: 'var(--accent-green)',
    }

    return (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        style={{
          fontFamily: '"SF Mono", "Fira Code", "JetBrains Mono", monospace',
          fontSize: '0.82rem',
          lineHeight: 1.8,
          color: colors[line.type],
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          minHeight: line.text === '' ? '0.6em' : undefined,
        }}
      >
        {line.type === 'command' && (
          <span style={{ color: 'var(--accent-green)' }}>
            {`ebgueny@portfolio:${line.prefix || '~'}$ `}
          </span>
        )}
        {line.type === 'userInput' && (
          <span style={{ color: 'var(--accent-green)' }}>
            {`> ${line.prefix}: `}
          </span>
        )}
        {line.text}
      </motion.div>
    )
  }

  return (
    <>
      <div
        ref={scrollRef}
        onClick={() => {
          if (phase === 'message') textareaRef.current?.focus()
          else inputRef.current?.focus()
        }}
        style={{
          padding: '20px',
          minHeight: 380,
          maxHeight: 500,
          overflowY: 'auto',
          cursor: 'text',
          background: 'rgba(0,0,0,0.3)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--muted) transparent',
        }}
      >
        {lines.map((line, i) => renderLine(line, i))}

        {/* Active prompt + input */}
        {['name', 'email', 'message', 'confirm', 'edit', 'done'].includes(phase) && (
          <div style={{
            display: 'flex',
            alignItems: phase === 'message' ? 'flex-start' : 'center',
            fontFamily: '"SF Mono", "Fira Code", "JetBrains Mono", monospace',
            fontSize: '0.82rem',
            lineHeight: 1.8,
          }}>
            <span style={{ color: 'var(--accent-green)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {`> ${getPromptLabel()}: `}
            </span>
            {phase === 'message' ? (
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); setHistoryIdx(-1) }}
                onKeyDown={handleKeyDown}
                rows={1}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--fg)',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  lineHeight: 'inherit',
                  resize: 'none',
                  padding: 0,
                  margin: 0,
                  minHeight: '1.8em',
                  overflow: 'hidden',
                  caretColor: 'var(--accent-green)',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = target.scrollHeight + 'px'
                }}
              />
            ) : (
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setHistoryIdx(-1) }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--fg)',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  lineHeight: 'inherit',
                  padding: 0,
                  margin: 0,
                  caretColor: 'var(--accent-green)',
                }}
              />
            )}
          </div>
        )}

        {/* Sending animation */}
        {phase === 'sending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{
              fontFamily: '"SF Mono", "Fira Code", monospace',
              fontSize: '0.82rem',
              lineHeight: 1.8,
              color: 'var(--accent-green)',
            }}
          >
            {'[▸] Transmitting payload...'}
          </motion.div>
        )}

        {/* Blinking cursor for boot phase */}
        {phase === 'boot' && (
          <motion.span
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            style={{
              display: 'inline-block',
              width: 8,
              height: 16,
              background: 'var(--accent-green)',
              verticalAlign: 'middle',
            }}
          />
        )}
      </div>

      {/* Honeypot */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, width: 0, overflow: 'hidden' }}>
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>
    </>
  )
}
