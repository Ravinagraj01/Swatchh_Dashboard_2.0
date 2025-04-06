// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { ResponsiveContainer } from "recharts";

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Home() {
  const [cleanedLocations, setCleanedLocations] = useState([]);
  const [statistics, setStatistics] = useState({
    weekly: [],
    monthly: [],
    yearly: [],
    category: []
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default to India center

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get token for authenticated requests
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        // Fetch all trash reports and filter for completed ones
        const reportsRes = await axios.get("http://localhost:5000/api/trash/all", { headers });
        const completedReports = reportsRes.data.filter(report => report.status === "completed");
        setCleanedLocations(completedReports);
        
        // Set map center based on first location if available
        if (completedReports.length > 0) {
          setMapCenter([completedReports[0].latitude, completedReports[0].longitude]);
        }
        
        // Fetch statistics
        try {
          const statsRes = await axios.get("http://localhost:5000/api/trash/stats", { headers });
          setStatistics(statsRes.data);
        } catch (statsErr) {
          console.error("Error fetching statistics:", statsErr);
          // If stats endpoint doesn't exist, calculate from reports
          const today = new Date();
          const lastWeek = new Date(today);
          lastWeek.setDate(lastWeek.getDate() - 7);
          
          // Calculate weekly stats
          const weeklyStats = [];
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = days[date.getDay()];
            
            const count = completedReports.filter(report => {
              const reportDate = new Date(report.completedAt);
              return reportDate.toDateString() === date.toDateString();
            }).length;
            
            weeklyStats.push({ day: dayName, count });
          }
          
          // Calculate category stats
          const categoryCounts = {};
          completedReports.forEach(report => {
            if (report.category) {
              categoryCounts[report.category] = (categoryCounts[report.category] || 0) + 1;
            }
          });
          
          const categoryStats = Object.entries(categoryCounts).map(([name, value]) => ({
            name,
            value
          }));
          
          setStatistics({
            weekly: weeklyStats,
            monthly: [],
            yearly: [],
            category: categoryStats
          });
        }
        
        // Fetch recent reports
        try {
          const recentRes = await axios.get("http://localhost:5000/api/trash/recent", { headers });
          setRecentReports(recentRes.data);
        } catch (recentErr) {
          console.error("Error fetching recent reports:", recentErr);
          // If recent endpoint doesn't exist, use the most recent reports
          const sortedReports = [...reportsRes.data].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRecentReports(sortedReports.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Swachh Dashboard</h1>
          <p className="text-xl mb-8">Join us in making our cities cleaner and greener</p>
          <div className="flex space-x-4">
            <Link to="/register" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50">
              Get Started
            </Link>
            <Link to="/login" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Statistics</h2>
        
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Weekly Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Weekly Cleaned Trash</h3>
            <div className="h-64">
              {statistics.weekly.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistics.weekly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10B981" name="Cleaned Items" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Category Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Trash by Category</h3>
            <div className="h-64">
              {statistics.category.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statistics.category}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statistics.category.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Cleaned Locations</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-96">
            <MapContainer
              center={mapCenter}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {cleanedLocations.map((location) => (
                <Marker
                  key={location._id}
                  position={[location.latitude, location.longitude]}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{location.location}</h3>
                      <p>Category: {location.category || "Not specified"}</p>
                      <p>Status: {location.status}</p>
                      <p>Completed: {location.completedAt ? new Date(location.completedAt).toLocaleDateString() : "Unknown"}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Recent Reports</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReports.length > 0 ? (
                  recentReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{report.category || "Not specified"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === "completed" 
                            ? "bg-green-100 text-green-800" 
                            : report.status === "assigned"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No recent reports available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Report Trash</h3>
              <p className="text-gray-600">Take a photo of trash in your area and report its location</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Volunteer</h3>
              <p className="text-gray-600">Volunteer to clean up reported trash and earn points</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor the status of your reports and see your impact</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Swachh Dashboard</h3>
              <p className="text-gray-400">Making our cities cleaner, one report at a time.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400">Email: info@swachhdashboard.com</p>
              <p className="text-gray-400">Phone: +91 1234567890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Swachh Dashboard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
