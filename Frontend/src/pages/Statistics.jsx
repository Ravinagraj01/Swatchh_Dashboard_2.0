import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

export default function Statistics() {
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [yearlyStats, setYearlyStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeFilter, setTimeFilter] = useState("week");
  const [userFilter, setUserFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login first");
          navigate("/login");
          return;
        }

        setLoading(true);
        
        // Fetch weekly stats
        const weeklyRes = await axios.get(
          "http://localhost:5000/api/trash/stats/weekly",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              userId: userFilter !== "all" ? userFilter : undefined,
              city: cityFilter !== "all" ? cityFilter : undefined
            }
          }
        );
        
        setWeeklyStats(weeklyRes.data);
        
        // Fetch monthly stats
        const monthlyRes = await axios.get(
          "http://localhost:5000/api/trash/stats/monthly",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              userId: userFilter !== "all" ? userFilter : undefined,
              city: cityFilter !== "all" ? cityFilter : undefined
            }
          }
        );
        
        setMonthlyStats(monthlyRes.data);
        
        // Fetch yearly stats
        const yearlyRes = await axios.get(
          "http://localhost:5000/api/trash/stats/yearly",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              userId: userFilter !== "all" ? userFilter : undefined,
              city: cityFilter !== "all" ? cityFilter : undefined
            }
          }
        );
        
        setYearlyStats(yearlyRes.data);
        
        // Fetch category stats
        const categoryRes = await axios.get(
          "http://localhost:5000/api/trash/stats/category",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              userId: userFilter !== "all" ? userFilter : undefined,
              city: cityFilter !== "all" ? cityFilter : undefined
            }
          }
        );
        
        setCategoryStats(categoryRes.data);
        
        // Fetch users for filter
        const usersRes = await axios.get(
          "http://localhost:5000/api/user/all",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setUsers(usersRes.data);
        
        // Fetch cities for filter
        const citiesRes = await axios.get(
          "http://localhost:5000/api/trash/cities",
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setCities(citiesRes.data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError(err.response?.data?.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [navigate, userFilter, cityFilter]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "time") {
      setTimeFilter(value);
    } else if (filterType === "user") {
      setUserFilter(value);
    } else if (filterType === "city") {
      setCityFilter(value);
    }
  };

  const getChartData = () => {
    switch (timeFilter) {
      case "week":
        return weeklyStats;
      case "month":
        return monthlyStats;
      case "year":
        return yearlyStats;
      default:
        return weeklyStats;
    }
  };

  const getChartTitle = () => {
    switch (timeFilter) {
      case "week":
        return "Weekly Cleaned Trash";
      case "month":
        return "Monthly Cleaned Trash";
      case "year":
        return "Yearly Cleaned Trash";
      default:
        return "Weekly Cleaned Trash";
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading statistics...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Statistics Dashboard</h1>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Reports</h3>
          <p className="text-3xl text-green-600 font-bold">{getChartData().reduce((sum, item) => sum + item.reports, 0)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Cleaned</h3>
          <p className="text-3xl text-green-600 font-bold">{getChartData().reduce((sum, item) => sum + item.cleaned, 0)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Volunteers</h3>
          <p className="text-3xl text-green-600 font-bold">{users.filter(user => user.role === "volunteer").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg. Response Time (hrs)</h3>
          <p className="text-3xl text-green-600 font-bold">{getChartData().reduce((sum, item) => sum + item.responseTime, 0) / getChartData().length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              value={timeFilter}
              onChange={(e) => handleFilterChange("time", e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User
            </label>
            <select
              value={userFilter}
              onChange={(e) => handleFilterChange("user", e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              value={cityFilter}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {timeFilter === "week"
              ? "Weekly Reports"
              : timeFilter === "month"
              ? "Monthly Reports"
              : "Yearly Reports"}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getChartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reports" fill="#8884d8" name="Reports" />
                <Bar dataKey="cleaned" fill="#82ca9d" name="Cleaned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Trash by Category
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 