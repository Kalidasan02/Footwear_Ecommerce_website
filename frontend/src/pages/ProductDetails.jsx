import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  // Custom Alert State
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const triggerAlert = (msg, type) => {
    setAlert({ show: true, msg, type });
    setTimeout(() => setAlert({ show: false, msg: "", type: "" }), 4000);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`products/${id}/`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product details", err);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      triggerAlert("REQUIREMENT: SELECT_SIZE_PROTOCOL", "error");
      return;
    }

    try {
      await API.post("cart/add/", {
        product_id: product.id,
        size: parseInt(selectedSize),
        quantity: parseInt(quantity),
      });
      triggerAlert("TRANSFER_SUCCESS: ITEM_ADDED_TO_CART", "success");
    } catch (err) {
      triggerAlert("TRANSFER_CRITICAL: AUTH_OR_STOCK_ERROR", "error");
    }
  };

  if (!product) {
    return <div style={styles.loadingScreen}>INITIALIZING_DATA_STREAM...</div>;
  }

  return (
    <div style={styles.pageWrapper}>
      {/* HUD ALERTS */}
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

      <div style={styles.contentContainer}>
        <div style={styles.mainGrid}>
          
          {/* LEFT: IMAGE VIEWPORT */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.imageSection}
          >
            <div style={styles.viewportFrame}>
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0].image} alt={product.name} style={styles.mainImage} />
              ) : (
                <div style={styles.noImage}>IMAGE_NOT_FOUND</div>
              )}
              {/* Decorative Scanning Lines */}
              <div style={styles.scanLine}></div>
            </div>
          </motion.div>

          {/* RIGHT: DATA PANEL */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.infoSection}
          >
            <div style={styles.header}>
              <span style={styles.brandTag}>{product.brand?.toUpperCase()}</span>
              <h1 style={styles.productName}>{product.name}</h1>
              <div style={styles.priceTag}>₹{product.price}</div>
            </div>

            <div style={styles.descriptionBox}>
              <h5 style={styles.sectionLabel}>OBJECT_DESCRIPTION</h5>
              <p style={styles.descriptionText}>{product.description}</p>
            </div>

            {/* SIZE SELECTION GRID */}
            <div style={styles.selectionArea}>
              <h5 style={styles.sectionLabel}>SELECT_DIMENSION</h5>
              <div style={styles.sizeGrid}>
                {product.sizes?.map((sizeObj, index) => (
                  <button
                    key={index}
                    disabled={sizeObj.stock <= 0}
                    onClick={() => setSelectedSize(sizeObj.size)}
                    style={{
                      ...styles.sizeBtn,
                      borderColor: selectedSize === sizeObj.size ? "#00F5FF" : "rgba(255,255,255,0.1)",
                      color: sizeObj.stock <= 0 ? "rgba(255,255,255,0.1)" : "#fff",
                      background: selectedSize === sizeObj.size ? "rgba(0,245,255,0.1)" : "transparent"
                    }}
                  >
                    {sizeObj.size}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY & ACTIONS */}
            <div style={styles.actionRow}>
              <div style={styles.qtyBox}>
                <label style={styles.sectionLabel}>QTY</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={styles.qtyInput}
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px #00F5FF" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                style={styles.addBtn}
              >
                ADD_TO_CART
              </motion.button>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#050505",
    color: "#fff",
    paddingTop: "120px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  loadingScreen: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#00F5FF", letterSpacing: "5px" },
  contentContainer: { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" },
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" },
  
  imageSection: { position: "relative" },
  viewportFrame: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: "40px",
    position: "relative",
    overflow: "hidden"
  },
  mainImage: { width: "100%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(0,245,255,0.2))" },
  scanLine: { position: "absolute", top: 0, left: 0, width: "100%", height: "2px", background: "rgba(0,245,255,0.1)", boxShadow: "0 0 10px #00F5FF", animation: "scan 4s linear infinite" },

  infoSection: { textAlign: "left" },
  brandTag: { color: "#00F5FF", fontSize: "0.7rem", letterSpacing: "3px" },
  productName: { fontSize: "3rem", fontWeight: "800", margin: "10px 0", letterSpacing: "-1px" },
  priceTag: { fontSize: "1.5rem", color: "#fff", borderLeft: "4px solid #00F5FF", paddingLeft: "15px", margin: "20px 0" },
  
  sectionLabel: { fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", marginBottom: "15px" },
  descriptionText: { fontSize: "0.9rem", lineHeight: "1.7", color: "rgba(255,255,255,0.7)", marginBottom: "40px" },
  
  sizeGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "40px" },
  sizeBtn: { padding: "12px", border: "1px solid", background: "transparent", cursor: "pointer", fontSize: "0.8rem", transition: "0.3s" },
  
  actionRow: { display: "flex", gap: "20px", alignItems: "flex-end" },
  qtyInput: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px", width: "80px", outline: "none", fontSize: "1rem" },
  addBtn: { flex: 1, padding: "18px", background: "#00F5FF", color: "#000", border: "none", fontWeight: "900", letterSpacing: "2px", cursor: "pointer" },

  customAlert: { position: "fixed", top: "20px", left: "50%", width: "300px", background: "#0a0a0a", border: "1px solid", padding: "15px", zIndex: 2000 },
  alertMsg: { color: "#fff", fontSize: "0.75rem", textAlign: "center", letterSpacing: "1px" },
  alertProgress: { position: "absolute", bottom: 0, left: 0, height: "2px", width: "100%", animation: "shrink 4s linear forwards" }
};

export default ProductDetails;