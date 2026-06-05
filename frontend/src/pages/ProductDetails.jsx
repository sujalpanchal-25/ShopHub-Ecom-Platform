import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/product/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const handleWishlist = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/wishlist/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.dispatchEvent(new Event("wishlistUpdated"));
        alert(data.message || "Added To Wishlist");
      } else {
        alert(data.error || data.detail || "Failed To Add Wishlist");
      }
    } catch (error) {
      console.log(error);
      alert("Something Went Wrong");
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/Cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addToCart(product);
        alert(data.message || "Product Added To Cart");
      } else {
        alert(data.error || data.detail);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0a0f1c]">
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex justify-center items-center w-20 h-20">
            <div className="absolute animate-ping w-full h-full rounded-full border-2 border-indigo-500/50"></div>
            <div className="relative w-10 h-10 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.8)]"></div>
          </div>
          <p className="text-indigo-400 font-bold tracking-widest uppercase text-sm animate-pulse">Establishing Link...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0a0f1c]">
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Signal Lost (404)</h1>
        <button 
          onClick={() => navigate('/')} 
          className="text-slate-400 hover:text-indigo-400 transition-colors font-medium underline underline-offset-8"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  // BUG FIX: Using product.stocks (with an 's') exactly as it is named in your Django models.py
  const availableStocks = product.stocks !== undefined && product.stocks !== null ? product.stocks : 0;
  const isOutOfStock = availableStocks <= 0;

  return (
    <div className="bg-[#0a0f1c] min-h-screen py-8 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl w-full mx-auto relative z-10">
        
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row">
          
          {/* --- Image Showcase Area --- */}
          <div className="w-full lg:w-1/2 p-4 sm:p-8">
            <div className="w-full h-[400px] sm:h-[500px] lg:h-full bg-black/40 rounded-[2rem] flex items-center justify-center p-8 relative overflow-hidden border border-white/5">
              
              {/* Image Core Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-70"></div>
              
              <button
                onClick={handleWishlist}
                className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full flex items-center justify-center text-slate-300 hover:scale-110 hover:text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/50 transition-all duration-300"
                title="Add to Wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>

              <img
                src={product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`}
                alt={product.name}
                className={`w-full h-full max-h-[350px] lg:max-h-[500px] object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isOutOfStock ? 'opacity-50 grayscale' : 'hover:scale-105'}`}
              />
            </div>
          </div>

          {/* --- Content Details Area --- */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            
            <div className="mb-6 flex items-center gap-3">
              <span className="w-10 h-1 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,1)]"></span>
              <span className="text-indigo-400 text-xs font-bold uppercase tracking-[0.3em]">
                Classified Asset
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter leading-[1.1] mb-6">
              {product.name}
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed font-light mb-10 max-w-lg">
              {product.description}
            </p>

            <div className="mb-8">
              <h2 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500 tracking-tighter">
                ₹{product.price}
              </h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">Credits · Taxes Included</p>
            </div>

            {/* --- Stock Status Display --- */}
            <div className="mb-10 flex items-center">
              {!isOutOfStock ? (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                  {availableStocks} Units in Sector
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                  Asset Depleted (Out of Stock)
                </span>
              )}
            </div>

            {/* --- Premium Action Buttons --- */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 px-8 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 border ${
                  !isOutOfStock
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] border-indigo-400/50 active:scale-[0.98]"
                    : "bg-slate-800/50 text-slate-500 border-slate-700/50 cursor-not-allowed"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Instant Buy
              </button>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 px-8 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 border ${
                  !isOutOfStock
                    ? "bg-white/5 hover:bg-white/10 hover:border-white/20 text-white border-white/10 active:scale-[0.98]"
                    : "bg-transparent text-slate-600 border-slate-800 cursor-not-allowed"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Add To Cart
              </button>

            </div>

            {/* --- Tech Trust Badges --- */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white tracking-wide">Encrypted Gateway</span>
                  <span className="text-xs text-slate-400 font-medium">100% secure checkout</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;