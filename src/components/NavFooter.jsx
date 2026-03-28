import styles from './NavFooter.module.css'

export function Navbar({ onGenerate }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>✦</div>
          <div>
            <span className={styles.logoText}>ContentSpark</span>
            <span className={styles.logoAccent}> AI</span>
          </div>
        </div>
        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#how" className={styles.navLink}>How it works</a>
        </div>
        <button className={styles.navCta} onClick={onGenerate}>
          Try it free →
        </button>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogo}>
            <span className={styles.footerMark}>✦</span>
            <span className={styles.footerName}>ContentSpark AI</span>
          </div>
          <p className={styles.footerTag}>
            Agency-quality marketing copy for small businesses.
            <br />
            Powered by Groq · LLaMA 3.3 70B · Free tier.
          </p>
          <div className={styles.footerBadges}>
            <span className={styles.fBadge}>100% Free</span>
            <span className={styles.fBadge}>No login required</span>
            <span className={styles.fBadge}>Privacy-first</span>
          </div>
        </div>
        <div className={styles.footerRight}>
          <div className={styles.footerCol}>
            <span className={styles.footerColHead}>Platforms</span>
            <span>Instagram</span>
            <span>X / Twitter</span>
            <span>Facebook</span>
            <span>LinkedIn</span>
            <span>Google Ads</span>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerColHead}>Content types</span>
            <span>Social posts</span>
            <span>Taglines</span>
            <span>Ad headlines</span>
            <span>Descriptions</span>
            <span>Promo offers</span>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerColHead}>Tech stack</span>
            <a href="https://groq.com" target="_blank" rel="noreferrer">Groq API</a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">React 18</a>
            <a href="https://vitejs.dev" target="_blank" rel="noreferrer">Vite</a>
            <span>LLaMA 3.3 70B</span>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© 2026 ContentSpark AI. All rights reserved.</span>
        <span>Zero cost · Zero tracking · Maximum quality.</span>
      </div>
    </footer>
  )
}