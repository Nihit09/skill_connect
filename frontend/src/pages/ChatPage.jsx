import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Send, Search, MoreVertical, Phone, Video, Info } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';

const ChatPage = () => {
  const { user } = useSelector(state => state.auth);
  const [exchanges, setExchanges] = useState([]);
  const [activeExchange, setActiveExchange] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // Fetch accepted exchanges to populate sidebar
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axiosClient.get('/exchanges');
        const allExchanges = Array.isArray(res.data) ? res.data : res.data.data || [];
        // Filter only accepted exchanges
        const accepted = allExchanges.filter(ex => ex.status === 'accepted');
        setExchanges(accepted);

        // Check if we need to deep link to a specific exchange
        if (location.state?.exchangeId) {
          const target = accepted.find(ex => ex._id === location.state.exchangeId);
          if (target) {
            setActiveExchange(target);
          }
        } else if (!activeExchange && accepted.length > 0) {
          // Optional: Auto-select first chat if none selected?
          // setActiveExchange(accepted[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setLoading(false);
      }
    };
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Socket Connection
  useEffect(() => {
    // Base URL logic - assuming proxied or localhost:3000
    const socketInstance = io("http://localhost:3000", {
      withCredentials: true
    });

    socketInstance.on('connect', () => {
      console.log("Socket connected");
    });

    socketInstance.on('receive_message', (message) => {
      // Only append if it belongs to the active conversation
      // In a real app, you'd update the sidebar preview too
      setMessages(prev => {
        // Check if message belongs to current exchange
        // Note: We need to know the current activeExchange ID inside this callback
        // Since state in closure might be stale, we can check message.exchange ID against a ref, 
        // OR just append and let the UI filter? 
        // Better: Just append. But wait, if we switch chats, we clear messages.
        // So if we receive a message for a DIFFERENT chat, we shouldn't show it in the current window.
        // For simplicity MVP: We will filter in the render or check ID.
        return [...prev, message];
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Load messages when active exchange changes
  useEffect(() => {
    if (!activeExchange || !socket) return;

    // Join room
    socket.emit('join_exchange', activeExchange._id);

    const fetchMessages = async () => {
      try {
        const res = await axiosClient.get(`/messages/${activeExchange._id}`);
        setMessages(res.data.data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };
    fetchMessages();
  }, [activeExchange, socket]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeExchange]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !activeExchange) return;

    const msgData = {
      exchangeId: activeExchange._id,
      text: newMessage
    };

    // UI Optimistic update (optional) - for now wait for socket loopback or just emit
    // Logic in socket.js emits back to sender too? Yes, 'io.to(room).emit'.

    socket.emit('send_message', msgData);
    setNewMessage("");
  };

  // Helper to get other participant
  const getOtherUser = (exchange) => {
    const isProvider = exchange.provider?._id === user?._id || exchange.provider === user?._id;
    return isProvider ? exchange.requester : exchange.provider;
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 flex gap-4 h-[calc(100vh-64px)]">
        {/* Sidebar - Chat List */}
        <div className="w-1/3 bg-[#111111] rounded-2xl border border-[#333333] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#333333] border-[#333333]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Messages</h2>
              <MoreVertical className="text-gray-400 cursor-pointer" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-[#1a1a1a] text-sm rounded-xl py-2 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center p-4"><span className="loading loading-spinner text-gray-300"></span></div>
            ) : exchanges.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No active chats. Accept an exchange request to start chatting!</div>
            ) : (
              exchanges.map(ex => {
                const other = getOtherUser(ex);
                const isActive = activeExchange?._id === ex._id;
                return (
                  <div
                    key={ex._id}
                    onClick={() => setActiveExchange(ex)}
                    className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-[#0a0a0a] dark:hover:bg-gray-700 ${isActive ? 'bg-[#1a1a1a] border-r-4 border-gray-600' : ''}`}
                  >
                    <div className="avatar placeholder">
                      <div className="bg-[#111111] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                        {other?.firstName?.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {other?.firstName} {other?.lastName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {ex.skill?.title}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-[#111111] rounded-2xl border border-[#333333] overflow-hidden flex flex-col">
          {activeExchange ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#333333] border-[#333333] flex items-center justify-between bg-[#111111] z-10">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      {getOtherUser(activeExchange)?.firstName?.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {getOtherUser(activeExchange)?.firstName} {getOtherUser(activeExchange)?.lastName}
                    </h3>
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#111111]0 rounded-full"></span> Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <Phone className="cursor-pointer hover:text-white transition-colors h-5 w-5" />
                  <Video className="cursor-pointer hover:text-white transition-colors h-6 w-6" />
                  <Info className="cursor-pointer hover:text-white transition-colors h-5 w-5" />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a] space-y-4">
                {messages
                  .filter(m => m.exchange === activeExchange._id || m.exchange?._id === activeExchange._id) // Client-side filtering just in case
                  .map((msg, idx) => {
                    const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                    return (
                      <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm ${isMe
                          ? 'bg-gray-800 text-white rounded-br-none'
                          : 'bg-[#111111] text-gray-200 border border-[#333333] border-[#333333] rounded-bl-none'
                          }`}>
                          <p>{msg.text}</p>
                          <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-gray-200' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[#111111] border-t border-[#333333]">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-[#111111] bg-[#0a0a0a] rounded-full px-4 py-2 border border-transparent focus-within:border-gray-600 focus-within:bg-transparent focus-within:ring-2 focus-within:ring-gray-600 transition-all">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 text-white"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="text-white disabled:text-gray-400 transition-colors p-2 hover:bg-[#111111] rounded-full"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
              <div className="w-24 h-24 bg-[#111111] bg-[#111111] rounded-full flex items-center justify-center mb-4">
                <Send className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400">Your Messages</h3>
              <p className="text-sm">Send private photos and messages to a friend or group.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
