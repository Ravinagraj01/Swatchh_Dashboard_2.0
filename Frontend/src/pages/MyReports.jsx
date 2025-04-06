import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!token || !user) {
          setError("Please login first");
          navigate("/login");
          return;
        }

        console.log("Fetching reports for user:", user._id);
        
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/trash/user/${user._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        console.log("Reports fetched:", res.data);
        
        // Filter reports to ensure only the current user's reports are shown
        const userReports = res.data.filter(report => report.user === user._id);
        console.log("Filtered user reports:", userReports);
        
        setReports(userReports);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.response?.data?.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-10">Loading reports...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-green-700">My Trash Reports</h2>

      {reports.length === 0 ? (
        <p className="text-gray-600">No reports found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div key={report._id} className="p-4 border rounded shadow">
              <img
                src={report.image}
                alt="Trash"
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <p className="font-semibold">Location: {report.location}</p>
              <p>Status: <span className="text-green-600">{report.status}</span></p>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
