import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-green-600 font-semibold" : "text-gray-600 hover:text-green-600";
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-green-700">
              Swachh Dashboard
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.role === "admin" && (
                  <>
                    <Link to="/admin-dashboard" className={isActive("/admin-dashboard")}>
                      Admin Dashboard
                    </Link>
                    <Link to="/stats" className={isActive("/stats")}>
                      Statistics
                    </Link>
                  </>
                )}
                
                {user.role === "worker" && (
                  <Link to="/worker-dashboard" className={isActive("/worker-dashboard")}>
                    Worker Dashboard
                  </Link>
                )}
                
                {user.role === "user" && (
                  <>
                    <Link to="/dashboard" className={isActive("/dashboard")}>
                      Dashboard
                    </Link>
                    <Link to="/report-trash" className={isActive("/report-trash")}>
                      Report Trash
                    </Link>
                    <Link to="/my-reports" className={isActive("/my-reports")}>
                      My Reports
                    </Link>
                    <Link to="/volunteer" className={isActive("/volunteer")}>
                      Volunteer
                    </Link>
                    <Link to="/my-volunteer-tasks" className={isActive("/my-volunteer-tasks")}>
                      My Tasks
                    </Link>
                    <Link to="/reviews" className={isActive("/reviews")}>
                      Reviews
                    </Link>
                  </>
                )}
                
                <button
                  onClick={handleLogout}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className={isActive("/")}>
                  Home
                </Link>
                <Link to="/login" className={isActive("/login")}>
                  Login
                </Link>
                <Link to="/register" className={isActive("/register")}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-green-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            {user ? (
              <div className="flex flex-col space-y-2">
                {user.role === "admin" && (
                  <>
                    <Link
                      to="/admin-dashboard"
                      className={isActive("/admin-dashboard")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/stats"
                      className={isActive("/stats")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Statistics
                    </Link>
                  </>
                )}
                
                {user.role === "worker" && (
                  <Link
                    to="/worker-dashboard"
                    className={isActive("/worker-dashboard")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Worker Dashboard
                  </Link>
                )}
                
                {user.role === "user" && (
                  <>
                    <Link
                      to="/dashboard"
                      className={isActive("/dashboard")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/report-trash"
                      className={isActive("/report-trash")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Report Trash
                    </Link>
                    <Link
                      to="/my-reports"
                      className={isActive("/my-reports")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Reports
                    </Link>
                    <Link
                      to="/volunteer"
                      className={isActive("/volunteer")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Volunteer
                    </Link>
                    <Link
                      to="/my-volunteer-tasks"
                      className={isActive("/my-volunteer-tasks")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Tasks
                    </Link>
                    <Link
                      to="/reviews"
                      className={isActive("/reviews")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Reviews
                    </Link>
                  </>
                )}
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className={isActive("/")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className={isActive("/login")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={isActive("/register")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 