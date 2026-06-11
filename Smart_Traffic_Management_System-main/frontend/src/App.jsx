import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

import Login from "./pages/Login";
import Features from "./pages/Features";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";

//
// 🎬 Page Animation Wrapper
//
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

//
// 🏠 HOME PAGE
//
function Home() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="h-screen bg-gradient-to-r from-purple-800 via-pink-500 to-orange-400 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4 text-center">
          Intelligent Traffic Management System
        </h1>

        <p className="text-lg mb-8 text-center max-w-xl">
          Using YOLOv8 to optimize traffic flow, prioritize emergency vehicles,
          and provide real-time analytics.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-green-400 hover:bg-green-500 text-black px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition"
        >
          Admin Login
        </button>
      </div>
    </PageWrapper>
  );
}

//
// 🚦 MAIN APP
//
function App() {
  const location = useLocation();

  return (
    <>
      {/* ✅ Toast Notifications */}
      <Toaster position="top-right" />

      {/* ✅ Animated Routes */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            }
          />

          <Route
            path="/features"
            element={
              <PageWrapper>
                <Features />
              </PageWrapper>
            }
          />

          <Route
            path="/upload"
            element={
              <PageWrapper>
                <Upload />
              </PageWrapper>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            }
          />

          <Route
            path="/analysis"
            element={
              <PageWrapper>
                <Analysis />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
