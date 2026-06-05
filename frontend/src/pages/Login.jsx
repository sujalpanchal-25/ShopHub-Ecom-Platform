import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        alert("Login Successful 🚀");
        window.location.href = "/";
      } else {
        alert(data.detail || "Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0f1c] px-4 sm:px-6 overflow-hidden font-sans">
      
      {/* --- Ambient Futuristic Background Glows --- */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0a0f1c]/80 to-[#0a0f1c] z-0 pointer-events-none"></div>

      {/* --- Glassmorphic Login Card --- */}
      <div className="relative z-10 w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_0_50px_rgba(79,70,229,0.1)]">
        
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tighter hover:scale-105 transition-transform duration-300">
              ShopHub
            </h1>
          </Link>
          <p className="text-slate-400 mt-3 font-medium tracking-wide">
            Authenticate to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-semibold tracking-wide ml-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-semibold tracking-wide ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
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
              "Initialize Session 🚀"
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Unregistered identity?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;