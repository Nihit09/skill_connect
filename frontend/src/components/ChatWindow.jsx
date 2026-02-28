import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { X, Send } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const ChatWindow = ({ exchangeId, exchangeTitle, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const { user } = useSelector(state => state.auth);
    const messagesEndRef = useRef(null);

    // Initial load: Fetch history & Connect Socket
    useEffect(() => {
        // Fetch history
        const fetchHistory = async () => {
            try {
                const res = await axiosClient.get(`/messages/${exchangeId}`);
                setMessages(res.data.data);
            } catch (error) {
                console.error("Failed to load messages:", error);
            }
        };
        fetchHistory();

        // Connect Socket
        // Assuming backend is on port 3000, and we use proxy via vite or axios baseURL logic?
        // Usually socket.io client needs explicit URL if different origin, or relative if same.
        // Let's use logic similar to axiosClient base URL but for socket.
        // Hardcoding typically works in dev: http://localhost:3000
        const socketInstance = io("http://localhost:3000", {
            auth: {
                token: document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] // Getting token from cookie might be tricky if httpOnly. 
                // Ah, right, our cookies are httpOnly. Socket.io with credentials:true sends cookies!
                // Backend 'socket.js' uses `socket.handshake.query.token`.
                // Actually, `socket.io` client sends cookies automatically if `{ withCredentials: true }` (depends on version, usually `withCredentials` option).
                // But backend logic in `socket.js` is: `token = socket.handshake.auth.token || socket.handshake.query.token`.
                // If cookies are httpOnly, JS cannot read `document.cookie`.
                // SO we rely on the browser sending the cookie and the backend parsing it from the header.
                // BUT `socket.js` middleware I wrote checks `handshake.auth.token`.
                // I need to update `socket.js` to parse cookies from `socket.request.headers.cookie`.
                // OR I need the frontend to not need to send the token explicitly if it's in the cookie.
            },
            withCredentials: true // Important for sending cookies
        });

        socketInstance.on('connect', () => {
            console.log("Socket connected");
            socketInstance.emit('join_exchange', exchangeId);
        });

        socketInstance.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        socketInstance.on('connect_error', (err) => {
            console.error("Socket connection error:", err);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [exchangeId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        socket.emit('send_message', {
            exchangeId,
            text: newMessage
        });

        setNewMessage("");
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-transparent  rounded-xl border border-gray-200 flex flex-col z-50">
            {/* Header */}
            <div className="bg-white text-black text-white p-4 rounded-t-xl flex justify-between items-center ">
                <div>
                    <h3 className="font-semibold text-sm">Chat</h3>
                    <p className="text-xs opacity-80 truncate w-60">{exchangeTitle}</p>
                </div>
                <button onClick={onClose} className="hover:bg-gray-200 p-1 rounded-full transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-3">
                {messages.map((msg, idx) => {
                    const isMe = msg.sender?._id === user._id || msg.sender === user._id; // Handle populated vs unpopulated
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm  ${isMe
                                    ? 'bg-white text-black text-white rounded-br-none'
                                    : 'bg-transparent text-gray-100 border border-gray-200 rounded-bl-none'
                                }`}>
                                <p>{msg.text}</p>
                                <span className={`text-[10px] block mt-1 ${isMe ? 'text-gray-200' : 'text-gray-400'}`}>
                                    {msg.sender?.firstName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-transparent border-t border-gray-100 rounded-b-xl flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 input input-sm input-bordered focus:border-gray-600 focus:ring-1 focus:ring-gray-600 rounded-full"
                />
                <button
                    type="submit"
                    className="btn btn-sm btn-circle btn-primary bg-white text-black hover:bg-gray-200 border-none text-white  transform active:scale-95 transition-all"
                    disabled={!newMessage.trim()}
                >
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
