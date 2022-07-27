import React, { CSSProperties } from "react";
import { motion, Transition } from "framer-motion";

interface IAnimatedTextContent {
  className?: string;
  customKey: string;
  children?: any;
  style?: CSSProperties;
  transition?: Transition;
  onAnimationComplete?: () => void;
}

const AnimatedTextContent: React.FC<IAnimatedTextContent> = ({
  children,
  style,
  customKey,
  className,
  transition,
  onAnimationComplete,
}) => {
  return (
    <motion.p
      key={customKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
      style={style}
      className={`result-title ${className}`}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.p>
  );
};

export default AnimatedTextContent;
