import { useState, useRef } from 'react'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Generator from './components/Generator.jsx'
import { Footer } from './components/NavFooter.jsx'

export default function App() {
  const [page, setPage] = useState('home')
  const generatorRef = useRef(null)

  const scrollToGenerator = () => {
    setPage('home')
    setTimeout(() => {
      generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <>
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
          <button onClick={() => setPage('home')} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
            {[
              { id: 'home', label: 'Generator' },
              { id: 'features', label: 'Features' },
            ].map(item => (
              <button key={item.id}
                onClick={() => {
                  if (item.id === 'features') {
                    setPage('home')
                    setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 50)
                  } else {
                    setPage(item.id)
                  }
                }}
                style={{
                  padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: page === item.id ? 'rgba(240,192,64,0.1)' : 'transparent',
                  color: page === item.id ? 'var(--accent)' : 'rgba(240,237,230,0.55)',
                  fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (page !== item.id) e.currentTarget.style.color = 'var(--text)' }}
                onMouseLeave={e => { if (page !== item.id) e.currentTarget.style.color = 'rgba(240,237,230,0.55)' }}
              >{item.label}</button>
            ))}
          </div>

          <button onClick={scrollToGenerator} style={{
            padding: '9px 22px', borderRadius: 100,
            border: 'none', background: 'var(--accent)',
            color: '#07070f', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-body)',
            transition: 'all 0.15s', flexShrink: 0,
            boxShadow: '0 0 20px rgba(240,192,64,0.25)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f5cc50' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
          >Try it free →</button>
        </div>
      </nav>

      <div style={{ height: 64 }} />

      <main>
        <Hero onGetStarted={scrollToGenerator} />
        <div id="features"><Features /></div>
        <div id="generator" ref={generatorRef}>
          <Generator />
        </div>
      </main>

      <Footer />
    </>
  )
}