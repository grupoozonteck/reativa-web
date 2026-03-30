'use client';

import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/useTheme';

export default function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08 }}
            title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className={`
                relative w-8 h-8 rounded-lg flex items-center justify-center
                transition-colors duration-300 cursor-pointer
                ${isDark
                    ? 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25'
                    : 'bg-amber-400/10 text-amber-500 hover:bg-amber-400/20'
                }
            `}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ y: -16, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 16, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="flex items-center justify-center"
                >
                    {isDark
                        ? <Sun className="w-4 h-4" />
                        : <Moon className="w-4 h-4" />
                    }
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
}