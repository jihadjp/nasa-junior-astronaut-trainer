// Smooth resource number interpolation hook for realistic telemetry display

import { useState, useEffect, useRef } from 'react';

export function useAnimatedNumber(targetValue: number, durationMs: number = 450): number {
  const [displayValue, setDisplayValue] = useState<number>(targetValue);
  const startValueRef = useRef<number>(targetValue);
  const targetValueRef = useRef<number>(targetValue);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // If user prefers reduced motion, jump directly
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setDisplayValue(targetValue);
      return;
    }

    startValueRef.current = displayValue;
    targetValueRef.current = targetValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(1, elapsed / durationMs);

      // Smooth ease-out quad interpolation
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const current = startValueRef.current + (targetValueRef.current - startValueRef.current) * easeProgress;

      setDisplayValue(Math.round(current * 10) / 10);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValueRef.current);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [targetValue, durationMs]);

  return displayValue;
}
