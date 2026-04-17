import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added useNavigate and Link
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
  });

  // Custom Alert State
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  
  const navigate = useNavigate(); // Initialize navigation

  // Helper to trigger the futuristic alert
  const triggerAlert = (msg, type) => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("auth/register/", form);
      
      // Trigger Success Alert
      triggerAlert("USER_CREATED: DATABASE SYNCHRONIZED", "success");
      
      // Redirect to login after 2 seconds so the user sees the success message
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error(err.response?.data);
      triggerAlert("REGISTRATION_FAILED: PROTOCOL ERROR", "error");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* HUD NOTIFICATION */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -100, x: "-50%" }}
            style={{
              ...styles.customAlert,
              borderColor: alert.type === "success" ? "#00F5FF" : "#FF0055",
              boxShadow: alert.type === "success" ? "0 0 15px rgba(0, 245, 255, 0.3)" : "0 0 15px rgba(255, 0, 85, 0.3)"
            }}
          >
            <div style={styles.alertMsg}>{alert.msg}</div>
            <div style={{...styles.alertProgress, backgroundColor: alert.type === "success" ? "#00F5FF" : "#FF0055"}} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.bgGlow}></div>

      {/* REGISTRATION CARD WITH TOP-TO-BOTTOM ENTRANCE */}
      <motion.div 
        initial={{ opacity: 0, y: -100 }} // Starts 100px above
        animate={{ opacity: 1, y: 0 }}    // Drops into position
        transition={{ 
            duration: 0.8, 
            type: "spring", 
            stiffness: 100, 
            damping: 15 
        }}
        style={styles.regCard}
      >
        <div style={styles.headerArea}>
          <h2 style={styles.title}>NEW_USER_REG</h2>
          <p style={styles.subtitle}>ESTABLISHING PERMANENT DATA LINK</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          {/* USERNAME */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>ASSIGN_USERNAME</label>
            <input
              style={styles.futuristicInput}
              placeholder="_username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <div style={styles.inputLine}></div>
          </div>

          {/* EMAIL */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>COMM_EMAIL</label>
            <input
              type="email"
              style={styles.futuristicInput}
              placeholder="user@foundry.io"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div style={styles.inputLine}></div>
          </div>

          {/* PHONE */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>MOBILE_LINK</label>
            <input
              type="text"
              style={styles.futuristicInput}
              placeholder="+00 000 000 00"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <div style={styles.inputLine}></div>
          </div>

          {/* PASSWORD */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>SECURE_VAULT_KEY</label>
            <input
              type="password"
              style={styles.futuristicInput}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <div style={styles.inputLine}></div>
          </div>

          {/* ADDRESS - Span full width */}
          <div style={{ ...styles.inputGroup, gridColumn: "1 / -1" }}>
            <label style={styles.label}>GEOGRAPHIC_BASE_STATION</label>
            <textarea
              style={styles.futuristicTextarea}
              placeholder="Street, City, Sector..."
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <div style={styles.inputLine}></div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "#00F5FF", color: "#000" }}
            whileTap={{ scale: 0.98 }}
            style={styles.regButton}
          >
            CONFIRM_REGISTRATION
          </motion.button>
        </form>

        <div style={styles.footerLinks}>
            <span style={styles.versionText}>ALREADY REGISTERED?</span>
            <Link to="/login" style={styles.loginLink}>ACCESS_VAULT</Link>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#050505",
    padding: "40px 20px",
    position: "relative",
    fontFamily: "'Space Grotesk', sans-serif",
    overflowX: "hidden"
  },
  bgGlow: {
    position: "absolute",
    width: "60vw",
    height: "60vw",
    background: "radial-gradient(circle, rgba(0, 245, 255, 0.05) 0%, rgba(0,0,0,0) 70%)",
    zIndex: 0,
  },
  regCard: {
    width: "100%",
    maxWidth: "650px",
    padding: "40px",
    marginTop: "100px", // Increased to ensure visibility below navbar
    background: "rgba(10, 10, 10, 0.85)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    zIndex: 1,
  },
  headerArea: { 
    marginBottom: "35px",
    borderLeft: "4px solid #00F5FF",
    paddingLeft: "20px" 
  },
  title: { 
    color: "#fff", 
    fontSize: "2rem", 
    fontWeight: "900", 
    letterSpacing: "6px", 
    margin: 0,
    textTransform: "uppercase" 
  },
  subtitle: { color: "#00F5FF", fontSize: "0.65rem", letterSpacing: "3px", marginTop: "8px" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  inputGroup: { marginBottom: "15px" },
  label: { color: "rgba(0, 245, 255, 0.7)", fontSize: "0.55rem", letterSpacing: "2px", marginBottom: "8px", display: "block" },
  futuristicInput: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "0.95rem",
    padding: "10px 0",
    outline: "none",
    borderBottom: "1px solid rgba(255,255,255,0.15)"
  },
  futuristicTextarea: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "0.95rem",
    minHeight: "80px",
    padding: "10px 0",
    outline: "none",
    resize: "none",
    borderBottom: "1px solid rgba(255,255,255,0.15)"
  },
  inputLine: { height: "1px", width: "0%", background: "#00F5FF" },
  regButton: {
    gridColumn: "1 / -1",
    padding: "18px",
    background: "transparent",
    border: "1px solid #00F5FF",
    color: "#00F5FF",
    fontWeight: "900",
    letterSpacing: "4px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "0.4s all"
  },
  footerLinks: { 
    marginTop: "30px", 
    textAlign: "center", 
    borderTop: "1px solid rgba(255,255,255,0.05)", 
    paddingTop: "20px" 
  },
  loginLink: { 
    color: "#fff", 
    textDecoration: "none", 
    marginLeft: "10px", 
    fontSize: "0.7rem", 
    fontWeight: "700", 
    borderBottom: "1px solid #00F5FF" 
  },
  versionText: { color: "rgba(255,255,255,0.2)", fontSize: "0.6rem", letterSpacing: "2px" },
  customAlert: {
    position: "fixed",
    top: 0,
    left: "50%",
    width: "320px",
    background: "rgba(10, 10, 10, 0.95)",
    backdropFilter: "blur(15px)",
    border: "1px solid",
    padding: "15px",
    zIndex: 2000,
    borderRadius: "2px"
  },
  alertMsg: { color: "#fff", fontSize: "0.85rem", textAlign: "center", letterSpacing: "1px" },
  alertProgress: { position: "absolute", bottom: 0, left: 0, height: "2px", width: "100%" }
};

export default Register;