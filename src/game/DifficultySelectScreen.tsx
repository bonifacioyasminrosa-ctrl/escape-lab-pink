import { motion } from "framer-motion";
import { Difficulty } from "./gameData";
import { Sparkles, Skull } from "lucide-react";

interface DifficultySelectScreenProps {
  onSelect: (difficulty: Difficulty) => void;
}

const OPTIONS: { type: Difficulty; label: string; desc: string; Icon: typeof Sparkles }[] = [
  {
    type: "facil",
    label: "Fácil",
    desc: "As pistas viram um quiz: escolha a resposta certa entre 4 opções.",
    Icon: Sparkles,
  },
  {
    type: "dificil",
    label: "Difícil",
    desc: "Sem opções! Você digita a resposta de cada pista do zero.",
    Icon: Skull,
  },
];

export default function DifficultySelectScreen({ onSelect }: DifficultySelectScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center justify-center bg-background p-6"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative z-10 w-full max-w-2xl space-y-8 text-center"
      >
        <div>
          <h1 className="font-display text-4xl text-primary text-glow-pink">Nível de Dificuldade</h1>
          <p className="mt-3 font-narrative text-lg text-muted-foreground">
            Escolha como você quer enfrentar o laboratório...
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {OPTIONS.map(({ type, label, desc, Icon }) => (
            <motion.button
              key={type}
              onClick={() => onSelect(type)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-game-surface p-6 transition-colors ${
                type === "facil" ? "hover:border-secondary" : "hover:border-primary"
              }`}
            >
              <Icon className={`h-10 w-10 ${type === "facil" ? "text-secondary" : "text-primary"}`} />
              <span className="font-display text-2xl text-foreground">{label}</span>
              <span className="font-narrative text-sm text-muted-foreground">{desc}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
