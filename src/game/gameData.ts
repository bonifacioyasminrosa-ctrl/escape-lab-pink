export type AvatarType = "boy" | "girl";
export type Difficulty = "facil" | "dificil";

export interface Clue {
  id: number;
  color: "red" | "blue" | "yellow" | "green";
  type: "vidraria" | "composto";
  question: string;
  answer: string;
  alternateAnswers: string[];
  options?: string[];
  found: boolean;
  answered: boolean;
}

export interface GameState {
  phase: "avatar" | "difficulty" | "name" | "intro" | "explore" | "cabinet" | "victory" | "defeat";
  avatar: AvatarType;
  difficulty: Difficulty;
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
    answer: "Erlenmeyer",
    alternateAnswers: ["erlenmeyer", "erlemeyer", "erlenmeier"],
    options: ["Erlenmeyer", "Béquer", "Proveta", "Funil"],
    found: false, answered: false,
  },
  {
    id: 2, color: "red", type: "composto",
    question: "Sou um ácido forte, muito usado na indústria e na limpeza de metais. Minha fórmula é HCl. Qual é meu nome?",
    answer: "Ácido clorídrico",
    alternateAnswers: ["acido cloridrico", "ácido cloridrico", "acido clorídrico", "hcl", "Acido cloridrico"],
    options: ["Ácido sulfúrico", "Ácido clorídrico", "Ácido nítrico", "Ácido fosfórico"],
    found: false, answered: false,
  },
  {
    id: 3, color: "blue", type: "vidraria",
    question: "Sou um recipiente cilíndrico com fundo chato, usado para aquecer líquidos ou fazer reações. Tenho uma boca larga. Quem sou eu?",
    answer: "Béquer",
    alternateAnswers: ["bequer", "becker", "béquer", "beaker", "beker", "Becker", "Bequer", "Beaker", "Beker"],
    options: ["Pipeta", "Tubo de ensaio", "Béquer", "Erlenmeyer"],
    found: false, answered: false,
  },
  {
    id: 4, color: "blue", type: "composto",
    question: "Sou uma base forte, conhecida como soda cáustica, usada na fabricação de sabão. Minha fórmula é NaOH. Qual é meu nome?",
    answer: "Hidróxido de sódio",
    alternateAnswers: ["hidroxido de sodio", "hidróxido de sodio", "hidroxido de sódio", "naoh", "soda caustica", "soda cáustica", "Hidroxido de sodio", "NaOH"],
    options: ["Hidróxido de cálcio", "Hidróxido de potássio", "Hidróxido de sódio", "Hidróxido de magnésio"],
    found: false, answered: false,
  },
  {
    id: 5, color: "yellow", type: "vidraria",
    question: "Sou um tubo alongado, aberto em uma das extremidades, usado para conter pequenas amostras ou fazer reações em pequena escala.",
    answer: "Tubo de ensaio",
    alternateAnswers: ["tubo de ensaio", "Tubo de Ensaio"],
    options: ["Tubo de ensaio", "Pisseta", "Proveta", "Vidro de relógio"],
    found: false, answered: false,
  },
  {
    id: 6, color: "yellow", type: "composto",
    question: "Sou o sal de cozinha, essencial para a vida e para temperar alimentos. Minha fórmula é NaCl. Qual é meu nome?",
    answer: "Cloreto de sódio",
    alternateAnswers: ["cloreto de sodio", "nacl", "sal de cozinha", "sal", "NaCl", "Cloreto de Sodio"],
    options: ["Sulfato de cálcio", "Nitrato de potássio", "Cloreto de sódio", "Carbonato de cálcio"],
    found: false, answered: false,
  },
  {
    id: 7, color: "green", type: "vidraria",
    question: "Tenho formato arredondado e fundo chato, usado para aquecer líquidos por longos períodos, comum em destilações.",
    answer: "Balão",
    alternateAnswers: ["balao", "balão de fundo chato", "balao de fundo chato", "balão volumétrico", "balao volumetrico", "Balao"],
    options: ["Vidro de relógio", "Balão", "Béquer", "Funil"],
    found: false, answered: false,
  },
  {
    id: 8, color: "green", type: "composto",
    question: "Sou um gás incolor essencial para a fotossíntese, produzido na respiração e na combustão. Minha fórmula é CO₂. Qual é meu nome?",
    answer: "Dióxido de carbono",
    alternateAnswers: ["dioxido de carbono", "co2", "gas carbonico", "gás carbônico", "CO2", "Dioxido de carbono", "Dioxido de Carbono"],
    options: ["Óxido de cálcio", "Óxido de ferro III", "Dióxido de carbono", "Óxido de enxofre VI"],
    found: false, answered: false,
  },
];

