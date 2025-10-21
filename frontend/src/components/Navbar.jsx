import React, { useContext, useState } from "react";
import { Moon, Sun, Home, Menu, X, MessageSquare, Building2, PlusCircle } from "lucide-react"; // Removed 'Search' icon import
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import AuthModal from "./AuthModal";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen((s) => !s);

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-1 text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'hover:text-primary'
    }`;

  const getMobileNavLinkClass = ({ isActive }) =>
    `text-lg font-medium w-full text-center p-2 rounded-md ${
      isActive ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent'
    }`;


  return (
    <>
      <nav className="fixed top-4 w-[95%] md:w-[90%] left-1/2 -translate-x-1/2 z-50 bg-background/70 backdrop-blur-sm border border-border rounded-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <img className="cursor-pointer" src="/Logo.png" width={70} alt="Matestay" />
              <span className="text-xl font-bold">Matestay</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* --- UPDATED LINKS (Removed Search) --- */}
              {/* <NavLink to="/search" className={getNavLinkClass}>
                 <Search className="h-4 w-4 mr-1" /> Find Roommates
              </NavLink> */}
              <NavLink to="/properties" className={getNavLinkClass}>
                 <Building2 className="h-4 w-4 mr-1" /> Browse Rooms
              </NavLink>
              <NavLink to="/chat" className={getNavLinkClass}>
                 <MessageSquare className="h-4 w-4 mr-1" /> Messages
              </NavLink>
              {/* --- END UPDATED LINKS --- */}

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Post Listing & Auth Section */}
              {user ? (
                <div className="flex items-center gap-3">
                   <Button
                     size="sm"
                     className="bg-primary/10 text-primary hover:bg-primary/20"
                     onClick={() => navigate('/properties/new')} // We'll create this page next
                   >
                     <PlusCircle className="h-4 w-4 mr-1" /> Post Listing
                   </Button>
                  <img
                    src={user.profilePic || defaultAvatar}
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer object-cover"
                    onClick={() => navigate("/profile")}
                  />
                  <button className="text-sm text-muted-foreground hover:text-red-500" onClick={logout}>Logout</button>
                </div>
              ) : (
                <Button className="cursor-pointer bg-[#5b5dda] text-white hover:bg-[#4a4ab5]" onClick={() => setShowAuth(true)}>Sign In</Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
               <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full mr-2"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button onClick={toggleMenu} variant="ghost" size="icon" className="rounded-full">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-24 z-40 bg-background/95 backdrop-blur-sm p-6">
          <div className="flex flex-col items-center gap-6">
            {/* --- UPDATED MOBILE LINKS (Removed Search) --- */}
            {/* <NavLink to="/search" onClick={toggleMenu} className={getMobileNavLinkClass}>
              Find Roommates
            </NavLink> */}
            <NavLink to="/properties" onClick={toggleMenu} className={getMobileNavLinkClass}>
              Browse Rooms
            </NavLink>
            <NavLink to="/chat" onClick={toggleMenu} className={getMobileNavLinkClass}>
              Messages
            </NavLink>
            {/* --- END UPDATED MOBILE LINKS --- */}

            {/* Mobile Post Listing & Auth */}
            <div className="flex items-center gap-6 mt-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Button
                     size="sm"
                     className="bg-primary/10 text-primary hover:bg-primary/20 mr-2"
                     onClick={() => { toggleMenu(); navigate('/properties/new'); }}
                   >
                     Post Listing
                   </Button>
                  <img src={user.profilePic || defaultAvatar} alt="Profile" className="w-10 h-10 rounded-full" onClick={() => { toggleMenu(); navigate("/profile"); }} />
                  <button className="px-6 py-2 bg-[#5b5dda] text-white rounded" onClick={() => { logout(); toggleMenu(); }}>Logout</button>
                </div>
              ) : (
                <Button className="cursor-pointer bg-[#5b5dda] text-white px-8 py-2" onClick={() => { setShowAuth(true); toggleMenu(); }}>Sign In</Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};
export default Navbar;