import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, CLUES, INITIAL_CABINET_SLOTS } from "./gameData";

const GAME_TIME = 60 * 60; // 60 minutes

export function useGameState() {
  const [state, setState] = useState<GameState>({
    phase: "name",
    playerName: "",
    clues: CLUES.map(c => ({ ...c })),
    errors: 0,
    maxErrors: 3,
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
    const correct = answer.toLowerCase().trim() === clue.answer.toLowerCase().trim();
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

  const fillCabinetSlot = useCallback((color: string, glassware: string, compound: string): boolean => {
    let isCorrect = false;
    setState(prev => {
      const newSlots = prev.cabinetSlots.map(s => {
        if (s.color === color) {
          const correct = glassware === s.correctGlassware && compound === s.correctCompound;
          isCorrect = correct;
          if (correct) {
            return { ...s, glassware, compound, filled: true, correct: true };
          }
          return s;
        }
        return s;
      });

      if (!isCorrect) {
        const newErrors = prev.errors + 1;
        if (newErrors >= prev.maxErrors) {
          stopTimer();
          return { ...prev, errors: newErrors, cabinetSlots: newSlots, phase: "defeat" };
        }
        return { ...prev, errors: newErrors, cabinetSlots: newSlots };
      }

      const allCorrect = newSlots.every(s => s.correct);
      if (allCorrect) {
        stopTimer();
        return { ...prev, cabinetSlots: newSlots, phase: "victory" };
      }
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
      phase: "name",
      playerName: "",
      clues: CLUES.map(c => ({ ...c })),
      errors: 0,
      maxErrors: 3,
      timeLeft: GAME_TIME,
      cabinetSlots: INITIAL_CABINET_SLOTS.map(s => ({ ...s })),
      showHint: false,
    });
  }, [stopTimer]);

  return {
    state,
    setPlayerName,
    goToPhase,
    findClue,
    answerClue,
    fillCabinetSlot,
    toggleHint,
    resetGame,
  };
}
