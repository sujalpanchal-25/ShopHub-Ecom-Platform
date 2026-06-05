import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Navbar() {
  const { cartItems } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  
  // State for mobile menu toggle[cite: 19]
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = !!localStorage.getItem("access_token");

  const hideSearchPages = ["/login", "/register", "/checkout"];

  const showSearch = !hideSearchPages.includes(location.pathname);

  const fetchWishlistCount = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/api/wishlist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setWishlistCount(data.items?.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/login");

    window.location.reload();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistCount();
    }
  }, [location]);

  useEffect(() => {
    const updateWishlist = () => {
      fetchWishlistCount();
    };

    window.addEventListener("wishlistUpdated", updateWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlist);
    };
  }, []);

  // Close mobile menu automatically when the route changes[cite: 19]
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!search.trim()) {
        setResults([]);
        return;
      }

      fetch(`${BASE_URL}/api/search/?search=${search}`)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.log(err));
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleProductClick = (productId) => {
    setSearchOpen(false);
    setSearch("");
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-[#0a0f1c]/80 backdrop-blur-2xl border-b border-white/5 transition-all duration-300 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            
            {/* --- BRAND LOGO --- */}
            <Link to="/" className="text-2xl sm:text-3xl font-extrabold tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                ShopHub
              </span>
            </Link>

            {/* --- DESKTOP NAVIGATION (Hidden on Mobile) --- */}
            <div className="hidden md:flex items-center gap-6">
              
              {showSearch && (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-slate-300 hover:text-indigo-400 hover:scale-110 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
              )}

              {isAuthenticated && (
                <Link
                  to="/wishlist"
                  className="relative text-slate-300 hover:text-pink-400 hover:scale-110 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full px-[5px] py-[1px] text-[10px] font-bold border-2 border-[#0a0f1c]">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated && (
                <>
                  <Link
                    to="/cart"
                    className="relative text-slate-300 hover:text-indigo-400 hover:scale-110 transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full px-[5px] py-[1px] text-[10px] font-bold border-2 border-[#0a0f1c]">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all duration-300 text-sm font-semibold"
                  >
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    Orders
                  </Link>
                </>
              )}

              <div className="h-6 w-px bg-white/10 mx-2"></div>

              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-300 font-medium text-sm"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)]"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-medium text-sm"
                >
                  Logout
                </button>
              )}
            </div>

            {/* --- MOBILE TOGGLE BUTTON (Hidden on Desktop) --- */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300 hover:text-white focus:outline-none transition-colors"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                )}
              </button>
            </div>
          </div>

          {/* --- MOBILE NAVIGATION DROPDOWN --- */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0f1c]/95 backdrop-blur-3xl border-b border-white/10 px-4 py-6 flex flex-col gap-5 shadow-2xl origin-top animate-in slide-in-from-top-4 duration-300">
              
              {showSearch && (
                <button
                  onClick={() => {
                    setSearchOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-4 text-slate-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <span className="font-medium text-lg">Search Products</span>
                </button>
              )}

              {isAuthenticated && (
                <Link to="/wishlist" className="flex items-center gap-4 text-slate-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="relative">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full px-[5px] py-[1px] text-[10px] font-bold border-2 border-[#0a0f1c]">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-lg">Wishlist</span>
                </Link>
              )}

              {isAuthenticated && (
                <>
                  <Link to="/cart" className="flex items-center gap-4 text-slate-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="relative">
                      <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                      {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full px-[5px] py-[1px] text-[10px] font-bold border-2 border-[#0a0f1c]">
                          {cartItems.length}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-lg">Cart</span>
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center gap-4 text-slate-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    <span className="font-medium text-lg">Orders</span>
                  </Link>
                </>
              )}

              <div className="h-px w-full bg-white/10 my-2"></div>

              {!isAuthenticated ? (
                <div className="flex flex-col gap-3 px-2">
                  <Link
                    to="/login"
                    className="w-full text-center px-4 py-3.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-300 font-semibold"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="w-full text-center px-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full text-center px-4 py-3.5 mx-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-semibold transition-all duration-300"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind the fixed navbar */}
      <div className="h-[72px] bg-[#0a0f1c]"></div>

      {/* --- SEARCH MODAL --- */}
      {searchOpen && showSearch && (
        <div className="fixed inset-0 bg-[#0a0f1c]/90 backdrop-blur-xl z-[999] flex justify-center items-start pt-24 px-4 font-sans animate-in fade-in duration-200">
          <div className="w-full max-w-3xl">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold tracking-tight">Search Catalog</h2>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(79,70,229,0.15)] group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="What are you looking for?"
                autoFocus
                className="w-full pl-14 pr-6 py-5 text-lg bg-transparent text-white placeholder-slate-500 outline-none focus:bg-white/10 transition-colors"
              />
            </div>

            {results.length > 0 && (
              <div className="mt-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl max-h-[60vh] overflow-y-auto">
                {results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleProductClick(item.id)}
                    className="flex items-center gap-5 p-4 border-b border-white/5 cursor-pointer hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-16 h-16 bg-white rounded-xl p-1 shrink-0">
                      <img
                        src={`${BASE_URL}${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200 group-hover:text-indigo-300 transition-colors text-lg">
                        {item.name}
                      </h3>
                      <p className="text-emerald-400 font-semibold tracking-wide">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {search && results.length === 0 && (
              <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center">
                <span className="text-4xl mb-3">🛸</span>
                <p className="text-slate-300 font-medium text-lg">No matching products found in this sector.</p>
              </div>
            )}
            
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;