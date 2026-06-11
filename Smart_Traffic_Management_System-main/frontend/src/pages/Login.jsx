import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 via-pink-500 to-orange-400">
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl w-80 shadow-lg">
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Admin Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-2 rounded bg-white/70 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 rounded bg-white/70 outline-none"
        />

        <button
          onClick={() => navigate("/features")}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-black py-2 rounded-lg font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
