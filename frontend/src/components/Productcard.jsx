import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please Login First");
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
      console.error(error);
      alert("Something Went Wrong");
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Please Login First");
        return;
      }

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
        alert(data.detail || data.error || "Failed To Add Product");
      }
    } catch (error) {
      console.error(error);
      alert("Something Went Wrong");
    }
  };

  return (
    <div className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(79,70,229,0.15)] flex flex-col h-full overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* --- Image & Wishlist Container --- */}
      <div className="relative w-full aspect-square bg-white/5 rounded-[1.5rem] overflow-hidden mb-5">
        
        {/* Wishlist SVG Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-[#0a0f1c]/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-pink-500 hover:scale-110 hover:border-pink-500/50 transition-all duration-300 shadow-lg"
          title="Add to Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        <Link to={`/product/${product.id}`} className="block w-full h-full p-6">
          <img
            src={`${BASE_URL}${product.image}`}
            alt={product.name}
            className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-[800ms] ease-out relative z-10"
          />
        </Link>
      </div>

      {/* --- Product Details --- */}
      <div className="flex flex-col flex-grow px-2 relative z-10">
        <Link to={`/product/${product.id}`}>
          <h2 className="text-xl font-bold text-white tracking-wide truncate hover:text-indigo-400 transition-colors">
            {product.name}
          </h2>
        </Link>
        
        <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed flex-grow">
          {product.description}
        </p>

        <div className="mt-5 mb-5 flex items-end gap-1">
          <span className="text-sm text-emerald-500/80 font-bold mb-1">₹</span>
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500 tracking-tighter leading-none">
            {product.price}
          </h3>
        </div>

        {/* --- Action Buttons --- */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={handleAddToCart}
            className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl text-sm font-bold tracking-wider active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Add
          </button>

          <Link
            to={`/product/${product.id}`}
            className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3.5 rounded-2xl text-sm font-bold tracking-wider active:scale-[0.97] transition-all duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;