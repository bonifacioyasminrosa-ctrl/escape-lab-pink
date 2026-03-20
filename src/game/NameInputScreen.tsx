import { useState } from "react";
import { motion } from "framer-motion";
import { AvatarType } from "./gameData";
import avatarBoy from "@/assets/avatar-boy.png";
import avatarGirl from "@/assets/avatar-girl.png";

interface NameInputScreenProps {
  avatar: AvatarType;
  onSubmit: (name: string) => void;
}

export default function NameInputScreen({ avatar, onSubmit }: NameInputScreenProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSubmit(name.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center justify-center bg-background p-6"
    >
      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              background: i % 2 === 0 ? "hsl(var(--game-pink) / 0.3)" : "hsl(var(--game-green) / 0.3)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative z-10 w-full max-w-md space-y-8 text-center"
      >
        <motion.div
          className="flex justify-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="rounded-full bg-game-surface p-4 glow-pink">
            <img
              src={avatar === "boy" ? avatarBoy : avatarGirl}
              alt="Seu avatar"
              className="h-24 w-24 object-contain"
            />
          </div>
        </motion.div>

        <div>
          <h1 className="font-display text-3xl text-primary text-glow-pink">
            ChemScape
          </h1>
          <p className="mt-3 font-narrative text-base text-muted-foreground">
            Digite seu nome para entrar no laboratório misterioso...
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
