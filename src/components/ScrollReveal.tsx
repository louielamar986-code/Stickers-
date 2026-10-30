import React, { ReactNode } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ScrollRevealProps {
  children: ReactNode;
  variant?: 'up' | 'left' | 'right' | 'scale';
  delay?: number; // In ms
  className?: string;
  as?: React.ElementType;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  as = 'div',
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  once = true,
}) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLElement>({
    threshold,
    rootMargin,
    once,
  });

  const getVariantClass = () => {
    switch (variant) {
      case 'left':
        return 'reveal-left';
      case 'right':
        return 'reveal-right';
      case 'scale':
        return 'reveal-scale';
      case 'up':
      default:
        return 'reveal-base';
    }
  };

  const Component = as as any;

  return (
    <Component
      ref={ref}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
      }}
      className={`${getVariantClass()} ${isVisible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </Component>
  );
};
