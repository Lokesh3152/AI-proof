"use client";

import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Share2, RefreshCw, Trophy, AlertTriangle, Zap, Coffee, ChevronUp } from "lucide-react";
import canvasConfetti from "canvas-confetti";
import ShareCard from "./ShareCard";
import { Question } from "@/data/questions";

interface ResultsProps {
    jobTitle: string;
    answers: Record<string, number>;
    questions: Question[];
    onRestart: () => void;
}

const VERDICTS = [
    { range: [0, 25], label: "Human in Training", icon: <Coffee className="w-12 h-12 text-slate-400" />, color: "text-slate-500", bg: "bg-slate-50" },
    { range: [26, 50], label: "Evolving Professional", icon: <Zap className="w-12 h-12 text-blue-400" />, color: "text-blue-500", bg: "bg-blue-50" },
    { range: [51, 75], label: "Strong Human Edge", icon: <StatusShield className="w-12 h-12 text-green-400" />, color: "text-green-500", bg: "bg-green-50" },
    { range: [76, 100], label: "Certified AI Proof", icon: <Trophy className="w-12 h-12 text-yellow-500" />, color: "text-yellow-600", bg: "bg-yellow-50" },
];

function StatusShield({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
    );
}

export default function Results({ jobTitle, answers, questions, onRestart }: ResultsProps) {
    const [showShare, setShowShare] = useState(false);
    const result = useMemo(() => {
        // Map answer IDs to dimensions and calculate averages
        const dimensions: Record<string, number[]> = {
            repetition: [],
            creativity: [],
            emotions: [],
            strategy: [],
            physical: [],
            data: [],
            adaptability: [],
        };

        Object.entries(answers).forEach(([id, val]) => {
            const question = questions.find((q: Question) => q.id === id);
            if (question) {
                const dim = question.dimension.toLowerCase();
                if (dimensions[dim]) {
                    dimensions[dim].push(val);
                } else {
                    dimensions[dim] = [val];
                }
            }
        });

        const getAvg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 50;

        const scores = {
            repetition: getAvg(dimensions.repetition),
            creativity: getAvg(dimensions.creativity),
            emotions: getAvg(dimensions.emotions),
            strategy: getAvg(dimensions.strategy),
            physical: getAvg(dimensions.physical),
            data: getAvg(dimensions.data),
            adaptability: getAvg(dimensions.adaptability),
        };

        // Calculate AI Proof Score (Higher = More Resilient)
        // Factors that REDUCE proof (Automations)
        const automationPressure = (scores.repetition * 0.6 + scores.data * 0.4);

        // Factors that INCREASE proof (Human Edge)
        const humanEdge = (
            scores.creativity * 0.25 +
            scores.emotions * 0.25 +
            scores.strategy * 0.20 +
            scores.physical * 0.20 +
            scores.adaptability * 0.10
        );

        // Final Score: Blend Human Edge with the inverse of automation pressure
        let finalScore = (humanEdge + (100 - automationPressure)) / 2;
        finalScore = Math.max(0, Math.min(100, finalScore));

        return {
            score: Math.round(finalScore),
            breakdown: [
                { subject: 'Creativity', A: scores.creativity },
                { subject: 'Empathy', A: scores.emotions },
                { subject: 'Strategy', A: scores.strategy },
                { subject: 'Dexterity', A: scores.physical },
                { subject: 'Intuition', A: 100 - scores.data }, // High score in data = low intuition in this context
                { subject: 'Evolution', A: scores.adaptability },
            ],
            verdict: VERDICTS.find(v => Math.round(finalScore) >= v.range[0] && Math.round(finalScore) <= v.range[1]) || VERDICTS[1]
        };
    }, [answers, questions]);

    useEffect(() => {
        if (result.score > 70) {
            canvasConfetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [result.score]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-8"
        >
            <div className="bg-white rounded-3xl p-8 md:p-12 playful-shadow border-2 border-slate-100 text-center space-y-8">
                <div className="space-y-4">
                    <div className={`inline-flex items-center justify-center p-6 rounded-full ${result.verdict.bg}`}>
                        {result.verdict.icon}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                        {result.score}% <span className="text-slate-300">AI Proof</span>
                    </h1>
                    <p className={`text-2xl font-bold ${result.verdict.color}`}>
                        Status: <span className="underline decoration-wavy">{result.verdict.label}</span>
                    </p>
                </div>

                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={result.breakdown}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 'bold' }} />
                            <Radar
                                name="Human Edge"
                                dataKey="A"
                                stroke="#ff6b6b"
                                fill="#ff6b6b"
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-6 text-left border-t-2 border-slate-50 pt-8 mt-8">
                    <h2 className="text-2xl font-bold text-slate-800">Why this score?</h2>
                    <p className="text-slate-500 leading-relaxed font-medium">
                        As a <span className="text-primary font-bold">{jobTitle}</span>, you excel in
                        <span className="text-secondary font-bold"> {[...result.breakdown].sort((a, b) => b.A - a.A)[0].subject}</span>.
                        {result.score > 60
                            ? " However, a large chunk of your daily grind involves patterns that machines absolutely LOVE to chew up."
                            : " Machines find your workflow too chaotic, emotional, or physically complex to handle... for now."}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={() => setShowShare(!showShare)}
                        className={`playful-button flex-1 flex items-center justify-center gap-2 ${showShare ? 'bg-slate-800' : ''}`}
                    >
                        {showShare ? <ChevronUp className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                        {showShare ? "Close Share Mode" : "Share My Fate"}
                    </button>
                    <button
                        onClick={onRestart}
                        className="px-8 py-4 bg-slate-100 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Retest
                    </button>
                </div>

                <AnimatePresence>
                    {showShare && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-8 border-t-2 border-slate-50 overflow-hidden"
                        >
                            <ShareCard
                                jobTitle={jobTitle}
                                score={result.score}
                                verdict={result.verdict.label}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="bg-accent/10 border-2 border-accent/20 rounded-3xl p-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Your Evolutionary Playbook:</h3>
                <ul className="space-y-3">
                    <li className="flex gap-2 text-slate-600 font-medium text-sm">
                        <div className="text-accent">✦</div>
                        Audit your daily tasks—if it's a pattern, it's machine terrain. If it's chaos, it's your stronghold.
                    </li>
                    <li className="flex gap-2 text-slate-600 font-medium text-sm">
                        <div className="text-accent">✦</div>
                        Double down on "reading the room." AI can process data, but it can't authentically navigate human conflict.
                    </li>
                    <li className="flex gap-2 text-slate-600 font-medium text-sm">
                        <div className="text-accent">✦</div>
                        Learn to prompt high-level strategy into the machines, rather than competing on execution speed.
                    </li>
                </ul>
            </div>
        </motion.div>
    );
}
