import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { complaintApi } from '../../api/services'
import { Card, Button, Loader } from '../../components/common'
import { StatusBadge } from '../../components/complaints/StatusBadge'
import { TrackingSearch } from '../../components/dashboard/TrackingSearch'
import { ReportProblemModal } from '../../components/dashboard/ReportProblemModal'
import { useChatbot } from '../../context/ChatbotContext'
import { IconSubmit, IconTrack, IconChevron } from '../../components/icons/Icons'
import styles from './HomePage.module.css'

const FEATURES = [
  { title: 'Easy Submission', desc: 'File complaints in minutes with guided forms and file uploads.' },
  { title: 'Real-time Tracking', desc: 'Monitor status from pending to resolution.' },
  { title: 'Multiple Categories', desc: 'Technical, Billing, Service & more.' },
  { title: '24/7 Support', desc: 'Chat assistant and Help center always available.' },
]

const STEPS = [
  { num: 1, title: 'Submit', desc: 'Fill the form with details and optional attachments.' },
  { num: 2, title: 'Track', desc: 'Use your complaint ID to check progress anytime.' },
  { num: 3, title: 'Resolve', desc: 'Receive updates and resolution from our team.' },
]

export function HomePage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showReportModal, setShowReportModal] = useState(false)
  const { setOpen: openChatbot } = useChatbot()
  const navigate = useNavigate()

  const loadComplaints = () => {
    setLoading(true)
    complaintApi
      .getMyComplaints()
      .then((res) => setComplaints(Array.isArray(res?.data) ? res.data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadComplaints() }, [])

  if (loading && complaints.length === 0) return <Loader />
  if (error) return <div className={styles.error}>{error}</div>

  const pending = complaints.filter((c) => c.status === 'pending').length
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length
  const resolved = complaints.filter((c) => c.status === 'resolved').length

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1>Digital Complaint Management</h1>
        <p>Submit, track, and resolve your complaints — all in one place.</p>
        <div className={styles.heroCtas}>
          <Link to="/home/submit">
            <Button className={styles.ctaPrimary}>Register Complaint</Button>
          </Link>
          <a href="#track" className={styles.ctaSecondary}>Track Status</a>
        </div>
      </section>

      {/* Quick Track */}
      <section id="track" className={styles.trackSection}>
        <h2>Quick Track</h2>
        <p>Enter your complaint ID to view status</p>
        <div className={styles.trackBox}>
          <TrackingSearch onFound={() => loadComplaints()} />
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{complaints.length}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{pending}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{inProgress}</span>
          <span className={styles.statLabel}>In Progress</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{resolved}</span>
          <span className={styles.statLabel}>Resolved</span>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className={styles.section}>
        <h2>Why Use Us</h2>
        <div className={styles.features}>
          {FEATURES.map((f, i) => (
            <Card key={i} className={styles.featureCard}>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.section}>
        <h2>How It Works</h2>
        <div className={styles.steps}>
          {STEPS.map((s) => (
            <div key={s.num} className={styles.step}>
              <span className={styles.stepNum}>{s.num}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Complaints */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>My Complaints</h2>
          <Link to="/home/submit"><Button>+ New Complaint</Button></Link>
        </div>
        {complaints.length === 0 ? (
          <Card className={styles.empty}>
            <p>No complaints yet.</p>
            <Link to="/home/submit"><Button>Submit your first complaint</Button></Link>
          </Card>
        ) : (
          <div className={styles.list}>
            {complaints.map((c) => (
              <Card key={c.id} className={styles.item}>
                <div className={styles.itemHead}>
                  <h3>{c.title}</h3>
                  <StatusBadge status={c.status} />
                </div>
                <p className={styles.meta}>{c.category} · {c.id}</p>
                <Link to={`/home/complaints/${c.id}`} className={styles.link}>
                  View details <IconChevron />
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Chatbot CTA */}
      <section className={styles.chatCta}>
        <div className={styles.chatCtaInner}>
          <h3>Need help?</h3>
          <p>Our chat assistant can help with submissions, tracking, and FAQs.</p>
          <Button onClick={() => openChatbot(true)}>Chat with us</Button>
        </div>
      </section>

      {showReportModal && <ReportProblemModal onClose={() => setShowReportModal(false)} />}
    </div>
  )
}
