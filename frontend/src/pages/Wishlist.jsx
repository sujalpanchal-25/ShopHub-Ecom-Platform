import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // FIX 1: Added missing Link import
import { useCart } from "../context/CartContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Wishlist() {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();

  const fetchWishlist = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/wishlist/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${BASE_URL}/api/wishlist/remove/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: productId,
          }),
        }
      );

      await response.json();
      fetchWishlist();
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${BASE_URL}/api/Cart/add/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: item.product,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        addToCart({
          id: item.product,
          name: item.product_name,
          image: item.product_image,
          price: item.product_price,
        });

        await handleRemove(item.product);
        alert("Asset successfully moved to cart");
      } else {
        alert(data.error || data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-[0%] right-[0%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-500/50 blur-lg rounded-full"></div>
              <svg className="w-10 h-10 text-pink-400 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Saved Assets
            </h1>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold w-max"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Command Center
          </Link>
        </div>
        {/* FIX 2: Removed the stray </div> that was right here */}

        {items.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-16 text-center flex flex-col items-center shadow-lg">
             <svg className="w-20 h-20 text-slate-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
              No Data Found
            </h2>
            <p className="text-slate-400 text-lg">Your watchlist is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(236,72,153,0.15)] flex flex-col h-full overflow-hidden"
              >
                {/* Background Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Image Box */}
                <div className="relative w-full aspect-square bg-black/40 rounded-[1.5rem] overflow-hidden mb-5 border border-white/5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/10 to-transparent"></div>
                  <img
                    src={`${BASE_URL}${item.product_image}`}
                    alt={item.product_name}
                    className="w-full h-full object-contain p-6 relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-[800ms] ease-out"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow px-2 relative z-10">
                  <h2 className="text-xl font-bold text-white tracking-wide truncate">
                    {item.product_name}
                  </h2>

                  <div className="mt-4 mb-5 flex items-end gap-1">
                    <span className="text-sm font-bold text-emerald-500/80 mb-1">₹</span>
                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500 leading-none">
                      {item.product_price}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-[2] flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold tracking-wide active:scale-[0.97] transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      Move to Cart
                    </button>

                    <button
                      onClick={() => handleRemove(item.product)}
                      className="flex-1 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 py-3 rounded-xl transition-all duration-300 active:scale-[0.97]"
                      title="Remove"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;