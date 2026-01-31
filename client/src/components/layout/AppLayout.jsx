import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Chatbot } from '../chatbot/Chatbot'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <NavLink to="/" className={styles.logoLink}>
          <h1 className={styles.logo}>Complaint<span>Hub</span></h1>
        </NavLink>
        <nav className={styles.nav}>
          {user?.role === 'admin' ? (
            <>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? styles.active : '')}>
                Complaints
              </NavLink>
              <NavLink to="/admin/reports" className={({ isActive }) => (isActive ? styles.active : '')}>
                Reports
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/home" className={({ isActive }) => (isActive ? styles.active : '')}>
                Home
              </NavLink>
              <NavLink to="/home/submit" className={({ isActive }) => (isActive ? styles.active : '')}>
                Submit
              </NavLink>
            </>
          )}
          <NavLink to="/help" className={({ isActive }) => (isActive ? styles.active : '')}>
            Help
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => (isActive ? styles.active : '')}>
            Notifications
          </NavLink>
        </nav>
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.badge}>{user?.role}</span>
          </div>
          <button onClick={handleLogout} className={styles.logout}>
            Logout
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <Chatbot />
    </div>
  )
}
