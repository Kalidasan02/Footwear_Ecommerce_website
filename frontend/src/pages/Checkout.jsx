import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";

function Checkout() {
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("cart/");
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching checkout cart", err);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await API.post("orders/checkout/");
      // Using a slightly more themed delay to simulate "processing"
      setTimeout(() => {
        navigate(`/orders`);
      }, 1000);
    } catch (err) {
      console.error("Checkout error", err);
      alert("CRITICAL_ERROR: ORDER_DEPLOYMENT_FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.title}>FINAL_AUTHORIZATION</h2>
          <p style={styles.subtitle}>SECURE_PROCUREMENT_PROTOCOL_V2.6</p>
        </header>

        {cart.items.length === 0 ? (
          <div style={styles.emptyState}>NO_DATA_TO_PROCESS</div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.checkoutPanel}
          >
            <div style={styles.panelHeader}>
              <h4 style={styles.panelTitle}>ORDER_MANIFEST_SUMMARY</h4>
              <span style={styles.itemCount}>{cart.items.length} UNITS_STAGED</span>
            </div>

            <div style={styles.itemContainer}>
              {cart.items.map((item) => (
                <div key={item.id} style={styles.itemRow}>
                  <div style={styles.itemMain}>
                    <span style={styles.productName}>{item.product_name.toUpperCase()}</span>
                    <span style={styles.itemSpecs}>
                      SIZE: {item.size} // QTY: {item.quantity}
                    </span>
                  </div>
                  <div style={styles.itemPrice}>₹{item.price}</div>
                </div>
              ))}
            </div>

            <div style={styles.footerSection}>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>TOTAL_VALUATION</span>
                <span style={styles.totalValue}>₹{cart.total_price}</span>
              </div>

              <motion.button
                whileHover={!loading ? { scale: 1.02, backgroundColor: "#00F5FF", color: "#000" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                style={{
                  ...styles.placeOrderBtn,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? "AUTHORIZING_TRANSACTION..." : "CONFIRM_AND_PLACE_ORDER"}
              </motion.button>
              
              <div style={styles.securityFooter}>
                <span style={styles.blink}>●</span> ENCRYPTED_GATEWAY_READY
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#050505",
    paddingTop: "120px",
    paddingBottom: "80px",
    color: "#fff",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  container: { maxWidth: "800px", margin: "0 auto", padding: "0 20px" },
  header: { marginBottom: "40px", textAlign: "center" },
  title: { fontSize: "2.5rem", letterSpacing: "8px", fontWeight: "900", margin: 0 },
  subtitle: { color: "#00F5FF", fontSize: "0.7rem", letterSpacing: "4px", marginTop: "10px" },
  
  checkoutPanel: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "40px",
    backdropFilter: "blur(15px)",
    position: "relative",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "30px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: "15px",
  },
  panelTitle: { fontSize: "1rem", letterSpacing: "2px", margin: 0 },
  itemCount: { fontSize: "0.6rem", color: "rgba(255,255,255,0.4)" },
  
  itemContainer: { marginBottom: "40px" },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  productName: { display: "block", fontSize: "1rem", fontWeight: "700", color: "#fff" },
  itemSpecs: { fontSize: "0.7rem", color: "rgba(0, 245, 255, 0.5)", letterSpacing: "1px" },
  itemPrice: { fontSize: "1.1rem", fontWeight: "800", color: "#fff" },
  
  footerSection: { marginTop: "30px" },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "40px",
    padding: "20px",
    background: "rgba(0, 245, 255, 0.03)",
    borderLeft: "4px solid #00F5FF",
  },
  totalLabel: { fontSize: "0.8rem", letterSpacing: "2px", fontWeight: "600" },
  totalValue: { fontSize: "1.8rem", fontWeight: "900", color: "#00F5FF" },
  
  placeOrderBtn: {
    width: "100%",
    padding: "20px",
    background: "transparent",
    border: "1px solid #00F5FF",
    color: "#00F5FF",
    fontSize: "0.9rem",
    fontWeight: "800",
    letterSpacing: "3px",
    transition: "0.3s all",
  },
  securityFooter: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "0.55rem",
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "2px",
  },
  blink: { color: "#00FF66", marginRight: "8px", animation: "blink 1.5s infinite" },
  emptyState: { textAlign: "center", padding: "100px", color: "rgba(255,255,255,0.2)", letterSpacing: "5px" }
};

export default Checkout;