'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Zap, Brain, Globe, Search, Database, Layers, CheckCircle2 } from 'lucide-react';

const MESSAGES = [
    { icon: Search, text: "Scanning global markets..." },
    { icon: Database, text: "Retrieving technical specifications..." },
    { icon: Brain, text: "Consulting AI comparison engine..." },
    { icon: Zap, text: "Analyzing performance benchmarks..." },
    { icon: Layers, text: "Cross-referencing user reviews..." },
    { icon: Globe, text: "Verifying regional availability..." },
    { icon: Sparkles, text: "Generating premium insights..." },
];

export function CompareLoading() {
    const [index, setIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Cycle through messages
        const msgInterval = setInterval(() => {
            setIndex((i) => (i + 1) % MESSAGES.length);
        }, 2800);

        // Smooth progress bar simulation
        const progInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 98) return prev;
                const inc = Math.random() * 2;
                return Math.min(prev + inc, 98);
            });
        }, 150);

        return () => {
            clearInterval(msgInterval);
            clearInterval(progInterval);
        };
    }, []);

    const CurrentIcon = MESSAGES[index].icon;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden">
            {/* Dynamic blurred background */}
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl transition-colors duration-500" />

            {/* Animated geometric background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-400/10 rounded-full blur-[100px] animate-pulse delay-700" />

            {/* Main Content Card */}
            <div className="relative w-full max-w-lg px-6 flex flex-col items-center">
                {/* Central Core Animation */}
                <div className="relative mb-12">
                    {/* Rotating Rings */}
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-200 dark:border-indigo-900/30 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute -inset-4 rounded-full border border-indigo-500/20 animate-[spin_15s_linear_infinite_reverse]" />
                    <div className="absolute -inset-8 rounded-full border-2 border-dashed border-violet-500/10 animate-[spin_20s_linear_infinite]" />

                    {/* Core Orb */}
                    <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center p-0.5 shadow-2xl shadow-indigo-500/30 overflow-hidden">
                        {/* Shimmer effect inside orb */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        <div className="relative h-full w-full rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center">
                            <Brain className="h-10 w-10 text-white animate-pulse" />
                        </div>
                    </div>

                    {/* Orbiting particles */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                            style={{
                                transform: `rotate(${i * 60}deg) translate(60px) rotate(-${i * 60}deg)`,
                                animation: `orbit 3s linear infinite`,
                                animationDelay: `${i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                {/* Textual Feedback */}
                <div className="text-center space-y-4 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Synthesizing Comparison
                    </h2>

                    <div className="h-8 flex items-center justify-center gap-3 text-indigo-600 dark:text-indigo-400 font-medium">
                        <CurrentIcon className="h-5 w-5 animate-bounce" />
                        <span className="transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
                            {MESSAGES[index].text}
                        </span>
                    </div>
                </div>

                {/* Premium Progress Bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-2 mb-2 overflow-hidden border border-gray-200 dark:border-gray-800">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 bg-[length:200%_100%] animate-[gradientShift_2s_linear_infinite] transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                    <span>Initializing</span>
                    <span>{Math.round(progress)}% Complete</span>
                    <span>Finalizing</span>
                </div>

                {/* Bottom trust badge */}
                <div className="mt-12 flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500 font-medium">DeepMind Verified Model v2.4</span>
                </div>
            </div>
        </div>
    );
}
