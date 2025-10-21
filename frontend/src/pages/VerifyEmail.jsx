// src/pages/VerifyEmail.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`/auth/verify/${token}`);
        alert(data.message || "Email verified successfully");
        // After verification, redirect to login/profile setup page
        navigate("/profile");
      } catch (err) {
        alert(err.response?.data?.message || "Invalid or expired token");
        navigate("/");
      }
    };
    if (token) verify();
  }, [token, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-muted-foreground">Verifying your email — please wait...</p>
      </div>
    </div>
  );
}
