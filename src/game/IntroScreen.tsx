import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface IntroScreenProps {
  playerName: string;
  onContinue: () => void;
}

export default function IntroScreen({ playerName, onContinue }: IntroScreenProps) {
  const [showButton, setShowButton] = useState(false);

  const paragraphs = [
    `Era para ser apenas mais uma aula de química. A professora havia saído por alguns minutos, e ${playerName} decidiu revisar os experimentos sozinha. Mas, de repente, as luzes começaram a piscar e a porta se trancou com um estalo metálico.`,
    `No quadro de giz do laboratório, havia uma mensagem: "Cara ${playerName}, coloque seus conhecimentos em prática e resolva os enigmas para liberar a saída."`,
    `Assustada, mas determinada, ${playerName} percebe que a única forma de escapar é usando seus conhecimentos de química inorgânica e vidrarias.`,
    `Espalhados pelo laboratório existem 8 pistas secretas – pequenos papéis escondidos em livros, gavetas, frascos e móveis. Cada pista contém uma pergunta. Algumas perguntas são sobre vidrarias, outras sobre nomenclatura de compostos inorgânicos (ácidos, bases, sais e óxidos).`,
    `Preste atenção nas cores dos papéis – elas revelam qual substância vai em qual vidraria. Seu raciocínio e seus conhecimentos químicos serão a chave para a liberdade.`,
    `Agora, cada erro pode atrasar sua saída. Cada acerto, uma chance de se libertar.`,
  ];

  useEffect(() => {
    const timeout = setTimeout(() => setShowButton(true), paragraphs.length * 800 + 1000);
    return () => clearTimeout(timeout);
  }, [paragraphs.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-background p-6"
    >
      <div className="max-w-2xl space-y-6">
        {paragraphs.map((text, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.8, duration: 0.6 }}
            className="font-narrative text-lg leading-relaxed text-foreground"
          >
            {text}
          </motion.p>
        ))}

        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center pt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="rounded-lg bg-secondary px-8 py-3 font-display text-xl text-secondary-foreground glow-green"
            >
              Explorar o Laboratório
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
