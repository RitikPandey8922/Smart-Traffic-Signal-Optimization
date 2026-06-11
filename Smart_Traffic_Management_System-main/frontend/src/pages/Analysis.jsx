import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

function Analysis() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/analysis")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data)
    return (
      <h2 className="text-center mt-20 text-xl font-semibold">
        Loading Analysis...
      </h2>
    );

  // 📊 Chart Options
  const chartOptions = {
    plugins: {
      legend: {
        labels: { color: "#333" },
      },
    },
    scales: {
      x: { ticks: { color: "#333" } },
      y: { ticks: { color: "#333" } },
    },
  };

  // 🚗 Density
  const densityData = {
    labels: ["Lane 1", "Lane 2", "Lane 3", "Lane 4"],
    datasets: [
      {
        label: "Vehicle Count",
        data: [
          data.lanes.lane1.total,
          data.lanes.lane2.total,
          data.lanes.lane3.total,
          data.lanes.lane4.total,
        ],
        backgroundColor: "#4facfe",
      },
    ],
  };

  // 📊 Comparison
  const compareData = {
    labels: ["Lane 1", "Lane 2", "Lane 3", "Lane 4"],
    datasets: [
      {
        label: "Traditional",
        data: data.comparison.traditional,
        backgroundColor: "#ff6a6a",
      },
      {
        label: "Smart AI",
        data: data.comparison.smart,
        backgroundColor: "#00c6ff",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-6">
      {/* 🔥 TITLE */}
      <h1 className="text-center text-4xl font-bold text-blue-900 mb-8">
        📊 Traffic Analysis Dashboard
      </h1>

      {/* 🚗 BAR CHARTS */}
      <div className="flex flex-wrap justify-center gap-8">
        <div className="bg-white p-5 rounded-xl shadow-lg w-[400px] hover:scale-105 transition duration-300">
          <h3 className="text-center text-lg font-semibold text-blue-800 mb-3">
            Vehicle Density
          </h3>
          <Bar data={densityData} options={chartOptions} />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg w-[400px] hover:scale-105 transition duration-300">
          <h3 className="text-center text-lg font-semibold text-blue-800 mb-3">
            Traditional vs Smart
          </h3>
          <Bar data={compareData} options={chartOptions} />
        </div>
      </div>

      {/* 🥧 VEHICLE DISTRIBUTION TITLE */}
      <h2 className="text-center text-2xl font-bold text-gray-700 mt-10 mb-6">
        🚗 Vehicle Distribution per Lane
      </h2>

      {/* 🥧 PIE CHARTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {Object.keys(data.lanes).map((lane) => {
          const laneInfo = data.lanes[lane];

          const pieData = {
            labels: ["Cars", "Buses", "Trucks", "Bikes"],
            datasets: [
              {
                data: [
                  laneInfo.cars,
                  laneInfo.buses,
                  laneInfo.trucks,
                  laneInfo.bikes,
                ],
                backgroundColor: ["#4facfe", "#ff6a6a", "#fbc531", "#00d2d3"],
              },
            ],
          };

          return (
            <div
              key={lane}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
            >
              <h4 className="text-center font-semibold text-gray-700 mb-2">
                {lane.toUpperCase()}
              </h4>

              <div className="h-[200px]">
                <Pie
                  data={pieData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: { color: "#333" },
                      },
                    },
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔘 BUTTON */}
      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg shadow-md hover:scale-105 transition duration-300"
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Analysis;
