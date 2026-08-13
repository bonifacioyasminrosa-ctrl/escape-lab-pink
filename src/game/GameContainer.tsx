import { useGameState } from "./useGameState";
import AvatarSelectScreen from "./AvatarSelectScreen";
import DifficultySelectScreen from "./DifficultySelectScreen";
import NameInputScreen from "./NameInputScreen";
import IntroScreen from "./IntroScreen";
import ExploreScreen from "./ExploreScreen";
import CabinetScreen from "./CabinetScreen";
import VictoryScreen from "./VictoryScreen";
import DefeatScreen from "./DefeatScreen";
import { AnimatePresence } from "framer-motion";

export default function GameContainer() {
  const {
    state, setAvatar, setDifficulty, setPlayerName, goToPhase,
    findClue, answerClue, fillCabinetSlot,
    toggleHint, resetGame,
  } = useGameState();

  return (
    <AnimatePresence mode="wait">
      {state.phase === "avatar" && (
        <AvatarSelectScreen
          key="avatar"
          onSelect={(avatar) => {
            setAvatar(avatar);
            goToPhase("difficulty");
          }}
        />
      )}

      {state.phase === "difficulty" && (
        <DifficultySelectScreen
          key="difficulty"
          onSelect={(difficulty) => {
            setDifficulty(difficulty);
            goToPhase("name");
          }}
        />
      )}

      {state.phase === "name" && (
        <NameInputScreen
          key="name"
          avatar={state.avatar}
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
          avatar={state.avatar}
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
          difficulty={state.difficulty}
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
          playerName={state.playerName}
          avatar={state.avatar}
          onFillSlot={fillCabinetSlot}
          onVictory={() => goToPhase("victory")}
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
