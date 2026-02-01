import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import NameEntryModal from "./NameEntryModal";
import ChatBubble from "./ChatBubble";
import InputBar from "./InputBar";
import TypingIndicator from "./TypingIndicator";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const WS_URL = BACKEND_URL.replace('https://', 'wss://').replace('http://', 'ws://');

export default function ChatApp() {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState("light");
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load username and theme from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem("chat-username");
    const savedTheme = localStorage.getItem("chat-theme") || "light";
    
    if (savedUsername) {
      setUsername(savedUsername);
    }
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Load message history
  useEffect(() => {
    if (username) {
      loadMessages();
    }
  }, [username]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!username) return;

    const websocket = new WebSocket(`${WS_URL}/api/ws`);

    websocket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "message") {
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            username: data.username,
            message: data.message,
            timestamp: data.timestamp,
          },
        ]);
      } else if (data.type === "typing") {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (data.is_typing && data.username !== username) {
            newSet.add(data.username);
          } else {
            newSet.delete(data.username);
          }
          return newSet;
        });
      } else if (data.type === "error") {
        // Show security/validation errors
        toast.error(data.message);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Erro na conexão");
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    return () => {
      websocket.close();
    };
  }, [username]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await axios.get(`${API}/messages?limit=100`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Erro ao carregar mensagens");
    }
  };

  const handleUsernameSubmit = (name) => {
    setUsername(name);
    localStorage.setItem("chat-username", name);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("chat-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const sendMessage = (message) => {
    if (ws && isConnected) {
      ws.send(
        JSON.stringify({
          type: "message",
          username: username,
          message: message,
        })
      );
    }
  };

  const sendTypingNotification = (isTyping) => {
    if (ws && isConnected) {
      ws.send(
        JSON.stringify({
          type: "typing",
          username: username,
          is_typing: isTyping,
        })
      );
    }
  };

  if (!username) {
    return <NameEntryModal onSubmit={handleUsernameSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F2F5] to-[#E8EAED] dark:from-[#0F172A] dark:to-[#1E293B] transition-colors duration-300">
      <div className="max-w-3xl mx-auto h-screen flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 p-4 flex items-center justify-between sticky top-0 z-20"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-['Outfit']">
              Chat Global
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-['Inter']">
              Olá, {username}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            data-testid="theme-toggle-btn"
            className="p-3 rounded-full bg-[#3390EC] hover:bg-[#2870B8] text-white transition-all duration-200 hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </motion.header>

        {/* Chat Area */}
        <div
          data-testid="chat-messages-container"
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          style={{
            backgroundImage: theme === "dark" ? "url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E')" : "url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E')"
          }}
        >
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.message}
                username={msg.username}
                timestamp={msg.timestamp}
                isOwn={msg.username === username}
              />
            ))}
          </AnimatePresence>
          
          {typingUsers.size > 0 && (
            <TypingIndicator usernames={Array.from(typingUsers)} />
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <InputBar
          onSendMessage={sendMessage}
          onTyping={sendTypingNotification}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
}