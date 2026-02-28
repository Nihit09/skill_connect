import { Link } from "react-router";
import { MoveRight, Zap, Users, Shield } from "lucide-react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const Home = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-[#050505] text-gray-100">
                <Navbar />

                {/* Hero Section */}
                <div className="relative overflow-hidden pt-20 pb-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {/* Removed Badge */}
                        </motion.div>

                        <motion.h1
                            className="text-5xl md:text-7xl font-extrabold text-gray-100 dark:text-white mb-6 tracking-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Master New Skills. <br />
                            <span className="text-transparent bg-clip-text bg-gray-800">Connect with Experts.</span>
                        </motion.h1>

                        <motion.p
                            className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Exchange your expertise for new knowledge. Join a community of lifelong learners and grow together.
                        </motion.p>

                        <motion.div
                            className="mt-10 flex justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link to="/marketplace">
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-white text-black text-white font-bold rounded-2xl  hover:bg-gray-200 transition-all flex items-center gap-2"
                                >
                                    Explore Skills <MoveRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-transparent text-white font-bold rounded-2xl  border border-gray-200 hover:bg-[#0a0a0a] transition-all"
                                >
                                    Join Now
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Subtle Gradient Background */}
                    <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/10 via-[#050505] to-[#050505] opacity-100"></div>
                </div>

                {/* Features / Quote */}
                <div className="py-20 bg-transparent/50 backdrop-blur-lg border-t border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {[
                                { icon: <Zap className="w-8 h-8 text-yellow-500" />, title: "Instant Connections", desc: "Find experts in seconds using our smart matching system." },
                                { icon: <Users className="w-8 h-8 text-blue-500" />, title: "Community Driven", desc: "Learn from real people, not just pre-recorded videos." },
                                { icon: <Shield className="w-8 h-8 text-green-500" />, title: "Verified Skills", desc: "Trust in our reputation system to find quality mentors." }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="p-8 bg-transparent dark:bg-gray-800 rounded-2xl  border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="bg-[#0a0a0a] dark:bg-gray-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-100 dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quote Section */}
                <div className="py-20 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <blockquote className="text-3xl font-serif italic text-gray-700 dark:text-gray-300">
                            "Live as if you were to die tomorrow. Learn as if you were to live forever."
                        </blockquote>
                        <cite className="block mt-4 text-gray-500 font-semibold">— Mahatma Gandhi</cite>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Home;
