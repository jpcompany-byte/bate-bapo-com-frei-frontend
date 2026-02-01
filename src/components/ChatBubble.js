import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ChatBubble({ message, username, timestamp, isOwn }) {
  const formattedTime = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
      data-testid={isOwn ? "own-message-bubble" : "other-message-bubble"}
    >
      <div className={`max-w-[80%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
        {!isOwn && (
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 ml-3 font-['Inter']">
            {username}
          </span>
        )}
        <div
          className={`p-3 rounded-2xl shadow-sm relative ${
            isOwn
              ? "bg-[#3390EC] text-white rounded-tr-sm"
              : "bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-tl-sm"
          }`}
        >
          <p className="text-base break-words font-['Inter']" data-testid="message-text">
            {message}
          </p>
          <span
            className={`text-[10px] mt-1 block ${
              isOwn ? "text-white/70" : "text-gray-500 dark:text-gray-400"
            } font-['JetBrains_Mono']`}
            data-testid="message-timestamp"
          >
            {formattedTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
}