export const INITIAL_CABINET_SLOTS: CabinetSlot[] = [
  { color: "red", glassware: "", compound: "", correctGlassware: "Erlenmeyer", correctCompound: "Ácido clorídrico", filled: false, correct: false },
  { color: "blue", glassware: "", compound: "", correctGlassware: "Béquer", correctCompound: "Hidróxido de sódio", filled: false, correct: false },
  { color: "yellow", glassware: "", compound: "", correctGlassware: "Tubo de ensaio", correctCompound: "Cloreto de sódio", filled: false, correct: false },
  { color: "green", glassware: "", compound: "", correctGlassware: "Balão", correctCompound: "Dióxido de carbono", filled: false, correct: false },
];

export const COLOR_LABELS: Record<string, string> = {
  red: "Vermelho (Ácido)",
  blue: "Azul (Base)",
  yellow: "Amarelo (Sal)",
  green: "Verde (Óxido)",
};

export const COLOR_EMOJI: Record<string, string> = {
  red: "🔴",
  blue: "🔵",
  yellow: "🟡",
  green: "🟢",
};

// Glassware options with image keys
export interface GlasswareOption {
  name: string;
  imageKey: string;
}

export const GLASSWARE_OPTIONS: GlasswareOption[] = [
  { name: "Erlenmeyer", imageKey: "erlenmeyer" },
  { name: "Tubo de ensaio", imageKey: "tubo-ensaio" },
  { name: "Béquer", imageKey: "bequer" },
  { name: "Balão", imageKey: "balao" },
  { name: "Proveta", imageKey: "proveta" },
  { name: "Funil", imageKey: "funil" },
  { name: "Pisseta", imageKey: "pisseta" },
  { name: "Vidro de relógio", imageKey: "vidro-relogio" },
  { name: "Pipeta", imageKey: "pipeta" },
];

export interface CompoundOption {
  name: string;
  imageKey: string;
}

export const COMPOUND_OPTIONS: CompoundOption[] = [
  { name: "Ácido clorídrico", imageKey: "acido-cloridrico" },
  { name: "Hidróxido de sódio", imageKey: "hidroxido-sodio" },
  { name: "Cloreto de sódio", imageKey: "cloreto-sodio" },
  { name: "Dióxido de carbono", imageKey: "dioxido-carbono" },
];

export interface LabHotspot {
  id: number;
  clueId: number;
  label: string;
  icon: string;
  x: number;
  y: number;
}

export const LAB_HOTSPOTS: LabHotspot[] = [
  { id: 1, clueId: 1, label: "Quadro de giz", icon: "📝", x: 48, y: 22 },
  { id: 2, clueId: 2, label: "Bancada do professor", icon: "🧪", x: 48, y: 55 },
  { id: 3, clueId: 3, label: "Armário de vidrarias", icon: "🗄️", x: 18, y: 38 },
  { id: 4, clueId: 4, label: "Mesa do aluno (esquerda)", icon: "📋", x: 15, y: 62 },
  { id: 5, clueId: 5, label: "Capela de exaustão", icon: "🔬", x: 75, y: 35 },
  { id: 6, clueId: 6, label: "Estante de livros", icon: "📚", x: 90, y: 32 },
  { id: 7, clueId: 7, label: "Gaveta da bancada", icon: "🗃️", x: 78, y: 58 },
  { id: 8, clueId: 8, label: "Mesa do aluno (direita)", icon: "📄", x: 82, y: 72 },
];
