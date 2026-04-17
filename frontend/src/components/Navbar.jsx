import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navContainer}>
      <div style={styles.glassBar}>
        {/* BRAND / LOGO */}
        <Link style={styles.brand} to="/">
          <span style={styles.brandAccent}>FOOTWEAR</span>_FOUNDRY
        </Link>

        <div style={styles.navLinks}>
          <NavLink to="/products" label="COLLECTION" active={isActive("/products")} />

          {/* ✅ Authenticated Operator Sectors */}
          {user && (
            <>
              <NavLink to="/cart" label="CART" active={isActive("/cart")} />
              <NavLink to="/orders" label="ORDERS" active={isActive("/orders")} />
              
              {/* Added Profile Link here */}
              <NavLink to="/profile" label="PROFILE" active={isActive("/profile")} />
              
              <Link style={styles.adminBtn} to="/admin-dashboard">
                ADMINISTRATION
              </Link>
            </>
          )}
        </div>

        {/* ✅ AUTH ACTIONS */}
        <div style={styles.authZone}>
          {user ? (
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              {/* Optional: Visual indicator of current user */}
              <span style={styles.operatorId}>OP_{user.username?.toUpperCase() || "USER"}</span>
              
              <motion.button 
                whileHover={{ backgroundColor: "rgba(255, 0, 85, 0.2)", color: "#FF0055" }}
                style={styles.logoutBtn} 
                onClick={logout}
              >
                LOG_OUT
              </motion.button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <Link style={styles.loginBtn} to="/login">LOGIN</Link>
              <Link style={styles.registerBtn} to="/register">REGISTER</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const NavLink = ({ to, label, active }) => (
  <Link to={to} style={{ ...styles.link, color: active ? "#00F5FF" : "rgba(255,255,255,0.6)" }}>
    {label}
    {active && <motion.div layoutId="underline" style={styles.activeUnderline} />}
  </Link>
);

const styles = {
  navContainer: {
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1000,
    padding: "20px 40px",
    display: "flex",
    justifyContent: "center",
  },
  glassBar: {
    width: "100%",
    maxWidth: "1200px",
    background: "rgba(10, 10, 10, 0.6)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    padding: "12px 30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "2px",
  },
  brand: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "800",
    letterSpacing: "3px",
  },
  brandAccent: {
    color: "#00F5FF",
    textShadow: "0 0 10px rgba(0, 245, 255, 0.5)",
  },
  navLinks: {
    display: "flex",
    gap: "30px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    fontSize: "0.7rem",
    fontWeight: "600",
    letterSpacing: "2px",
    position: "relative",
    padding: "5px 0",
    transition: "0.3s color ease",
  },
  activeUnderline: {
    position: "absolute",
    bottom: -2,
    left: 0,
    right: 0,
    height: "2px",
    background: "#00F5FF",
    boxShadow: "0 0 8px #00F5FF",
  },
  authZone: {
    display: "flex",
    alignItems: "center",
  },
  operatorId: {
    color: "rgba(255,255,255,0.3)",
    fontSize: "0.55rem",
    letterSpacing: "2px",
    borderRight: "1px solid rgba(255,255,255,0.1)",
    paddingRight: "15px"
  },
  loginBtn: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "0.65rem",
    letterSpacing: "2px",
    padding: "8px 16px",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  registerBtn: {
    textDecoration: "none",
    color: "#000",
    background: "#00F5FF",
    fontSize: "0.65rem",
    fontWeight: "bold",
    letterSpacing: "2px",
    padding: "8px 16px",
    border: "1px solid #00F5FF",
  },
  adminBtn: {
    textDecoration: "none",
    color: "#FFB800",
    fontSize: "0.65rem",
    letterSpacing: "2px",
    border: "1px solid rgba(255, 184, 0, 0.3)",
    padding: "5px 10px",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(255, 0, 85, 0.3)",
    color: "rgba(255, 0, 85, 0.8)",
    padding: "8px 16px",
    fontSize: "0.65rem",
    cursor: "pointer",
    letterSpacing: "2px",
    transition: "0.3s all",
  },
};

export default Navbar;