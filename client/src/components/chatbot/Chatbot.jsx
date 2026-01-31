import { useState, useRef, useEffect } from 'react'
import { chatbotApi } from '../../api/services'
import { Button } from '../common'
import { useChatbot } from '../../context/ChatbotContext'
import styles from './Chatbot.module.css'

const SUGGESTIONS = [
  'How do I submit a complaint?',
  'How do I track my complaint?',
  'What are the complaint categories?',
]

export function Chatbot() {
  const { open, setOpen } = useChatbot()
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I can help with complaint submission, tracking, and FAQs.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [messages])

  const send = async (text = input) => {
    if (!text.trim()) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setLoading(true)
    try {
      const { data } = await chatbotApi.sendMessage(text)
      setMessages((m) => [...m, { role: 'bot', text: data.reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'Sorry, I could not process that. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        className={styles.fab}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '×' : '💬'}
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <h4>Complaint Assistant</h4>
            <button onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>
          <div className={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className={styles.suggestion}>
                {s}
              </button>
            ))}
          </div>
          <div className={styles.messages} ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={styles[`msg-${m.role}`]}>
                {m.text}
              </div>
            ))}
            {loading && <div className={styles.msgBot}>...</div>}
          </div>
          <form
            className={styles.inputRow}
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="form-input"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              Send
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
