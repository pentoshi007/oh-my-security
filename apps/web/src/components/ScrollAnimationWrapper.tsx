'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollAnimationWrapper({
  children,
  className,
  delay = 0,
}: ScrollAnimationWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 