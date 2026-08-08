import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("admin_token", data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-[#8b0000] mb-6">Admin Login</h2>
          
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Admin ID</label>
              <input
                type="text"
                value={id}
                onChange={e => setId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#8b0000] text-white font-bold py-2 rounded hover:bg-red-800 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
