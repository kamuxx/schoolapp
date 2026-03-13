'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    alpha: number;
    color: string;
    type: 'circle' | 'line' | 'polygon';
}

interface AnimatedBackgroundProps {
    variant?: 'light' | 'dark';
    density?: 'low' | 'medium' | 'high';
    showConnections?: boolean;
}

const COLORS = {
    light: ['#0e5199', '#175ea8', '#277bd9', '#60a5fa', '#93c5fd'],
    dark: ['#60a5fa', '#93c5fd', '#277bd9', '#175ea8', '#bfdbfe'],
};

export default function AnimatedBackground({
    variant = 'dark',
    density = 'medium',
    showConnections = true,
}: AnimatedBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0, radius: 150 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const densityMap = {
            low: 8000,
            medium: 15000,
            high: 10000,
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            const particles: Particle[] = [];
            const particleCount = Math.floor(
                (canvas.width * canvas.height) / densityMap[density],
            );

            const types: ('circle' | 'line' | 'polygon')[] = [
                'circle',
                'circle',
                'circle',
                'line',
                'polygon',
            ];

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 2 + 0.5,
                    alpha: Math.random() * 0.4 + 0.1,
                    color: COLORS[variant][
                        Math.floor(Math.random() * COLORS[variant].length)
                    ],
                    type: types[Math.floor(Math.random() * types.length)],
                });
            }
            particlesRef.current = particles;
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width)
                    particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height)
                    particle.vy *= -1;

                const dx = mouseRef.current.x - particle.x;
                const dy = mouseRef.current.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseRef.current.radius) {
                    const force =
                        (mouseRef.current.radius - distance) /
                        mouseRef.current.radius;
                    const angle = Math.atan2(dy, dx);
                    particle.vx -= Math.cos(angle) * force * 0.01;
                    particle.vy -= Math.sin(angle) * force * 0.01;
                }

                particle.vx *= 0.995;
                particle.vy *= 0.995;

                ctx.globalAlpha = particle.alpha;

                if (particle.type === 'circle') {
                    ctx.beginPath();
                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.radius,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fillStyle = particle.color;
                    ctx.fill();
                } else if (particle.type === 'line') {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(
                        particle.x + particle.vx * 10,
                        particle.y + particle.vy * 10,
                    );
                    ctx.strokeStyle = particle.color;
                    ctx.lineWidth = particle.radius * 0.5;
                    ctx.stroke();
                } else if (particle.type === 'polygon') {
                    const sides = 3 + Math.floor(Math.random() * 3);
                    ctx.beginPath();
                    for (let i = 0; i < sides; i++) {
                        const angle = (i / sides) * Math.PI * 2;
                        const px =
                            particle.x + Math.cos(angle) * particle.radius;
                        const py =
                            particle.y + Math.sin(angle) * particle.radius;
                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.fillStyle = particle.color;
                    ctx.fill();
                }
            });

            if (showConnections) {
                particlesRef.current.forEach((p1, i) => {
                    particlesRef.current.slice(i + 1).forEach((p2) => {
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = p1.color;
                            ctx.globalAlpha = (1 - distance / 100) * 0.1;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    });
                });
            }

            ctx.globalAlpha = 1;
            animationRef.current = requestAnimationFrame(drawParticles);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouseRef.current.x = -1000;
            mouseRef.current.y = -1000;
        };

        resizeCanvas();
        createParticles();
        drawParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [variant, density, showConnections]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        />
    );
}
