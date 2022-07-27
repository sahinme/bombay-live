import React, { CSSProperties } from "react";
import { motion } from "framer-motion";

interface IAnimatedTextContent {
  className?: string;
  customKey: string;
  children?: any;
  style?: CSSProperties;
  onAnimationComplete?: () => void;
}

const AnimatedTextContent: React.FC<IAnimatedTextContent> = ({
  children,
  style,
  customKey,
  className,
  onAnimationComplete,
}) => {
  return (
    <motion.p
      key={customKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={style}
      className={`result-title ${className}`}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.p>
  );
};

export default AnimatedTextContent;
