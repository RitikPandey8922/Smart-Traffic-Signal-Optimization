import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrafficLight } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const [greenLane, setGreenLane] = useState("lane1");
  const [stats, setStats] = useState({});

  const lanes = [1, 2, 3, 4];

  // 🚦 Fetch traffic control
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/traffic");
        const data = await res.json();
        setGreenLane(data.green);
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 📊 Fetch stats
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 🚦 Traffic light logic
  const getColor = (lane, light) => {
    if (greenLane === lane && light === "green") return "green";
    if (greenLane === lane && light === "yellow") return "orange";
    if (greenLane !== lane && light === "red") return "red";
    return "#444";
  };

  const btnStyle = {
    margin: "10px",
    padding: "12px 22px",
    border: "none",
    background: "linear-gradient(to right, #007bff, #00c6ff)",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  };

  return (
    <div style={{ padding: "20px", background: "#f2f2f2", minHeight: "100vh" }}>
      {/* 🔥 HEADING */}
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          fontSize: "34px",
          fontWeight: "bold",
          marginBottom: "25px",
        }}
      >
        <FaTrafficLight
          color="#ff7e5f"
          size={32}
          style={{ filter: "drop-shadow(0 0 6px #ff7e5f)" }}
        />

        <span
          style={{
            background: "linear-gradient(to right, #ff7e5f, #feb47b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Live Traffic Dashboard
        </span>
      </h1>

      {/* 🧩 GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {lanes.map((lane) => (
          <div
            key={lane}
            style={{
              display: "flex",
              background: "#fff",
              borderRadius: "12px",
              padding: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              alignItems: "center",
            }}
          >
            {/* 🚦 SIGNAL */}
            <div
              style={{
                width: "60px",
                height: "220px",
                background: "#ddd",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                marginRight: "12px",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: getColor(`lane${lane}`, "red"),
                }}
              />
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: getColor(`lane${lane}`, "yellow"),
                }}
              />
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: getColor(`lane${lane}`, "green"),
                }}
              />
            </div>

            {/* 🎥 VIDEO + INFO */}
            <div style={{ flex: 1 }}>
              <img
                src={`http://127.0.0.1:5000/video/lane${lane}`}
                alt={`Lane ${lane}`}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <p style={{ fontWeight: "bold", marginTop: "8px" }}>
                Lane {lane}
              </p>

              <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                🚗 Density: {stats[`lane${lane}`]?.count || 0} <br />
                🚑 Ambulance: {stats[`lane${lane}`]?.ambulance
                  ? "Yes"
                  : "No"}{" "}
                <br />⏱ Time: {stats[`lane${lane}`]?.time || 0}s
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔘 BUTTONS */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button style={btnStyle} onClick={() => navigate("/analysis")}>
          View Analysis
        </button>

        <button style={btnStyle} onClick={() => navigate("/upload")}>
          Upload New Videos
        </button>

        <button style={btnStyle} onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
