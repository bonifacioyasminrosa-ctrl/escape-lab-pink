import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";

interface NameInputScreenProps {
  onSubmit: (name: string) => void;
}

export default function NameInputScreen({ onSubmit }: NameInputScreenProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col items-center justify-center bg-background p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-full max-w-md space-y-8 text-center"
      >
        <div className="flex justify-center">
          <div className="rounded-full bg-game-surface p-6 glow-pink">
            <FlaskConical className="h-16 w-16 text-primary" />
          </div>
        </div>

        <div>
          <h1 className="font-display text-4xl text-primary text-glow-pink">
            O Enigma do Laboratório
          </h1>
          <p className="mt-3 font-narrative text-lg text-muted-foreground">
            Bem-vindo, jovem cientista! Antes de entrar no laboratório, preciso saber seu nome...
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Digite seu nome..."
            className="w-full rounded-lg border border-border bg-game-surface px-4 py-3 text-center font-narrative text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <motion.button
            type="submit"
            disabled={!name.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full rounded-lg bg-primary px-6 py-3 font-display text-xl text-primary-foreground transition-all hover:bg-game-pink-glow disabled:opacity-40 disabled:cursor-not-allowed glow-pink"
          >
            Entrar no Laboratório
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
