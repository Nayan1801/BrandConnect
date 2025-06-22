import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(form);
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      navigate("/connect-fb");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 overflow-hidden">
      <div
        className="bg-white p-8 rounded-xl shadow-2xl w-96 transform transition-all duration-500 hover:-rotate-2 hover:scale-105 animate-float"
        style={{
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Login to Your Account</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            type="email"
            required
          />
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            type="password"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          New to MyApp?{" "}
          <Link to="/register" className="text-blue-700 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Custom animation class for floating */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
