import { useState, useRef } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { signOut } from './lib/supabase.js'
import { Navbar, Footer } from './components/NavFooter.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Generator from './components/Generator.jsx'
import AuthModal from './components/AuthModal.jsx'
import HistoryPage from './pages/History.jsx'
import DraftsPage from './pages/Drafts.jsx'

// ── Page router (no library needed) ──────────────────────────
function AppInner() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState('home') // home | history | drafts
  const [apiKey, setApiKey] = useState('')
  const [showAuth, setShowAuth] = useState(false)
  const generatorRef = useRef(null)

  const scrollToGenerator = () => {
    setPage('home')
    setTimeout(() => {
      generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const handleSignOut = async () => {
    await signOut()
    setPage('home')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)',
      }}>
        <div style={{
          width: 32, height: 32,
          border: '2px solid rgba(240,192,64,0.2)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    )
  }

  return (
    <>
      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(5,5,10,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 24px',
          height: 64, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 24,
        }}>
          {/* Logo */}
          <button
            onClick={() => setPage('home')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg,#f0c040,#e8a820)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, boxShadow: '0 0 16px rgba(240,192,64,0.3)',
            }}>✦</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              ContentSpark <span style={{ color: 'var(--accent)' }}>AI</span>
            </span>
          </button>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
            {[
              { id: 'home', label: 'Generator' },
              { id: 'history', label: 'History', auth: true },
              { id: 'drafts', label: 'Drafts', auth: true },
            ].map(item => (
              (!item.auth || user) && (
                <button
                  key={item.id}
                  onClick={() => item.auth && !user ? setShowAuth(true) : setPage(item.id)}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: page === item.id ? 'rgba(240,192,64,0.1)' : 'transparent',
                    color: page === item.id ? 'var(--accent)' : 'rgba(240,237,230,0.55)',
                    fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-body)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (page !== item.id) e.currentTarget.style.color = 'var(--text)' }}
                  onMouseLeave={e => { if (page !== item.id) e.currentTarget.style.color = 'rgba(240,237,230,0.55)' }}
                >
                  {item.label}
                </button>
              )
            ))}
          </div>

          {/* Auth section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {user ? (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px', borderRadius: 100,
                  border: '1px solid var(--border)', background: 'var(--surface)',
                }}>
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="" width={22} height={22}
                      style={{ borderRadius: '50%' }}
                    />
                  ) : (
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--accent)', color: '#07070f',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {(user.user_metadata?.full_name || user.email || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: 13, color: 'var(--text2)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  style={{
                    padding: '7px 14px', borderRadius: 100,
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text3)', fontSize: 13, cursor: 'pointer',
                    fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAuth(true)}
                  style={{
                    padding: '8px 18px', borderRadius: 100,
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text2)', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setShowAuth(true)}
                  style={{
                    padding: '8px 18px', borderRadius: 100,
                    border: 'none', background: 'var(--accent)',
                    color: '#07070f', fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                    transition: 'all 0.15s',
                    boxShadow: '0 0 20px rgba(240,192,64,0.25)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f5cc50' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
                >
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div style={{ height: 64 }} />

      {/* ── Pages ── */}
      {page === 'home' && (
        <main>
          <Hero onGetStarted={scrollToGenerator} />
          <div id="features"><Features /></div>
          <div id="generator" ref={generatorRef}>
            <Generator
              apiKey={apiKey}
              setApiKey={setApiKey}
              onShowAuth={() => setShowAuth(true)}
            />
          </div>
        </main>
      )}

      {page === 'history' && user && (
        <main>
          <HistoryPage />
        </main>
      )}

      {page === 'drafts' && user && (
        <main>
          <DraftsPage />
        </main>
      )}

      <Footer />

      {/* ── Auth Modal ── */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
