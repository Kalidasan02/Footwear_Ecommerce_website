import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function ProductCard({ product }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      style={styles.cardContainer}
    >
      {/* Top Accent Line */}
      <div style={styles.topAccent}></div>

      {/* IMAGE SECTION */}
      <div style={styles.imageWrapper}>
        {product.images && product.images.length > 0 ? (
          <motion.img
            whileHover={{ scale: 1.1, rotate: -2 }}
            src={product.images[0].image}
            style={styles.productImg}
            alt={product.name}
          />
        ) : (
          <div style={styles.noImage}>
            <span style={styles.noImageText}>NO_DATA_LINK</span>
          </div>
        )}
        
        {/* Price Tag Overlay */}
        <div style={styles.priceOverlay}>
          <span style={styles.currency}>₹</span>{product.price}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div style={styles.cardBody}>
        <div style={styles.brandRow}>
          <span style={styles.brandText}>{product.brand?.toUpperCase()}</span>
          <span style={styles.categoryTag}>{product.category}</span>
        </div>
        
        <h5 style={styles.productName}>{product.name}</h5>

        {/* Technical Progress Bar (Aesthetic Only) */}
        <div style={styles.techBar}>
          <div style={styles.techProgress}></div>
        </div>

        <Link to={`/products/${product.id}`} style={styles.detailsBtn}>
          <span style={styles.btnText}>INITIALIZE_VIEW</span>
          <div style={styles.btnGlow}></div>
        </Link>
      </div>

      {/* Corner Decor */}
      <div style={styles.cornerTR}></div>
      <div style={styles.cornerBL}></div>
    </motion.div>
  );
}

const styles = {
  cardContainer: {
    background: "rgba(15, 15, 15, 0.7)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Space Grotesk', sans-serif",
    transition: "all 0.4s ease",
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
  },
  topAccent: {
    height: "2px",
    width: "100%",
    background: "linear-gradient(90deg, #00F5FF, transparent)",
  },
  imageWrapper: {
    height: "280px",
    width: "100%",
    overflow: "hidden",
    position: "relative",
    background: "radial-gradient(circle, rgba(0, 245, 255, 0.05) 0%, transparent 70%)",
  },
  productImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain", // Footwear looks better contained vs cropped
    padding: "20px",
    transition: "0.5s ease",
  },
  noImage: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.02)",
  },
  noImageText: {
    color: "rgba(255,255,255,0.2)",
    fontSize: "0.7rem",
    letterSpacing: "2px",
  },
  priceOverlay: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    background: "rgba(0, 245, 255, 0.9)",
    color: "#000",
    padding: "4px 12px",
    fontWeight: "800",
    fontSize: "0.9rem",
    clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)", // Angled futuristic shape
  },
  currency: { fontSize: "0.7rem", marginRight: "2px" },
  cardBody: {
    padding: "20px",
    textAlign: "left",
  },
  brandRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  brandText: {
    color: "#00F5FF",
    fontSize: "0.6rem",
    letterSpacing: "2px",
    fontWeight: "bold",
  },
  categoryTag: {
    color: "rgba(255,255,255,0.3)",
    fontSize: "0.55rem",
    letterSpacing: "1px",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "2px 6px",
  },
  productName: {
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: "0 0 15px 0",
    letterSpacing: "0.5px",
  },
  techBar: {
    height: "2px",
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    marginBottom: "20px",
  },
  techProgress: {
    width: "40%",
    height: "100%",
    background: "#00F5FF",
    boxShadow: "0 0 5px #00F5FF",
  },
  detailsBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "12px",
    position: "relative",
    overflow: "hidden",
    transition: "0.3s",
  },
  btnText: {
    color: "#fff",
    fontSize: "0.65rem",
    fontWeight: "bold",
    letterSpacing: "2px",
    zIndex: 1,
  },
  // Corner accents for that industrial look
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "10px",
    height: "10px",
    borderTop: "2px solid #00F5FF",
    borderRight: "2px solid #00F5FF",
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "10px",
    height: "10px",
    borderBottom: "2px solid #00F5FF",
    borderLeft: "2px solid #00F5FF",
  }
};

export default ProductCard;