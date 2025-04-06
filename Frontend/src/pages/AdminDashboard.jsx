import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaUser, FaUserTie, FaMapMarkerAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [trashReports, setTrashReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState("");
    const [selectedTrash, setSelectedTrash] = useState("");
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user || user.role !== "admin") {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                // Fetch trash reports
                const trashResponse = await axios.get(
                    "http://localhost:5000/api/trash/all",
                    { headers }
                );
                setTrashReports(trashResponse.data);

                // Fetch users
                const usersResponse = await axios.get(
                    "http://localhost:5000/api/user/all",
                    { headers }
                );
                setUsers(usersResponse.data);

                // Fetch workers
                const workersResponse = await axios.get(
                    "http://localhost:5000/api/worker/all",
                    { headers }
                );
                setWorkers(workersResponse.data);

                // Update map center based on first trash report
                if (trashResponse.data.length > 0) {
                    const firstReport = trashResponse.data[0];
                    setMapCenter([firstReport.latitude, firstReport.longitude]);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching data");
                toast.error("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleAssignWorker = async () => {
        if (!selectedWorker || !selectedTrash) {
            toast.error("Please select both worker and trash report");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/worker/assign",
                {
                    workerId: selectedWorker,
                    trashId: selectedTrash,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Worker assigned successfully");
            
            // Refresh data
            const headers = { Authorization: `Bearer ${token}` };
            const [trashRes, workersRes] = await Promise.all([
                axios.get("http://localhost:5000/api/trash/all", { headers }),
                axios.get("http://localhost:5000/api/worker/all", { headers })
            ]);
            
            setTrashReports(trashRes.data);
            setWorkers(workersRes.data);
            setSelectedWorker("");
            setSelectedTrash("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error assigning worker");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="text-red-500 text-center">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Assignment Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Assign Worker to Task</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Worker
                            </label>
                            <select
                                value={selectedWorker}
                                onChange={(e) => setSelectedWorker(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Select a worker</option>
                                {workers.map((worker) => (
                                    <option key={worker._id} value={worker._id}>
                                        {worker.name} ({worker.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Trash Report
                            </label>
                            <select
                                value={selectedTrash}
                                onChange={(e) => setSelectedTrash(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Select a trash report</option>
                                {trashReports
                                    .filter((report) => report.status === "pending")
                                    .map((report) => (
                                        <option key={report._id} value={report._id}>
                                            {report.location} - {report.category}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleAssignWorker}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Assign Worker
                    </button>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <FaTrash className="text-blue-500 text-2xl mr-3" />
                            <div>
                                <h3 className="text-lg font-semibold">Total Reports</h3>
                                <p className="text-3xl font-bold">{trashReports.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <FaUser className="text-green-500 text-2xl mr-3" />
                            <div>
                                <h3 className="text-lg font-semibold">Total Users</h3>
                                <p className="text-3xl font-bold">{users.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <FaUserTie className="text-purple-500 text-2xl mr-3" />
                            <div>
                                <h3 className="text-lg font-semibold">Total Workers</h3>
                                <p className="text-3xl font-bold">{workers.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Trash Locations</h2>
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
                            {trashReports.map((report) => (
                                <Marker
                                    key={report._id}
                                    position={[report.latitude, report.longitude]}
                                >
                                    <Popup>
                                        <div>
                                            <p className="font-semibold">{report.location}</p>
                                            <p>Category: {report.category}</p>
                                            <p>Status: {report.status}</p>
                                            <p>Reported by: {report.reportedBy?.name || "Unknown"}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Recent Reports Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50">
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
                                        Reported By
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {trashReports.slice(0, 5).map((report) => (
                                    <tr key={report._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaMapMarkerAlt className="text-gray-400 mr-2" />
                                                {report.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {report.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    report.status === "completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : report.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {report.reportedBy?.name || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 