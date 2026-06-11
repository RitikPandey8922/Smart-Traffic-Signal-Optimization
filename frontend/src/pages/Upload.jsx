import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Upload() {
  const navigate = useNavigate();

  const [files, setFiles] = useState({
    lane1: null,
    lane2: null,
    lane3: null,
    lane4: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e, lane) => {
    setFiles({ ...files, [lane]: e.target.files[0] });
  };

  const handleUpload = async () => {
    const formData = new FormData();

    for (let key in files) {
      if (!files[key]) {
        toast.error("Please upload all 4 videos");
        return;
      }
      formData.append(key, files[key]);
    }

    try {
      setLoading(true);

      await axios.post("http://127.0.0.1:5000/upload", formData);

      toast.success("Upload successful 🚀");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6"
    >
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          🚦 Upload Lane Videos
        </h1>

        {/* INPUTS */}
        <div className="space-y-6">
          {[1, 2, 3, 4].map((lane) => (
            <div key={lane}>
              <label className="block text-white mb-2 font-semibold">
                Lane {lane}
              </label>

              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => handleChange(e, `lane${lane}`)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="bg-white/20 text-white px-4 py-3 rounded-lg border border-white/30 hover:bg-white/30 transition">
                  {files[`lane${lane}`]
                    ? files[`lane${lane}`].name
                    : "📁 Click to upload video"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-8 py-3 rounded-lg text-white font-semibold 
          bg-gradient-to-r from-pink-500 to-orange-400 
          hover:scale-105 hover:shadow-lg transition duration-300 flex items-center justify-center"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Uploading...
            </>
          ) : (
            "🚀 Upload and Start"
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default Upload;
