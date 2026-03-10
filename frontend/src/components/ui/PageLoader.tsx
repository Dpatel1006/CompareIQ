'use client';

import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';

interface PageLoaderProps {
    message?: string;
}

/**
 * Full-screen premium loading screen shown during:
 * - Initial auth check
 * - Route transitions
 * - Comparison generation
 */
export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
    const [progress, setProgress] = useState(0);
    const [dots, setDots] = useState(0);

    // Fake progress bar — fills smoothly to 90% then waits
    useEffect(() => {
        const timings = [
            { target: 30, duration: 400 },
            { target: 60, duration: 600 },
            { target: 85, duration: 800 },
        ];
        let current = 0;
        const timers: ReturnType<typeof setTimeout>[] = [];
        timings.forEach(({ target, duration }) => {
            const t = setTimeout(() => {
                setProgress(target);
            }, current);
            timers.push(t);
            current += duration;
        });
        return () => timers.forEach(clearTimeout);
    }, []);

    // Animated dots
    useEffect(() => {
        const id = setInterval(() => setDots((d) => (d + 1) % 4), 400);
        return () => clearInterval(id);
    }, []);

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, #0a0a1a 0%, #111128 50%, #0d0d20 100%)',
            }}
        >
            {/* Animated mesh background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    style={{
                        position: 'absolute',
                        width: '600px',
                        height: '600px',
                        top: '-200px',
                        left: '-200px',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                        animation: 'float 6s ease-in-out infinite',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        width: '500px',
                        height: '500px',
                        bottom: '-150px',
                        right: '-150px',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
                        animation: 'float 8s ease-in-out infinite reverse',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        top: '50%',
                        left: '60%',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
                        animation: 'float 5s ease-in-out infinite 1s',
                    }}
                />
            </div>

            {/* Central loader */}
            <div className="relative flex flex-col items-center gap-8 z-10">

                {/* Orbit rings + logo */}
                <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
                    {/* Outer orbit ring */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            border: '1px solid rgba(99,102,241,0.2)',
                        }}
                    />
                    {/* Orbit dot 1 */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            boxShadow: '0 0 12px rgba(99,102,241,0.8)',
                            animation: 'orbit 2.5s linear infinite',
                            transformOrigin: 'center',
                        }}
                    />
                    {/* Orbit dot 2 */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                            boxShadow: '0 0 8px rgba(139,92,246,0.7)',
                            animation: 'orbitReverse 1.8s linear infinite',
                            transformOrigin: 'center',
                        }}
                    />
                    {/* Inner ring */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '68px',
                            height: '68px',
                            borderRadius: '50%',
                            border: '1px solid rgba(99,102,241,0.15)',
                        }}
                    />
                    {/* Logo center */}
                    <div
                        style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.2)',
                            animation: 'pulseGlow 2s ease-in-out infinite',
                        }}
                    >
                        <BarChart3 style={{ width: 28, height: 28, color: 'white' }} />
                    </div>
                </div>

                {/* Brand name */}
                <div className="text-center">
                    <h1
                        style={{
                            fontSize: '1.75rem',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #c4b5fd 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            lineHeight: 1.2,
                        }}
                    >
                        CompareIQ
                    </h1>
                    <p
                        style={{
                            marginTop: '6px',
                            fontSize: '0.85rem',
                            color: 'rgba(148,163,184,0.8)',
                            letterSpacing: '0.04em',
                        }}
                    >
                        {message}
                        {'.'.repeat(dots)}
                    </p>
                </div>

                {/* Progress bar */}
                <div
                    style={{
                        width: '200px',
                        height: '3px',
                        background: 'rgba(99,102,241,0.15)',
                        borderRadius: '99px',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
                            borderRadius: '99px',
                            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 0 12px rgba(99,102,241,0.6)',
                        }}
                    />
                </div>

                {/* Wave dots */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="loading-dot"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/** Inline mini spinner for buttons / small areas */
export function MiniSpinner({ className = '' }: { className?: string }) {
    return (
        <div
            className={className}
            style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '2.5px solid rgba(99,102,241,0.2)',
                borderTopColor: '#6366f1',
                animation: 'spin 0.7s linear infinite',
                flexShrink: 0,
            }}
        />
    );
}

/** Section skeleton with shimmer */
export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
    return (
        <div className="space-y-3 animate-fade-in">
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton rounded-xl"
                    style={{
                        height: i === 0 ? '120px' : '60px',
                        opacity: 1 - i * 0.15,
                    }}
                />
            ))}
        </div>
    );
}
