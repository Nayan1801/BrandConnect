import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Register page rendered");
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API call can be added here using Axios (example: await API.post("/auth/register", form);)
    console.log("Form submitted", form);
    const res = await register(form);
    if (res.ok) {
        navigate("/");
        alert("Registered successfully (dummy)!");
    } 
    else {
        alert("Registration failed");
    }    
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 overflow-hidden">
      <div
        className="bg-white p-8 rounded-xl shadow-2xl w-96 transform transition-all duration-500 hover:rotate-1 hover:scale-105 animate-float"
        style={{
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              className="mr-2 accent-blue-700"
            />
            Remember Me
          </label>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-700 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>

      {/* Custom animation */}
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
