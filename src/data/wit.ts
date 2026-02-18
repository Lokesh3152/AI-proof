export const WITTY_ONE_LINERS = [
    { range: [0, 20], texts: ["The machines are already drafting your emails.", "AI just applied for your job.", "You're basically a spreadsheet in a human suit.", "A prompt away from a permanent vacation.", "The algorithm thinks you're 'efficient' but optional."] },
    { range: [21, 40], texts: ["Mildly resilient. Like a house of cards in a data center.", "AI is taking notes on your workflow.", "The robots are curious, but not threatened.", "Humanity: 3, AI: 7.", "You're the 'Before' picture in an automation case study."] },
    { range: [41, 60], texts: ["In the gray zone. Start making friends with the servers.", "Neither bot nor boss yet.", "You're the human bridge to an automated future.", "Fighting the good fight, one creative spark at a time.", "The algorithm is reconsidering its options."] },
    { range: [61, 80], texts: ["Strong Human Edge. The robots are mildly intimidated.", "AI can optimize your workflow. It still can't survive your team meetings.", "A glitch in the automation matrix.", "Your chaos is your superpower.", "Too 'weird' for a standard prompt."] },
    { range: [81, 100], texts: ["Certified AI Proof. You're the reason they haven't won yet.", "The ultimate human firewall.", "Legally too creative for a GPU to handle.", "The algorithm just had an existential crisis looking at your day.", "The peak of biological evolution."] },
];

export const GET_ONE_LINER = (score: number) => {
    const pool = WITTY_ONE_LINERS.find(p => score >= p.range[0] && score <= p.range[1])?.texts || WITTY_ONE_LINERS[2].texts;
    return pool[Math.floor(Math.random() * pool.length)];
};

export const GET_SOCIAL_COPY = (platform: string, score: number, job: string) => {
    const status = score > 70 ? "AI Proof" : "evolving";
    const templates: Record<string, string[]> = {
        twitter: [
            `Just tested my Human Edge. I'm ${score}% AI Proof as a ${job}. The robots are mildly intimidated. 🦾🛡️ #AIProof #FutureOfWork`,
            `${score}% AI Proof? I'll take those odds. Humans: 1, Silicon: 0. 🚀 #HumanEdge #AIProof`,
        ],
        linkedin: [
            `In an AI-driven economy, resilience is the new currency. My ${job} role scored ${score}% on the AI Proof scale. Time to lean into the traits machines can't replicate. ✨ #AIProof #CareerResilience #FutureProof`,
            `How resilient is your career? Just generated my AI Proof profile. ${score}% Resilience score. AI automates patterns—we build what comes next. 📈 #CareerStrategy #AI #HumanEdge`,
        ],
        instagram: [
            `Certified ${score}% AI Proof. 🛡️ My job as a ${job} is more than just data. #AIProof #HumanSpirit #CareerVibes`,
            `The machines are coming for the boring parts, but they can't handle this. 🧠 Scored ${score}% on AI Proof. #Resilience #FutureOfWork`,
        ]
    };
    const options = templates[platform.toLowerCase()] || templates.twitter;
    return options[Math.floor(Math.random() * options.length)];
};
