import { motion } from "framer-motion";
import { XCircle, RotateCcw } from "lucide-react";

interface DefeatScreenProps {
  playerName: string;
  reason: "time" | "errors";
  onRestart: () => void;
}

export default function DefeatScreen({ playerName, reason, onRestart }: DefeatScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-background p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-lg text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/20 p-8">
            <XCircle className="h-20 w-20 text-destructive" />
          </div>
        </div>

        <h1 className="font-display text-5xl text-destructive">
          Fim de Jogo
        </h1>

        <div className="space-y-4 font-narrative text-lg leading-relaxed text-foreground">
          {reason === "time" ? (
            <>
              <p>
                O cronômetro zerou. As luzes do laboratório se apagam por um momento e, quando acendem novamente, a porta está aberta.
              </p>
              <p>
                Mas não foi {playerName} quem abriu... Foi a professora, que retornou e encontrou você tentando resolver os enigmas.
              </p>
              <p className="text-muted-foreground italic">
                "Da próxima vez," ela diz com um sorriso, "estude mais as funções inorgânicas."
              </p>
            </>
          ) : (
            <>
              <p>
                Muitos erros foram cometidos. O sistema de segurança do laboratório foi ativado e todas as pistas foram recolhidas automaticamente.
              </p>
              <p className="text-muted-foreground italic">
                {playerName} terá que tentar novamente com mais cuidado...
              </p>
            </>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="rounded-lg bg-primary px-8 py-3 font-display text-lg text-primary-foreground glow-pink"
        >
          <RotateCcw className="inline h-5 w-5 mr-2" /> Tentar Novamente
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
