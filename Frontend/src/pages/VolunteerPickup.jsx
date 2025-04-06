import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VolunteerPickup() {
  const [trashList, setTrashList] = useState([]);
  const [volunteer, setVolunteer] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setVolunteer(user);

    axios
      .get("http://localhost:5000/api/trash/available")
      .then((res) => setTrashList(res.data))
      .catch((err) => console.error("Error loading available trash:", err));
  }, []);

  const handlePick = async (trashId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/trash/volunteer/${volunteer._id}`,
        { trashId }
      );

      alert("Trash picked successfully by volunteer! ✅");

      // Remove the picked trash from UI
      setTrashList(trashList.filter((item) => item._id !== trashId));
    } catch (err) {
      alert("Error picking trash. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">Available Trash to Volunteer</h2>

      {trashList.length === 0 ? (
        <p className="text-gray-600">No trash available for pickup.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trashList.map((trash) => (
            <div key={trash._id} className="p-4 border rounded shadow">
              <img
                src={trash.image}
                alt="Trash"
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <p><strong>Description:</strong> {trash.description}</p>
              <p><strong>Location:</strong> {trash.location}</p>
              <button
                className="bg-green-600 text-white px-4 py-1 rounded mt-2 hover:bg-green-700"
                onClick={() => handlePick(trash._id)}
              >
                Pick this Trash
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
