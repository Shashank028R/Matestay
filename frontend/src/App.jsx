import React from 'react'; // Import React if not already imported globally
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
// import SearchResults from "./pages/SearchResults"; // Roommate search removed from nav
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import CreatePropertyPage from "./pages/CreatePropertyPage";
import MyListingsPage from "./pages/MyListingsPage"; // <-- Page for user's listings
import EditPropertyPage from "./pages/EditPropertyPage"; // <-- Page for editing listing
import ChatPage from "./pages/ChatPage";
import FloatingChatButton from "./components/FloatingChatButton";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isOnChatPage = location.pathname.startsWith('/chat');

  return (
    <>
      <Navbar />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />

        {/* --- Protected Routes --- */}
        {/* Use ProtectedRoute as the PARENT element */}
        <Route element={<ProtectedRoute />}>
          {/* These routes are now CHILDREN of ProtectedRoute */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:conversationId" element={<ChatPage />} />
          <Route path="/properties/new" element={<CreatePropertyPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/properties/edit/:id" element={<EditPropertyPage />} />
        </Route>

      </Routes>
      {/* Show FloatingChatButton ONLY IF logged in AND NOT on chat page */}
      {user && !isOnChatPage && <FloatingChatButton />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <AppContent />
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;