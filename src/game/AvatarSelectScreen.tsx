import { motion } from "framer-motion";
import { AvatarType } from "./gameData";
import avatarBoy from "@/assets/avatar-boy.png";
import avatarGirl from "@/assets/avatar-girl.png";

interface AvatarSelectScreenProps {
  onSelect: (avatar: AvatarType) => void;
}

export default function AvatarSelectScreen({ onSelect }: AvatarSelectScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center justify-center bg-background p-6"
    >
      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              background: i % 2 === 0 ? "hsl(var(--game-pink) / 0.4)" : "hsl(var(--game-green) / 0.4)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative z-10 w-full max-w-lg space-y-8 text-center"
      >
        <div>
          <motion.h1
            className="font-display text-4xl text-primary text-glow-pink"
            animate={{ textShadow: ["0 0 20px hsl(340 70% 55% / 0.5)", "0 0 40px hsl(340 70% 55% / 0.8)", "0 0 20px hsl(340 70% 55% / 0.5)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ChemScape
          </motion.h1>
          <p className="mt-3 font-narrative text-lg text-muted-foreground">
            Escolha seu personagem para começar a aventura...
          </p>
        </div>

        <div className="flex justify-center gap-8">
          {[
            { type: "boy" as AvatarType, src: avatarBoy, label: "Cientista" },
            { type: "girl" as AvatarType, src: avatarGirl, label: "Cientista" },
          ].map(({ type, src, label }) => (
            <motion.button
              key={type}
              onClick={() => onSelect(type)}
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-game-surface p-6 transition-colors hover:border-primary"
            >
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{ boxShadow: "0 0 30px hsl(var(--game-pink) / 0.3)" }}
              />
              <img src={src} alt={label} className="h-36 w-36 object-contain" />
              <span className="font-display text-lg text-foreground">{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
