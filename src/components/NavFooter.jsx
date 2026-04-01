import styles from './NavFooter.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogo}>
            <div className={styles.footerMark}>✦</div>
            <span className={styles.footerName}>ContentSpark AI</span>
          </div>
          <p className={styles.footerTag}>
            Agency-quality marketing copy for small businesses.
            Powered by Groq · LLaMA 3.3 70B · Completely free.
          </p>
          <div className={styles.footerBadges}>
            <span className={styles.fBadge}>100% Free</span>
            <span className={styles.fBadge}>No login required</span>
            <span className={styles.fBadge}>Privacy-first</span>
            <span className={styles.fBadge}>Open on Vercel</span>
          </div>
          <div className={styles.footerStats}>
            <div className={styles.footerStat}>
              <span className={styles.footerStatVal}>&lt; 5s</span>
              <span className={styles.footerStatLabel}>Generation time</span>
            </div>
            <div className={styles.footerStat}>
              <span className={styles.footerStatVal}>5</span>
              <span className={styles.footerStatLabel}>Platforms</span>
            </div>
            <div className={styles.footerStat}>
              <span className={styles.footerStatVal}>3×</span>
              <span className={styles.footerStatLabel}>Variants each</span>
            </div>
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
            <span className={styles.footerColHead}>Built with</span>
            <a href="https://groq.com" target="_blank" rel="noreferrer">Groq API</a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">React 18</a>
            <a href="https://vitejs.dev" target="_blank" rel="noreferrer">Vite 5</a>
            <a href="https://supabase.com" target="_blank" rel="noreferrer">Supabase</a>
            <span>LLaMA 3.3 70B</span>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>© 2026 ContentSpark AI — Built for the GenAI Hackathon</span>
        <span>Zero cost · Zero tracking · Maximum quality</span>
      </div>
    </footer>
  )
}