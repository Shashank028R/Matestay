import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosInstance";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("matestay_token");

    if (token) {
      // If a token exists, always refresh user data from the server.
      refreshUser().finally(() => setLoading(false));
    } else {
      // No token, definitely logged out.
      setLoading(false);
    }
  }, []); // Runs once on app load

  const login = (userData, token) => {
    localStorage.setItem("matestay_user", JSON.stringify(userData));
    localStorage.setItem("matestay_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("matestay_user");
    localStorage.removeItem("matestay_token");
    setUser(null);
    // Optionally redirect to home or login page after logout
    // window.location.href = '/'; // Simple redirect
  };

  const refreshUser = async () => {
    try {
      const { data } = await axios.get("/user/profile");
      // Store fresh data
      localStorage.setItem("matestay_user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      console.error("AuthContext refreshUser failed:", err);
      // If refresh fails (bad token), log out
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};