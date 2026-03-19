import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Clue, COLOR_LABELS, COLOR_EMOJI, LAB_HOTSPOTS } from "./gameData";
import { X, Check, AlertTriangle, HelpCircle, FlaskConical, BookOpen } from "lucide-react";
import labPanorama from "@/assets/lab-panorama.jpg";

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
  red: "bg-clue-red", blue: "bg-clue-blue", yellow: "bg-clue-yellow", green: "bg-clue-green",
};

const CLUE_GLOW_MAP: Record<string, string> = {
  red: "shadow-[0_0_12px_hsl(0,75%,50%,0.7)]",
  blue: "shadow-[0_0_12px_hsl(210,75%,50%,0.7)]",
  yellow: "shadow-[0_0_12px_hsl(45,90%,55%,0.7)]",
  green: "shadow-[0_0_12px_hsl(140,60%,42%,0.7)]",
};

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
  const [foundAnimation, setFoundAnimation] = useState<number | null>(null);

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

  const handleHotspotClick = (clueId: number) => {
    const clue = clues.find(c => c.id === clueId);
    if (!clue) return;
    if (!clue.found) {
      onFindClue(clue.id);
      setFoundAnimation(clue.id);
      setTimeout(() => setFoundAnimation(null), 1500);
    }
    if (!clue.answered) {
      setActiveClue(clue);
      setAnswer("");
      setFeedback(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col bg-background"
    >
      {/* Header bar */}
      <div className="sticky top-0 z-20 border-b border-border bg-game-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
          <div className={`font-display text-xl ${timeLeft < 300 ? "text-destructive animate-flicker" : "text-primary"}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: maxErrors }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-3 w-3 rounded-full ${i < errors ? "bg-destructive" : "bg-muted"}`}
                  animate={i === errors - 1 && errors > 0 ? { scale: [1, 1.5, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-narrative">
              {answeredClues.length}/8 pistas
            </span>
            <button onClick={onToggleHint} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Color reminder bar */}
      <div className="border-b border-border bg-game-surface/50 px-4 py-1.5">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 text-xs font-narrative text-muted-foreground">
          <span>🔴 Ácido</span>
          <span>🔵 Base</span>
          <span>🟡 Sal</span>
          <span>🟢 Óxido</span>
          <span className="text-primary/70 ml-2">• Lembre das cores!</span>
        </div>
      </div>

      {/* Hint panel */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-secondary bg-secondary/10"
          >
            <div className="mx-auto max-w-5xl p-3">
              <h3 className="flex items-center gap-2 font-display text-sm text-secondary">
                <BookOpen className="h-4 w-4" /> Caderno de Anotações
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-narrative">
                {clues.filter(c => c.answered).map(c => (
                  <div key={c.id} className={`flex items-center gap-2 rounded-md p-1.5 ${CLUE_COLOR_MAP[c.color]}`}>
                    <span>{COLOR_EMOJI[c.color]}</span>
                    <span className="text-foreground">{c.answer}</span>
                    <span className="text-muted-foreground">({c.type === "vidraria" ? "Vidraria" : "Composto"})</span>
                  </div>
                ))}
              </div>
              {clues.filter(c => c.answered).length === 0 && (
                <p className="mt-2 text-xs text-muted-foreground font-narrative">Nenhuma pista respondida ainda...</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lab panorama with hotspots */}
      <div className="relative flex-1 overflow-auto">
        <div className="relative mx-auto max-w-5xl">
          <img src={labPanorama} alt="Laboratório de química" className="w-full select-none" draggable={false} />

          {/* Found clue celebration overlay */}
          <AnimatePresence>
            {foundAnimation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="rounded-full bg-primary/20 p-8 backdrop-blur-sm"
                >
                  <span className="text-5xl">🔍</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {LAB_HOTSPOTS.map(spot => {
            const clue = clues.find(c => c.id === spot.clueId);
            if (!clue) return null;
            const isAnswered = clue.answered;
            const isFound = clue.found;

            return (
              <motion.button
                key={spot.id}
                onClick={() => handleHotspotClick(spot.clueId)}
                className="absolute flex flex-col items-center group"
                style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                disabled={isAnswered}
              >
                {!isAnswered && (
                  <motion.div
                    className={`absolute inset-0 rounded-full ${isFound ? CLUE_DOT_MAP[clue.color] : "bg-primary"} opacity-30`}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 40, height: 40, left: -8, top: -8 }}
                  />
                )}

                <div className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all ${
                  isAnswered
                    ? "bg-secondary/80 opacity-50"
                    : isFound
                    ? `${CLUE_DOT_MAP[clue.color]} ${CLUE_GLOW_MAP[clue.color]}`
                    : "bg-primary/90 glow-pink"
                }`}>
                  {isAnswered ? <Check className="h-3 w-3 text-secondary-foreground" /> : <span className="text-[10px]">{spot.icon}</span>}
                </div>

                <div className="pointer-events-none absolute top-8 whitespace-nowrap rounded-md bg-game-surface/95 px-2 py-1 text-[10px] font-narrative text-foreground opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  {spot.label}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="sticky bottom-0 border-t border-border bg-game-surface/95 backdrop-blur-md p-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <p className="text-xs font-narrative text-muted-foreground">
              Clique nos pontos brilhantes para encontrar pistas!
            </p>
            {allAnswered && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGoToCabinet}
                className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 font-display text-sm text-secondary-foreground glow-green"
                animate={{ boxShadow: ["0 0 20px hsl(150 50% 40% / 0.3)", "0 0 40px hsl(150 50% 40% / 0.7)", "0 0 20px hsl(150 50% 40% / 0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FlaskConical className="h-4 w-4" />
                Ir ao Armário
              </motion.button>
            )}
          </div>
        </div>
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
              initial={{ scale: 0.5, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, rotate: 5, opacity: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className={`w-full max-w-md rounded-xl border-2 bg-game-surface p-5 ${CLUE_COLOR_MAP[activeClue.color]}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`h-4 w-4 rounded-full ${CLUE_DOT_MAP[activeClue.color]}`}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="font-display text-base">{COLOR_LABELS[activeClue.color]}</span>
                  <span className="text-xs text-muted-foreground font-narrative">
                    ({activeClue.type === "vidraria" ? "Vidraria" : "Composto"})
                  </span>
                </div>
                <button onClick={() => { setActiveClue(null); setFeedback(null); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="font-narrative text-sm leading-relaxed text-foreground mb-2">{activeClue.question}</p>
              <p className="text-xs text-muted-foreground font-narrative mb-4 italic">
                💡 Lembre-se: a cor desta pista ({COLOR_EMOJI[activeClue.color]}) será importante depois!
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAnswer()}
                  placeholder="Sua resposta..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  onClick={handleAnswer}
                  disabled={!answer.trim()}
                  className="w-full rounded-lg bg-primary py-2 font-display text-sm text-primary-foreground disabled:opacity-40"
                >
                  Responder
                </button>
              </div>

              <AnimatePresence>
                {feedback === "correct" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-center gap-2 text-secondary font-narrative text-sm"
                  >
                    <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 0.5 }}>
                      <Check className="h-4 w-4" />
                    </motion.div>
                    Correto! Excelente! ✨
                  </motion.div>
                )}
                {feedback === "wrong" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: [0, -5, 5, -5, 0] }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-center gap-2 text-destructive font-narrative text-sm"
                  >
                    <AlertTriangle className="h-4 w-4" /> BIP! Resposta incorreta...
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
