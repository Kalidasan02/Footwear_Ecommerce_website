import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const triggerAlert = (msg, type) => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: "", type: "" }), 4000);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const handlePayment = async (order) => {
    try {
      const createRes = await API.post("payments/create-order/", { order_id: order.id });
      const data = createRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "FOOTWEAR_FOUNDRY",
        description: `TXN_LOG: ORDER_${order.id}`,
        order_id: data.razorpay_order_id,
        handler: async function (response) {
          try {
            await API.post("payments/verify-payment/", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id,
            });
            triggerAlert("PAYMENT_VERIFIED: CLEARANCE_GRANTED", "success");
            fetchOrders();
          } catch (err) {
            triggerAlert("VERIFICATION_FAILED: SEC_BREACH", "error");
          }
        },
        prefill: { name: "Customer", email: "customer@foundry.io" },
        theme: { color: "#00F5FF" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      triggerAlert("TXN_FAILED: GATEWAY_UNREACHABLE", "error");
    }
  };

  const handleDownloadReceipt = async (orderId) => {
    try {
      const response = await API.get(`orders/receipt/${orderId}/`, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `FOUNDRY_REC_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      triggerAlert("IO_ERROR: PDF_GENERATION_FAILED", "error");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            style={{...styles.customAlert, borderColor: alert.type === "success" ? "#00F5FF" : "#FF0055"}}
          >
            <div style={styles.alertMsg}>{alert.msg}</div>
            <div style={{...styles.alertProgress, backgroundColor: alert.type === "success" ? "#00F5FF" : "#FF0055"}} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.title}>ORDER_MANIFEST</h2>
          <p style={styles.subtitle}>HISTORY OF ENCRYPTED TRANSACTIONS</p>
        </header>

        {orders.length === 0 ? (
          <div style={styles.emptyState}>NULL_RECORDS_FOUND</div>
        ) : (
          orders.map((order) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={order.id} 
              style={styles.orderCard}
            >
              {/* Card Header */}
              <div style={styles.cardTop}>
                <div>
                  <div style={styles.label}>TRANSACTION_ID</div>
                  <div style={styles.orderId}>#ORD_{order.id.toString().padStart(4, '0')}</div>
                  <div style={styles.timeStamp}>{new Date(order.created_at).toLocaleString().toUpperCase()}</div>
                </div>
                <div style={styles.statusSection}>
                  <div style={{
                    ...styles.statusBadge,
                    color: order.status === "completed" ? "#00FF66" : "#FFB800",
                    borderColor: order.status === "completed" ? "#00FF66" : "#FFB800"
                  }}>
                    {order.status?.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div style={styles.itemsArea}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={styles.itemRow}>
                    <div style={styles.itemMain}>
                      <span style={styles.productName}>{item.product_name}</span>
                      <span style={styles.itemMeta}>SZ_{item.size} // QTY_{item.quantity}</span>
                    </div>
                    <div style={styles.itemPrice}>₹{item.price}</div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div style={styles.cardBottom}>
                <div style={styles.totalSection}>
                  <span style={styles.label}>TOTAL_VALUE</span>
                  <div style={styles.totalAmount}>₹{order.total_price}</div>
                </div>

                <div style={styles.actionSection}>
                  {order.status === "pending" && (
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: "#00F5FF", color: "#000" }}
                      style={styles.payBtn} 
                      onClick={() => handlePayment(order)}
                    >
                      EXECUTE_PAYMENT
                    </motion.button>
                  )}
                  {order.status === "completed" && (
                    <motion.button 
                      whileHover={{ scale: 1.05, borderColor: "#00F5FF", color: "#00F5FF" }}
                      style={styles.receiptBtn} 
                      onClick={() => handleDownloadReceipt(order.id)}
                    >
                      EXTRACT_RECEIPT_PDF
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { minHeight: "100vh", background: "#050505", paddingTop: "120px", paddingBottom: "100px", fontFamily: "'Space Grotesk', sans-serif" },
  container: { maxWidth: "900px", margin: "0 auto", padding: "0 20px" },
  header: { marginBottom: "50px", borderLeft: "4px solid #00F5FF", paddingLeft: "20px" },
  title: { color: "#fff", fontSize: "2rem", letterSpacing: "5px", fontWeight: "800", margin: 0 },
  subtitle: { color: "rgba(0, 245, 255, 0.5)", fontSize: "0.7rem", letterSpacing: "3px", marginTop: "5px" },
  
  orderCard: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    marginBottom: "30px",
    padding: "30px",
    position: "relative",
    backdropFilter: "blur(10px)",
  },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: "30px" },
  label: { fontSize: "0.55rem", color: "rgba(255, 255, 255, 0.3)", letterSpacing: "2px", marginBottom: "5px" },
  orderId: { color: "#fff", fontSize: "1.2rem", fontWeight: "700", letterSpacing: "1px" },
  timeStamp: { color: "rgba(255, 255, 255, 0.5)", fontSize: "0.65rem", marginTop: "5px" },
  
  statusBadge: { 
    padding: "5px 15px", 
    border: "1px solid", 
    fontSize: "0.6rem", 
    fontWeight: "800", 
    letterSpacing: "2px",
    background: "rgba(0,0,0,0.3)"
  },
  
  itemsArea: { borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "20px 0" },
  itemRow: { display: "flex", justifyContent: "space-between", marginBottom: "15px" },
  productName: { display: "block", color: "#fff", fontSize: "0.9rem", fontWeight: "600" },
  itemMeta: { color: "rgba(0, 245, 255, 0.5)", fontSize: "0.65rem", letterSpacing: "1px" },
  itemPrice: { color: "#fff", fontWeight: "700" },
  
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "30px" },
  totalAmount: { color: "#00F5FF", fontSize: "1.5rem", fontWeight: "800" },
  
  payBtn: { background: "transparent", border: "1px solid #00F5FF", color: "#00F5FF", padding: "12px 25px", fontSize: "0.7rem", fontWeight: "800", cursor: "pointer", letterSpacing: "2px" },
  receiptBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "12px 25px", fontSize: "0.7rem", fontWeight: "800", cursor: "pointer", letterSpacing: "2px" },
  
  emptyState: { textAlign: "center", padding: "100px", color: "rgba(255,255,255,0.2)", letterSpacing: "5px" },
  customAlert: { position: "fixed", top: "20px", left: "50%", width: "300px", background: "#0a0a0a", border: "1px solid", padding: "15px", zIndex: 2000 },
  alertMsg: { color: "#fff", fontSize: "0.75rem", textAlign: "center", letterSpacing: "1px" },
  alertProgress: { position: "absolute", bottom: 0, left: 0, height: "2px", width: "100%", animation: "shrink 4s linear forwards" }
};

export default MyOrders;