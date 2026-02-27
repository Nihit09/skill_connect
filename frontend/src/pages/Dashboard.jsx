import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import Navbar from "../components/Navbar";
import { Briefcase, Repeat, Star, TrendingUp, Plus, ArrowRight, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay, duration: 0.4 }}
        className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-5"
    >
        <div className={`p-4 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
            <div className={`text-${color.replace('bg-', '')}-600 dark:text-${color.replace('bg-', '')}-400`}>
                <Icon className="h-7 w-7 text-current" />
            </div>
        </div>
        <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-1">{title}</p>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentExchanges, setRecentExchanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axiosClient.get('/dashboard/user');
                setStats(res.data.data.stats);
                setRecentExchanges(res.data.data.activeExchanges);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <span className="loading loading-spinner loading-lg text-indigo-600"></span>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Header */}
                    <div className="md:flex md:items-center md:justify-between mb-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 min-w-0"
                        >
                            <h2 className="text-3xl font-extrabold leading-7 text-gray-900 dark:text-white sm:truncate tracking-tight">
                                DashboardOverview
                            </h2>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">Welcome back, track your learning journey.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mt-4 flex md:mt-0 md:ml-4"
                        >
                            <Link
                                to="/create-skill"
                                className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                            >
                                <Plus className="h-5 w-5" />
                                Create New Skill
                            </Link>
                        </motion.div>
                    </div>

                    {/* Stats Grid */}
                    {/* Gamification Stats */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                        <StatCard
                            title="Reputation Points"
                            value={stats?.reputation || 0}
                            icon={Star}
                            color="bg-amber-500"
                            delay={0.1}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-center gap-2"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-500 bg-opacity-10 dark:bg-opacity-20 text-emerald-600">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">Current Level</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.level || 1}</span>
                            </div>

                            {/* Progress Bar to next level (Assume 50 points per level) */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                                    style={{ width: `${((stats?.reputation || 0) % 50) / 50 * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 text-right mt-1">
                                {50 - ((stats?.reputation || 0) % 50)} points to next level
                            </p>
                        </motion.div>

                        <StatCard
                            title="Skills Offered"
                            value={stats?.skillsCount || 0}
                            icon={Briefcase}
                            color="bg-indigo-500"
                            delay={0.3}
                        />
                        <StatCard
                            title="Total Exchanges"
                            value={stats?.totalExchanges || 0}
                            icon={Repeat}
                            color="bg-violet-500"
                            delay={0.4}
                        />
                    </div>

                    {/* Active Exchanges List (Matches Exchanges.jsx Style) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white/50 dark:bg-gray-800/50">
                            <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white">
                                Active Exchanges
                            </h3>
                            <Link to="/exchanges" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {recentExchanges.length > 0 ? (
                            <motion.ul
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="divide-y divide-gray-100 dark:divide-gray-700"
                            >
                                {recentExchanges.map((exchange) => (
                                    <motion.li
                                        key={exchange._id}
                                        variants={itemVariants}
                                        className="p-6 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                        onClick={() => navigate('/exchanges')}
                                    >
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                        {exchange.skill?.title || 'Unknown Skill'}
                                                    </h3>
                                                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border 
                                                        ${exchange.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            exchange.status === 'requested' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                                'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                                        {exchange.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
                                                    <span>
                                                        with <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                            {exchange.provider?._id === stats?._id
                                                                ? exchange.requester?.firstName
                                                                : (exchange.provider?.firstName || "User")}
                                                        </span>
                                                    </span>
                                                    {exchange.updatedAt && (
                                                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                                                            <Clock className="w-3 h-3" /> {new Date(exchange.updatedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <button className="btn btn-sm btn-ghost text-indigo-600">Manage</button>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        ) : (
                            <div className="p-16 text-center text-gray-400 dark:text-gray-500">
                                <Repeat className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-lg font-medium">No active exchanges found.</p>
                                <p className="text-sm">Start browsing the marketplace!</p>
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        </PageTransition>
    );
};

export default Dashboard;
