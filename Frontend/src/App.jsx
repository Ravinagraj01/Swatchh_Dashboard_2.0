// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import UserDashboard from "./pages/UserDashboard";
import ReportTrash from "./pages/ReportTrash";
import MyReports from "./pages/MyReports";
import Volunteer from "./pages/Volunteer";
import MyVolunteerTasks from "./pages/MyVolunteerTasks";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Statistics from "./pages/Statistics";
import Reviews from "./pages/Reviews";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
// import other components like Login, Register, Dashboard, etc.

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Routes */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/report-trash" element={<ReportTrash />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/my-volunteer-tasks" element={<MyVolunteerTasks />} />
          <Route path="/reviews" element={<Reviews />} />
        </Route>
        
        {/* Worker Routes */}
        <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
        </Route>
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/stats" element={<Statistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
