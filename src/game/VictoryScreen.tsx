import { motion } from "framer-motion";
import { Trophy, RotateCcw } from "lucide-react";

interface VictoryScreenProps {
  playerName: string;
  onRestart: () => void;
}

export default function VictoryScreen({ playerName, onRestart }: VictoryScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-background p-6 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, hsl(var(--game-green) / 0.15) 0%, transparent 70%)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="relative z-10 max-w-lg text-center space-y-6"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0], y: [0, -5, 0] }}
          transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          className="flex justify-center"
        >
          <div className="rounded-full bg-secondary/20 p-8 glow-green">
            <Trophy className="h-20 w-20 text-secondary" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display text-5xl text-secondary text-glow-green"
        >
          Missão Completa!
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 font-narrative text-lg leading-relaxed text-foreground"
        >
          <p>
            {playerName} escapou do laboratório com sucesso! 🔓
          </p>
          <p className="text-muted-foreground">
            Seu conhecimento sobre vidrarias e substâncias foi sua salvação. A professora ficou orgulhosa!
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="rounded-lg bg-primary px-8 py-3 font-display text-lg text-primary-foreground glow-pink"
        >
          <RotateCcw className="inline h-5 w-5 mr-2" /> Jogar Novamente
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
