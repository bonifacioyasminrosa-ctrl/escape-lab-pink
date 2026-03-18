import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CabinetSlot, COLOR_LABELS, GLASSWARE_OPTIONS, COMPOUND_OPTIONS } from "./gameData";
import { Lock, Unlock, AlertTriangle, Check } from "lucide-react";

interface CabinetScreenProps {
  slots: CabinetSlot[];
  errors: number;
  maxErrors: number;
  timeLeft: number;
  onFillSlot: (color: string, glassware: string, compound: string) => boolean;
}

const SLOT_BORDER: Record<string, string> = {
  red: "border-clue-red",
  blue: "border-clue-blue",
  yellow: "border-clue-yellow",
  green: "border-clue-green",
};

const SLOT_BG: Record<string, string> = {
  red: "bg-clue-red/10",
  blue: "bg-clue-blue/10",
  yellow: "bg-clue-yellow/10",
  green: "bg-clue-green/10",
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function CabinetScreen({ slots, errors, maxErrors, timeLeft, onFillSlot }: CabinetScreenProps) {
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [selectedGlassware, setSelectedGlassware] = useState("");
  const [selectedCompound, setSelectedCompound] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const handleSubmit = () => {
    if (!activeSlot || !selectedGlassware || !selectedCompound) return;
    const correct = onFillSlot(activeSlot, selectedGlassware, selectedCompound);
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setTimeout(() => {
        setActiveSlot(null);
        setSelectedGlassware("");
        setSelectedCompound("");
        setFeedback(null);
      }, 1000);
    } else {
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border bg-game-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className={`font-display text-2xl ${timeLeft < 300 ? "text-destructive animate-flicker" : "text-primary"}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: maxErrors }).map((_, i) => (
              <div key={i} className={`h-3 w-3 rounded-full ${i < errors ? "bg-destructive" : "bg-muted"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-6 space-y-6">
        <div className="text-center">
          <h2 className="font-display text-3xl text-secondary text-glow-green">
            🗄️ Armário dos Compartimentos
          </h2>
          <p className="font-narrative text-muted-foreground mt-2">
            Encaixe a vidraria correta com a substância correta em cada compartimento.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {slots.map(slot => (
            <motion.button
              key={slot.color}
              whileHover={slot.correct ? {} : { scale: 1.03 }}
              whileTap={slot.correct ? {} : { scale: 0.97 }}
              onClick={() => !slot.correct && setActiveSlot(slot.color)}
              disabled={slot.correct}
              className={`rounded-xl border-2 p-6 text-center transition-all ${SLOT_BORDER[slot.color]} ${
                slot.correct ? `${SLOT_BG[slot.color]} opacity-70` : "bg-game-surface hover:bg-game-surface-light"
              }`}
            >
              <div className="flex justify-center mb-3">
                {slot.correct ? (
                  <Unlock className="h-10 w-10 text-secondary" />
                ) : (
                  <Lock className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <p className="font-display text-lg">{COLOR_LABELS[slot.color]}</p>
              {slot.correct && (
                <div className="mt-2 space-y-1 text-sm font-narrative text-muted-foreground">
                  <p>{slot.glassware}</p>
                  <p>{slot.compound}</p>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Slot fill modal */}
      <AnimatePresence>
        {activeSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className={`w-full max-w-md rounded-xl border-2 bg-game-surface p-6 ${SLOT_BORDER[activeSlot]}`}
            >
              <h3 className="font-display text-xl mb-4">{COLOR_LABELS[activeSlot]}</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Vidraria:</label>
                  <select
                    value={selectedGlassware}
                    onChange={e => setSelectedGlassware(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecione...</option>
                    {GLASSWARE_OPTIONS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Composto:</label>
                  <select
                    value={selectedCompound}
                    onChange={e => setSelectedCompound(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecione...</option>
                    {COMPOUND_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setActiveSlot(null); setFeedback(null); }}
                    className="flex-1 rounded-lg border border-border py-2 text-muted-foreground hover:text-foreground"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedGlassware || !selectedCompound}
                    className="flex-1 rounded-lg bg-primary py-2 font-display text-primary-foreground disabled:opacity-40"
                  >
                    Encaixar
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {feedback === "correct" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-3 flex items-center gap-2 text-secondary font-narrative">
                    <Check className="h-5 w-5" /> CLICK! Compartimento ativado!
                  </motion.p>
                )}
                {feedback === "wrong" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-3 flex items-center gap-2 text-destructive font-narrative">
                    <AlertTriangle className="h-5 w-5" /> BIP! Combinação incorreta!
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
