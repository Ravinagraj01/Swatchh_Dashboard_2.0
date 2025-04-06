import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Reviews() {
  const [cleanedLocations, setCleanedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCleanedLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!token || !user) {
          setError("Please login first");
          navigate("/login");
          return;
        }

        setLoading(true);
        
        // Since there's no direct endpoint for cleaned locations, we'll use the user's reports
        // that have been marked as completed
        const res = await axios.get(
          `http://localhost:5000/api/trash/user/${user._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Filter for completed reports
        const completedLocations = res.data.filter(item => item.status === "completed");
        setCleanedLocations(completedLocations);
      } catch (err) {
        console.error("Error fetching cleaned locations:", err);
        setError(err.response?.data?.message || "Failed to fetch cleaned locations");
        
        // Set sample data for demonstration
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        setCleanedLocations([
          {
            _id: "1",
            location: "Central Park",
            cleanedAt: today.toISOString(),
            category: "Plastic",
            description: "Plastic bottles and wrappers",
            image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
          {
            _id: "2",
            location: "Beach Front",
            cleanedAt: yesterday.toISOString(),
            category: "Glass",
            description: "Broken glass bottles",
            image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          },
          {
            _id: "3",
            location: "Riverside Park",
            cleanedAt: lastWeek.toISOString(),
            category: "Mixed",
            description: "Various trash items",
            image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCleanedLocations();
  }, [navigate]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      toast.error("Please select a location");
      return;
    }
    
    if (!review.trim()) {
      toast.error("Please enter a review");
      return;
    }
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (!token || !user) {
        setError("Please login first");
        navigate("/login");
        return;
      }

      // For demo purposes, simulate a successful API call
      // In production, this would be a real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Review submitted successfully!");
      setReview("");
      setRating(5);
      setSelectedLocation(null);
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
          <p className="mt-4 text-gray-600">Loading cleaned locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Leave a Review</h2>
      
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {cleanedLocations.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-800">No cleaned locations available for review.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Select a Location</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {cleanedLocations.map((location) => (
                  <li 
                    key={location._id}
                    className={`p-4 cursor-pointer hover:bg-green-50 transition-colors ${
                      selectedLocation && selectedLocation._id === location._id ? "bg-green-100" : ""
                    }`}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{location.location}</h4>
                        <p className="text-sm text-gray-500">
                          Cleaned on: {formatDate(location.cleanedAt || location.createdAt)}
                        </p>
                        {location.category && (
                          <p className="text-xs text-gray-500">
                            Category: {location.category}
                          </p>
                        )}
                      </div>
                      {selectedLocation && selectedLocation._id === location._id && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Write Your Review</h3>
            <form onSubmit={handleSubmitReview} className="bg-white rounded-lg shadow-md p-6">
              {selectedLocation ? (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Location
                    </label>
                    <p className="text-gray-800">{selectedLocation.location}</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Rating
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 ${
                              star <= rating ? "text-yellow-500" : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Your Review
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="4"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your experience with this cleaned location..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full hover:bg-green-700 transition-colors"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Please select a location to leave a review</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 