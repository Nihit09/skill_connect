import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import Navbar from "../components/Navbar";
import { ArrowLeft, BookOpen, Star, Shield, MapPin, Mail, User as UserIcon, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import { useSelector } from "react-redux";

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector(state => state.auth);
    const [profileUser, setProfileUser] = useState(null);
    const [userSkills, setUserSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeExchange, setActiveExchange] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user details
                const userRes = await axiosClient.get(`/users/${id}`);
                setProfileUser(userRes.data.data);

                // Fetch user skills
                const skillsRes = await axiosClient.get(`/skills?owner=${id}`);
                setUserSkills(skillsRes.data.data);

                // Check for existing exchange to enable messaging
                if (currentUser) {
                    const exchangesRes = await axiosClient.get('/exchanges');
                    const allExchanges = Array.isArray(exchangesRes.data) ? exchangesRes.data : exchangesRes.data.data || [];

                    // Find an accepted exchange between current user and profile user
                    const existingChart = allExchanges.find(ex =>
                        ex.status === 'accepted' &&
                        (
                            (ex.requester?._id === currentUser._id && ex.provider?._id === id) ||
                            (ex.provider?._id === currentUser._id && ex.requester?._id === id)
                        )
                    );
                    setActiveExchange(existingChart);
                }

            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load user profile");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, currentUser]);

    const handleRequest = async (skillId) => {
        try {
            await axiosClient.post('/exchanges', { skillId });
            alert("Exchange requested successfully!");
        } catch (error) {
            console.error("Error requesting exchange:", error);
            alert("Failed to request exchange.");
        }
    };

    const handleMessage = () => {
        if (activeExchange) {
            navigate('/chat', { state: { exchangeId: activeExchange._id } });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] dark:bg-gray-900">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <span className="loading loading-spinner loading-lg text-indigo-600"></span>
                </div>
            </div>
        );
    }

    if (error || !profileUser) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] dark:bg-gray-900">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-3xl font-bold text-white dark:text-white">User Not Found</h2>
                    <p className="mt-2 text-gray-400 dark:text-gray-400">The user you are looking for does not exist.</p>
                    <Link to="/marketplace" className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl inline-flex items-center hover:bg-indigo-700 transition">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Marketplace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#0a0a0a] dark:bg-gray-900">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="mb-6">
                        <Link to="/marketplace" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-indigo-600 transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Marketplace
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar: Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-transparent dark:bg-gray-800  border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden sticky top-24">
                                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                </div>
                                <div className="px-6 pb-8 relative">
                                    <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                                        <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-[#111111] flex items-center justify-center text-4xl font-bold text-indigo-600 ">
                                            {profileUser.firstName?.[0]}
                                        </div>
                                    </div>
                                    <div className="mt-20 text-center">
                                        <h1 className="text-2xl font-bold text-white dark:text-white">
                                            {profileUser.firstName} {profileUser.lastName}
                                        </h1>
                                        <p className="text-sm font-medium text-indigo-500 capitalize px-3 py-1 bg-indigo-50 dark:bg-gray-700 rounded-full inline-block mt-2">{profileUser.role}</p>

                                        {activeExchange && (
                                            <div className="mt-6">
                                                <button
                                                    onClick={handleMessage}
                                                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl  transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <MessageSquare className="w-4 h-4" /> Message
                                                </button>
                                            </div>
                                        )}

                                        <div className="mt-8 space-y-4 text-left">
                                            <div className="flex items-center justify-between p-3 bg-[#0a0a0a] dark:bg-gray-700/50 rounded-xl">
                                                <span className="text-sm text-gray-400 dark:text-gray-400 flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-indigo-500" /> Level
                                                </span>
                                                <span className="font-bold text-white dark:text-white">{profileUser.level}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-[#0a0a0a] dark:bg-gray-700/50 rounded-xl">
                                                <span className="text-sm text-gray-400 dark:text-gray-400 flex items-center gap-2">
                                                    <Star className="h-4 w-4 text-amber-500" /> Reputation
                                                </span>
                                                <span className="font-bold text-white dark:text-white">{profileUser.reputation}</span>
                                            </div>
                                            {profileUser.email && (
                                                <div className="flex items-center p-3 bg-[#0a0a0a] dark:bg-gray-700/50 rounded-xl overflow-hidden">
                                                    <Mail className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                                                    <span className="text-sm text-gray-300 dark:text-slate-300 truncate">{profileUser.email}</span>
                                                </div>
                                            )}
                                        </div>

                                        {profileUser.profile?.bio && (
                                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-gray-700 text-left">
                                                <h3 className="text-sm font-bold text-white dark:text-white mb-2 uppercase tracking-wide opacity-50">About</h3>
                                                <p className="text-sm text-gray-300 dark:text-slate-300 leading-relaxed">{profileUser.profile.bio}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content: Skills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-3"
                        >
                            <h2 className="text-2xl font-bold text-white dark:text-white mb-6 flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-indigo-600" /> Offered Skills
                            </h2>

                            {userSkills.length === 0 ? (
                                <div className="bg-transparent dark:bg-gray-800 rounded-2xl  border border-gray-800 dark:border-gray-700 p-16 text-center text-gray-400 dark:text-gray-400">
                                    <UserIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p className="text-xl font-medium">This user hasn't posted any skills yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {userSkills.map((skill, index) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={skill._id}
                                            whileHover={{ y: -5 }}
                                            className="bg-transparent dark:bg-gray-800 rounded-2xl  border border-gray-800 dark:border-gray-700 overflow-hidden hover: transition-all flex flex-col h-full"
                                        >
                                            <div className="p-6 flex flex-col h-full">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${skill.price > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                                                        {skill.price > 0 ? `${skill.price} Credits` : 'Free'}
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-400 bg-[#111111] px-2 py-1 rounded dark:bg-gray-700 dark:text-slate-300 uppercase tracking-wider">{skill.category}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white dark:text-white mb-2">
                                                    {skill.title}
                                                </h3>
                                                <p className="text-sm text-gray-300 dark:text-slate-300 line-clamp-3 mb-6 flex-grow">
                                                    {skill.description}
                                                </p>

                                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-gray-700">
                                                    {activeExchange ? (
                                                        <div className="text-center text-sm text-green-600 font-medium py-2 bg-green-50 rounded-lg">
                                                            Active Exchange Connected
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleRequest(skill._id)}
                                                            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-xl   dark: text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-all transform active:scale-95"
                                                        >
                                                            <BookOpen className="h-4 w-4 mr-2" />
                                                            Request Exchange
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default UserProfile;
