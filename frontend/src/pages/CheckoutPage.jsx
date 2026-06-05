import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function CheckoutPage() {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    payment_method: "COD",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please Login First");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${BASE_URL}/api/orders/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        clearCart();
        alert(`Order Placed Successfully 🎉\nOrder ID: ${data.order_id}`);
        navigate("/");
      } else {
        alert(data.error || data.detail || "Order Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-5 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
          <h1 className="text-4xl font-extrabold mb-10 text-center text-slate-900 tracking-tight">
            Secure Checkout
          </h1>

          <form onSubmit={placeOrder} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-slate-200 focus:border-indigo-500 p-3 outline-none text-lg transition-colors peer bg-transparent pt-6"
                  placeholder=" "
                />
                <label htmlFor="name" className="absolute left-3 top-1 text-slate-500 text-sm font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:top-1 peer-focus:text-indigo-600 peer-focus:text-sm">
                  Full Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-slate-200 focus:border-indigo-500 p-3 outline-none text-lg transition-colors peer bg-transparent pt-6"
                  placeholder=" "
                />
                <label htmlFor="phone" className="absolute left-3 top-1 text-slate-500 text-sm font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:top-1 peer-focus:text-indigo-600 peer-focus:text-sm">
                  Phone Number
                </label>
              </div>
            </div>

            <div className="relative">
              <textarea
                rows="3"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border-b-2 border-slate-200 focus:border-indigo-500 p-3 outline-none text-lg transition-colors peer bg-transparent pt-6 resize-none"
                placeholder=" "
              />
              <label htmlFor="address" className="absolute left-3 top-1 text-slate-500 text-sm font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:top-1 peer-focus:text-indigo-600 peer-focus:text-sm">
                Shipping Address
              </label>
            </div>

            <div>
              <label htmlFor="payment_method" className="block text-sm font-medium text-slate-600 mb-2">
                Payment Method
              </label>
              <div className="relative">
                <select
                  name="payment_method"
                  id="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="w-full appearance-none border border-slate-200 rounded-xl p-4 text-lg bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition"
                >
                  <option value="COD">Cash On Delivery (COD)</option>
                  <option value="online">Online Payment</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white font-bold text-lg bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Place Order
                  <span className="text-xl">🚀</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;