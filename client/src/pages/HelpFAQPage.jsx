import { useState } from 'react'
import { Card } from '../components/common'
import styles from './HelpFAQPage.module.css'

const FAQ_ITEMS = [
  {
    q: 'How do I submit a complaint?',
    a: 'Go to Home → Submit, fill in the title, category, description, and optionally attach files. Click Submit Complaint to file your report.',
  },
  {
    q: 'How can I track my complaint status?',
    a: 'On the Home page, use the Track Complaint card to search by complaint ID, or view your complaint list and click on any item for details and status timeline.',
  },
  {
    q: 'What complaint categories are available?',
    a: 'We support Technical, Billing, Service, and Other categories. Choose the one that best fits your issue when submitting.',
  },
  {
    q: 'How long does it take to resolve a complaint?',
    a: 'Resolution time varies by complexity. You can track progress through the status timeline: Pending → In Progress → Resolved or Rejected.',
  },
  {
    q: 'Can I add attachments to my complaint?',
    a: 'Yes. When submitting, use the attachment area to upload PDFs, images, or documents (up to 5 files) to support your case.',
  },
  {
    q: 'What if I have issues with the portal itself?',
    a: 'Use Report a Problem from the Home page to describe technical issues or feedback. Our team will address them promptly.',
  },
]

export function HelpFAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1>Help & FAQ</h1>
        <p>Find answers to common questions about submitting and tracking complaints</p>
      </div>

      <section className={styles.section}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {FAQ_ITEMS.map((item, i) => (
            <Card
              key={i}
              className={`${styles.faqItem} ${openIndex === i ? styles.open : ''}`}
            >
              <button
                type="button"
                className={styles.faqQuestion}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span>{item.q}</span>
                <span className={styles.faqIcon}>{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && (
                <div className={styles.faqAnswer}>{item.a}</div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.contactSection}>
        <h2>Need more help?</h2>
        <p>Use the chat assistant in the bottom-right corner for instant support, or contact us at support@complainthub.com</p>
      </section>
    </div>
  )
}
