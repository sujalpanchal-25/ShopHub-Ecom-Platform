import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function CartPage() {
  const {
    cartItems,
    totalPrice,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const tax = Math.floor(totalPrice * 0.05);
  const finalTotal = totalPrice + tax;

  return (
    <div className="min-h-screen bg-[#0a0f1c] pt-28 pb-12 relative overflow-hidden font-sans">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/20 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-purple-600/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-10 border-b border-white/10 pb-4 sm:pb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3 sm:gap-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            Active Cart
          </h1>
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-300 font-semibold"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Command Center
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] p-8 sm:p-12 lg:p-20 text-center flex flex-col items-center">
            <svg className="w-20 h-20 sm:w-24 sm:h-24 text-slate-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white">Your Cart is Empty</h2>
            <p className="text-slate-400 mb-6 sm:mb-8 max-w-md text-base sm:text-lg">
              Looks like your sector is clear. Discover our premium gear and add items to your loadout.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full sm:w-auto gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              Initialize Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">

            {/* --- Cart Items List --- */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {cartItems.map((item) => {
                const maxStock = item.product_stock !== undefined ? item.product_stock : 1;
                const isMaxReached = item.quantity >= maxStock;

                return (
                  <div
                    key={item.id}
                    className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start transition-all duration-300 hover:bg-white/[0.04]"
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-32 md:w-40 h-48 sm:h-40 bg-black/40 rounded-xl sm:rounded-2xl overflow-hidden flex justify-center items-center shrink-0 border border-white/5 relative">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 to-transparent"></div>
                      <img
                        src={`${BASE_URL}${item.product_image}`}
                        alt={item.Product_name}
                        className="w-full h-full object-contain p-4 relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 w-full flex flex-col justify-between text-left">
                      <div>
                        {/* FIX: Using line-clamp-2 instead of truncate so long names wrap nicely */}
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide line-clamp-2 leading-snug">
                          {item.Product_name}
                        </h2>
                        <p className="text-indigo-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-1">
                          Classified Asset
                        </p>
                        
                        <div className="flex items-end justify-start gap-1 mt-2 sm:mt-3">
                          <span className="text-xs sm:text-sm font-medium text-emerald-500 mb-0.5">₹</span>
                          <h3 className="text-emerald-400 text-xl sm:text-2xl font-black leading-none">
                            {item.product_price}
                          </h3>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1">
                          Subtotal: ₹{Number(item.product_price) * item.quantity}
                        </p>
                      </div>

                      {/* Controls & Remove */}
                      <div className="flex flex-row items-end justify-between gap-4 mt-5 sm:mt-6 w-full">
                        
                        {/* Quantity Toggles & Stock Status */}
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                            </button>
                            
                            <span className="w-6 sm:w-8 text-center font-bold text-white text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => !isMaxReached && increaseQuantity(item.id)}
                              disabled={isMaxReached}
                              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-all ${
                                isMaxReached 
                                  ? 'text-slate-600 cursor-not-allowed bg-white/5' 
                                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            </button>
                          </div>
                          
                          {/* Visual Stock Indicator - Left Aligned */}
                          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-1 pl-1">
                            {isMaxReached ? (
                              <span className="text-red-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span> 
                                Max Reached
                              </span>
                            ) : (
                              <span className="text-emerald-400 flex items-center gap-1.5 opacity-80">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 
                                {maxStock} in Sector
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-red-400 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-red-500/10 transition-colors h-10 sm:h-12 border border-white/5"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- Order Summary (Sticky) --- */}
            <div className="lg:sticky top-20 sm:top-28 mt-4 sm:mt-0">
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] p-6 sm:p-8 relative overflow-hidden">
                
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-indigo-500/10 rounded-bl-[80px] sm:rounded-bl-[100px] pointer-events-none"></div>

                <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-white tracking-wide">
                  Order Summary
                </h2>

                <div className="space-y-3 sm:space-y-4 font-medium text-slate-300 text-sm sm:text-base">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Items</span>
                    <span className="text-white bg-white/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">{cartItems.length}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Shipping</span>
                    <span className="text-emerald-400 flex items-center gap-1 text-xs sm:text-sm">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Complimentary
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Encrypted Tax (5%)</span>
                    <span>₹{tax}</span>
                  </div>

                  <div className="h-px w-full bg-white/10 my-4 sm:my-6"></div>

                  <div className="flex justify-between items-end">
                    <span className="text-base sm:text-lg text-slate-400">Total</span>
                    <div className="text-right">
                      <span className="text-xs sm:text-sm text-emerald-500 font-bold mr-1">₹</span>
                      <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500 leading-none tracking-tighter">
                        {finalTotal}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="mt-8 sm:mt-10 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] active:scale-[0.98]"
                >
                  Proceed To Checkout
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>

                <p className="flex items-center justify-center gap-1.5 sm:gap-2 text-slate-500 mt-5 sm:mt-6 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  256-Bit Encrypted Checkout
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;