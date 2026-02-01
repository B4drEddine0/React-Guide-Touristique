import { motion, type TargetAndTransition } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
  once?: boolean;
}

const getInitial = (direction: FadeInProps['direction'], distance: number): TargetAndTransition => {
  const base: TargetAndTransition = { opacity: 0 };
  switch (direction) {
    case 'up':
      return { ...base, y: distance };
    case 'down':
      return { ...base, y: -distance };
    case 'left':
      return { ...base, x: distance };
    case 'right':
      return { ...base, x: -distance };
    default:
      return base;
  }
};

function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 30,
  className = '',
  once = true,
}: FadeInProps) {
  return (
    <motion.div
      initial={getInitial(direction, distance)}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default FadeIn;
