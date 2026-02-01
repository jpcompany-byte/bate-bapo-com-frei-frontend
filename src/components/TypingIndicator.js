import { motion } from "framer-motion";

export default function TypingIndicator({ usernames }) {
  const text =
    usernames.length === 1
      ? `${usernames[0]} está digitando...`
      : usernames.length === 2
      ? `${usernames[0]} e ${usernames[1]} estão digitando...`
      : `${usernames.length} pessoas estão digitando...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-start"
      data-testid="typing-indicator"
    >
      <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-sm p-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600 dark:text-gray-300 font-['Inter'] mr-2">
            {text}
          </span>
          <motion.div
            className="flex gap-1"
            initial="start"
            animate="end"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#3390EC] rounded-full"
                variants={{
                  start: { y: 0 },
                  end: { y: 0 },
                }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}