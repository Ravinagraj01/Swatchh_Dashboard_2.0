import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function WorkerDashboard() {
  const [assignedTrash, setAssignedTrash] = useState([]);
  const [completedTrash, setCompletedTrash] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workerPoints, setWorkerPoints] = useState(0);
  const [markingCleaned, setMarkingCleaned] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!token || !user) {
          setError("Please login first");
          navigate("/login");
          return;
        }

        setLoading(true);
        // Fetch assigned trash reports
        const res = await axios.get(
          `http://localhost:5000/api/trash/worker/${user._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Separate active and completed tasks
        const activeTasks = res.data.filter(report => report.status !== "completed");
        const completedTasks = res.data.filter(report => report.status === "completed");
        
        console.log("Assigned trash:", activeTasks);
        console.log("Completed trash:", completedTasks);
        
        setAssignedTrash(activeTasks);
        setCompletedTrash(completedTasks);
        
        // Fetch worker points
        const pointsRes = await axios.get(
          `http://localhost:5000/api/worker/points/${user._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setWorkerPoints(pointsRes.data.points || 0);
      } catch (err) {
        console.error("Error fetching worker data:", err);
        setError(err.response?.data?.message || "Failed to fetch worker data");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [navigate]);

  const handleMarkAsCleaned = async (trashId) => {
    try {
      setMarkingCleaned(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/trash/worker/cleaned/${trashId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      toast.success("Task marked as completed! You earned 20 points!");
      
      // Refresh the assigned trash list
      const user = JSON.parse(localStorage.getItem("user"));
      const updatedRes = await axios.get(
        `http://localhost:5000/api/trash/worker/${user._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Separate active and completed tasks
      const activeTasks = updatedRes.data.filter(report => report.status !== "completed");
      const completedTasks = updatedRes.data.filter(report => report.status === "completed");
      
      setAssignedTrash(activeTasks);
      setCompletedTrash(completedTasks);
      
      // Update worker points
      const pointsRes = await axios.get(
        `http://localhost:5000/api/worker/points/${user._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setWorkerPoints(pointsRes.data.points || 0);
    } catch (err) {
      console.error("Error marking task as cleaned:", err);
      toast.error(err.response?.data?.message || "Failed to mark task as cleaned");
    } finally {
      setMarkingCleaned(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading worker dashboard...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Worker Dashboard</h2>
        <div className="bg-green-100 p-3 rounded-lg">
          <p className="text-green-800 font-semibold">Your Points: {workerPoints}</p>
        </div>
      </div>
      
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Assigned Tasks</h3>
        {assignedTrash.length === 0 ? (
          <p className="text-gray-600">You don't have any assigned tasks.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedTrash.map((trash) => (
              <div key={trash._id} className="p-4 border rounded shadow">
                <img
                  src={trash.image}
                  alt="Trash"
                  className="w-full h-48 object-cover mb-2 rounded"
                />
                <p className="font-semibold">Location: {trash.location}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Reported: {new Date(trash.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Status: <span className="text-yellow-600">{trash.status}</span>
                </p>
                <button
                  onClick={() => handleMarkAsCleaned(trash._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                  disabled={markingCleaned}
                >
                  {markingCleaned ? "Marking as Cleaned..." : "Mark as Cleaned"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Completed Tasks</h3>
        {completedTrash.length === 0 ? (
          <p className="text-gray-600">You haven't completed any tasks yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedTrash.map((trash) => (
              <div key={trash._id} className="p-4 border rounded shadow bg-gray-50">
                <img
                  src={trash.image}
                  alt="Trash"
                  className="w-full h-48 object-cover mb-2 rounded opacity-75"
                />
                <p className="font-semibold">Location: {trash.location}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Reported: {new Date(trash.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mb-2">
                  Completed: {new Date(trash.cleanedAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Status: <span className="text-green-600">Completed</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 