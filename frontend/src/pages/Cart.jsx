import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

function Cart() {
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("cart/");
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await API.delete(`cart/remove/${itemId}/`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item", err);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.title}>STAGING_AREA</h2>
          <p style={styles.subtitle}>VERIFY_UNITS_FOR_PROCUREMENT</p>
        </header>

        {cart.items.length === 0 ? (
          <div style={styles.emptyState}>CART_IS_EMPTY // NO_UNITS_DETECTED</div>
        ) : (
          <div style={styles.cartContent}>
            <div style={styles.itemList}>
              <AnimatePresence>
                {cart.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    style={styles.cartItem}
                  >
                    <div style={styles.itemInfo}>
                      <span style={styles.productName}>{item.product_name.toUpperCase()}</span>
                      <div style={styles.metaRow}>
                        <span style={styles.metaLabel}>SIZE: {item.size}</span>
                        <span style={styles.metaDivider}>|</span>
                        <span style={styles.metaLabel}>QTY: {item.quantity}</span>
                      </div>
                      <div style={styles.priceTag}>₹{item.price}</div>
                    </div>

                    <button
                      style={styles.removeBtn}
                      onClick={() => handleRemove(item.id)}
                    >
                      DISCARD_UNIT
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* SUMMARY SIDEBAR */}
            <div style={styles.summaryBox}>
              <div style={styles.summaryLabel}>TOTAL_VALUATION</div>
              <div style={styles.totalPrice}>₹{cart.total_price}</div>
              
              <div style={styles.techDecoration}>
                <div style={styles.techLine}></div>
                <div style={styles.techDot}></div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#00F5FF", color: "#000" }}
                whileTap={{ scale: 0.95 }}
                style={styles.checkoutBtn}
                onClick={() => navigate("/checkout")}
              >
                INITIATE_CHECKOUT
              </motion.button>
              
              <p style={styles.secureText}>[SECURE_ENCRYPTION_ACTIVE]</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { minHeight: "100vh", background: "#050505", paddingTop: "120px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 20px" },
  header: { marginBottom: "50px", borderLeft: "4px solid #00F5FF", paddingLeft: "20px" },
  title: { fontSize: "2rem", letterSpacing: "5px", fontWeight: "800", margin: 0 },
  subtitle: { color: "rgba(0, 245, 255, 0.5)", fontSize: "0.7rem", letterSpacing: "3px", marginTop: "5px" },
  
  cartContent: { display: "grid", gridTemplateColumns: "1fr 350px", gap: "40px", alignItems: "start" },
  itemList: { display: "flex", flexDirection: "column", gap: "15px" },
  
  cartItem: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  productName: { display: "block", fontSize: "1.1rem", fontWeight: "700", letterSpacing: "1px", marginBottom: "8px" },
  metaRow: { display: "flex", gap: "10px", marginBottom: "12px" },
  metaLabel: { color: "rgba(255, 255, 255, 0.4)", fontSize: "0.7rem", letterSpacing: "1px" },
  metaDivider: { color: "rgba(0, 245, 255, 0.3)", fontSize: "0.7rem" },
  priceTag: { color: "#00F5FF", fontWeight: "800", fontSize: "1.2rem" },
  
  removeBtn: {
    background: "transparent",
    border: "1px solid rgba(255, 0, 85, 0.3)",
    color: "#FF0055",
    padding: "8px 15px",
    fontSize: "0.65rem",
    fontWeight: "700",
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "0.3s",
  },

  summaryBox: {
    background: "rgba(0, 245, 255, 0.03)",
    border: "1px solid rgba(0, 245, 255, 0.1)",
    padding: "30px",
    textAlign: "center",
    position: "sticky",
    top: "140px",
  },
  summaryLabel: { fontSize: "0.6rem", color: "rgba(255, 255, 255, 0.4)", letterSpacing: "2px", marginBottom: "10px" },
  totalPrice: { fontSize: "2.2rem", fontWeight: "800", color: "#fff", marginBottom: "30px" },
  
  techDecoration: { position: "relative", height: "20px", marginBottom: "30px" },
  techLine: { width: "100%", height: "1px", background: "rgba(0, 245, 255, 0.2)" },
  techDot: { position: "absolute", top: "-2px", left: "50%", width: "5px", height: "5px", background: "#00F5FF", boxShadow: "0 0 10px #00F5FF" },

  checkoutBtn: {
    width: "100%",
    padding: "18px",
    background: "transparent",
    border: "1px solid #00F5FF",
    color: "#00F5FF",
    fontWeight: "800",
    fontSize: "0.8rem",
    letterSpacing: "2px",
    cursor: "pointer",
  },
  secureText: { fontSize: "0.55rem", color: "rgba(255,255,255,0.2)", marginTop: "15px", letterSpacing: "1px" },
  
  emptyState: { textAlign: "center", padding: "100px 0", color: "rgba(255,255,255,0.2)", letterSpacing: "4px" }
};

export default Cart;