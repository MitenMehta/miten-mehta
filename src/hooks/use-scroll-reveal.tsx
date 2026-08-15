import { useEffect, useRef, useState } from 'react';

export const useScrollReveal = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, keep it visible
          if (target) {
            observer.unobserve(target);
          }
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [options]);

  return { ref, isVisible };
};
