// Glassware images
import erlenmeyer from "@/assets/glassware/erlenmeyer.png";
import bequer from "@/assets/glassware/bequer.png";
import tuboEnsaio from "@/assets/glassware/tubo-ensaio.png";
import balao from "@/assets/glassware/balao.png";
import proveta from "@/assets/glassware/proveta.png";
import funil from "@/assets/glassware/funil.png";
import pisseta from "@/assets/glassware/pisseta.png";
import vidroRelogio from "@/assets/glassware/vidro-relogio.png";
import pipeta from "@/assets/glassware/pipeta.png";

// Compound images
import acidoCloridrico from "@/assets/compounds/acido-cloridrico.png";
import hidroxidoSodio from "@/assets/compounds/hidroxido-sodio.png";
import cloretoSodio from "@/assets/compounds/cloreto-sodio.png";
import dioxidoCarbono from "@/assets/compounds/dioxido-carbono.png";

export const GLASSWARE_IMAGES: Record<string, string> = {
  "erlenmeyer": erlenmeyer,
  "bequer": bequer,
  "tubo-ensaio": tuboEnsaio,
  "balao": balao,
  "proveta": proveta,
  "funil": funil,
  "pisseta": pisseta,
  "vidro-relogio": vidroRelogio,
  "pipeta": pipeta,
};

export const COMPOUND_IMAGES: Record<string, string> = {
  "acido-cloridrico": acidoCloridrico,
  "hidroxido-sodio": hidroxidoSodio,
  "cloreto-sodio": cloretoSodio,
  "dioxido-carbono": dioxidoCarbono,
};

// Map glassware name to image key
export const GLASSWARE_NAME_TO_KEY: Record<string, string> = {
  "Erlenmeyer": "erlenmeyer",
  "Béquer": "bequer",
  "Tubo de ensaio": "tubo-ensaio",
  "Balão": "balao",
  "Proveta": "proveta",
  "Funil": "funil",
  "Pisseta": "pisseta",
  "Vidro de relógio": "vidro-relogio",
  "Pipeta": "pipeta",
};

export const COMPOUND_NAME_TO_KEY: Record<string, string> = {
  "Ácido clorídrico": "acido-cloridrico",
  "Hidróxido de sódio": "hidroxido-sodio",
  "Cloreto de sódio": "cloreto-sodio",
  "Dióxido de carbono": "dioxido-carbono",
};
