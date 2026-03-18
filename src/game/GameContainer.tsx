import { useGameState } from "./useGameState";
import NameInputScreen from "./NameInputScreen";
import IntroScreen from "./IntroScreen";
import ExploreScreen from "./ExploreScreen";
import CabinetScreen from "./CabinetScreen";
import VictoryScreen from "./VictoryScreen";
import DefeatScreen from "./DefeatScreen";
import { AnimatePresence } from "framer-motion";

export default function GameContainer() {
  const {
    state, setPlayerName, goToPhase,
    findClue, answerClue, fillCabinetSlot,
    toggleHint, resetGame,
  } = useGameState();

  return (
    <AnimatePresence mode="wait">
      {state.phase === "name" && (
        <NameInputScreen
          key="name"
          onSubmit={(name) => {
            setPlayerName(name);
            goToPhase("intro");
          }}
        />
      )}

      {state.phase === "intro" && (
        <IntroScreen
          key="intro"
          playerName={state.playerName}
          onContinue={() => goToPhase("explore")}
        />
      )}

      {state.phase === "explore" && (
        <ExploreScreen
          key="explore"
          clues={state.clues}
          errors={state.errors}
          maxErrors={state.maxErrors}
          timeLeft={state.timeLeft}
          showHint={state.showHint}
          onFindClue={findClue}
          onAnswerClue={answerClue}
          onGoToCabinet={() => goToPhase("cabinet")}
          onToggleHint={toggleHint}
        />
      )}

      {state.phase === "cabinet" && (
        <CabinetScreen
          key="cabinet"
          slots={state.cabinetSlots}
          errors={state.errors}
          maxErrors={state.maxErrors}
          timeLeft={state.timeLeft}
          onFillSlot={fillCabinetSlot}
        />
      )}

      {state.phase === "victory" && (
        <VictoryScreen
          key="victory"
          playerName={state.playerName}
          onRestart={resetGame}
        />
      )}

      {state.phase === "defeat" && (
        <DefeatScreen
          key="defeat"
          playerName={state.playerName}
          reason={state.timeLeft <= 0 ? "time" : "errors"}
          onRestart={resetGame}
        />
      )}
    </AnimatePresence>
  );
}
