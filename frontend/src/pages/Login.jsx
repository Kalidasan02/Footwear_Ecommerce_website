import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const triggerAlert = (msg, type) => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("auth/login/", form);
      login(res.data.access);
      triggerAlert("ACCESS GRANTED: SESSION INITIALIZED", "success");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      triggerAlert("CRITICAL ERROR: INVALID CREDENTIALS", "error");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* SCANLINE OVERLAY */}
      <div style={styles.scanline}></div>

      {/* FUTURISTIC CUSTOM ALERT HUD */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ y: -100, opacity: 0, x: "-50%" }}
            animate={{ y: 20, opacity: 1, x: "-50%" }}
            exit={{ y: -100, opacity: 0, x: "-50%" }}
            style={{
              ...styles.customAlert,
              borderColor: alert.type === "success" ? "#00F5FF" : "#FF0055",
              boxShadow: alert.type === "success" ? "0 0 20px rgba(0, 245, 255, 0.2)" : "0 0 20px rgba(255, 0, 85, 0.2)"
            }}
          >
            <div style={styles.alertHeader}>
              <span style={{...styles.alertDot, backgroundColor: alert.type === "success" ? "#00F5FF" : "#FF0055"}}></span>
              {alert.type === "success" ? "SYSTEM_STABLE" : "SYSTEM_BREACH"}
            </div>
            <div style={styles.alertMsg}>{alert.msg}</div>
            <div style={{...styles.alertProgress, backgroundColor: alert.type === "success" ? "#00F5FF" : "#FF0055"}}></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.bgGlow}></div>
      
      {/* MAIN LOGIN CARD WITH TOP-TO-BOTTOM SPRING ANIMATION */}
      <motion.div 
        initial={{ opacity: 0, y: -150, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 60, 
          damping: 12,
          duration: 0.8 
        }}
        style={styles.loginCard}
      >
        <div style={styles.headerArea}>
          <h2 style={styles.title}>SYSTEM_ACCESS</h2>
          <p style={styles.subtitle}>PLEASE_LOGIN_TO_CONTINUE</p>
        </div>

        {/* STAGGERED FADE FOR FORM ELEMENTS */}
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onSubmit={handleSubmit} 
          style={styles.form}
        >
          <div style={styles.inputGroup}>
            <label style={styles.label}>OPERATOR_ID</label>
            <input
              style={styles.futuristicInput}
              placeholder="ENTER_USERNAME"
              autoComplete="off"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <div style={styles.inputLine}></div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>ACCESS_KEY</label>
            <input
              type="password"
              style={styles.futuristicInput}
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <div style={styles.inputLine}></div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, letterSpacing: "4px", backgroundColor: "#00F5FF", color: "#000" }}
            whileTap={{ scale: 0.98 }}
            style={styles.loginButton}
          >
            LOG_IN
          </motion.button>

          <div style={styles.footerLinks}>
            <span style={styles.versionText}>NEW_OPERATOR?</span>
            <Link to="/register" style={styles.registerLink}>CREATE_IDENTITY</Link>
          </div>
        </motion.form>

        <div style={styles.footerDecor}>
          <p style={styles.versionText}>FOOTWEAR_OS_V.2.0.26 // ENCRYPTED</p>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#050505",
    overflow: "hidden",
    position: "relative",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  scanline: {
    position: "absolute",
    top: 0, left: 0, width: "100%", height: "100%",
    background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
    backgroundSize: "100% 4px, 3px 100%",
    pointerEvents: "none",
    zIndex: 2,
  },
  customAlert: {
    position: "absolute",
    top: 0, left: "50%", width: "320px",
    background: "rgba(10, 10, 10, 0.95)",
    backdropFilter: "blur(15px)",
    border: "1px solid",
    padding: "15px",
    zIndex: 1000,
    borderRadius: "2px",
    overflow: "hidden"
  },
  alertHeader: { fontSize: "0.6rem", color: "#fff", letterSpacing: "2px", display: "flex", alignItems: "center", marginBottom: "5px" },
  alertDot: { width: "6px", height: "6px", marginRight: "8px", borderRadius: "50%" },
  alertMsg: { color: "#fff", fontSize: "0.85rem", fontWeight: "500", letterSpacing: "1px" },
  alertProgress: { position: "absolute", bottom: 0, left: 0, height: "2px", width: "100%" },
  
  bgGlow: {
    position: "absolute",
    width: "50vw", height: "50vw",
    background: "radial-gradient(circle, rgba(0, 245, 255, 0.05) 0%, rgba(0,0,0,0) 70%)",
    top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    zIndex: 0,
  },
  loginCard: {
    width: "100%", maxWidth: "420px",
    padding: "50px",
    background: "rgba(15, 15, 15, 0.8)",
    backdropFilter: "blur(30px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    zIndex: 5,
    position: "relative",
  },
  headerArea: { marginBottom: "40px", borderLeft: "3px solid #00F5FF", paddingLeft: "15px" },
  title: { color: "#fff", fontSize: "1.8rem", fontWeight: "900", letterSpacing: "4px", margin: "0" },
  subtitle: { color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", letterSpacing: "3px", marginTop: "8px" },
  
  inputGroup: { marginBottom: "30px" },
  label: { color: "#00F5FF", fontSize: "0.6rem", display: "block", marginBottom: "10px", letterSpacing: "2px" },
  futuristicInput: { 
    width: "100%", background: "transparent", border: "none", color: "#fff", 
    fontSize: "1rem", outline: "none", letterSpacing: "1px" 
  },
  inputLine: { height: "1px", width: "100%", background: "rgba(255,255,255,0.1)", marginTop: "8px" },
  
  loginButton: { 
    width: "100%", padding: "18px", background: "transparent", border: "1px solid #00F5FF",
    color: "#00F5FF", fontWeight: "900", letterSpacing: "2px", fontSize: "0.75rem", 
    cursor: "pointer", transition: "0.4s all" 
  },
  footerLinks: { marginTop: "25px", display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" },
  registerLink: { color: "#fff", textDecoration: "none", fontSize: "0.65rem", fontWeight: "700", letterSpacing: "1px", borderBottom: "1px solid #00F5FF" },
  footerDecor: { marginTop: "40px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" },
  versionText: { color: "rgba(255,255,255,0.2)", fontSize: "0.55rem", letterSpacing: "3px", margin: 0 },
};

export default Login;