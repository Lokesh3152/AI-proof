"use client";

import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Sparkles, Instagram, Linkedin, Twitter, Copy, Check } from "lucide-react";
import { GET_ONE_LINER, GET_SOCIAL_COPY } from "@/data/wit";

interface ShareCardProps {
    jobTitle: string;
    score: number;
    verdict: string;
}

type Format = "square" | "story" | "landscape";
type Style = "modern" | "certification" | "warning" | "ai-message";

export default function ShareCard({ jobTitle, score, verdict }: ShareCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [format, setFormat] = useState<Format>("square");
    const [style, setStyle] = useState<Style>("modern");
    const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

    // We want the same joke for the session but different styles
    const [oneLiner] = useState(() => GET_ONE_LINER(score));

    const handleDownload = async () => {
        if (cardRef.current === null) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `aiproof-${style}-${format}-${jobTitle.toLowerCase().replace(/\s+/g, '-')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setIsExporting(false);
        }
    };

    const handleShare = (platform: string) => {
        const text = GET_SOCIAL_COPY(platform, score, jobTitle);
        const url = "https://aiproof.app"; // Placeholder or actual app URL

        const shareUrls: Record<string, string> = {
            Twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
            LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], "_blank", "width=600,height=400");
        }

        // Always copy to clipboard as a courtesy fallback
        navigator.clipboard.writeText(text);
        setCopiedPlatform(platform);
        setTimeout(() => setCopiedPlatform(null), 2000);
    };

    const nextStyle = () => {
        const styles: Style[] = ["modern", "certification", "warning", "ai-message"];
        const currentIndex = styles.indexOf(style);
        setStyle(styles[(currentIndex + 1) % styles.length]);
    };

    const aspectClasses = {
        square: "aspect-square w-full max-w-[400px]",
        story: "aspect-[9/16] w-full max-w-[300px]",
        landscape: "aspect-[1.91/1] w-full max-w-[600px]",
    };

    const renderCard = () => {
        switch (style) {
            case "certification":
                return (
                    <div className="h-full w-full bg-slate-50 border-[12px] border-slate-900 p-8 flex flex-col items-center justify-between text-slate-900 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary animate-pulse" />
                        <div className="space-y-4 pt-4">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Official Certification</p>
                            <h2 className="text-4xl font-black leading-none uppercase tracking-tighter">{jobTitle}</h2>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full border-8 border-slate-900 flex items-center justify-center mb-2 relative">
                                <span className="text-4xl font-black">{score}%</span>
                                <div className="absolute -bottom-4 bg-slate-900 text-white px-3 py-1 text-[10px] font-black uppercase">Resilient</div>
                            </div>
                        </div>
                        <div className="space-y-4 pb-4">
                            <div className="px-6 py-2 border-2 border-slate-900 inline-block font-black uppercase italic relative">
                                {verdict}
                                <div className="absolute -top-3 -right-3 bg-primary text-white p-1 rounded-full"><Check className="w-3 h-3" /></div>
                            </div>
                            <p className="text-sm font-bold leading-tight max-w-[90%] mx-auto opacity-70">"{oneLiner}"</p>
                        </div>
                        <div className="w-full flex justify-between items-end border-t border-slate-200 pt-4 text-[8px] font-bold opacity-50 uppercase tracking-widest">
                            <span>Auth ID: AIP-2026-X7</span>
                            <span>aiproof.app</span>
                        </div>
                    </div>
                );
            case "warning":
                return (
                    <div className="h-full w-full bg-orange-400 p-8 flex flex-col justify-between text-slate-900 relative overflow-hidden font-mono">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_0)] bg-[size:10px_10px]" />
                        <div className="flex justify-between items-start relative z-10">
                            <div className="bg-slate-900 text-orange-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest">Caution: Higher Intelligence</div>
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <div className="space-y-2 relative z-10 text-center">
                            <p className="text-xs font-black uppercase">Subject Identification</p>
                            <h2 className="text-5xl font-black uppercase leading-none">{jobTitle}</h2>
                        </div>
                        <div className="text-center relative z-10">
                            <div className="text-9xl font-black leading-none">{score}%</div>
                            <p className="text-base font-black uppercase tracking-tighter bg-slate-900 text-orange-400 px-4 py-1 inline-block -rotate-2 mt-4">{verdict}</p>
                        </div>
                        <div className="relative z-10 bg-white/20 p-4 border border-slate-900/10 backdrop-blur-sm">
                            <p className="text-sm font-bold leading-tight italic">"{oneLiner}"</p>
                        </div>
                        <div className="flex justify-between items-end relative z-10 text-[10px] font-black uppercase pt-4">
                            <span>AI Proof Verified</span>
                            <span className="opacity-50 underline">Scan for Authenticity</span>
                        </div>
                    </div>
                );
            case "ai-message":
                return (
                    <div className="h-full w-full bg-slate-900 p-8 flex flex-col justify-between text-green-400 relative overflow-hidden font-mono text-left">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-20" />
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <p className="text-[10px] opacity-60 uppercase tracking-[0.5em]">System Status: Analyzing Genesis</p>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <p className="text-[10px] opacity-50 underline uppercase">Target Role</p>
                                <h2 className="text-3xl font-black uppercase tracking-widest leading-none text-white">{jobTitle}</h2>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <div className="text-7xl font-black text-white">{score}%</div>
                                <div className="text-[10px] border border-green-400 px-2 py-1 animate-pulse uppercase">Immunity Score</div>
                            </div>
                            <div className="p-4 border-l-4 border-green-500 bg-white/5 space-y-2">
                                <p className="text-xs font-black uppercase opacity-60 leading-none">Verdict Analysis:</p>
                                <p className="text-lg font-black text-white italic">{verdict}</p>
                                <p className="text-xs text-green-200/80 leading-snug">"{oneLiner}"</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-green-900/50 flex justify-between items-end text-[8px] font-black uppercase tracking-[0.3em]">
                            <span>Identity: Verified Human</span>
                            <span>Runtime: AI.PROOF.SH</span>
                        </div>
                    </div>
                );
            default: // modern
                return (
                    <div className="h-full w-full bg-gradient-to-br from-primary via-secondary to-accent p-8 flex flex-col justify-between text-white relative overflow-hidden">
                        <Sparkles className="absolute top-4 right-4 w-12 h-12 opacity-20 rotate-12" />
                        <Sparkles className="absolute bottom-10 left-4 w-8 h-8 opacity-20 -rotate-12" />
                        <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 underline">AI Proof Results</p>
                            <h2 className={`${format === 'landscape' ? 'text-5xl' : 'text-4xl'} font-black leading-none uppercase tracking-tighter`}>{jobTitle}</h2>
                        </div>
                        <div className="text-center relative z-10 py-6">
                            <div className={`${format === 'landscape' ? 'text-9xl' : 'text-[100px]'} font-black leading-none drop-shadow-2xl`}>{score}%</div>
                            <div className="px-6 py-2 bg-white text-primary inline-block rounded-full font-black text-sm uppercase tracking-widest shadow-xl mt-4">
                                {verdict}
                            </div>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <p className={`${format === 'landscape' ? 'text-2xl' : 'text-xl'} font-black italic leading-tight text-white drop-shadow-md max-w-[90%]`}>
                                "{oneLiner}"
                            </p>
                            <div className="pt-4 border-t border-white/20 flex justify-between items-end">
                                <span className="text-[10px] font-black opacity-70 tracking-[0.3em] uppercase">Built for 2026</span>
                                <span className="text-xs font-black">AIPROOF.APP</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/30 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/30 rounded-full blur-[100px]" />
                    </div>
                );
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-center gap-4">
                {/* Format Selector */}
                <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                    {(['square', 'story', 'landscape'] as Format[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFormat(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${format === f ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Style Toggle */}
                <button
                    onClick={nextStyle}
                    className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                    <RefreshCw className="w-4 h-4" />
                    Style: {style}
                </button>
            </div>

            <div className="flex justify-center p-4">
                <div ref={cardRef} className={`${aspectClasses[format]} rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] ring-1 ring-slate-200`}>
                    {renderCard()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto px-4">
                {/* Actions */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center md:text-left">Export Identity</h3>
                    <button
                        onClick={handleDownload}
                        disabled={isExporting}
                        className="playful-button w-full flex items-center justify-center gap-3 py-4 text-sm"
                    >
                        {isExporting ? "Rendering Design..." : "Save Identity PNG"}
                        <Download className="w-5 h-5" />
                    </button>
                    <div className="flex justify-center md:justify-start gap-6 pt-2">
                        <Twitter className="w-6 h-6 text-slate-300 hover:text-sky-500 cursor-pointer transition-colors" onClick={() => handleShare('Twitter')} />
                        <Linkedin className="w-6 h-6 text-slate-300 hover:text-blue-600 cursor-pointer transition-colors" onClick={() => handleShare('LinkedIn')} />
                        <Instagram className="w-6 h-6 text-slate-300 hover:text-pink-500 cursor-pointer transition-colors" onClick={() => handleShare('Instagram')} />
                    </div>
                </div>

                {/* Social Copy Generator */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center md:text-left">Social Sharing</h3>
                    <div className="space-y-2">
                        {['Twitter', 'LinkedIn', 'Instagram'].map((p) => (
                            <button
                                key={p}
                                onClick={() => handleShare(p)}
                                className="w-full p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-primary/30 transition-all flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    {p === 'Twitter' && <Twitter className="w-4 h-4 text-sky-400" />}
                                    {p === 'LinkedIn' && <Linkedin className="w-4 h-4 text-blue-500" />}
                                    {p === 'Instagram' && <Instagram className="w-4 h-4 text-pink-400" />}
                                    <span className="text-xs font-bold text-slate-600">{p === 'Instagram' ? `Copy for ${p}` : `Share on ${p}`}</span>
                                </div>
                                {copiedPlatform === p ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-300 group-hover:text-primary" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { RefreshCw, Shield, AlertTriangle } from "lucide-react";
