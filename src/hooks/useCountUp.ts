import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to `end` over `duration` ms.
 * Returns the current numeric value.
 */
export function useCountUp(end: number, duration = 1200) {
    const [count, setCount] = useState(0);
    const ref = useRef<number | null>(null);
    const startTime = useRef<number | null>(null);

    useEffect(() => {
        // Reset when end changes
        startTime.current = null;

        const step = (timestamp: number) => {
            if (!startTime.current) startTime.current = timestamp;
            const progress = Math.min(
                (timestamp - startTime.current) / duration,
                1,
            );
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * end);
            if (progress < 1) {
                ref.current = requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };

        ref.current = requestAnimationFrame(step);
        return () => {
            if (ref.current) cancelAnimationFrame(ref.current);
        };
    }, [end, duration]);

    return count;
}
