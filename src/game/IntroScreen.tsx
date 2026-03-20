import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AvatarType } from "./gameData";

interface IntroScreenProps {
  playerName: string;
  avatar: AvatarType;
  onContinue: () => void;
}

export default function IntroScreen({ playerName, avatar, onContinue }: IntroScreenProps) {
  const [showButton, setShowButton] = useState(false);
  const pronoun = avatar === "girl" ? "a" : "o";
  const pronounCap = avatar === "girl" ? "A" : "O";

  const paragraphs = [
    `Era para ser apenas mais uma aula de química. A professora havia saído por alguns minutos, e ${playerName} decidiu revisar os experimentos. Mas, de repente, as luzes começaram a piscar e a porta se trancou com um estalo metálico. Bem-vind${pronoun} ao ChemScape.`,
    `No quadro de giz do laboratório, havia uma mensagem: "Car${pronoun} ${playerName}, coloque seus conhecimentos em prática e resolva os enigmas para liberar a saída."`,
    `${pronounCap} determinad${pronoun} ${playerName} percebe que a única forma de escapar é usando seus conhecimentos de química inorgânica e vidrarias.`,
    `Espalhados pelo laboratório existem 8 pistas secretas – pequenos papéis coloridos escondidos nos móveis. Cada pista contém uma pergunta sobre vidrarias ou compostos inorgânicos (ácidos, bases, sais e óxidos).`,
    `⚠️ IMPORTANTE: Preste muita atenção na COR de cada pista! As cores indicam a qual categoria cada substância e vidraria pertence. Você precisará lembrar dessas cores para a fase final!`,
    `🔴 Vermelho = Ácidos  ·  🔵 Azul = Bases  ·  🟡 Amarelo = Sais  ·  🟢 Verde = Óxidos`,
    `Agora, cada erro conta – você tem apenas 5 chances. Cada acerto, uma chance de se libertar.`,
  ];

  useEffect(() => {
    const timeout = setTimeout(() => setShowButton(true), paragraphs.length * 800 + 1000);
    return () => clearTimeout(timeout);
  }, [paragraphs.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen items-center justify-center bg-background p-6"
    >
      {/* Mysterious fog effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 30% 50%, hsl(var(--game-green) / 0.08) 0%, transparent 70%)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 70% 30%, hsl(var(--game-pink) / 0.08) 0%, transparent 70%)" }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-2xl space-y-5">
        {paragraphs.map((text, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.8, duration: 0.6, type: "spring" }}
            className={`font-narrative text-lg leading-relaxed ${
              i === 4 ? "text-primary font-bold border border-primary/30 rounded-lg p-3 bg-primary/5" :
              i === 5 ? "text-center text-sm text-muted-foreground bg-game-surface rounded-lg p-3" :
              "text-foreground"
            }`}
          >
            {text}
          </motion.p>
        ))}

        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="flex justify-center pt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="rounded-lg bg-secondary px-8 py-3 font-display text-xl text-secondary-foreground glow-green"
              animate={{ boxShadow: ["0 0 20px hsl(150 50% 40% / 0.3)", "0 0 40px hsl(150 50% 40% / 0.6)", "0 0 20px hsl(150 50% 40% / 0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Explorar o Laboratório
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
