import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { CabinetSlot, COLOR_LABELS, COLOR_EMOJI, GLASSWARE_OPTIONS, COMPOUND_OPTIONS } from "./gameData";
import { GLASSWARE_IMAGES, COMPOUND_IMAGES } from "./assetMaps";
import { Lock, Unlock, AlertTriangle, Check, Key, DoorOpen } from "lucide-react";
import type { AvatarType } from "./gameData";
import avatarBoy from "@/assets/avatar-boy.png";
import avatarGirl from "@/assets/avatar-girl.png";
import teacherImg from "@/assets/teacher.png";
import ErlenLives from "./ErlenLives";

interface CabinetScreenProps {
  slots: CabinetSlot[];
  errors: number;
  maxErrors: number;
  timeLeft: number;
  playerName: string;
  avatar: AvatarType;
  onFillSlot: (color: string, glassware: string, compound: string) => boolean;
  onVictory: () => void;
}

const SLOT_BORDER: Record<string, string> = {
  red: "border-clue-red", blue: "border-clue-blue", yellow: "border-clue-yellow", green: "border-clue-green",
};
const SLOT_BG: Record<string, string> = {
  red: "bg-clue-red/10", blue: "bg-clue-blue/10", yellow: "bg-clue-yellow/10", green: "bg-clue-green/10",
};
const SLOT_GLOW: Record<string, string> = {
  red: "shadow-[0_0_20px_hsl(0,75%,50%,0.4)]",
  blue: "shadow-[0_0_20px_hsl(210,75%,50%,0.4)]",
  yellow: "shadow-[0_0_20px_hsl(45,90%,55%,0.4)]",
  green: "shadow-[0_0_20px_hsl(140,60%,42%,0.4)]",
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

type CabinetPhase = "shelves" | "pouring" | "compartments" | "drawer" | "key" | "door" | "teacher";

export default function CabinetScreen({ slots, errors, maxErrors, timeLeft, playerName, avatar, onFillSlot, onVictory }: CabinetScreenProps) {
  const [cabinetPhase, setCabinetPhase] = useState<CabinetPhase>("shelves");
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [selectedGlassware, setSelectedGlassware] = useState("");
  const [selectedCompound, setSelectedCompound] = useState("");
  const [lastResult, setLastResult] = useState<{ color: string; correct: boolean } | null>(null);
  const [pouringSlotIndex, setPouringSlotIndex] = useState(0);
  const [fittedSlots, setFittedSlots] = useState<Set<string>>(new Set());
  const selectedGlasswareRef = useRef("");
  const selectedCompoundRef = useRef("");
  const selectionLockedRef = useRef(false);

  const allCorrect = slots.every(s => s.correct);
  const allFitted = fittedSlots.size === 4;

  // Check if all slots are correct to advance
  useEffect(() => {
    if (allCorrect && cabinetPhase === "shelves") {
      setTimeout(() => setCabinetPhase("pouring"), 1200);
    }
  }, [allCorrect, cabinetPhase]);

  const resetActiveSelection = (closeModal: boolean) => {
    if (closeModal) setActiveSlot(null);
    selectedGlasswareRef.current = "";
    selectedCompoundRef.current = "";
    selectionLockedRef.current = false;
    setSelectedGlassware("");
    setSelectedCompound("");
    setLastResult(null);
  };

  // Validate as soon as the player has picked one vidraria and one substance
  const validateSelection = (glassware: string, compound: string) => {
    if (!activeSlot || !glassware || !compound || selectionLockedRef.current) return;
    selectionLockedRef.current = true;

    const correct = onFillSlot(activeSlot, glassware, compound);
    setLastResult({ color: activeSlot, correct });

    if (correct) {
      setTimeout(() => resetActiveSelection(true), 850);
    } else {
      setTimeout(() => resetActiveSelection(false), 1200);
    }
  };

  const handleGlasswareSelect = (glassware: string) => {
    if (selectionLockedRef.current) return;
    selectedGlasswareRef.current = glassware;
    setSelectedGlassware(glassware);
    validateSelection(glassware, selectedCompoundRef.current);
  };

  const handleCompoundSelect = (compound: string) => {
    if (selectionLockedRef.current) return;
    selectedCompoundRef.current = compound;
    setSelectedCompound(compound);
    validateSelection(selectedGlasswareRef.current, compound);
  };

  // Pouring animation sequence
  useEffect(() => {
    if (cabinetPhase === "pouring") {
      const colors = slots.map(s => s.color);
      if (pouringSlotIndex < colors.length) {
        const timer = setTimeout(() => setPouringSlotIndex(prev => prev + 1), 1800);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => setCabinetPhase("compartments"), 1000);
      }
    }
  }, [cabinetPhase, pouringSlotIndex, slots]);

  const handleFitCompartment = (color: string) => {
    setFittedSlots(prev => { const next = new Set(prev); next.add(color); return next; });
  };

  const getGlasswareImage = (name: string) => {
    const opt = GLASSWARE_OPTIONS.find(g => g.name === name);
    return opt ? GLASSWARE_IMAGES[opt.imageKey] : undefined;
  };
  const getCompoundImage = (name: string) => {
    const opt = COMPOUND_OPTIONS.find(c => c.name === name);
    return opt ? COMPOUND_IMAGES[opt.imageKey] : undefined;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border bg-game-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className={`font-display text-2xl ${timeLeft < 300 ? "text-destructive animate-flicker" : "text-primary"}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <ErlenLives errors={errors} maxErrors={maxErrors} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* SHELVES PHASE - per-slot validation */}
        {cabinetPhase === "shelves" && (
          <motion.div key="shelves" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mx-auto max-w-4xl p-6 space-y-6">
            <div className="text-center">
              <h2 className="font-display text-3xl text-secondary text-glow-green">🧪 Prateleira de Vidrarias e Substâncias</h2>
              <p className="font-narrative text-muted-foreground mt-2">Selecione a vidraria e a substância correta para cada cor.</p>
            </div>

            {/* Glassware shelf */}
            <div className="rounded-xl border border-border bg-game-surface p-4">
              <h3 className="font-display text-sm text-primary mb-3">📐 Prateleira de Vidrarias</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {GLASSWARE_OPTIONS.map(g => (
                  <motion.div key={g.name} whileHover={{ y: -5, scale: 1.05 }} className="flex flex-col items-center gap-1 rounded-lg border border-border bg-game-surface-light p-2 cursor-default w-16">
                    <img src={GLASSWARE_IMAGES[g.imageKey]} alt={g.name} className="h-12 w-12 object-contain" />
                    <span className="text-[8px] font-narrative text-muted-foreground text-center leading-tight">{g.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Compound shelf */}
            <div className="rounded-xl border border-border bg-game-surface p-4">
              <h3 className="font-display text-sm text-secondary mb-3">⚗️ Prateleira de Substâncias</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {COMPOUND_OPTIONS.map(c => (
                  <motion.div key={c.name} whileHover={{ y: -5, scale: 1.05 }} className="flex flex-col items-center gap-1 rounded-lg border border-border bg-game-surface-light p-2 cursor-default w-20">
                    <img src={COMPOUND_IMAGES[c.imageKey]} alt={c.name} className="h-14 w-14 object-contain" />
                    <span className="text-[8px] font-narrative text-muted-foreground text-center leading-tight">{c.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Color compartments */}
            <div className="grid grid-cols-2 gap-4">
              {slots.map(slot => (
                <motion.button
                  key={slot.color}
                  whileHover={slot.correct ? {} : { scale: 1.03 }}
                  whileTap={slot.correct ? {} : { scale: 0.97 }}
                  onClick={() => !slot.correct && setActiveSlot(slot.color)}
                  disabled={slot.correct}
                  className={`rounded-xl border-2 p-5 text-center transition-all ${SLOT_BORDER[slot.color]} ${
                    slot.correct ? `${SLOT_BG[slot.color]} ${SLOT_GLOW[slot.color]}` : "bg-game-surface hover:bg-game-surface-light"
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    {slot.correct ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: "spring" }}>
                        <Unlock className="h-8 w-8 text-secondary" />
                      </motion.div>
                    ) : (
                      <Lock className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <p className="font-display text-base">{COLOR_EMOJI[slot.color]} {COLOR_LABELS[slot.color]}</p>
                  {slot.correct && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 flex items-center justify-center gap-2">
                      <img src={getGlasswareImage(slot.correctGlassware)} alt={slot.correctGlassware} className="h-8 w-8 object-contain" />
                      <span className="text-xs text-muted-foreground">+</span>
                      <img src={getCompoundImage(slot.correctCompound)} alt={slot.correctCompound} className="h-8 w-8 object-contain" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* POURING PHASE */}
        {cabinetPhase === "pouring" && (
          <motion.div key="pouring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-md p-6 flex flex-col items-center justify-center min-h-[70vh] space-y-6">
            <h2 className="font-display text-2xl text-secondary text-glow-green text-center">Preparando as substâncias...</h2>
            {slots.map((slot, idx) => {
              if (idx >= pouringSlotIndex) {
                return idx === pouringSlotIndex ? (
                  <motion.div key={slot.color} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                    <p className="font-narrative text-sm text-muted-foreground">{COLOR_EMOJI[slot.color]} {COLOR_LABELS[slot.color]}</p>
                    <div className="relative flex flex-col items-center">
                      <motion.img src={getCompoundImage(slot.correctCompound)} alt={slot.correctCompound} className="h-16 w-16 object-contain" initial={{ rotate: 0, y: 0 }} animate={{ rotate: -90, y: -10 }} transition={{ duration: 0.8 }} />
                      {[...Array(6)].map((_, i) => (
                        <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-primary/70" style={{ left: "50%", top: "70%" }} initial={{ y: 0, opacity: 0 }} animate={{ y: [0, 40 + i * 8], opacity: [0, 1, 0] }} transition={{ delay: 0.6 + i * 0.12, duration: 0.5 }} />
                      ))}
                      <motion.img src={getGlasswareImage(slot.correctGlassware)} alt={slot.correctGlassware} className="h-20 w-20 object-contain mt-4" initial={{ scale: 0.9 }} animate={{ scale: [0.9, 1.05, 1] }} transition={{ delay: 1.2, duration: 0.4 }} />
                    </div>
                  </motion.div>
                ) : null;
              }
              return (
                <motion.div key={slot.color} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-secondary" />
                  <span className="font-narrative text-sm text-muted-foreground">{COLOR_EMOJI[slot.color]} {slot.correctGlassware} + {slot.correctCompound}</span>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* COMPARTMENTS PHASE */}
        {cabinetPhase === "compartments" && (
          <motion.div key="compartments" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", damping: 15 }} className="mx-auto max-w-4xl p-6 space-y-6">
            <div className="text-center">
              <motion.h2 className="font-display text-3xl text-primary text-glow-pink" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>🗄️ Armário Secreto Revelado!</motion.h2>
              <p className="font-narrative text-muted-foreground mt-2">Encaixe cada vidraria no compartimento correto.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {slots.map((slot, idx) => {
                const isFitted = fittedSlots.has(slot.color);
                return (
                  <motion.button key={slot.color} onClick={() => !isFitted && handleFitCompartment(slot.color)} disabled={isFitted} whileHover={isFitted ? {} : { scale: 1.05 }} whileTap={isFitted ? {} : { scale: 0.95 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 * idx }} className={`rounded-xl border-2 border-dashed p-6 text-center transition-all ${isFitted ? `${SLOT_BORDER[slot.color]} ${SLOT_BG[slot.color]} ${SLOT_GLOW[slot.color]} border-solid` : "border-muted-foreground/30 bg-game-surface hover:border-primary"}`}>
                    {isFitted ? (
                      <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 8 }} className="space-y-2 flex flex-col items-center">
                        <img src={getGlasswareImage(slot.correctGlassware)} alt="" className="h-12 w-12 object-contain" />
                        <p className="font-display text-sm text-secondary">{slot.correctGlassware}</p>
                        <Check className="h-5 w-5 text-secondary" />
                      </motion.div>
                    ) : (
                      <div className="space-y-2">
                        <motion.div className="text-3xl opacity-30" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>📦</motion.div>
                        <p className="font-display text-sm text-muted-foreground">{COLOR_EMOJI[slot.color]} Compartimento</p>
                        <p className="text-xs font-narrative text-muted-foreground/50">Clique para encaixar</p>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
            {allFitted && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCabinetPhase("drawer")} className="rounded-lg bg-secondary px-6 py-3 font-display text-lg text-secondary-foreground glow-green" animate={{ boxShadow: ["0 0 20px hsl(150 50% 40% / 0.3)", "0 0 40px hsl(150 50% 40% / 0.7)", "0 0 20px hsl(150 50% 40% / 0.3)"] }} transition={{ duration: 2, repeat: Infinity }}>
                  Todos encaixados! Continuar...
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* DRAWER PHASE */}
        {cabinetPhase === "drawer" && (
          <motion.div key="drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[80vh] flex-col items-center justify-center p-6">
            <motion.div className="text-center space-y-6 max-w-md">
              <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.5, duration: 1, type: "spring" }} className="mx-auto w-48 h-24 rounded-lg border-2 border-secondary bg-game-surface origin-top flex items-center justify-center" style={{ boxShadow: "0 0 30px hsl(150 50% 40% / 0.4)" }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}><Key className="h-12 w-12 text-primary" /></motion.div>
              </motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="font-narrative text-lg text-foreground"><em>CLICK!</em> Uma gaveta secreta se abre lentamente...</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="font-narrative text-muted-foreground">Dentro dela, brilhando sob a luz esverdeada, está uma chave antiga!</motion.p>
              <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCabinetPhase("key")} className="rounded-lg bg-primary px-6 py-3 font-display text-lg text-primary-foreground glow-pink">🔑 Pegar a Chave</motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* KEY PHASE */}
        {cabinetPhase === "key" && (
          <motion.div key="key" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[80vh] flex-col items-center justify-center p-6">
            <motion.div className="text-center space-y-6 max-w-md">
              <motion.div initial={{ y: 0 }} animate={{ y: [-10, 0, -10] }} transition={{ duration: 2, repeat: Infinity }}><Key className="h-20 w-20 text-primary mx-auto" /></motion.div>
              <p className="font-narrative text-lg text-foreground">{playerName} segura a chave com determinação. A porta está logo ali!</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCabinetPhase("door")} className="rounded-lg bg-secondary px-6 py-3 font-display text-lg text-secondary-foreground glow-green">🚪 Ir até a porta</motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* DOOR PHASE */}
        {cabinetPhase === "door" && (
          <motion.div key="door" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[80vh] flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="relative w-full max-w-sm mx-auto">
              <motion.div className="mx-auto w-40 h-64 rounded-t-xl border-2 border-secondary bg-game-surface flex items-center justify-center relative overflow-hidden" style={{ boxShadow: "0 0 40px hsl(150 50% 40% / 0.3)" }}>
                <motion.div className="absolute inset-0 bg-secondary/20" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ delay: 2.5, duration: 1.5, ease: "easeInOut" }} style={{ transformOrigin: "left" }} />
                <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 2.5, duration: 0.5 }}><DoorOpen className="h-16 w-16 text-muted-foreground" /></motion.div>
                <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}><span className="text-4xl">✨</span></motion.div>
              </motion.div>
              <motion.div className="absolute bottom-0 left-1/2" initial={{ x: "-50%", y: 80, scale: 0.6 }} animate={{ x: "-50%", y: -20, scale: 0.9 }} transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}>
                <motion.img src={avatar === "boy" ? avatarBoy : avatarGirl} alt={playerName} className="h-28 w-28 object-contain" animate={{ x: [0, -3, 3, -3, 0] }} transition={{ duration: 0.5, repeat: 4, delay: 0.5 }} />
              </motion.div>
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 font-narrative text-lg text-foreground text-center">{playerName} caminha até a porta e insere a chave...</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCabinetPhase("teacher")} className="mt-4 rounded-lg bg-primary px-6 py-3 font-display text-lg text-primary-foreground glow-pink">A porta se abriu! 🎉</motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* TEACHER PHASE */}
        {cabinetPhase === "teacher" && (
          <motion.div key="teacher" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-[80vh] flex-col items-center justify-center p-6 relative overflow-hidden">
            <motion.div className="text-center space-y-6 max-w-md relative z-10">
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, type: "spring", damping: 10 }}>
                <img src={teacherImg} alt="Professora" className="h-44 w-44 object-contain mx-auto" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="space-y-4">
                <h2 className="font-display text-3xl text-secondary text-glow-green">Parabéns, {playerName}! 🎉</h2>
                <p className="font-narrative text-lg text-foreground">A professora está esperando do lado de fora com um grande sorriso!</p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="rounded-xl border border-secondary/30 bg-secondary/5 p-4">
                  <p className="font-narrative text-foreground italic">"{playerName}, estou impressionada! Você resolveu todos os enigmas do laboratório e provou que domina as vidrarias e os compostos inorgânicos. Nota máxima para você!"</p>
                  <p className="mt-2 font-narrative text-sm text-muted-foreground">— Professora</p>
                </motion.div>
              </motion.div>
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div key={i} className="absolute h-2 w-2 rounded-full" style={{ background: ["hsl(var(--game-pink))", "hsl(var(--game-green))", "hsl(var(--clue-yellow))", "hsl(var(--clue-blue))"][i % 4], left: `${Math.random() * 100}%`, top: "-5%" }} animate={{ y: ["0vh", "100vh"], x: [0, (Math.random() - 0.5) * 100], rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)] }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
                ))}
              </div>
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onVictory} className="rounded-lg bg-primary px-8 py-3 font-display text-lg text-primary-foreground glow-pink">🏆 Concluir Aventura</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slot fill modal - per-slot validation */}
      <AnimatePresence>
        {activeSlot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.7, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.7, y: 30 }} transition={{ type: "spring", damping: 15 }} className={`w-full max-w-md rounded-xl border-2 bg-game-surface p-6 ${SLOT_BORDER[activeSlot]}`}>
              <h3 className="font-display text-xl mb-1">{COLOR_EMOJI[activeSlot]} {COLOR_LABELS[activeSlot]}</h3>
              <p className="text-xs font-narrative text-muted-foreground mb-4">Selecione a vidraria e o composto corretos</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">🧪 Vidraria:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {GLASSWARE_OPTIONS.map(g => (
                      <motion.button key={g.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleGlasswareSelect(g.name)} disabled={selectionLockedRef.current} className={`rounded-lg border p-2 flex flex-col items-center gap-1 transition-all disabled:pointer-events-none disabled:opacity-70 ${selectedGlassware === g.name ? "border-primary bg-primary/20 ring-1 ring-primary" : "border-border bg-background hover:border-primary/50"}`}>
                        <img src={GLASSWARE_IMAGES[g.imageKey]} alt={g.name} className="h-10 w-10 object-contain" />
                        <span className="text-[8px] font-narrative text-foreground leading-tight text-center">{g.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">⚗️ Composto:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COMPOUND_OPTIONS.map(c => (
                      <motion.button key={c.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleCompoundSelect(c.name)} disabled={selectionLockedRef.current} className={`rounded-lg border p-2 flex flex-col items-center gap-1 transition-all disabled:pointer-events-none disabled:opacity-70 ${selectedCompound === c.name ? "border-secondary bg-secondary/20 ring-1 ring-secondary" : "border-border bg-background hover:border-secondary/50"}`}>
                        <img src={COMPOUND_IMAGES[c.imageKey]} alt={c.name} className="h-12 w-12 object-contain" />
                        <span className="text-[8px] font-narrative text-foreground leading-tight text-center">{c.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {lastResult && lastResult.color === activeSlot && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex items-center gap-2 text-sm font-narrative ${lastResult.correct ? "text-secondary" : "text-destructive"}`}>
                      {lastResult.correct ? <><Check className="h-4 w-4" /> Correto! ✨</> : <><AlertTriangle className="h-4 w-4" /> Incorreto! Tente novamente.</>}
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="pt-1 text-center text-[11px] font-narrative text-muted-foreground">A combinação é conferida automaticamente após escolher os dois itens.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
