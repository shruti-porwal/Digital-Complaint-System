import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input, Button } from '../components/common'
import styles from './LoginPage.module.css' // Reusing Login styles for consistency

export function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState('')

    const { register } = useAuth()
    const navigate = useNavigate()

    const validate = () => {
        const err = {}
        if (!name.trim()) err.name = 'Name is required'
        if (!email.trim()) err.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = 'Invalid email'

        if (!password) err.password = 'Password is required'
        else if (password.length < 6) err.password = 'Password must be at least 6 characters'

        if (password !== confirmPassword) err.confirmPassword = 'Passwords do not match'

        setErrors(err)
        return Object.keys(err).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setApiError('')
        if (!validate()) return

        setLoading(true)
        try {
            await register(name, email, password)
            navigate('/home', { replace: true })
        } catch (err) {
            setApiError(err.response?.data?.message || err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1>Complaint<span>Hub</span></h1>
                <p className={styles.subtitle}>Create your account</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {apiError && <div className={styles.apiError}>{apiError}</div>}

                    <Input
                        type="text"
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                    />

                    <Input
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        autoComplete="email"
                    />

                    <Input
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        autoComplete="new-password"
                    />

                    <Input
                        type="password"
                        label="Confirm Password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                        autoComplete="new-password"
                    />

                    <Button type="submit" loading={loading} className={styles.submit}>
                        Sign up
                    </Button>
                </form>

                <p className={styles.hint}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    )
}
