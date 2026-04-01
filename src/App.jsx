import { useState, useRef, useEffect } from 'react'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Generator from './components/Generator.jsx'
import { Footer } from './components/NavFooter.jsx'

export default function App() {
  const [page, setPage] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const generatorRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToGenerator = () => {
    setPage('home')
    setTimeout(() => {
      generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <>
      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        background: scrolled ? 'rgba(8,8,16,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 32px',
          height: 60, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 24,
        }}>
          {/* Logo */}
          <button onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: '#08080f', fontWeight: 800,
              boxShadow: '0 0 20px rgba(245,200,66,0.35)',
            }}>✦</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--text)', letterSpacing: '-0.025em', fontWeight: 300 }}>
              ContentSpark <span style={{ color: 'var(--accent)' }}>AI</span>
            </span>
          </button>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {[
              { label: 'Generator', action: () => scrollToGenerator() },
              { label: 'Features', action: () => { setPage('home'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 50) } },
              { label: 'How it works', action: () => { setPage('home'); setTimeout(() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }), 50) } },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: 'transparent', color: 'var(--text3)',
                  fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface2)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.background = 'transparent' }}
              >{item.label}</button>
            ))}
          </div>

          {/* CTA */}
          <button onClick={scrollToGenerator} style={{
            padding: '8px 20px', borderRadius: 100, flexShrink: 0,
            border: '1px solid rgba(245,200,66,0.35)',
            background: 'rgba(245,200,66,0.1)', color: 'var(--accent)',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-body)', transition: 'all 0.18s',
            letterSpacing: '-0.01em',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,200,66,0.18)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(245,200,66,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,200,66,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Try free →
          </button>
        </div>
      </nav>

      <div style={{ height: 60 }} />

      <main>
        <Hero onGetStarted={scrollToGenerator} />
        <div id="features"><Features /></div>
        <div id="generator" ref={generatorRef}>
          <Generator />
        </div>
        {/* ── Bottom CTA before footer ── */}
        <section style={{
          padding: '100px 32px',
          textAlign: 'center',
          borderTop: '1px solid var(--border)',
          background: 'linear-gradient(180deg, transparent, rgba(245,200,66,0.02))',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 1, height: '60%',
            background: 'linear-gradient(180deg, rgba(245,200,66,0.4), transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px', borderRadius: 100,
              border: '1px solid rgba(245,200,66,0.25)',
              background: 'rgba(245,200,66,0.06)',
              fontSize: 11, fontWeight: 700, color: 'var(--accent)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: 28,
            }}>✦ Ready to try it?</div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--text)',
              lineHeight: 1.08, marginBottom: 20,
            }}>
              Stop writing copy.<br />
              <span style={{ fontStyle: 'italic', color: 'var(--text2)' }}>Start publishing it.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 40, fontWeight: 300, lineHeight: 1.7 }}>
              33 million small businesses can't afford an agency.<br />
              ContentSpark AI gives them one — free, instant, powered by Groq.
            </p>
            <button onClick={scrollToGenerator} style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 36px', borderRadius: 100, border: 'none',
              background: 'var(--accent)', color: '#08080f',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-body)', letterSpacing: '-0.01em',
              boxShadow: '0 0 0 1px rgba(245,200,66,0.3), 0 0 60px rgba(245,200,66,0.25), 0 8px 24px rgba(0,0,0,0.4)',
              transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1)',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
            >
              <span>✦</span> Generate content free <span>→</span>
            </button>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 16, fontWeight: 300 }}>
              No signup · No credit card · Instant results
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}