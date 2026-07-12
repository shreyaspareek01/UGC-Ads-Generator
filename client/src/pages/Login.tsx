import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { PrimaryButton } from "../components/Buttons";
import { useAuthContext } from "../context/AuthContext";
import api from "../configs/axios";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      login(data.token, data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Sign in to your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-white/3 rounded-lg border-2 p-3 text-sm border-violet-200/10 focus:border-violet-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-white/3 rounded-lg border-2 p-3 text-sm border-violet-200/10 focus:border-violet-500/50 outline-none transition-all"
            />
          </div>
          <PrimaryButton
            disabled={loading}
            className="w-full py-3 rounded-xl mt-2"
          >
            {loading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </PrimaryButton>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-violet-400 hover:text-violet-300"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
