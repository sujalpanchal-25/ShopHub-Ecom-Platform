import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchProducts = async (categoryId = null) => {
    let url = `${BASE_URL}/api/product/`;
    if (categoryId) {
      url += `?category=${categoryId}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetch(`${BASE_URL}/api/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!search.trim()) {
        setSuggestions([]);
        return;
      }
      fetch(`${BASE_URL}/api/search/?search=${search}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setSuggestions(data.slice(0, 5));
        })
        .catch((err) => console.log(err));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === "all") {
      fetchProducts();
    } else {
      fetchProducts(categoryId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] font-sans pb-24">
      
      {/* --- Ultra-Compact Futuristic Header --- */}
      <div className="relative bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/15 via-transparent to-transparent border-b border-white/5 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          
          {/* Left: Compact Title & Status */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                System Online · Live Inventory
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Sectors</span>
            </h1>
          </div>

          {/* Right: Slim Trust Badges */}
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> 
              Fast Dispatch
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> 
              Encrypted
            </span>
          </div>
          
        </div>
      </div>

      {/* --- Glassmorphic Category Scroller (Tight Spacing) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar items-center">
          
          <button
            onClick={() => handleCategoryClick("all")}
            className={`
              shrink-0 px-5 py-2 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 backdrop-blur-md border
              ${
                activeCategory === "all"
                  ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                  : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            All Hardware
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                shrink-0 px-5 py-2 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 backdrop-blur-md border
                ${
                  activeCategory === category.id
                    ? "bg-purple-600/20 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    : "bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* --- Product Grid --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {products.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20">
            <svg className="w-16 h-16 text-slate-700 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            <p className="text-lg font-semibold text-slate-500 tracking-wide">No inventory detected.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;