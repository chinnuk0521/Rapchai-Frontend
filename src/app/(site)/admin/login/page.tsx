"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth-hydration-safe";

export default function AdminLogin() {
  const [email, setEmail] = useState("chandu.kalluru@outlook.com");
  const [password, setPassword] = useState("Kalluru@145");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      
      if (success) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--rc-creamy-beige)] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--rc-espresso-brown)] mb-2">Admin Login</h1>
          <div className="flex justify-center mb-2">
            <img src="/logo-brown.svg" alt="Logo" className="h-10 w-10" />
          </div>
          <p className="text-[var(--rc-text-secondary)]">Staff Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors"
              placeholder="chandu.kalluru@outlook.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[var(--rc-espresso-brown)] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)]/20 transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold text-lg hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-[var(--rc-creamy-beige)] rounded-xl">
          <p className="text-sm text-[var(--rc-text-secondary)] text-center">
            <strong>Admin Credentials:</strong><br />
            Email: chandu.kalluru@outlook.com<br />
            Password: Kalluru@145
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-[var(--rc-orange)] hover:text-[var(--rc-espresso-brown)] font-semibold"
          >
            ← Back to Customer Site
          </button>
        </div>
      </div>
    </div>
  );
}
