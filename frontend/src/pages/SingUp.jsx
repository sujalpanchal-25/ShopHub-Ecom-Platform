import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
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
      const response = await fetch(`${BASE_URL}/api/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account Created Successfully 🚀");
        navigate("/login");
      } else {
        console.log(data);
        if (data.username) {
          alert(data.username[0]);
        } else if (data.email) {
          alert(data.email[0]);
        } else if (data.non_field_errors) {
          alert(data.non_field_errors[0]);
        } else {
          alert("Registration Failed");
        }
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0f1c] px-4 sm:px-6 overflow-hidden font-sans py-12">
      
      {/* --- Ambient Futuristic Background Glows --- */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[0%] left-[-10%] w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0a0f1c]/80 to-[#0a0f1c] z-0 pointer-events-none"></div>

      {/* --- Glassmorphic Register Card --- */}
      <div className="relative z-10 w-full max-w-lg bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_0_50px_rgba(236,72,153,0.1)]">
        
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 tracking-tighter hover:scale-105 transition-transform duration-300">
              ShopHub
            </h1>
          </Link>
          <p className="text-slate-400 mt-3 font-medium tracking-wide">
            Establish your identity
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
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
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
              placeholder="Choose a username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-semibold tracking-wide ml-1">
              Email Network
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
              placeholder="name@domain.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-semibold tracking-wide ml-1">
                Confirm
              </label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-500 active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
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
              "Initialize Account 🚀"
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Already established?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;