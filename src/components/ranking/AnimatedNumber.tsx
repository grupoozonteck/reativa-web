import { useEffect, useRef } from 'react';
import {
    motion,
    useMotionValue,
    useTransform,
    animate as frameAnimate,
    useInView,
} from 'framer-motion';

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
const NUM = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

export function AnimatedNumber({
    value,
    currency = false,
    suffix = '',
    decimals = 0,
    className,
    duration = 1.6,
}: {
    value: number;
    currency?: boolean;
    suffix?: string;
    decimals?: number;
    className?: string;
    duration?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionVal = useMotionValue(0);
    const formatted = useTransform(motionVal, (v) => {
        if (currency) return BRL.format(v);
        if (decimals === 0) return `${NUM.format(Math.round(v))}${suffix}`;
        return `${v.toFixed(decimals)}${suffix}`;
    });
    const inView = useInView(ref, { once: true, margin: '-40px' });

    useEffect(() => {
        if (!inView) return;
        const ctrl = frameAnimate(motionVal, value, { duration, ease: [0.22, 1, 0.36, 1] });
        return () => ctrl.stop();
    }, [inView, value, duration, motionVal]);

    return (
        <motion.span ref={ref} className={className}>
            {formatted}
        </motion.span>
    );
}
