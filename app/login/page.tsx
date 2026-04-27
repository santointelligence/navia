'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'E-Mail oder Passwort ist falsch.'
        : error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>N</span>
            <span className={styles.logoText}>Navia.</span>
          </Link>
        </div>

        <h1 className={styles.title}>Willkommen zurück</h1>
        <p className={styles.subtitle}>Melden Sie sich in Ihrem Konto an</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>E-Mail-Adresse</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@beispiel.ch"
              className={styles.input}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Passwort</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Wird angemeldet…' : 'Anmelden'}
          </button>
        </form>

        <p className={styles.footer}>
          Noch kein Konto?{' '}
          <Link href="/register" className={styles.link}>
            Kostenlos registrieren
          </Link>
        </p>
      </div>
    </main>
  )
}
