import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImageValidator from "../components/ImageValidator";

export default function Report() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isImageValid, setIsImageValid] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setIsImageValid(false); // Reset validation state when new image is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isImageValid) {
      toast.error("Please wait for image validation to complete or upload a valid trash image.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        setError("Please login first");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("location", location);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("image", image);

      const response = await axios.post(
        "http://localhost:5000/api/trash/report",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Trash reported successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error reporting trash:", err);
      setError(err.response?.data?.message || "Failed to report trash");
      toast.error(err.response?.data?.message || "Failed to report trash");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Report Trash</h2>
      
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a category</option>
            <option value="plastic">Plastic</option>
            <option value="glass">Glass</option>
            <option value="paper">Paper</option>
            <option value="metal">Metal</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          {image && (
            <ImageValidator
              image={image}
              onValidationComplete={setIsImageValid}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isImageValid}
          className={`w-full bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading || !isImageValid
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-700"
          }`}
        >
          {loading ? "Reporting..." : "Report Trash"}
        </button>
      </form>
    </div>
  );
} 