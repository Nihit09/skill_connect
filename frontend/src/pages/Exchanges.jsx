import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import Navbar from "../components/Navbar";
import { CheckCircle, XCircle, Clock, MessageSquare, AlertCircle, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";

const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const res = await axiosClient.get('/exchanges');
      setExchanges(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      console.error("Error fetching exchanges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (exchangeId, status) => {
    try {
      await axiosClient.patch(`/exchanges/${exchangeId}/status`, { status });
      fetchExchanges();
    } catch (error) {
      console.error(`Error updating exchange status:`, error);
      alert("Action failed. Please try again.");
    }
  };

  const handleDelete = async (exchangeId) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      await axiosClient.delete(`/exchanges/${exchangeId}`);
      setExchanges(prev => prev.filter(ex => ex._id !== exchangeId)); // Optimistic UI update
    } catch (error) {
      console.error("Error deleting exchange:", error);
      alert("Failed to delete request.");
      fetchExchanges(); // Revert on failure
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a] bg-[#0a0a0a]">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white text-white">
                My Exchanges
              </h1>
              <p className="mt-1 text-gray-500">Manage your skill swap requests and progress.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-20">
              <span className="loading loading-spinner loading-lg text-white"></span>
            </div>
          ) : (
            <div className="bg-transparent/80 backdrop-blur-md bg-[#111111]/80 rounded-2xl overflow-hidden border border-[#333333] border-[#333333]">
              {exchanges.length === 0 ? (
                <div className="p-16 text-center text-gray-500 text-gray-400">
                  <div className="w-20 h-20 bg-[#111111] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Exchanges Yet</h3>
                  <p>Go to the Marketplace to request your first skill exchange!</p>
                  <Link to="/marketplace" className="mt-6 inline-block px-6 py-2 bg-white text-black font-bold rounded-xl font-medium hover:bg-gray-200 transition">
                    Explore Marketplace
                  </Link>
                </div>
              ) : (
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="divide-y divide-gray-100 dark:divide-gray-700"
                >
                  <AnimatePresence>
                    {exchanges.map((exchange) => {
                      const isProvider = exchange.provider?._id === user?._id || exchange.provider === user?._id;
                      const isRequester = exchange.requester?._id === user?._id || exchange.requester === user?._id;

                      return (
                        <motion.li
                          key={exchange._id}
                          variants={itemVariants}
                          exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                          className="p-6 hover:bg-[#111111]/30 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-white text-white">
                                  {exchange.skill?.title || 'Unknown Skill'}
                                </h3>
                                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border 
                                  ${exchange.status === 'accepted' ? 'bg-[#111111] text-green-700 border-green-200' :
                                    exchange.status === 'requested' ? 'bg-[#111111] text-yellow-700 border-yellow-200' :
                                      exchange.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        'bg-red-50 text-red-700 border-red-200'}`}>
                                  {exchange.status.toUpperCase()}
                                </span>
                                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border 
                                  ${exchange.exchangeType === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    'bg-[#111111] text-gray-700 border-gray-200'}`}>
                                  {exchange.exchangeType === 'paid' ? `PAID ($${exchange.cost})` : 'BARTER / FREE'}
                                </span>
                              </div>
                              <div className="mt-2 text-sm text-gray-500 text-gray-400">
                                {isProvider ? (
                                  <p>Request from: <span className="font-semibold text-gray-700">{exchange.requester?.firstName} {exchange.requester?.lastName}</span></p>
                                ) : (
                                  <p>Provider: <span className="font-semibold text-gray-700">{exchange.provider?.firstName} {exchange.provider?.lastName}</span></p>
                                )}
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {new Date(exchange.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Provider Actions */}
                              {exchange.status === 'requested' && isProvider && (
                                <>
                                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction(exchange._id, 'accepted')} className="btn btn-sm btn-success text-white">
                                    <CheckCircle className="h-4 w-4 mr-1" /> Accept
                                  </motion.button>
                                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction(exchange._id, 'rejected')} className="btn btn-sm btn-error text-white">
                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                  </motion.button>
                                </>
                              )}

                              {/* Requester Actions */}
                              {exchange.status === 'requested' && isRequester && (
                                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction(exchange._id, 'cancelled')} className="btn btn-sm btn-ghost border-gray-300">
                                  Cancel Request
                                </motion.button>
                              )}

                              {/* Active / Completed Actions */}
                              {exchange.status === 'accepted' && (
                                <>
                                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/chat')} className="btn btn-sm btn-primary text-white">
                                    <MessageSquare className="h-4 w-4 mr-1" /> Chat
                                  </motion.button>
                                  <Link to={`/workspace/${exchange._id}`} className="btn btn-sm btn-warning text-white">
                                    <CheckCircle className="h-4 w-4 mr-1" /> Open Workspace
                                  </Link>
                                  {isRequester && (
                                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction(exchange._id, 'completed')} className="btn btn-sm btn-info text-white">
                                      <CheckCircle className="h-4 w-4 mr-1" /> Complete
                                    </motion.button>
                                  )}
                                </>
                              )}
                              {/* Completed Actions */}
                              {exchange.status === 'completed' && (
                                <Link to={`/workspace/${exchange._id}`} className="btn btn-sm btn-warning text-white">
                                  Open Workspace (Read-Only)
                                </Link>
                              )}

                              {/* Delete Action (Always available for finished/cancelled, or if owner of pending) */}
                              {(exchange.status !== 'accepted' && exchange.status !== 'completed') && (
                                <motion.button
                                  whileHover={{ scale: 1.1, backgroundColor: "#fee2e2" }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(exchange._id)}
                                  className="p-2 text-gray-400 rounded-full hover:text-red-500 transition-colors"
                                  title="Delete Request"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </motion.button>
                              )}
                              {/* Separate case for completed/rejected cleanup if not covered above */}
                              {(exchange.status === 'rejected' || exchange.status === 'cancelled') && (
                                // Already covered by the condition above (status !== accepted && status !== completed) 
                                // Actually 'completed' is excluded above. Do we want to allow deleting completed?
                                // User said "dlt request", which implies pending. 
                                // Backend logic I wrote allows deleting `requested`, `rejected`, `cancelled`.
                                // It BLOCKS `accepted` and `completed`.
                                // So the UI Condition: status !== 'accepted' && status !== 'completed' is correct.
                                null
                              )}
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </motion.ul>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Exchanges;
