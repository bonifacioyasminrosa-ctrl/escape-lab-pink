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
      className="flex min-h-screen items-center justify-center bg-background p-6"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="max-w-lg text-center space-y-6"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="rounded-full bg-secondary/20 p-8 glow-green">
            <Trophy className="h-20 w-20 text-secondary" />
          </div>
        </motion.div>

        <h1 className="font-display text-5xl text-secondary text-glow-green">
          Parabéns!
        </h1>

        <div className="space-y-4 font-narrative text-lg leading-relaxed text-foreground">
          <p>
            <em>CLICK!</em> A gaveta secreta se abre com um som suave. Dentro dela, brilhando sob a luz fraca do laboratório, está uma chave antiga.
          </p>
          <p>
            {playerName} pega a chave com mãos trêmulas, corre até a porta e a destranca. A luz do corredor invade a sala.
          </p>
          <p className="text-secondary font-bold">
            Você está livre! 🔓
          </p>
          <p className="text-muted-foreground">
            Parabéns, detetive da química! Seu conhecimento sobre vidrarias e substâncias foi sua salvação.
          </p>
        </div>

        <motion.button
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
