import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/orders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Failed to fetch orders or invalid format:", data);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const handleDelete = async (orderId) => {
    const token = localStorage.getItem("access_token");

    const confirmDelete = window.confirm("Delete this order record?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/orders/delete/${orderId}/`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_id: orderId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Order log erased.");
        fetchOrders();
      } else {
        alert(data.error || "Failed to erase order log.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] py-12 relative overflow-hidden font-sans px-4 sm:px-6">
      
      {/* Background Ambience */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-12 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-4">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            Order Logs
          </h1>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold w-max"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Command Center
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-16 rounded-[2rem] text-center shadow-lg flex flex-col items-center">
            <svg className="w-20 h-20 text-slate-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <h2 className="text-2xl font-bold text-white tracking-wide mb-2">No Records Found</h2>
            <p className="text-slate-400 mb-8">You haven't initiated any deployments yet.</p>
            <Link
              to="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
            >
              Browse Network
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-lg transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
              >
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-6">
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-black text-white tracking-tight">
                        ID: #{order.id}
                      </h2>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {order.status}
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {new Date(order.created_at).toLocaleString()}
                    </p>

                    <div className="flex items-end gap-1">
                      <span className="text-emerald-500 text-sm font-bold mb-1">₹</span>
                      <p className="text-emerald-400 font-black text-3xl leading-none">
                        {order.total_amount}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex justify-end">
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      Erase Record
                    </button>
                  </div>
                </div>

                {order.items?.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider mb-4">
                      Manifest Assets
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-white/5 border border-white/5 rounded-xl p-4"
                        >
                          <span className="text-white font-medium truncate pr-4">
                            {item.product_name}
                          </span>
                          <span className="bg-white/10 text-slate-300 px-3 py-1 rounded-full text-xs font-bold shrink-0">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;