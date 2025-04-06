import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Volunteer() {
  const [availableTrash, setAvailableTrash] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [volunteering, setVolunteering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableTrash = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login first");
          navigate("/login");
          return;
        }

        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/trash/available",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setAvailableTrash(res.data);
      } catch (err) {
        console.error("Error fetching available trash:", err);
        setError(err.response?.data?.message || "Failed to fetch available trash");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTrash();
  }, [navigate]);

  const handleVolunteer = async (trashId) => {
    try {
      setVolunteering(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/trash/volunteer/${trashId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      toast.success("You have successfully volunteered for this task!");
      
      // Refresh the available trash list
      const updatedRes = await axios.get(
        "http://localhost:5000/api/trash/available",
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setAvailableTrash(updatedRes.data);
    } catch (err) {
      console.error("Error volunteering:", err);
      toast.error(err.response?.data?.message || "Failed to volunteer for this task");
    } finally {
      setVolunteering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading available trash...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Volunteer to Clean Up</h2>
      
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {availableTrash.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">No trash reports available for volunteering.</p>
          <p className="text-gray-500">Check back later for new opportunities to help clean up your community!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableTrash.map((trash) => (
            <div key={trash._id} className="p-4 border rounded shadow bg-white hover:shadow-md transition-shadow">
              <img
                src={trash.image}
                alt="Trash"
                className="w-full h-48 object-cover mb-2 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
                }}
              />
              <p className="font-semibold">Location: {trash.location}</p>
              <p className="text-sm text-gray-500 mb-2">
                Reported: {new Date(trash.createdAt).toLocaleString()}
              </p>
              {trash.category && (
                <p className="text-sm text-gray-500 mb-2">
                  Category: {trash.category}
                </p>
              )}
              {trash.description && (
                <p className="text-sm text-gray-500 mb-4">
                  Description: {trash.description}
                </p>
              )}
              <button
                onClick={() => handleVolunteer(trash._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                disabled={volunteering}
              >
                {volunteering ? "Volunteering..." : "Volunteer for This Task"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 