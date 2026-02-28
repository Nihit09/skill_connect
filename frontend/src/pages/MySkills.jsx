import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import Navbar from "../components/Navbar";
import { Plus, Edit2, Trash2, Layers, DollarSign, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMySkills();
  }, []);

  const fetchMySkills = async () => {
    try {
      const res = await axiosClient.get('/skills/my-skills');
      setSkills(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent triggering parent click
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await axiosClient.delete(`/skills/${id}`);
        setSkills(skills.filter(skill => skill._id !== id));
      } catch (err) {
        console.error("Error deleting skill:", err);
        alert("Failed to delete skill");
      }
    }
  };

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
      <div className="min-h-screen bg-[#0a0a0a] bg-[#0a0a0a]">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a] bg-[#0a0a0a]">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white text-white">My Skills</h1>
              <p className="mt-1 text-gray-500">Manage the skills you offer to the community.</p>
            </div>
            <Link
              to="/create-skill"
              className="px-5 py-2.5 bg-white text-black font-bold font-semibold rounded-xl  hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create New Skill
            </Link>
          </div>

          <div className="bg-transparent/80 backdrop-blur-md bg-[#111111]/80 rounded-2xl overflow-hidden border border-[#333333] border-[#333333]">
            {skills.length === 0 ? (
              <div className="p-16 text-center text-gray-500 text-gray-400">
                <div className="bg-[#111111] bg-[#1a1a1a] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layers className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-white text-white">No skills created yet</h3>
                <p className="mt-2 text-gray-500 text-gray-400">Start sharing your expertise by creating your first skill listing.</p>
                <div className="mt-8">
                  <Link
                    to="/create-skill"
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all inline-flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Create Skill
                  </Link>
                </div>
              </div>
            ) : (
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-gray-100 dark:divide-gray-700"
              >
                <AnimatePresence>
                  {skills.map((skill) => (
                    <motion.li
                      key={skill._id}
                      variants={itemVariants}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 hover:bg-[#111111]/30 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-white text-white">
                              {skill.title}
                            </h3>
                            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#111111] text-gray-600 border border-gray-200 uppercase tracking-wider">
                              {skill.category}
                            </span>
                            {skill.isPaid ? (
                              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                <DollarSign className="w-3 h-3" /> {skill.price} Credits
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#111111] text-green-700 border border-green-200">
                                Free
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-gray-500 text-sm line-clamp-1 text-gray-400">
                            {skill.description}
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-400 font-medium">
                            <span className={`
                              ${skill.difficulty === 'Beginner' ? 'text-green-600' :
                                skill.difficulty === 'Intermediate' ? 'text-amber-600' : 'text-red-600'}
                            `}>
                              {skill.difficulty} Level
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link to={`/edit-skill/${skill._id}`}>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-[#111111] transition-colors"
                              title="Edit Skill"
                            >
                              <Edit2 className="h-5 w-5" />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleDelete(skill._id, e)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete Skill"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MySkills;
