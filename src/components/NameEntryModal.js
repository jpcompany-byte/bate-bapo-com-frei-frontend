import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function NameEntryModal({ onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (trimmedName.length < 2) {
      toast.error("Nome deve ter pelo menos 2 caracteres");
      return;
    }
    
    if (trimmedName.length > 20) {
      toast.error("Nome deve ter no máximo 20 caracteres");
      return;
    }
    
    onSubmit(trimmedName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3390EC] to-[#2870B8] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-2 font-['Outfit']"
          >
            Bem-vindo!
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 font-['Inter']"
          >
            Digite seu nome para começar a conversar
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome..."
              data-testid="username-input"
              className="w-full px-6 py-4 rounded-2xl bg-gray-100 dark:bg-slate-700 border-2 border-transparent focus:border-[#3390EC] focus:bg-white dark:focus:bg-slate-600 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-['Inter']"
              autoFocus
              maxLength={20}
            />
          </motion.div>

          <motion.button
            type="submit"
            data-testid="submit-username-btn"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#3390EC] hover:bg-[#2870B8] text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-['Inter']"
          >
            Entrar no Chat
            <Send size={20} />
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6 font-['Inter']"
        >
          Ao entrar, você pode conversar com todos online
        </motion.p>
      </motion.div>
    </div>
  );
}