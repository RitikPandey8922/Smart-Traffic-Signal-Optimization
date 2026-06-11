import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Dynamic Signal Control",
    desc: "Automatically adjusts signal timing based on real-time traffic density.",
    icon: "🚦",
  },
  {
    title: "Ambulance Priority",
    desc: "Detects emergency vehicles and gives instant green signal.",
    icon: "🚑",
  },
  {
    title: "Live Dashboard",
    desc: "Monitor all lanes with live feeds and signal states.",
    icon: "📊",
  },
  {
    title: "Data Analytics",
    desc: "View traffic trends, density graphs, and performance reports.",
    icon: "📈",
  },
];

const tools = [
  {
    title: "HTML, CSS, JS , React",
    desc: "Responsive and interactive frontend.",
    icon: "💻",
  },
  {
    title: "Python & Flask",
    desc: "Backend powered by Flask for fast processing.",
    icon: "🐍",
  },
  {
    title: "YOLOv8 & OpenCV",
    desc: "Real-time vehicle detection using AI.",
    icon: "🤖",
  },

  {
    title: "Chart.js",
    desc: "Dynamic graphs for analytics.",
    icon: "📊",
  },
];

function Features() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 text-white">
      {/* ---------- FEATURES SECTION ---------- */}
      <div className="p-10">
        <h1 className="text-4xl font-bold text-center mb-10">
          ✨ Project Features
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((f, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] 
              transition text-center flex flex-col items-center"
            >
              {/* ICON */}
              <div className="text-4xl mb-4">{f.icon}</div>

              {/* TITLE */}
              <h2 className="text-lg font-semibold mb-2">{f.title}</h2>

              {/* DESC */}
              <p className="text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- TOOLS SECTION ---------- */}
      <div className="p-10 bg-black/10">
        <h1 className="text-3xl font-bold text-center mb-10">
          🛠 Tools & Technology
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {tools.map((t, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] 
              transition text-center flex flex-col items-center"
            >
              {/* ICON */}
              <div className="text-4xl mb-4">{t.icon}</div>

              {/* TITLE */}
              <h2 className="text-lg font-semibold mb-2">{t.title}</h2>

              {/* DESC */}
              <p className="text-sm">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- IMPORTANCE SECTION ---------- */}
      <div className="p-10">
        <h1 className="text-3xl font-bold text-center mb-6">
          💡 Project Importance
        </h1>

        <div className="max-w-3xl mx-auto text-center space-y-4 text-sm leading-relaxed">
          <p>
            <span className="font-semibold">Reduces Traffic Congestion:</span>{" "}
            Smart signal timing minimizes delays and improves traffic flow.
          </p>

          <p>
            <span className="font-semibold">Enhances Emergency Response:</span>{" "}
            Ambulance prioritization ensures faster emergency handling.
          </p>

          <p>
            <span className="font-semibold">Data-Driven Insights:</span> Helps
            authorities make better traffic management decisions.
          </p>
        </div>

        {/* BUTTON */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/upload")}
            className="bg-green-400 text-black px-6 py-3 rounded-xl font-semibold 
            hover:scale-105 transition"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Features;
