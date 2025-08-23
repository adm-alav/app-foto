import { motion } from "framer-motion";
import { LineChart, TrendingUp, TrendingDown, Timer, Target, Shield, Send } from "lucide-react";

interface SignalAnimationProps {
  step: number;
  isSuccess?: boolean;
}

export function SignalAnimation({ step, isSuccess }: SignalAnimationProps) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderIcon = () => {
    const iconProps = {
      className: "w-12 h-12 text-[#FFB800]",
      initial: "hidden",
      animate: "visible",
      variants: iconVariants
    };

    switch(step) {
      case 1: return <LineChart {...iconProps} />;
      case 2: return <TrendingUp {...iconProps} />;
      case 3: return <Target {...iconProps} />;
      case 4: return <Timer {...iconProps} />;
      case 5: return <Shield {...iconProps} />;
      case 6: return <Send {...iconProps} />;
      default: return null;
    }
  };

  const messages = [
    "Analisando padrões do mercado...",
    "Identificando tendências...",
    "Calculando pontos de entrada...",
    "Definindo momento ideal...",
    "Estabelecendo proteções...",
    "Preparando sinal..."
  ];

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center p-8 rounded-xl bg-black/20 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    >
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate="pulse"
        variants={pulseVariants}
      >
        <div className="w-full h-full bg-[#FFB800]/5 rounded-xl" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {renderIcon()}
        
        <motion.div
          className="text-xl font-medium text-[#FFB800]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {messages[step - 1]}
        </motion.div>

        <motion.div 
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[1, 2, 3].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 rounded-full bg-[#FFB800]"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: dot * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
