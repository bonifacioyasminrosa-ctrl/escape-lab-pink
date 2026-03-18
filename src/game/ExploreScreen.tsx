import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Clue, COLOR_LABELS } from "./gameData";
import { Search, BookOpen, FlaskConical, X, Check, AlertTriangle, HelpCircle } from "lucide-react";

interface ExploreScreenProps {
  clues: Clue[];
  errors: number;
  maxErrors: number;
  timeLeft: number;
  showHint: boolean;
  onFindClue: (id: number) => void;
  onAnswerClue: (id: number, answer: string) => boolean;
  onGoToCabinet: () => void;
  onToggleHint: () => void;
}

const CLUE_COLOR_MAP: Record<string, string> = {
  red: "border-clue-red bg-clue-red/10 text-clue-red",
  blue: "border-clue-blue bg-clue-blue/10 text-clue-blue",
  yellow: "border-clue-yellow bg-clue-yellow/10 text-clue-yellow",
  green: "border-clue-green bg-clue-green/10 text-clue-green",
};

const CLUE_DOT_MAP: Record<string, string> = {
  red: "bg-clue-red",
  blue: "bg-clue-blue",
  yellow: "bg-clue-yellow",
  green: "bg-clue-green",
};

const HIDING_SPOTS = [
  "📚 Dentro de um livro de química",
  "🧪 Atrás de um frasco no armário",
  "🗄️ Na gaveta da bancada",
  "🔬 Sob o microscópio",
  "📋 Presa ao quadro de avisos",
  "🧫 Dentro de uma placa de Petri",
  "📦 Atrás de uma caixa de reagentes",
  "🪑 Debaixo de uma cadeira",
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function ExploreScreen({
  clues, errors, maxErrors, timeLeft, showHint,
  onFindClue, onAnswerClue, onGoToCabinet, onToggleHint,
}: ExploreScreenProps) {
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const foundClues = clues.filter(c => c.found);
  const answeredClues = clues.filter(c => c.answered);
  const allAnswered = answeredClues.length === clues.length;

  const handleAnswer = () => {
    if (!activeClue || !answer.trim()) return;
    const correct = onAnswerClue(activeClue.id, answer);
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setTimeout(() => {
        setActiveClue(null);
        setAnswer("");
        setFeedback(null);
      }, 1200);
    } else {
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleOpenClue = (clue: Clue) => {
    if (!clue.found) onFindClue(clue.id);
    if (!clue.answered) {
      setActiveClue(clue);
      setAnswer("");
      setFeedback(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header bar */}
      <div className="sticky top-0 z-20 border-b border-border bg-game-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className={`font-display text-2xl ${timeLeft < 300 ? "text-destructive animate-flicker" : "text-primary"}`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: maxErrors }).map((_, i) => (
                <div key={i} className={`h-3 w-3 rounded-full ${i < errors ? "bg-destructive" : "bg-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {answeredClues.length}/8 pistas
            </span>
            <button onClick={onToggleHint} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-4 space-y-6">
        {/* Hint panel */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden rounded-lg border border-secondary bg-secondary/10 p-4"
            >
              <h3 className="flex items-center gap-2 font-display text-lg text-secondary">
                <BookOpen className="h-5 w-5" /> Caderno de Anotações
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm font-narrative text-muted-foreground">
                <p>🔴 <strong className="text-clue-red">Vermelho</strong> = Ácidos (ex: HCl, H₂SO₄)</p>
                <p>🔵 <strong className="text-clue-blue">Azul</strong> = Bases (ex: NaOH, Ca(OH)₂)</p>
                <p>🟡 <strong className="text-clue-yellow">Amarelo</strong> = Sais (ex: NaCl, CaCO₃)</p>
                <p>🟢 <strong className="text-clue-green">Verde</strong> = Óxidos (ex: CO₂, Fe₂O₃)</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lab exploration */}
        <div>
          <h2 className="font-display text-2xl text-primary text-glow-pink mb-1">
            <Search className="inline h-6 w-6 mr-2" />
            Explore o Laboratório
          </h2>
          <p className="text-sm text-muted-foreground font-narrative mb-4">
            Clique nos locais para encontrar pistas escondidas. Resolva cada enigma!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {clues.map((clue, i) => (
              <motion.button
                key={clue.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOpenClue(clue)}
                className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                  clue.answered
                    ? "border-secondary/50 bg-secondary/10 opacity-60"
                    : clue.found
                    ? CLUE_COLOR_MAP[clue.color]
                    : "border-border bg-game-surface hover:border-primary/50 hover:glow-pink"
                }`}
              >
                {clue.answered && (
                  <div className="absolute -right-1 -top-1 rounded-full bg-secondary p-1">
                    <Check className="h-3 w-3 text-secondary-foreground" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground font-narrative mb-1">
                  {HIDING_SPOTS[i]}
                </p>
                {clue.found ? (
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`h-3 w-3 rounded-full ${CLUE_DOT_MAP[clue.color]}`} />
                    <span className="text-xs font-medium">
                      {clue.type === "vidraria" ? "Vidraria" : "Composto"}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs mt-2 text-muted-foreground">???</p>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Go to cabinet */}
        {allAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="font-narrative text-secondary mb-3">
              Todas as pistas resolvidas! Vá até o armário dos compartimentos.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGoToCabinet}
              className="rounded-lg bg-secondary px-8 py-3 font-display text-xl text-secondary-foreground glow-green"
            >
              <FlaskConical className="inline h-5 w-5 mr-2" />
              Ir ao Armário
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Clue modal */}
      <AnimatePresence>
        {activeClue && !activeClue.answered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`w-full max-w-md rounded-xl border-2 bg-game-surface p-6 ${CLUE_COLOR_MAP[activeClue.color]}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${CLUE_DOT_MAP[activeClue.color]}`} />
                  <span className="font-display text-lg">{COLOR_LABELS[activeClue.color]}</span>
                  <span className="text-xs text-muted-foreground">
                    ({activeClue.type === "vidraria" ? "Vidraria" : "Composto"})
                  </span>
                </div>
                <button
                  onClick={() => { setActiveClue(null); setFeedback(null); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="font-narrative text-base leading-relaxed text-foreground mb-6">
                {activeClue.question}
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAnswer()}
                  placeholder="Sua resposta..."
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  onClick={handleAnswer}
                  disabled={!answer.trim()}
                  className="w-full rounded-lg bg-primary py-2 font-display text-primary-foreground disabled:opacity-40"
                >
                  Responder
                </button>
              </div>

              <AnimatePresence>
                {feedback === "correct" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 text-secondary font-narrative"
                  >
                    <Check className="h-5 w-5" /> Correto! Excelente raciocínio!
                  </motion.div>
                )}
                {feedback === "wrong" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 text-destructive font-narrative"
                  >
                    <AlertTriangle className="h-5 w-5" /> BIP! Resposta incorreta. Tempo precioso perdido...
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
