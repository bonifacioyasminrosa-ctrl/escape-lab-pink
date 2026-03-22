import { motion } from "framer-motion";
import erlenmeyerImg from "@/assets/glassware/erlenmeyer.png";

interface ErlenLivesProps {
  errors: number;
  maxErrors: number;
}

export default function ErlenLives({ errors, maxErrors }: ErlenLivesProps) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: maxErrors }).map((_, i) => {
        const isBroken = i < errors;
        return (
          <motion.div
            key={i}
            className="relative h-7 w-5"
            animate={i === errors - 1 && errors > 0 ? { rotate: [0, 15, -10, 5, 0], scale: [1, 1.2, 0.9, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <img
              src={erlenmeyerImg}
              alt={isBroken ? "Erlenmeyer quebrado" : "Erlenmeyer intacto"}
              className={`h-full w-full object-contain transition-all duration-300 ${
                isBroken ? "opacity-25 grayscale sepia hue-rotate-[330deg] saturate-200" : ""
              }`}
            />
            {isBroken && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-destructive text-xs font-bold">✕</span>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
