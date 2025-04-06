// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userPoints, setUserPoints] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));
        
        if (!token || !userData) {
          setError("Please login first");
          navigate("/login");
          return;
        }

        setUser(userData);
        setLoading(true);

        // Fetch user's reports
        const reportsRes = await axios.get(
          `http://localhost:5000/api/trash/user/${userData._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setReports(reportsRes.data);

        // Fetch volunteer history - filter from user reports
        const volunteerRes = await axios.get(
          `http://localhost:5000/api/trash/user/${userData._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Filter for reports where the user is a volunteer and status is completed
        const volunteerHistory = volunteerRes.data.filter(report => 
          report.volunteer === userData._id && report.status === "completed"
        );
        
        setVolunteerHistory(volunteerHistory);

        // Fetch user points - using the correct endpoint
        const pointsRes = await axios.get(
          `http://localhost:5000/api/user/points`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setUserPoints(pointsRes.data || 0);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.response?.data?.message || "Failed to fetch user data");
        
        // Set sample data for demonstration
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        setReports([
          {
            _id: "1",
            location: "Central Park",
            status: "completed",
            createdAt: today.toISOString(),
            image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "Plastic",
            description: "Plastic bottles and wrappers"
          },
          {
            _id: "2",
            location: "Beach Front",
            status: "pending",
            createdAt: yesterday.toISOString(),
            image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "Glass",
            description: "Broken glass bottles"
          }
        ]);
        
        setVolunteerHistory([
          {
            _id: "1",
            location: "Riverside Park",
            status: "completed",
            completedAt: today.toISOString(),
            image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "Mixed",
            description: "Various trash items",
            pointsEarned: 15
          },
          {
            _id: "2",
            location: "City Square",
            status: "completed",
            completedAt: lastWeek.toISOString(),
            image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            category: "Paper",
            description: "Cardboard boxes and paper waste",
            pointsEarned: 10
          }
        ]);
        
        setUserPoints(150); // Sample points
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">User Dashboard</h2>
        <div className="bg-green-100 p-3 rounded-lg">
          <p className="text-green-800 font-semibold">Your Points: {userPoints}</p>
        </div>
      </div>
      
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Reports</h3>
          {reports.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">You haven't reported any trash yet.</p>
              <button
                onClick={() => navigate("/report")}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Report Trash
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {reports.slice(0, 5).map((report) => (
                  <li key={report._id} className="p-4 hover:bg-green-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{report.location}</h4>
                        <p className="text-sm text-gray-500">
                          Reported: {formatDate(report.createdAt)}
                        </p>
                        {report.category && (
                          <p className="text-xs text-gray-500">
                            Category: {report.category}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        report.status === "completed" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              {reports.length > 5 && (
                <div className="p-4 bg-gray-50">
                  <button
                    onClick={() => navigate("/reports")}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    View all reports →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Volunteer History</h3>
          {volunteerHistory.length === 0 ? (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">You haven't volunteered for any cleanups yet.</p>
              <button
                onClick={() => navigate("/volunteer")}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Find Tasks to Volunteer For
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {volunteerHistory.slice(0, 5).map((task) => (
                  <li key={task._id} className="p-4 hover:bg-green-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{task.location}</h4>
                        <p className="text-sm text-gray-500">
                          Completed: {formatDate(task.completedAt || task.createdAt)}
                        </p>
                        {task.category && (
                          <p className="text-xs text-gray-500">
                            Category: {task.category}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                          {task.status}
                        </span>
                        <p className="text-xs text-green-600 mt-1">
                          +{task.pointsEarned || 15} points
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {volunteerHistory.length > 5 && (
                <div className="p-4 bg-gray-50">
                  <button
                    onClick={() => navigate("/volunteer/history")}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    View all volunteer history →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
