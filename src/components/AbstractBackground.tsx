import { useEffect, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    color: string;
}

// ─── Config ──────────────────────────────────────────────────
const CONNECTION_DISTANCE = 140;
const MOUSE_REPEL_RADIUS = 90;
const MOUSE_REPEL_FORCE = 0.35;
const BASE_SPEED = 0.28;

const PALETTE = [
    'rgba(6,  182, 212',    // blue-500
    'rgba(20, 184, 166',    // blue-500
    'rgba(14, 165, 233',    // sky-500
    'rgba(34, 211, 238',    // blue-400
    'rgba(45, 212, 191',    // blue-400
];

function randomColor() {
    return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

function particleCount(w: number, h: number) {
    return Math.min(100, Math.floor((w * h) / 14000));
}

// ─── Component ───────────────────────────────────────────────
export default function AbstractBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: -9999, y: -9999 });
    const particles = useRef<Particle[]>([]);
    const rafId = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;

        // ── Init ──────────────────────────────────────────────────
        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            particles.current = Array.from({ length: particleCount(canvas.width, canvas.height) }, () => {
                const angle = Math.random() * Math.PI * 2;
                const speed = BASE_SPEED * (0.5 + Math.random() * 1.0);
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    r: 1.2 + Math.random() * 1.6,
                    color: randomColor(),
                };
            });
        };

        // ── Draw large gradient blobs (background) ────────────────
        const drawBlobs = () => {
            const blobs = [
                { x: canvas.width * 0.15, y: canvas.height * 0.2, r: 340, c: 'rgba(6,182,212,' },
                { x: canvas.width * 0.82, y: canvas.height * 0.75, r: 280, c: 'rgba(20,184,166,' },
                { x: canvas.width * 0.55, y: canvas.height * 0.5, r: 200, c: 'rgba(14,165,233,' },
            ];

            blobs.forEach(b => {
                const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
                g.addColorStop(0, `${b.c}0.065)`);
                g.addColorStop(0.6, `${b.c}0.03)`);
                g.addColorStop(1, `${b.c}0)`);
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        // ── Draw connections ──────────────────────────────────────
        const drawConnections = () => {
            const pts = particles.current;
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x;
                    const dy = pts[i].y - pts[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DISTANCE) {
                        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);

                        // Gradient line between the two particle colors
                        const grad = ctx.createLinearGradient(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
                        grad.addColorStop(0, `${pts[i].color},${opacity})`);
                        grad.addColorStop(1, `${pts[j].color},${opacity})`);
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        };

        // ── Draw particles ────────────────────────────────────────
        const drawParticles = () => {
            particles.current.forEach(p => {
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
                g.addColorStop(0, `${p.color},0.9)`);
                g.addColorStop(1, `${p.color},0)`);
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        // ── Update positions ──────────────────────────────────────
        const update = (w: number, h: number) => {
            particles.current.forEach(p => {
                // Mouse repulsion
                const mdx = p.x - mouse.current.x;
                const mdy = p.y - mouse.current.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < MOUSE_REPEL_RADIUS && mdist > 0) {
                    const force = (MOUSE_REPEL_RADIUS - mdist) / MOUSE_REPEL_RADIUS * MOUSE_REPEL_FORCE;
                    p.vx += (mdx / mdist) * force;
                    p.vy += (mdy / mdist) * force;
                }

                // Speed cap
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > BASE_SPEED * 2.5) {
                    p.vx = (p.vx / speed) * BASE_SPEED * 2.5;
                    p.vy = (p.vy / speed) * BASE_SPEED * 2.5;
                }

                // Drift back to base speed
                p.vx *= 0.998;
                p.vy *= 0.998;

                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > w) { p.vx *= -1; p.x = Math.max(0, Math.min(w, p.x)); }
                if (p.y < 0 || p.y > h) { p.vy *= -1; p.y = Math.max(0, Math.min(h, p.y)); }
            });
        };

        // ── Animation loop ────────────────────────────────────────
        const draw = () => {
            const { width: w, height: h } = canvas;
            ctx.clearRect(0, 0, w, h);

            drawBlobs();
            drawConnections();
            drawParticles();
            update(w, h);

            rafId.current = requestAnimationFrame(draw);
        };

        // ── Resize ────────────────────────────────────────────────
        let resizeTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(init, 200);
        };

        // ── Mouse ─────────────────────────────────────────────────
        const onMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };
        const onMouseLeave = () => {
            mouse.current = { x: -9999, y: -9999 };
        };

        init();
        draw();
        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseleave', onMouseLeave);

        return () => {
            cancelAnimationFrame(rafId.current);
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return (
        <>
            {/* Canvas particle network */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 0 }}
                aria-hidden="true"
            />

            {/* Vignette overlay — fades edges so content pops */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 1,
                    background: `
            radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, hsl(238,22%,5%) 100%)
          `,
                }}
                aria-hidden="true"
            />

            {/* Top/bottom edge fades */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: 1,
                    background: `
            linear-gradient(to bottom,
              hsl(238,22%,5%) 0%,
              transparent 8%,
              transparent 92%,
              hsl(238,22%,5%) 100%
            )
          `,
                }}
                aria-hidden="true"
            />
        </>
    );
}
