import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, CLUES, INITIAL_CABINET_SLOTS, AvatarType } from "./gameData";

const GAME_TIME = 30 * 60;

function normalize(s: string) {
  return s.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    phase: "avatar",
    avatar: "boy",
    playerName: "",
    clues: CLUES.map(c => ({ ...c })),
    errors: 0,
    maxErrors: 5,
    timeLeft: GAME_TIME,
    cabinetSlots: INITIAL_CABINET_SLOTS.map(s => ({ ...s })),
    showHint: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return { ...prev, timeLeft: 0, phase: "defeat" };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const setAvatar = useCallback((avatar: AvatarType) => {
    setState(prev => ({ ...prev, avatar }));
  }, []);

  const setPlayerName = useCallback((name: string) => {
    setState(prev => ({ ...prev, playerName: name }));
  }, []);

  const goToPhase = useCallback((phase: GameState["phase"]) => {
    setState(prev => ({ ...prev, phase }));
    if (phase === "explore") startTimer();
    if (phase === "victory" || phase === "defeat") stopTimer();
  }, [startTimer, stopTimer]);

  const findClue = useCallback((clueId: number) => {
    setState(prev => ({
      ...prev,
      clues: prev.clues.map(c => c.id === clueId ? { ...c, found: true } : c),
    }));
  }, []);

  const answerClue = useCallback((clueId: number, answer: string): boolean => {
    const clue = state.clues.find(c => c.id === clueId);
    if (!clue) return false;
    
    const normalizedAnswer = normalize(answer);
    const correct = normalize(clue.answer) === normalizedAnswer ||
      clue.alternateAnswers.some(alt => normalize(alt) === normalizedAnswer);
    
    if (correct) {
      setState(prev => ({
        ...prev,
        clues: prev.clues.map(c => c.id === clueId ? { ...c, answered: true } : c),
      }));
    } else {
      setState(prev => {
        const newErrors = prev.errors + 1;
        if (newErrors >= prev.maxErrors) {
          stopTimer();
          return { ...prev, errors: newErrors, phase: "defeat" };
        }
        return { ...prev, errors: newErrors };
      });
    }
    return correct;
  }, [state.clues, stopTimer]);

  // Cabinet uses exact string comparison since user picks from buttons
  const fillCabinetSlot = useCallback((color: string, glassware: string, compound: string): boolean => {
    let isCorrect = false;
    setState(prev => {
      const slot = prev.cabinetSlots.find(s => s.color === color);
      if (!slot) return prev;

      // Direct comparison - user selects from predefined buttons
      const correct = glassware === slot.correctGlassware && compound === slot.correctCompound;
      isCorrect = correct;

      const newSlots = prev.cabinetSlots.map(s => {
        if (s.color === color && correct) {
          return { ...s, glassware, compound, filled: true, correct: true };
        }
        return s;
      });

      if (!correct) {
        const newErrors = prev.errors + 1;
        if (newErrors >= prev.maxErrors) {
          stopTimer();
          return { ...prev, errors: newErrors, cabinetSlots: newSlots, phase: "defeat" };
        }
        return { ...prev, errors: newErrors, cabinetSlots: newSlots };
      }

      // Don't auto-transition to victory - let CabinetScreen handle it via its internal phases
      return { ...prev, cabinetSlots: newSlots };
    });
    return isCorrect;
  }, [stopTimer]);

  const toggleHint = useCallback(() => {
    setState(prev => ({ ...prev, showHint: !prev.showHint }));
  }, []);

  const resetGame = useCallback(() => {
    stopTimer();
    setState({
      phase: "avatar",
      avatar: "boy",
      playerName: "",
      clues: CLUES.map(c => ({ ...c })),
      errors: 0,
      maxErrors: 5,
      timeLeft: GAME_TIME,
      cabinetSlots: INITIAL_CABINET_SLOTS.map(s => ({ ...s })),
      showHint: false,
    });
  }, [stopTimer]);

  return {
    state,
    setAvatar,
    setPlayerName,
    goToPhase,
    findClue,
    answerClue,
    fillCabinetSlot,
    toggleHint,
    resetGame,
  };
}
