import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [allTrash, setAllTrash] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [assigning, setAssigning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!token || !user || user.role !== "admin") {
          setError("Unauthorized access");
          navigate("/login");
          return;
        }

        setLoading(true);
        
        // Fetch all trash reports
        const trashRes = await axios.get(
          "http://localhost:5000/api/trash/all",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setAllTrash(trashRes.data);
        
        // Fetch all users
        const usersRes = await axios.get(
          "http://localhost:5000/api/user/all",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setAllUsers(usersRes.data);
        
        // Fetch all workers
        const workersRes = await axios.get(
          "http://localhost:5000/api/worker/all",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setAllWorkers(workersRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(err.response?.data?.message || "Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleAssignWorker = async (trashId) => {
    if (!selectedWorker) {
      toast.error("Please select a worker first");
      return;
    }
    
    try {
      setAssigning(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/trash/assign/${trashId}`,
        { workerId: selectedWorker },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      toast.success("Worker assigned successfully!");
      
      // Refresh the trash list
      const updatedRes = await axios.get(
        "http://localhost:5000/api/trash/all",
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setAllTrash(updatedRes.data);
      setSelectedWorker("");
    } catch (err) {
      console.error("Error assigning worker:", err);
      toast.error(err.response?.data?.message || "Failed to assign worker");
    } finally {
      setAssigning(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "assigned":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading admin dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Admin Dashboard</h2>
      
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">All Trash Reports</h3>
        {allTrash.length === 0 ? (
          <p className="text-gray-600">No trash reports found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Image</th>
                  <th className="py-2 px-4 border-b text-left">Location</th>
                  <th className="py-2 px-4 border-b text-left">Reported By</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Assigned To</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allTrash.map((trash) => (
                  <tr key={trash._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      <img 
                        src={trash.image} 
                        alt="Trash" 
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">{trash.location}</td>
                    <td className="py-2 px-4 border-b">
                      {allUsers.find(user => user._id === trash.reportedBy)?.name || "Unknown"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span className={getStatusColor(trash.status)}>
                        {trash.status.charAt(0).toUpperCase() + trash.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {trash.worker ? 
                        allWorkers.find(worker => worker._id === trash.worker)?.name || "Unknown" : 
                        "Not assigned"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {trash.status !== "completed" && (
                        <div className="flex items-center space-x-2">
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={selectedWorker}
                            onChange={(e) => setSelectedWorker(e.target.value)}
                            disabled={assigning}
                          >
                            <option value="">Select Worker</option>
                            {allWorkers.map(worker => (
                              <option key={worker._id} value={worker._id}>
                                {worker.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAssignWorker(trash._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            disabled={assigning || !selectedWorker}
                          >
                            {assigning ? "Assigning..." : "Assign"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Users</h3>
          {allUsers.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                    <th className="py-2 px-4 border-b text-left">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{user.name}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">{user.points || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Workers</h3>
          {allWorkers.length === 0 ? (
            <p className="text-gray-600">No workers found.</p>
          ) : (
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                    <th className="py-2 px-4 border-b text-left">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {allWorkers.map(worker => (
                    <tr key={worker._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{worker.name}</td>
                      <td className="py-2 px-4 border-b">{worker.email}</td>
                      <td className="py-2 px-4 border-b">{worker.points || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 