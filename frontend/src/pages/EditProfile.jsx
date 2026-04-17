import { useState, useEffect } from "react";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

function Profile() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  useEffect(() => {
    fetchOperatorData();
  }, []);

  const fetchOperatorData = async () => {
    try {
      const res = await API.get("auth/profile/"); // Ensure this matches your URL path
      setForm(res.data);
      setLoading(false);
    } catch (err) {
      triggerAlert("SIGNAL_INTERRUPTED: DATA_FETCH_FAILED", "error");
      setLoading(false);
    }
  };

  const triggerAlert = (msg, type) => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: "", type: "" }), 4000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("auth/profile/", form);
      triggerAlert(res.data.message || "RECALIBRATION_COMPLETE", "success");
    } catch (err) {
      triggerAlert("PROTOCOL_ERROR: UPDATE_REJECTED", "error");
    }
  };

  if (loading) return <div style={styles.loader}>UPLOADING_NEURAL_INTERFACE...</div>;

  return (
    <div style={styles.pageWrapper}>
      {/* HUD ALERT */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ y: -100, opacity: 0, x: "-50%" }}
            animate={{ y: 20, opacity: 1, x: "-50%" }}
            exit={{ y: -100, opacity: 0, x: "-50%" }}
            style={{
              ...styles.customAlert,
              borderColor: alert.type === "success" ? "#00F5FF" : "#FF0055",
            }}
          >
            <div style={styles.alertMsg}>{alert.msg}</div>
            <div style={{...styles.alertProgress, backgroundColor: alert.type === "success" ? "#00F5FF" : "#FF0055"}} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT PROFILE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
        style={styles.profileCard}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>OPERATOR_PROFILE</h2>
          <p style={styles.subtitle}>MANAGE_IDENTITY_METADATA</p>
        </div>

        <form onSubmit={handleUpdate} style={styles.form}>
          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>OPERATOR_ID</label>
              <input
                style={styles.input}
                value={form.username}
                onChange={(e) => setForm({...form, username: e.target.value})}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>COMM_EMAIL</label>
              <input
                style={styles.input}
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>SECURE_MOBILE_LINK</label>
            <input
              style={styles.input}
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>GEOGRAPHIC_BASE_STATION</label>
            <textarea
              style={styles.textarea}
              value={form.address}
              onChange={(e) => setForm({...form, address: e.target.value})}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.01, backgroundColor: "#00F5FF", color: "#000" }}
            whileTap={{ scale: 0.98 }}
            style={styles.submitBtn}
          >
            EXECUTE_DATA_SYNC
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    height: "100vh",
    background: "#050505",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Space Grotesk', sans-serif",
    paddingTop: "80px", // Clear fixed navbar
  },
  profileCard: {
    width: "100%",
    maxWidth: "550px",
    background: "rgba(10, 10, 10, 0.85)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    padding: "40px",
    position: "relative",
  },
  header: { marginBottom: "30px", borderLeft: "3px solid #00F5FF", paddingLeft: "15px" },
  title: { color: "#fff", fontSize: "1.8rem", letterSpacing: "5px", margin: 0 },
  subtitle: { color: "#00F5FF", fontSize: "0.6rem", letterSpacing: "3px", opacity: 0.7 },
  form: { display: "flex", flexDirection: "column", gap: "25px" },
  inputRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { color: "rgba(255,255,255,0.3)", fontSize: "0.55rem", letterSpacing: "2px" },
  input: {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "0.95rem",
    padding: "8px 0",
    outline: "none",
  },
  textarea: {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "0.95rem",
    minHeight: "60px",
    outline: "none",
    resize: "none"
  },
  submitBtn: {
    padding: "18px",
    background: "transparent",
    border: "1px solid #00F5FF",
    color: "#00F5FF",
    fontWeight: "900",
    letterSpacing: "3px",
    cursor: "pointer",
    marginTop: "15px",
  },
  loader: { color: "#00F5FF", textAlign: "center", marginTop: "20%", letterSpacing: "5px" },
  customAlert: { position: "fixed", top: 0, left: "50%", width: "320px", background: "#0a0a0a", border: "1px solid", padding: "15px", zIndex: 2000 },
  alertMsg: { color: "#fff", fontSize: "0.8rem", textAlign: "center" },
  alertProgress: { position: "absolute", bottom: 0, left: 0, height: "2px", width: "100%" }
};

export default Profile;