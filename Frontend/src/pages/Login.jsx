import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous errors
        
        try {
            console.log("Attempting login with:", { email }); // Debug log
            
            const res = await axios.post("http://localhost:5000/api/users/login", {
                email,
                password
            });
            
            console.log("Login response:", res.data); // Debug log
            
            const { token, user } = res.data;

            if (!token || !user) {
                throw new Error("Invalid response from server");
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Redirect based on role
            if (user.role === "admin") navigate("/admin");
            else if (user.role === "worker") navigate("/worker");
            else navigate("/dashboard");
            
        } catch (error) {
            console.error("Login error:", error.response || error); // Debug log
            setError(
                error.response?.data?.message || 
                error.message || 
                "Login failed. Please check your credentials and try again."
            );
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Login</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-green-700 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  )
}

export default Login;