export interface Clue {
  id: number;
  color: "red" | "blue" | "yellow" | "green";
  type: "vidraria" | "composto";
  question: string;
  answer: string;
  found: boolean;
  answered: boolean;
}

export interface GameState {
  phase: "name" | "intro" | "explore" | "cabinet" | "victory" | "defeat";
  playerName: string;
  clues: Clue[];
  errors: number;
  maxErrors: number;
  timeLeft: number;
  cabinetSlots: CabinetSlot[];
  showHint: boolean;
}

export interface CabinetSlot {
  color: "red" | "blue" | "yellow" | "green";
  glassware: string;
  compound: string;
  correctGlassware: string;
  correctCompound: string;
  filled: boolean;
  correct: boolean;
}

export const CLUES: Clue[] = [
  {
    id: 1, color: "red", type: "vidraria",
    question: "Tenho formato cônico, fundo chato e um gargalo estreito. Sou muito usado em titulações porque meu formato facilita a agitação sem risco de derramar. Qual é o meu nome?",
    answer: "Erlenmeyer", found: false, answered: false,
  },
  {
    id: 2, color: "red", type: "composto",
    question: "Sou um ácido forte, muito usado na indústria e na limpeza de metais. Minha fórmula é HCl. Qual é meu nome?",
    answer: "Ácido clorídrico", found: false, answered: false,
  },
  {
    id: 3, color: "blue", type: "vidraria",
    question: "Sou um recipiente cilíndrico com fundo chato, usado para aquecer líquidos ou fazer reações. Tenho uma boca larga. Quem sou eu?",
    answer: "Béquer", found: false, answered: false,
  },
  {
    id: 4, color: "blue", type: "composto",
    question: "Sou uma base forte, conhecida como soda cáustica, usada na fabricação de sabão. Minha fórmula é NaOH. Qual é meu nome?",
    answer: "Hidróxido de sódio", found: false, answered: false,
  },
  {
    id: 5, color: "yellow", type: "vidraria",
    question: "Sou um tubo alongado, aberto em uma das extremidades, usado para conter pequenas amostras ou fazer reações em pequena escala.",
    answer: "Tubo de ensaio", found: false, answered: false,
  },
  {
    id: 6, color: "yellow", type: "composto",
    question: "Sou o sal de cozinha, essencial para a vida e para temperar alimentos. Minha fórmula é NaCl. Qual é meu nome?",
    answer: "Cloreto de sódio", found: false, answered: false,
  },
  {
    id: 7, color: "green", type: "vidraria",
    question: "Tenho formato arredondado e fundo chato, usado para aquecer líquidos por longos períodos, comum em destilações.",
    answer: "Balão de fundo chato", found: false, answered: false,
  },
  {
    id: 8, color: "green", type: "composto",
    question: "Sou um gás incolor essencial para a fotossíntese, produzido na respiração e na combustão. Minha fórmula é CO₂. Qual é meu nome?",
    answer: "Dióxido de carbono", found: false, answered: false,
  },
];

export const INITIAL_CABINET_SLOTS: CabinetSlot[] = [
  { color: "red", glassware: "", compound: "", correctGlassware: "Erlenmeyer", correctCompound: "Ácido clorídrico", filled: false, correct: false },
  { color: "blue", glassware: "", compound: "", correctGlassware: "Béquer", correctCompound: "Hidróxido de sódio", filled: false, correct: false },
  { color: "yellow", glassware: "", compound: "", correctGlassware: "Tubo de ensaio", correctCompound: "Cloreto de sódio", filled: false, correct: false },
  { color: "green", glassware: "", compound: "", correctGlassware: "Balão de fundo chato", correctCompound: "Dióxido de carbono", filled: false, correct: false },
];

export const COLOR_LABELS: Record<string, string> = {
  red: "Vermelho (Ácido)",
  blue: "Azul (Base)",
  yellow: "Amarelo (Sal)",
  green: "Verde (Óxido)",
};

export const GLASSWARE_OPTIONS = ["Erlenmeyer", "Tubo de ensaio", "Béquer", "Balão de fundo chato", "Proveta", "Funil", "Pisseta", "Vidro de relógio", "Pipeta"];
export const COMPOUND_OPTIONS = ["Ácido clorídrico", "Hidróxido de sódio", "Cloreto de sódio", "Dióxido de carbono"];
