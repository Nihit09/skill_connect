import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../authSlice";
import { Lock, Mail, User, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-transparent dark:bg-gray-800 rounded-2xl  border border-gray-100 dark:border-gray-700 p-8"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center text-white font-bold text-xl">S</div>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-100 dark:text-white tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Join the community and start exchanging skills
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm border border-red-100 dark:border-red-800 flex items-center"
            >
              <span className="font-medium">Error:</span>
              <span className="ml-1">{error}</span>
            </motion.div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSignup}>
            <div className="flex gap-4">
              <div className="space-y-1 w-1/2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-600/50 outline-none transition-all text-gray-100 dark:text-white"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1 w-1/2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-600/50 outline-none transition-all text-gray-100 dark:text-white"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 px-4 py-2.5 rounded-xl bg-[#0a0a0a] dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-600/50 outline-none transition-all text-gray-100 dark:text-white"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 px-4 py-2.5 rounded-xl bg-[#0a0a0a] dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-600/50 outline-none transition-all text-gray-100 dark:text-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-black text-white font-bold rounded-xl   dark: hover:bg-gray-200 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-white hover:text-gray-300 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default Signup;