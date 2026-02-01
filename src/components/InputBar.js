import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Smile } from "lucide-react";
import { toast } from "sonner";
import EmojiPicker from "./EmojiPicker";

export default function InputBar({ onSendMessage, onTyping, isConnected }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!message && typingTimeoutRef.current) {
      onTyping(false);
      clearTimeout(typingTimeoutRef.current);
    }
  }, [message]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Send typing notification
    if (e.target.value) {
      onTyping(true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) {
      toast.error("Mensagem não pode estar vazia");
      return;
    }
    
    if (!isConnected) {
      toast.error("Não conectado ao servidor");
      return;
    }
    
    onSendMessage(trimmedMessage);
    setMessage("");
    onTyping(false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-slate-700 sticky bottom-0 z-10">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Digite sua mensagem..."
            data-testid="message-input"
            className="w-full px-6 py-4 pr-12 rounded-full bg-gray-100 dark:bg-slate-700 border-2 border-transparent focus:border-[#3390EC] focus:bg-white dark:focus:bg-slate-600 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-['Inter']"
            maxLength={500}
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            data-testid="emoji-picker-btn"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
          >
            <Smile size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
          
          {showEmojiPicker && (
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>
        
        <motion.button
          type="submit"
          data-testid="send-message-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-full bg-[#3390EC] hover:bg-[#2870B8] text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative z-50"
          disabled={!isConnected}
        >
          <Send size={20} />
        </motion.button>
      </form>
      
      {!isConnected && (
        <p className="text-xs text-red-500 mt-2 text-center font-['Inter']">
          Desconectado - Tentando reconectar...
        </p>
      )}
    </div>
  );
}