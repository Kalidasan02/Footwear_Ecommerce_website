import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("products/");
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    let data = [...products];
    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (brandFilter) {
      data = data.filter((p) => p.brand === brandFilter);
    }
    if (categoryFilter) {
      data = data.filter((p) => p.category === categoryFilter);
    }
    setFiltered(data);
  }, [search, brandFilter, categoryFilter, products]);

  const brands = [...new Set(products.map((p) => p.brand))];
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div style={styles.pageWrapper}>
      {/* BACKGROUND DECOR */}
      <div style={styles.gridOverlay}></div>

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.titleArea}>
            <h2 style={styles.mainTitle}>ARCHIVE_COLLECTION</h2>
            <p style={styles.subtitle}>
              DISPLAYING {filtered.length} AVAILABLE_UNITS
            </p>
          </div>
          
          {/* SEARCH & FILTER HUD */}
          <div style={styles.filterBar}>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>SEARCH_QUERY</label>
              <input
                type="text"
                style={styles.futuristicInput}
                placeholder="Find footwear..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}>BRAND_FILTER</label>
              <select
                style={styles.futuristicSelect}
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                <option value="">ALL_BRANDS</option>
                {brands.map((brand, index) => (
                  <option key={index} value={brand}>{brand?.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}>CATEGORY_FILTER</label>
              <select
                style={styles.futuristicSelect}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">ALL_CATEGORIES</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category?.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* PRODUCTS GRID */}
        <div style={styles.productGrid}>
          <AnimatePresence>
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div style={styles.noResults}>
                <p>CRITICAL_ERROR: NO_MATCHING_UNITS_FOUND</p>
              </div>
            )}
          </AnimatePresence>
        </div>
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
    position: "relative",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  gridOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `radial-gradient(rgba(0, 245, 255, 0.05) 1px, transparent 0)`,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  container: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "0 40px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    marginBottom: "60px",
  },
  titleArea: {
    marginBottom: "40px",
    textAlign: "left",
  },
  mainTitle: {
    color: "#fff",
    fontSize: "2.5rem",
    fontWeight: "800",
    letterSpacing: "8px",
    margin: 0,
  },
  subtitle: {
    color: "#00F5FF",
    fontSize: "0.7rem",
    letterSpacing: "4px",
    marginTop: "10px",
  },
  filterBar: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    background: "rgba(255, 255, 255, 0.03)",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: "0.55rem",
    letterSpacing: "2px",
  },
  futuristicInput: {
    background: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    padding: "12px",
    fontSize: "0.85rem",
    outline: "none",
    borderRadius: "2px",
    transition: "0.3s border-color",
  },
  futuristicSelect: {
    background: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#fff",
    padding: "12px",
    fontSize: "0.85rem",
    outline: "none",
    borderRadius: "2px",
    cursor: "pointer",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "30px",
  },
  noResults: {
    gridColumn: "1 / -1",
    padding: "100px 0",
    textAlign: "center",
    color: "#FF0055",
    letterSpacing: "3px",
    fontSize: "0.8rem",
  }
};

export default Products;