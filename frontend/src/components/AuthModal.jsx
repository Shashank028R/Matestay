// src/components/AuthModal.jsx
import React, { useContext, useState } from "react";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthModal({ onClose }) {
  const { login } = useContext(AuthContext);
  const [tab, setTab] = useState("login"); // "login" or "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      alert(data.message || "Verification email sent. Check your inbox.");
      setTab("login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      // data: { token, user }
      login(data.user, data.token);
      onClose?.();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-2xl shadow-xl w-96 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{tab === "login" ? "Login" : "Sign Up"}</h3>
          <button className="text-sm text-muted-foreground" onClick={() => onClose?.()}>
            ✖
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 py-2 rounded ${tab === "login" ? "bg-primary/90 text-white" : "bg-transparent"}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded ${tab === "signup" ? "bg-primary/90 text-white" : "bg-transparent"}`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {tab === "signup" ? (
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <Input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
            <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <Button type="submit" className="mt-2" disabled={loading}>
              {loading ? "Signing up..." : "Create account"}
            </Button>
            <p className="text-xs text-muted-foreground">
              After sign up you will receive a verification email — you must verify your email before logging in.
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <Button type="submit" className="mt-2" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-xs text-muted-foreground">If you haven't verified your email you'll be asked to verify first.</p>
          </form>
        )}
      </div>
    </div>
  );
}
