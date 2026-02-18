"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Building2, GraduationCap, ArrowRight, Search, Check } from "lucide-react";
import { COMMON_JOB_TITLES } from "@/data/job_titles";

interface JobFormProps {
    onSubmit: (data: JobData) => void;
}

export interface JobData {
    title: string;
    industry: string;
    experience: string;
}

const INDUSTRIES = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Creative & Arts",
    "Retail & Sales",
    "Manufacturing",
    "Marketing & PR",
    "Legal",
    "Other",
];

const EXPERIENCE_LEVELS = [
    { id: "junior", label: "Junior", description: "0-2 years" },
    { id: "mid", label: "Mid-Level", description: "3-5 years" },
    { id: "senior", label: "Senior", description: "6-10 years" },
    { id: "expert", label: "Expert / Lead", description: "10+ years" },
];

export default function JobForm({ onSubmit }: JobFormProps) {
    const [formData, setFormData] = useState<JobData>({
        title: "",
        industry: "",
        experience: "",
    });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter suggestions based on input
    useEffect(() => {
        if (formData.title.length > 1) {
            const filtered = COMMON_JOB_TITLES.filter(job =>
                job.toLowerCase().includes(formData.title.toLowerCase())
            ).slice(0, 5); // Limit to top 5
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    }, [formData.title]);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title && formData.industry && formData.experience) {
            onSubmit(formData);
        }
    };

    const selectSuggestion = (job: string) => {
        setFormData({ ...formData, title: job });
        setShowSuggestions(false);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-8 rounded-3xl playful-shadow border-2 border-slate-100"
        >
            <div className="space-y-4 relative" ref={dropdownRef}>
                <label className="flex items-center gap-2 text-lg font-bold text-slate-700">
                    <Briefcase className="w-5 h-5 text-primary" />
                    What's your job title?
                </label>
                <div className="relative">
                    <input
                        autoFocus
                        type="text"
                        placeholder="e.g. Graphic Designer, Software Engineer..."
                        className="playful-input pr-12"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        onFocus={() => formData.title.length > 1 && setShowSuggestions(true)}
                        required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                        <Search className="w-5 h-5" />
                    </div>
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                    {showSuggestions && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl border-2 border-slate-100 shadow-xl overflow-hidden"
                        >
                            <div className="p-2 space-y-1">
                                {suggestions.map((job) => (
                                    <button
                                        key={job}
                                        type="button"
                                        onClick={() => selectSuggestion(job)}
                                        className="w-full flex justify-between items-center px-4 py-3 rounded-xl hover:bg-primary/5 text-left font-bold text-slate-600 hover:text-primary transition-all group"
                                    >
                                        <span>{job}</span>
                                        {formData.title.toLowerCase() === job.toLowerCase() && (
                                            <Check className="w-4 h-4 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="bg-slate-50 p-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center border-t border-slate-50">
                                Suggested Roles
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-4">
                <label className="flex items-center gap-2 text-lg font-bold text-slate-700">
                    <Building2 className="w-5 h-5 text-secondary" />
                    Which industry are you in?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {INDUSTRIES.map((ind) => (
                        <button
                            key={ind}
                            type="button"
                            onClick={() => setFormData({ ...formData, industry: ind })}
                            className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-semibold
                ${formData.industry === ind
                                    ? "border-secondary bg-secondary/10 text-secondary"
                                    : "border-slate-100 hover:border-slate-300 text-slate-500"
                                }`}
                        >
                            {ind}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="flex items-center gap-2 text-lg font-bold text-slate-700">
                    <GraduationCap className="w-5 h-5 text-accent text-slate-600" />
                    How much experience?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EXPERIENCE_LEVELS.map((exp) => (
                        <button
                            key={exp.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, experience: exp.id })}
                            className={`flex flex-col p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${formData.experience === exp.id
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-slate-100 hover:border-slate-300"
                                }`}
                        >
                            <span className={`font-bold ${formData.experience === exp.id ? "text-primary" : "text-slate-700"}`}>
                                {exp.label}
                            </span>
                            <span className="text-sm text-slate-400">{exp.description}</span>
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={!formData.title || !formData.industry || !formData.experience}
                className="playful-button w-full group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span>Analyze My Future</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.form>
    );
}
