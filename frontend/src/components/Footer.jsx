import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footerContainer}>
      {/* Top Border Glow Line */}
      <div style={styles.topGlow}></div>

      <div style={styles.contentGrid}>
        {/* SECTION 1: BRAND & STATUS */}
        <div style={styles.section}>
          <h3 style={styles.brandTitle}>FOOTWEAR<span style={styles.cyan}>_FOUNDRY</span></h3>
          <p style={styles.statusText}>
            STATUS: <span style={styles.onlinePulse}></span> OPERATIONAL
          </p>
          <p style={styles.description}>
            High-performance digital tailoring for the next generation of urban explorers. 
            Engineered in the cloud. Delivered to your coordinate.
          </p>
        </div>

        {/* SECTION 2: NAVIGATION MAP */}
        <div style={styles.section}>
          <h4 style={styles.heading}>SITEMAP_INDEX</h4>
          <ul style={styles.list}>
            <li><FooterLink to="/products">ALL_COLLECTIONS</FooterLink></li>
            <li><FooterLink to="/new-arrivals">NEW_DROPS</FooterLink></li>
            <li><FooterLink to="/tech-specs">MATERIALS_LAB</FooterLink></li>
            <li><FooterLink to="/sustainability">ECO_PROTOCOL</FooterLink></li>
          </ul>
        </div>

        {/* SECTION 3: SUPPORT PROTOCOLS */}
        <div style={styles.section}>
          <h4 style={styles.heading}>SUPPORT_HUB</h4>
          <ul style={styles.list}>
            <li><FooterLink to="/help">HELP_CENTER</FooterLink></li>
            <li><FooterLink to="/shipping">LOGISTICS_TRACKING</FooterLink></li>
            <li><FooterLink to="/returns">REVERSE_SUPPLY</FooterLink></li>
            <li><FooterLink to="/contact">SIGNAL_US</FooterLink></li>
          </ul>
        </div>

        {/* SECTION 4: DATA NODES (SOCIALS) */}
        <div style={styles.section}>
          <h4 style={styles.heading}>DATA_NODES</h4>
          <div style={styles.socialGrid}>
            <SocialIcon label="IG" />
            <SocialIcon label="TW" />
            <SocialIcon label="DS" />
            <SocialIcon label="GH" />
          </div>
          <div style={styles.newsletterBox}>
            <input style={styles.newsInput} placeholder="JOIN_COMM_CHANNEL" />
            <button style={styles.newsBtn}>&gt;</button>
          </div>
        </div>
      </div>

      {/* BOTTOM METADATA BAR */}
      <div style={styles.bottomBar}>
        <div style={styles.metaData}>
          <span>LAT: 9.8910° N</span>
          <span>LONG: 76.2250° E</span>
          <span>ENCRYPTION: AES-256</span>
        </div>
        <p style={styles.copyright}>
          © {currentYear} FOUNDRY_OS. ALL_RIGHTS_ENFORCED.
        </p>
      </div>
    </footer>
  );
}

// Sub-components for cleaner code
const FooterLink = ({ to, children }) => (
  <Link to={to} style={styles.footerLink}>
    <motion.span whileHover={{ x: 5, color: "#00F5FF" }}>
      {children}
    </motion.span>
  </Link>
);

const SocialIcon = ({ label }) => (
  <motion.div 
    whileHover={{ scale: 1.1, borderColor: "#00F5FF", color: "#00F5FF" }}
    style={styles.iconCircle}
  >
    {label}
  </motion.div>
);

const styles = {
  footerContainer: {
    background: "#080808",
    padding: "80px 40px 20px 40px",
    position: "relative",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    fontFamily: "'Space Grotesk', sans-serif",
    marginTop: "100px",
  },
  topGlow: {
    position: "absolute",
    top: -1,
    left: "10%",
    right: "10%",
    height: "1px",
    background: "linear-gradient(90deg, transparent, #00F5FF, transparent)",
    boxShadow: "0 0 15px #00F5FF",
  },
  contentGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
    gap: "40px",
  },
  section: { textAlign: "left" },
  brandTitle: { color: "#fff", fontSize: "1.4rem", letterSpacing: "4px", fontWeight: "800", marginBottom: "10px" },
  cyan: { color: "#00F5FF" },
  statusText: { fontSize: "0.6rem", color: "#fff", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "8px" },
  onlinePulse: { width: "6px", height: "6px", background: "#00FF66", borderRadius: "50%", boxShadow: "0 0 8px #00FF66" },
  description: { color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", lineHeight: "1.6", marginTop: "15px", maxWidth: "280px" },
  heading: { color: "#fff", fontSize: "0.7rem", letterSpacing: "3px", fontWeight: "700", marginBottom: "25px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" },
  list: { listStyle: "none", padding: 0 },
  footerLink: { textDecoration: "none", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", letterSpacing: "1.5px", display: "block", marginBottom: "12px", transition: "0.3s" },
  socialGrid: { display: "flex", gap: "12px", marginBottom: "25px" },
  iconCircle: { width: "35px", height: "35px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.6rem", cursor: "pointer", borderRadius: "2px" },
  newsletterBox: { display: "flex", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "5px" },
  newsInput: { background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.65rem", padding: "8px", flex: 1, letterSpacing: "1px" },
  newsBtn: { background: "#00F5FF", border: "none", color: "#000", padding: "0 15px", fontWeight: "bold", cursor: "pointer" },
  bottomBar: { maxWidth: "1200px", margin: "60px auto 0 auto", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  metaData: { display: "flex", gap: "20px", color: "rgba(0, 245, 255, 0.3)", fontSize: "0.55rem", letterSpacing: "2px" },
  copyright: { color: "rgba(255,255,255,0.2)", fontSize: "0.6rem", letterSpacing: "2px" },
};

export default Footer;