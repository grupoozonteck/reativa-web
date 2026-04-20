import { Trophy, PartyPopper } from 'lucide-react';

interface CongratulationsModalProps {
    onClose: () => void;
}

export function CongratulationsModal({ onClose }: CongratulationsModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative z-10 solid-card p-8 max-w-sm w-full text-center animate-fade-in shadow-2xl"
                onClick={e => e.stopPropagation()}
                style={{ animationDuration: '0.3s' }}
            >
                {/* Confetes animados */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full opacity-80"
                            style={{
                                left: `${8 + i * 7}%`,
                                top: '-8px',
                                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#ec4899'][i % 6],
                                animation: `confetti-fall ${1 + (i % 3) * 0.4}s ease-in ${(i % 5) * 0.15}s forwards`,
                            }}
                        />
                    ))}
                </div>
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                        <Trophy className="w-10 h-10 text-emerald-500" />
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <PartyPopper className="w-5 h-5 text-amber-500" />
                    <h2 className="text-2xl font-extrabold tracking-tight">Parabéns!</h2>
                    <PartyPopper className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                    Nova venda realizada! 🎉<br />
                    Seu número de reativados aumentou.
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
                >
                    Arrasou! 🚀
                </button>
            </div>
        </div>
    );
}
