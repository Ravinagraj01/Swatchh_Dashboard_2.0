import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ReportTrash() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("location", location);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/trash/report",
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      alert("Trash reported successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.message || "Failed to report trash. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Report Trash</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <textarea
            placeholder="Enter the location where you found the trash"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded p-2"
            rows={3}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}
