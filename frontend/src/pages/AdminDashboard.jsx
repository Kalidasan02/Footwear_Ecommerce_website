import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("orders/admin-dashboard/");
      setStats(res.data);
    } catch (err) {
      setError("AUTHORIZATION_REJECTED: ACCESS_DENIED");
    }
  };

  if (error) {
    return (
      <div style={styles.errorWrapper}>
        <div style={styles.errorBox}>{error}</div>
      </div>
    );
  }

  if (!stats) {
    return <div style={styles.loading}>SYNCING_WITH_CORE_SERVER...</div>;
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        {/* DASHBOARD HEADER */}
        <header style={styles.header}>
          <div>
            <h2 style={styles.title}>CENTRAL_COMMAND</h2>
            <p style={styles.subtitle}>SYSTEM_METRICS // REAL-TIME_TELEMETRY</p>
          </div>
          <div style={styles.statusIndicator}>
            <span style={styles.pulse}></span> SECURE_CONNECTION
          </div>
        </header>

        {/* PRIMARY METRICS GRID */}
        <div style={styles.statsGrid}>
          <StatCard label="TOTAL_INVENTORY" value={stats.total_products} color="#fff" />
          <StatCard label="TOTAL_TRANSACTIONS" value={stats.total_orders} color="#fff" />
          <StatCard label="PENDING_OPERATIONS" value={stats.pending_orders} color="#FFB800" />
          <StatCard label="COMPLETED_MISSIONS" value={stats.completed_orders} color="#00FF66" />
          <StatCard label="TOTAL_REVENUE" value={`₹${stats.total_revenue}`} color="#00F5FF" isLarge />
          <StatCard label="CRITICAL_STOCK_ALERTS" value={stats.low_stock_count} color="#FF0055" />
        </div>

        {/* MANAGEMENT ACCESS */}
        <motion.div whileHover={{ scale: 1.01 }} style={styles.managementBox}>
          <div style={styles.managementText}>
            <h4 style={styles.boxTitle}>ORDER_MANAGEMENT_INTERFACE</h4>
            <p style={styles.boxDesc}>Update logistical statuses and verify customer transactions.</p>
          </div>
          <Link to="/admin-orders" style={styles.manageBtn}>
            ACCESS_DATABASE
          </Link>
        </motion.div>

        {/* LOW STOCK ALERTS SECTION */}
        <div style={styles.alertSection}>
          <h4 style={styles.alertHeading}>
            <span style={{ color: "#FF0055" }}>[!]</span> CRITICAL_STOCK_REPORT
          </h4>

          {stats.low_stock_products.length === 0 ? (
            <div style={styles.successReport}>ALL_INVENTORY_LEVELS_NOMINAL</div>
          ) : (
            <div style={styles.reportList}>
              {stats.low_stock_products.map((item, index) => (
                <div key={index} style={styles.reportItem}>
                  <div style={styles.reportMain}>
                    <span style={styles.productCode}>UNIT_{item.product_name.toUpperCase()}</span>
                    <span style={styles.productSize}>SIZE: {item.size}</span>
                  </div>
                  <div style={styles.stockLevel}>
                    REMAINING: <span style={{ color: "#FF0055" }}>{item.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for Stats Cards
const StatCard = ({ label, value, color, isLarge }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ ...styles.statCard, borderLeft: `2px solid ${color}` }}
  >
    <div style={styles.label}>{label}</div>
    <div style={{ ...styles.value, color: color, fontSize: isLarge ? "2rem" : "1.5rem" }}>{value}</div>
  </motion.div>
);

const styles = {
  pageWrapper: { minHeight: "100vh", background: "#050505", paddingTop: "120px", paddingBottom: "100px", fontFamily: "'Space Grotesk', sans-serif" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 30px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "50px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "20px" },
  title: { color: "#fff", fontSize: "2.2rem", letterSpacing: "6px", fontWeight: "800", margin: 0 },
  subtitle: { color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", letterSpacing: "3px", marginTop: "5px" },
  statusIndicator: { color: "#00FF66", fontSize: "0.6rem", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "10px" },
  pulse: { width: "8px", height: "8px", background: "#00FF66", borderRadius: "50%", boxShadow: "0 0 10px #00FF66" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "50px" },
  statCard: { background: "rgba(255,255,255,0.02)", padding: "25px", border: "1px solid rgba(255,255,255,0.05)" },
  label: { fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", marginBottom: "10px" },
  value: { fontWeight: "800", letterSpacing: "1px" },

  managementBox: { 
    display: "flex", justifyContent: "space-between", alignItems: "center", 
    background: "linear-gradient(90deg, rgba(0, 245, 255, 0.05), transparent)", 
    padding: "30px", border: "1px solid rgba(0, 245, 255, 0.2)", marginBottom: "50px" 
  },
  boxTitle: { color: "#fff", fontSize: "1rem", letterSpacing: "2px", margin: "0 0 5px 0" },
  boxDesc: { color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", margin: 0 },
  manageBtn: { textDecoration: "none", background: "#00F5FF", color: "#000", padding: "12px 25px", fontSize: "0.7rem", fontWeight: "800", letterSpacing: "2px" },

  alertSection: { background: "rgba(255, 0, 85, 0.02)", border: "1px solid rgba(255, 0, 85, 0.1)", padding: "30px" },
  alertHeading: { color: "#fff", fontSize: "0.9rem", letterSpacing: "3px", marginBottom: "30px" },
  successReport: { color: "#00FF66", fontSize: "0.75rem", letterSpacing: "2px", textAlign: "center", padding: "20px" },
  reportList: { display: "flex", flexDirection: "column", gap: "15px" },
  reportItem: { display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" },
  productCode: { display: "block", color: "#fff", fontSize: "0.85rem", fontWeight: "600" },
  productSize: { color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", letterSpacing: "1px" },
  stockLevel: { color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", letterSpacing: "1px" },

  loading: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#00F5FF", letterSpacing: "5px", fontSize: "0.8rem" },
  errorWrapper: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" },
  errorBox: { border: "1px solid #FF0055", color: "#FF0055", padding: "20px", letterSpacing: "2px", fontSize: "0.8rem", background: "rgba(255,0,85,0.05)" }
};

export default AdminDashboard;