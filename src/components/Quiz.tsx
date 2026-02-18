"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUIZ_QUESTIONS, Question } from "@/data/questions";
import { ChevronRight, ChevronLeft, Sparkles, Loader2, Zap, X, AlertCircle } from "lucide-react";

interface QuizProps {
    jobTitle: string;
    industry: string;
    experience: string;
    onComplete: (answers: Record<string, number>, questions: Question[]) => void;
    onExit: () => void;
}

export default function Quiz({ jobTitle, industry, experience, onComplete, onExit }: QuizProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isAiActive, setIsAiActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchAiQuestions() {
            try {
                const response = await fetch("/api/questions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jobTitle, industry, experience }),
                });

                let finalPool: Question[] = [];

                if (response.ok) {
                    const data = await response.json();

                    // Check for validation error
                    if (data.error === "invalid_role") {
                        if (isMounted) {
                            setError(data.message);
                            setIsLoading(false);
                        }
                        return;
                    }

                    if (Array.isArray(data) && data.length > 0) {
                        const staticSample = [...QUIZ_QUESTIONS]
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 4);
                        const finalPool = [...staticSample, ...data].sort(() => Math.random() - 0.5);

                        if (isMounted) {
                            setQuestions(finalPool);
                            setIsAiActive(true);
                            setIsLoading(false);
                        }
                        return;
                    }
                }
                throw new Error("API failed or fallback required");
            } catch (err) {
                if (!isMounted) return;
                console.warn("Falling back to Smart Matching", err);

                const jobTerms = jobTitle.toLowerCase().split(/\s+/);
                const industryTerms = industry.toLowerCase().split(/\s+/);
                const allTerms = [...jobTerms, ...industryTerms];

                const matched = QUIZ_QUESTIONS.filter(q =>
                    q.tags?.some(tag => allTerms.some(term => term.includes(tag) || tag.includes(term)))
                );

                const others = QUIZ_QUESTIONS.filter(q => !matched.find(m => m.id === q.id));

                const finalSelection = [
                    ...matched.sort(() => Math.random() - 0.5).slice(0, 10),
                    ...others.sort(() => Math.random() - 0.5).slice(0, 5)
                ].sort(() => Math.random() - 0.5);

                setQuestions(finalSelection);
                setIsAiActive(false);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchAiQuestions();
        return () => { isMounted = false; };
    }, [jobTitle, industry]);

    const currentQuestion = questions[currentIndex];
    const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

    const handleAnswer = (value: number) => {
        const newAnswers = { ...answers, [currentQuestion.id]: value };
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete(newAnswers, questions);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Consulting the Oracles...</h2>
                    <p className="text-slate-500 font-medium">Generating job-specific challenges for a <span className="text-primary">{jobTitle}</span>.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl mx-auto bg-white p-12 rounded-3xl playful-shadow border-2 border-slate-100 text-center space-y-8"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-500">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-slate-900 leading-tight">Identity Crisis Detected</h2>
                    <p className="text-slate-500 text-xl font-medium">
                        "{jobTitle}"? {error}
                    </p>
                </div>
                <button
                    onClick={onExit}
                    className="playful-button w-full bg-slate-900"
                >
                    Escape This Reality
                </button>
                <footer className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    Entry rejected by Labor Economist AI
                </footer>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 relative">
            <button
                onClick={onExit}
                className="absolute -top-10 right-0 p-2 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 font-black text-xs uppercase tracking-widest"
            >
                <X className="w-4 h-4" />
                Exit Test
            </button>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-400 uppercase tracking-wider">
                    <span>Question {currentIndex + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border-2 border-slate-100">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-8 md:p-12 rounded-3xl playful-shadow border-2 border-slate-100 min-h-[400px] flex flex-col justify-center"
                >
                    <div className="space-y-8">
                        <div className="space-y-4">
                            {currentQuestion.id.startsWith('ai-') ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/10 text-secondary font-bold text-xs uppercase">
                                    <Sparkles className="w-3 h-3" />
                                    Custom AI Thought for a {jobTitle}
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100 text-orange-600 font-bold text-xs uppercase">
                                    <Zap className="w-3 h-3" />
                                    Smart Matched for {jobTitle}
                                </div>
                            )}
                            <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                                {currentQuestion.text}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {currentQuestion.type === "scale" && (
                                <div className="space-y-10 py-6">
                                    <div className="flex justify-between items-center gap-2">
                                        {[0, 25, 50, 75, 100].map((value) => (
                                            <button
                                                key={value}
                                                onClick={() => handleAnswer(value)}
                                                className="group flex flex-col items-center gap-3 flex-1"
                                            >
                                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-50 border-2 border-slate-100 group-hover:border-primary group-hover:bg-primary/5 transition-all flex items-center justify-center text-2xl font-black text-slate-300 group-hover:text-primary group-hover:scale-110 active:scale-95">
                                                    {value === 0 && "1"}
                                                    {value === 25 && "2"}
                                                    {value === 50 && "3"}
                                                    {value === 75 && "4"}
                                                    {value === 100 && "5"}
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full bg-primary/20 transition-all duration-300`} style={{ width: `${value}%` }} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-sm font-black text-slate-400 tracking-tight uppercase">
                                        <span className="max-w-[100px] leading-tight">{currentQuestion.minLabel}</span>
                                        <span className="max-w-[100px] text-right leading-tight">{currentQuestion.maxLabel}</span>
                                    </div>
                                </div>
                            )}

                            {currentQuestion.type === "multiple-choice" && (
                                <div className="grid gap-3">
                                    {currentQuestion.options?.map((option) => (
                                        <button
                                            key={option.label}
                                            onClick={() => handleAnswer(option.value)}
                                            className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-primary hover:bg-primary/5 transition-all duration-200 font-bold text-slate-700 group flex justify-between items-center"
                                        >
                                            {option.label}
                                            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center">
                <button
                    onClick={handleBack}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <div className="text-slate-300 font-bold italic text-sm">
                    Thinking like a {jobTitle}...
                </div>
            </div>
        </div>
    );
}
