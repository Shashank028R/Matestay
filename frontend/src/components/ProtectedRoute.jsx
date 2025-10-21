import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom'; // <-- Make sure Outlet is imported
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  // console.log("Standard ProtectedRoute: State - loading:", loading, "user:", user); // Optional logging

  if (loading) {
    // console.log("Standard ProtectedRoute: Loading, showing spinner.");
    return (
      <div className="flex justify-center items-center h-screen pt-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // console.log("Standard ProtectedRoute: No user, redirecting.");
    return <Navigate to="/" replace />;
  }

  // console.log("Standard ProtectedRoute: User found, rendering Outlet.");
  // If user exists, render the child route component via Outlet
  return <Outlet />;
};

export default ProtectedRoute;