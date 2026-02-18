"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Swords, User, Users, ChevronRight, Trophy } from "lucide-react";

interface ComparisonProps {
    userScore: number;
    userTitle: string;
}

export default function Comparison({ userScore, userTitle }: ComparisonProps) {
    const [friendScore, setFriendScore] = useState<number | "">("");
    const [friendTitle, setFriendTitle] = useState("");
    const [battleStarted, setBattleStarted] = useState(false);

    const winner = friendScore === "" ? null : userScore > Number(friendScore) ? "user" : "friend";

    return (
        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Swords className="w-32 h-32 rotate-12" />
            </div>

            {!battleStarted ? (
                <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Swords className="text-primary w-8 h-8" />
                            Enter Battle Mode
                        </h3>
                        <p className="text-slate-400 text-sm font-medium">Compare your AI Proof score with a friend's. Who has the stronger human edge?</p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Friend's Job</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sales Guru"
                                    value={friendTitle}
                                    onChange={(e) => setFriendTitle(e.target.value)}
                                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition-colors outline-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Friend's Score</label>
                                <input
                                    type="number"
                                    placeholder="0-100"
                                    value={friendScore}
                                    onChange={(e) => setFriendScore(e.target.value === "" ? "" : Number(e.target.value))}
                                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-white focus:border-primary transition-colors outline-none font-bold"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setBattleStarted(true)}
                            disabled={!friendTitle || friendScore === ""}
                            className="playful-button w-full flex items-center justify-center gap-2 group"
                        >
                            Start Battle
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8 relative z-10"
                >
                    <div className="flex justify-between items-center px-4">
                        <h3 className="text-xl font-black uppercase tracking-widest text-primary italic">Battle Result</h3>
                        <button
                            onClick={() => setBattleStarted(false)}
                            className="text-xs font-bold text-slate-400 hover:text-white underline underline-offset-4"
                        >
                            New Battle
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8 items-end">
                        {/* User Column */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className={`p-4 rounded-2xl bg-white/5 border-2 ${winner === "user" ? "border-primary shadow-[0_0_30px_rgba(255,107,107,0.3)]" : "border-slate-800"} transition-all w-full text-center relative`}>
                                {winner === "user" && <Trophy className="absolute -top-3 -left-3 w-8 h-8 text-yellow-400 -rotate-12 drop-shadow-lg" />}
                                <User className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                                <p className="text-[10px] font-black uppercase opacity-60 truncate">{userTitle}</p>
                                <div className="text-4xl font-black mt-1">{userScore}%</div>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${winner === "user" ? "bg-primary text-white" : "text-slate-500"}`}>
                                {winner === "user" ? "Ultimate Human" : "Fallen Hero"}
                            </span>
                        </div>

                        {/* Friend Column */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className={`p-4 rounded-2xl bg-white/5 border-2 ${winner === "friend" ? "border-secondary shadow-[0_0_30px_rgba(81,203,238,0.3)]" : "border-slate-800"} transition-all w-full text-center relative`}>
                                {winner === "friend" && <Trophy className="absolute -top-3 -right-3 w-8 h-8 text-yellow-400 rotate-12 drop-shadow-lg" />}
                                <Users className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                                <p className="text-[10px] font-black uppercase opacity-60 truncate">{friendTitle}</p>
                                <div className="text-4xl font-black mt-1">{friendScore}%</div>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${winner === "friend" ? "bg-secondary text-white" : "text-slate-500"}`}>
                                {winner === "friend" ? "Ultimate Human" : "Fallen Hero"}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <p className="text-sm font-bold italic text-slate-300">
                            {winner === "user"
                                ? `You definitely have the edge. ${friendTitle} might need to upskill.`
                                : `The machines are slightly more impressed by ${friendTitle}. Keep evolving!`}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
