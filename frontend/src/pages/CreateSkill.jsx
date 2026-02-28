import { useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import Navbar from "../components/Navbar";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const CreateSkill = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Web Development",
    difficulty: "Beginner",
    description: "",
    price: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.description.length < 20) {
      alert("Description must be at least 20 characters long.");
      return;
    }

    setLoading(true);
    try {
      // Determine isPaid based on price
      const isPaid = Number(formData.price) > 0;
      const payload = { ...formData, isPaid };

      await axiosClient.post('/skills', payload);
      navigate('/my-skills');
    } catch (error) {
      console.error("Error creating skill:", error);
      const msg = error.response?.data?.error || "Failed to create skill";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6">
            <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111] border border-[#333333] border-[#333333] rounded-2xl overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-[#333333] border-[#333333] bg-[#0a0a0a]/50 bg-[#111111]/50 flex items-center gap-4">
              <div className="p-3 bg-[#111111] text-white rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Create New Skill
                </h3>
                <p className="text-sm text-gray-400">
                  Share your expertise with the community.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-gray-700 text-gray-300 mb-2">
                  Skill Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  minLength={5}
                  className="block w-full border border-gray-300 border-[#444444] rounded-xl px-4 py-3 bg-transparent bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all "
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Advanced React Patterns"
                />
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className="block text-sm font-bold text-gray-700 text-gray-300 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      className="block w-full border border-gray-300 border-[#444444] rounded-xl px-4 py-3 bg-transparent bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all appearance-none"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option>Web Development</option>
                      <option>Data Science</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>Music</option>
                      <option>Language</option>
                      <option>Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="difficulty" className="block text-sm font-bold text-gray-700 text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <div className="relative">
                    <select
                      id="difficulty"
                      name="difficulty"
                      className="block w-full border border-gray-300 border-[#444444] rounded-xl px-4 py-3 bg-transparent bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all appearance-none"
                      value={formData.difficulty}
                      onChange={handleChange}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-bold text-gray-700 text-gray-300 mb-2">
                  Price (Credits) - 0 for Free
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  className="block w-full border border-gray-300 border-[#444444] rounded-xl px-4 py-3 bg-transparent bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all "
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-700 text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  minLength={20}
                  className="block w-full border border-gray-300 border-[#444444] rounded-xl px-4 py-3 bg-transparent bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all resize-none"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what users will learn (min 20 characters)..."
                />
              </div>

              <div className="flex justify-end pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-8 py-3.5 border border-transparent rounded-xl  text-base font-bold bg-white text-black font-bold hover:bg-gray-200 focus:outline-none transition-all"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  Publish Skill
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CreateSkill;
