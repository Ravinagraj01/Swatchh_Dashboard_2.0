import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import CleanedMap from './Map';

function Reports() {
  // Random sample data
  const weeklyData = [
    { day: 'Monday', reported: 20, resolved: 15 },
    { day: 'Tuesday', reported: 30, resolved: 25 },
    { day: 'Wednesday', reported: 40, resolved: 35 },
    { day: 'Thursday', reported: 25, resolved: 20 },
    { day: 'Friday', reported: 50, resolved: 45 },
    { day: 'Saturday', reported: 35, resolved: 30 },
    { day: 'Sunday', reported: 40, resolved: 38 },
  ];

  const monthlyData = [
    { month: 'Jan', reported: 200, resolved: 180 },
    { month: 'Feb', reported: 220, resolved: 190 },
    { month: 'Mar', reported: 250, resolved: 230 },
    { month: 'Apr', reported: 280, resolved: 260 },
    { month: 'May', reported: 300, resolved: 290 },
    { month: 'Jun', reported: 320, resolved: 310 },
  ];

  const yearlyData = [
    { status: 'Reported', value: 3200 },
    { status: 'Resolved', value: 2900 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-8 bg-gradient-to-b from-green-700 to-green-300pt-[100px]">
        <div className='w-full relative rounded-lg'>
            <CleanedMap />
        </div>
        <div className='flex mt-[100px]'>
            <div className="week w-full h-[500px] ">
                {/* Weekly Report */}
                <h2 className="text-xl font-semibold  mb-4 m-4">Weekly Report</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reported" fill="#0088FE" name="Reported" />
                    <Bar dataKey="resolved" fill="#00C49F" name="Resolved" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="monthly w-full">
                {/* Monthly Report */}
                <h2 className="text-xl font-semibold mb-4 m-4">Monthly Report</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="reported" stroke="#FFBB28" name="Reported" />
                    <Line type="monotone" dataKey="resolved" stroke="#00C49F" name="Resolved" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

      <h1 className="text-3xl font-bold mt-12 mb-6">Statistical Reports</h1>

      <div>
        {/* Yearly Report */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Yearly Report</h2>
      <ResponsiveContainer width="50%" height={300}>
        <PieChart>
          <Pie data={yearlyData} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={120} label>
            {yearlyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      </div>
      
    </div>
  );
}

export default Reports;
