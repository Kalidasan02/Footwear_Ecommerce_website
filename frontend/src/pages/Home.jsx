import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  return (
    <div style={styles.pageWrapper}>
      {/* SCANLINE OVERLAY - Gives it a CRT/Tech feel */}
      <div style={styles.scanline}></div>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={styles.heroContent}
        >
          <h1 style={styles.glitchTitle}>FOOTWEAR_FOUNDRY_V3</h1>
          <p style={styles.heroSubtitle}>
            ENGINEERED_COMFORT // ARCHITECTURAL_DESIGN // HIGH_PERFORMANCE_UNITS
          </p>
          
          <div style={styles.btnGroup}>
            <Link to="/products" style={styles.primaryBtn}>
              BROWSE_CATALOG
            </Link>
            <Link to="/orders" style={styles.secondaryBtn}>
              TRACK_LOGISTICS
            </Link>
          </div>
        </motion.div>
      </section>

      {/* CORE SPECS SECTION (FEATURES) */}
      <section style={styles.specsSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.line}></span>
          <h3 style={styles.sectionTitle}>CORE_SPECIFICATIONS</h3>
          <span style={styles.line}></span>
        </div>

        <div style={styles.grid}>
          <FeatureCard 
            id="01" 
            title="DURABILITY_TESTED" 
            desc="Reinforced structural integrity for high-impact urban environments."
          />
          <FeatureCard 
            id="02" 
            title="FLUID_GEOMETRY" 
            desc="Ergonomic contours designed for seamless natural movement."
          />
          <FeatureCard 
            id="03" 
            title="SECURE_TRANSACTIONS" 
            desc="Encrypted procurement protocols and real-time shipment tracking."
          />
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={styles.cta}>
        <div style={styles.ctaBox}>
          <h2 style={styles.ctaTitle}>READY_TO_EQUIP?</h2>
          <p style={styles.ctaDesc}>JOIN_THE_FOUNDRY_AND_UPGRADE_YOUR_EQUIPMENT_TODAY.</p>
          <Link to="/register" style={styles.ctaBtn}>INITIALIZE_MEMBERSHIP</Link>
        </div>
      </section>
    </div>
  );
}

// Sub-component for clean code
const FeatureCard = ({ id, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10, borderColor: "#00F5FF" }}
    style={styles.card}
  >
    <div style={styles.cardId}>{id}</div>
    <h4 style={styles.cardTitle}>{title}</h4>
    <p style={styles.cardDesc}>{desc}</p>
  </motion.div>
);

const styles = {
  pageWrapper: {
    background: "#050505",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "'Space Grotesk', sans-serif",
    overflowX: "hidden",
    position: "relative",
  },
  scanline: {
    position: "fixed",
    top: 0, left: 0, width: "100%", height: "100%",
    background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
    backgroundSize: "100% 2px, 3px 100%",
    pointerEvents: "none",
    zIndex: 10,
  },
  hero: {
    height: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: "radial-gradient(circle at center, rgba(0, 245, 255, 0.05) 0%, transparent 70%)",
  },
  glitchTitle: {
    fontSize: "clamp(2rem, 8vw, 5rem)",
    fontWeight: "900",
    letterSpacing: "15px",
    margin: 0,
    textShadow: "2px 2px #FF0055, -2px -2px #00F5FF",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "4px",
    fontSize: "0.75rem",
    marginTop: "20px",
  },
  btnGroup: { marginTop: "50px", display: "flex", gap: "20px", justifyContent: "center" },
  primaryBtn: {
    background: "#00F5FF",
    color: "#000",
    padding: "15px 40px",
    textDecoration: "none",
    fontWeight: "800",
    fontSize: "0.8rem",
    letterSpacing: "2px",
    clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)",
  },
  secondaryBtn: {
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "15px 40px",
    textDecoration: "none",
    fontWeight: "800",
    fontSize: "0.8rem",
    letterSpacing: "2px",
    clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)",
  },
  specsSection: { padding: "100px 20px", maxWidth: "1200px", margin: "0 auto" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "60px" },
  line: { flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" },
  sectionTitle: { fontSize: "0.9rem", letterSpacing: "5px", color: "#00F5FF" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" },
  card: {
    padding: "40px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    position: "relative",
  },
  cardId: { color: "#FF0055", fontSize: "0.7rem", fontWeight: "900", marginBottom: "20px" },
  cardTitle: { fontSize: "1.2rem", letterSpacing: "2px", marginBottom: "15px" },
  cardDesc: { color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", lineHeight: "1.6" },
  cta: { padding: "100px 20px" },
  ctaBox: {
    maxWidth: "800px", margin: "0 auto", padding: "60px",
    background: "linear-gradient(45deg, #0a0a0a, #111)",
    border: "1px solid #00F5FF",
    textAlign: "center",
  },
  ctaTitle: { fontSize: "2rem", letterSpacing: "8px", marginBottom: "20px" },
  ctaDesc: { color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "2px", marginBottom: "40px" },
  ctaBtn: {
    color: "#00F5FF", textDecoration: "none", border: "1px solid #00F5FF",
    padding: "15px 40px", fontWeight: "800", fontSize: "0.8rem", letterSpacing: "3px",
  }
};

export default Home;