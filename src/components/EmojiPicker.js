import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = [
  "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊",
  "😇", "🙂", "😉", "😍", "🥰", "😘", "😗", "😙",
  "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐",
  "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔",
  "😟", "😕", "🙁", "😣", "😖", "😫", "😩", "🥺",
  "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳",
  "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
  "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬",
  "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴",
  "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧",
  "😷", "🤒", "🤕", "🤑", "🤠", "👍", "👎", "👋",
  "🤚", "👏", "🙌", "👐", "🤝", "🙏", "💪", "🎉",
  "🎊", "🎈", "🎁", "🏆", "❤️", "🧡", "💛", "💚",
  "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕",
  "💞", "💓", "💗", "💖", "💘", "💝", "🔥", "✨",
];

export default function EmojiPicker({ onEmojiSelect, onClose }) {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={pickerRef}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        data-testid="emoji-picker"
        className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-4 w-80 max-h-64 overflow-y-auto z-50"
      >
        <div className="grid grid-cols-8 gap-2">
          {EMOJIS.map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onEmojiSelect(emoji)}
              data-testid={`emoji-${emoji}`}
              className="text-2xl hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg p-2 transition-colors duration-150 hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}