import { useState, useEffect } from "react";
import { Link } from "react-router";
import axiosClient from "../utils/axiosClient";
import Navbar from "../components/Navbar";
import { Search, Filter, BookOpen, User, Star, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";

const Marketplace = () => {
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [searchType, setSearchType] = useState("skills"); // "skills" or "users"

  // Debounce search for users
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchType === 'users') {
        fetchUsers(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchType]);

  // Initial load
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/skills');
      setSkills(res.data.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (query = "") => {
    // Don't set global loading true here to avoid flickering, maybe local state if needed
    // but for now simplistic approach
    if (!query && users.length > 0) return; // Optional optimization

    try {
      const res = await axiosClient.get(`/users?search=${query}`);
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRequest = async (skillId) => {
    try {
      await axiosClient.post('/exchanges', { skillId });
      alert("Exchange requested successfully!");
    } catch (error) {
      console.error("Error requesting exchange:", error);
      alert("Failed to request exchange. You might need more reputation or credits.");
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "All" || skill.category === category;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
              Explore & Connect
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-400">
              Search for skills or find experts directly.
            </p>
          </motion.div>

          {/* Search & Tabs */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-[#111111] rounded-xl border border-[#333333] overflow-hidden flex flex-col md:flex-row">
              {/* Tabs */}
              <div className="flex md:w-64 border-b md:border-b-0 md:border-r border-[#333333]">
                <button
                  onClick={() => setSearchType("skills")}
                  className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${searchType === "skills" ? "bg-[#1a1a1a] text-gray-400" : "text-gray-500 hover:bg-[#1a1a1a]"}`}
                >
                  <BookOpen className="w-4 h-4" /> Skills
                </button>
                <button
                  onClick={() => {
                    setSearchType("users");
                    fetchUsers(searchTerm);
                  }}
                  className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${searchType === "users" ? "bg-[#1a1a1a] text-gray-400" : "text-gray-500 hover:bg-[#1a1a1a]"}`}
                >
                  <Users className="w-4 h-4" /> People
                </button>
              </div>

              {/* Search Bar & Filters */}
              <div className="flex-1 p-2 flex flex-col sm:flex-row gap-2 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    className="block w-full pl-9 pr-4 py-2 rounded-lg bg-transparent border border-[#333333] focus:ring-2 focus:ring-gray-600 transition-all outline-none text-sm text-white placeholder-gray-500"
                    placeholder={searchType === "skills" ? "Search for a skill..." : "Search for a person..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* filters for skills only */}
                {searchType === "skills" && (
                  <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    <select
                      className="block w-full sm:w-48 py-2 pl-3 pr-8 rounded-lg bg-[#1a1a1a] text-sm border border-[#333333] focus:ring-2 focus:ring-gray-600 appearance-none cursor-pointer text-gray-200"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option>All Categories</option>
                      <option>Web Development</option>
                      <option>Data Science</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>Music</option>
                      <option>Language</option>
                      <option>Other</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          {loading && searchType === 'skills' ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-white"></span>
            </div>
          ) : (
            <div className="min-h-[400px]">
              {searchType === "skills" ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence>
                    {filteredSkills.map(skill => (
                      <motion.div
                        key={skill._id}
                        variants={itemVariants}
                        layout
                        whileHover={{ y: -8 }}
                        className="bg-[#111111] rounded-2xl border border-[#333333] overflow-hidden hover: transition-all flex flex-col h-full group"
                      >
                        <div className="p-6 flex flex-col h-full">
                          <div className="flex items-center justify-between mb-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${skill.price > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                              {skill.price > 0 ? `${skill.price} Credits` : 'Free'}
                            </span>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider bg-[#1a1a1a] text-gray-300 px-2 py-1 rounded-md">{skill.category}</span>
                          </div>

                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                            {skill.title}
                          </h3>

                          <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-grow">
                            {skill.description}
                          </p>

                          <div className="flex items-center gap-3 mb-6 pt-6 border-t border-[#333333]">
                            <div className="h-10 w-10 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-sm">
                              {skill.owner?.firstName?.[0] || <User className="w-5 h-5" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-400">Provider</span>
                              <Link to={`/user/${skill.owner?._id}`} className="font-semibold text-sm text-white hover:text-gray-300 hover:underline">
                                {skill.owner?.firstName || 'Unknown'} {skill.owner?.lastName || ''}
                              </Link>
                            </div>
                          </div>

                          <div className="mt-auto">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRequest(skill._id)}
                              className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-xl  text-sm font-bold bg-white text-black font-bold hover:bg-gray-200 focus:outline-none transition-all"
                            >
                              <BookOpen className="h-4 w-4 mr-2" />
                              Request Exchange
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredSkills.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                      No skills found matching your criteria.
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence>
                    {users.map(user => (
                      <motion.div
                        key={user._id}
                        variants={itemVariants}
                        layout
                        whileHover={{ y: -8 }}
                        className="bg-[#111111] rounded-2xl border border-[#333333] overflow-hidden hover: transition-all"
                      >
                        <Link to={`/user/${user._id}`} className="block p-6 text-center group">
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#1a1a1a] flex items-center justify-center text-3xl font-bold text-gray-400 group-hover:bg-[#111111] group-hover:text-white transition-colors">
                            {user.firstName?.[0]}
                          </div>
                          <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors mb-1">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-300 font-medium bg-[#0a0a0a] inline-block px-3 py-1 rounded-full mb-4">
                            {user.role || 'Member'}
                          </p>

                          <div className="flex justify-center gap-4 text-sm text-gray-400 border-t border-[#333333] pt-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="font-bold text-white">{user.reputation || 0}</span> Rep
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span className="font-bold text-white">{user.level || 1}</span> Lvl
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {users.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                      No users found matching "{searchTerm}".
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Marketplace;
