import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedContainerProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  animate?: boolean;
}

// You'll need to install framer-motion: npm install framer-motion
const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  delay = 0.2,
  duration = 0.5,
  animate = true
}) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration,
        delay,
        ease: 'easeOut'
      }
    }
  };
  
  if (!animate) {
    return <>{children}</>;
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;
