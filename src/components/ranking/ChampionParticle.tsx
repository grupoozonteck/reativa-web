import { motion } from 'framer-motion';

export function ChampionParticle({ i }: { i: number }) {
    const angle = (i / 8) * 360;
    const radius = 54 + (i % 3) * 14;
    const size = 3 + (i % 3);
    const colors = ['#fbbf24', '#f59e0b', '#fcd34d', '#06b6d4', '#fdba74'];
    const color = colors[i % colors.length];
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
                width: size, height: size,
                background: color,
                boxShadow: `0 0 ${size * 2}px ${color}`,
                top: '50%', left: '50%',
            }}
            animate={{
                x: [
                    Math.cos((angle * Math.PI) / 180) * radius,
                    Math.cos(((angle + 60) * Math.PI) / 180) * (radius + 10),
                    Math.cos((angle * Math.PI) / 180) * radius,
                ],
                y: [
                    Math.sin((angle * Math.PI) / 180) * radius,
                    Math.sin(((angle + 60) * Math.PI) / 180) * (radius + 10),
                    Math.sin((angle * Math.PI) / 180) * radius,
                ],
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.3, 1],
            }}
            transition={{
                duration: 2.4 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.15,
            }}
        />
    );
}
