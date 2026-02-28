import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../authSlice";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import { Loader2, Lock, Mail } from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser(formData));
        if (result.meta.requestStatus === "fulfilled") {
            navigate("/dashboard");
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md bg-[#111111] rounded-2xl border border-[#333333] p-8"
                >
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white text-black font-bold flex items-center justify-center text-xl">S</div>
                        </Link>
                        <h1 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to continue to Skill Connect</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r"
                        >
                            <p className="text-sm text-red-400">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#444444] focus:border-gray-500 focus:ring-2 focus:ring-gray-600 outline-none transition-all text-white placeholder-gray-500"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#444444] focus:border-gray-500 focus:ring-2 focus:ring-gray-600 outline-none transition-all text-white placeholder-gray-500"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-bold text-white hover:text-gray-300 hover:underline">
                            Create free account
                        </Link>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default Login;