import { useState, useRef, useEffect } from 'react'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Generator from './components/Generator.jsx'
import { Footer } from './components/NavFooter.jsx'

// Scroll-reveal hook
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1'
          e.target.style.transform = 'translateY(0)'
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' })
    els.forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)'
      obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const generatorRef = useRef(null)
  useScrollReveal()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id) => {
    setMobileOpen(false)
    if (id === 'generator') {
      generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToGenerator = () => scrollTo('generator')

  const NAV_LINKS = [
    { label: 'Generator', id: 'generator' },
    { label: 'Features', id: 'features' },
    { label: 'How it works', id: 'how' },
  ]

  return (
    <>
      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        background: scrolled ? 'rgba(8,8,16,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 32px',
          height: 60, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 24,
        }}>
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}
            className="desktop-nav">
            {NAV_LINKS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
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

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <button onClick={scrollToGenerator} style={{
              padding: '8px 20px', borderRadius: 100,
              border: '1px solid rgba(245,200,66,0.35)',
              background: 'rgba(245,200,66,0.1)', color: 'var(--accent)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-body)', transition: 'all 0.18s', letterSpacing: '-0.01em',
              display: 'none',
            }}
              id="nav-cta"
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,200,66,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,200,66,0.1)' }}
            >Try free →</button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              style={{
                display: 'none', background: 'none', border: '1px solid var(--border)',
                borderRadius: 8, width: 36, height: 36, cursor: 'pointer',
                alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                gap: 5, padding: 8, transition: 'border-color 0.15s',
              }}
              id="hamburger"
            >
              <span style={{ width: '100%', height: 1.5, background: 'var(--text2)', borderRadius: 1, display: 'block', transition: 'all 0.2s',
                transform: mobileOpen ? 'rotate(45deg) translate(0, 5px)' : 'none' }} />
              <span style={{ width: '100%', height: 1.5, background: 'var(--text2)', borderRadius: 1, display: 'block', transition: 'all 0.2s',
                opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ width: '100%', height: 1.5, background: 'var(--text2)', borderRadius: 1, display: 'block', transition: 'all 0.2s',
                transform: mobileOpen ? 'rotate(-45deg) translate(0, -5px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'rgba(8,8,16,0.98)', borderBottom: '1px solid var(--border)',
            padding: '16px 32px 24px', display: 'flex', flexDirection: 'column', gap: 4,
            backdropFilter: 'blur(20px)',
          }}>
            {NAV_LINKS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                style={{
                  padding: '12px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'transparent', color: 'var(--text2)', textAlign: 'left',
                  fontSize: 15, fontWeight: 500, fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)' }}
              >{item.label}</button>
            ))}
            <button onClick={scrollToGenerator} style={{
              marginTop: 8, padding: '13px 20px', borderRadius: 100,
              border: 'none', background: 'var(--accent)', color: '#08080f',
              fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>✦ Generate content free →</button>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          #hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          #nav-cta { display: block !important; }
        }
      `}</style>

      <div style={{ height: 60 }} />

      <main>
        <Hero onGetStarted={scrollToGenerator} />

        <div id="features" data-reveal><Features /></div>

        <div id="generator" ref={generatorRef} data-reveal>
          <Generator />
        </div>

        {/* ── Bottom CTA ── */}
        <section data-reveal style={{
          padding: '100px 32px', textAlign: 'center',
          borderTop: '1px solid var(--border)',
          background: 'linear-gradient(180deg, transparent, rgba(245,200,66,0.025))',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 1, height: '55%',
            background: 'linear-gradient(180deg, rgba(245,200,66,0.5), transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px',
              borderRadius: 100, border: '1px solid rgba(245,200,66,0.25)',
              background: 'rgba(245,200,66,0.06)', fontSize: 11, fontWeight: 700,
              color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28,
            }}>✦ Ready to try it?</div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5vw, 60px)',
              fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--text)',
              lineHeight: 1.06, marginBottom: 20,
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
              transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(245,200,66,0.5), 0 0 80px rgba(245,200,66,0.35), 0 12px 32px rgba(0,0,0,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(245,200,66,0.3), 0 0 60px rgba(245,200,66,0.25), 0 8px 24px rgba(0,0,0,0.4)' }}
            >
              <span>✦</span> Generate content free <span>→</span>
            </button>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 16, fontWeight: 300 }}>
              No signup · No credit card · No nonsense
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}