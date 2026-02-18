export type QuestionType = "multiple-choice" | "scale" | "situational";

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    dimension: "repetition" | "creativity" | "emotions" | "strategy" | "physical" | "data" | "adaptability";
    tags?: string[]; // New field for smart matching
    options?: { label: string; value: number }[];
    minLabel?: string;
    maxLabel?: string;
}

export const QUIZ_QUESTIONS: Question[] = [
    {
        id: "rep-1",
        text: "How often does your work require you to break away from predictable patterns and handle unique, non-repeating situations?",
        type: "scale",
        dimension: "repetition",
        tags: ["admin", "finance", "logistics"],
        minLabel: "Machine Terrain (Automation)",
        maxLabel: "Human Stronghold (Resilience)",
    },
    {
        id: "cre-1",
        text: "When faced with a unique challenge, how often do you have to innovate a solution that outpaces any existing documentation?",
        type: "scale",
        dimension: "creativity",
        tags: ["design", "tech", "engineering", "writing"],
        minLabel: "The Manual (Pattern-Match)",
        maxLabel: "Pure Innovation (Resilient)",
    },
    {
        id: "emo-1",
        text: "How critical is 'reading the room' or managing human emotions to your daily success?",
        type: "multiple-choice",
        dimension: "emotions",
        tags: ["management", "sales", "healthcare", "hr"],
        options: [
            { label: "Data only, emotions are irrelevant", value: 5 },
            { label: "Predictable social patterns", value: 30 },
            { label: "Meaningful empathy & connection", value: 70 },
            { label: "Navigating deep human complexity", value: 100 },
        ]
    },
    {
        id: "str-1",
        text: "How multi-layered are the strategic 'ripple effects' triggered by your typical creative or professional decisions?",
        type: "scale",
        dimension: "strategy",
        tags: ["leadership", "finance", "legal"],
        minLabel: "One-step logic",
        maxLabel: "Chaos-proof Strategy",
    },
    {
        id: "phy-1",
        text: "How much of your work requires precise physical manipulation of objects in an unpredictable environment?",
        type: "multiple-choice",
        dimension: "physical",
        tags: ["healthcare", "construction", "manufacturing"],
        options: [
            { label: "Zero physical interaction", value: 5 },
            { label: "Predictable movements", value: 35 },
            { label: "Unpredictable environment", value: 75 },
            { label: "High-dexterity unique tasks", value: 100 },
        ]
    },
    {
        id: "dat-1",
        text: "How much interpretation, nuance, and 'gut feeling' goes into how you translate structured data into action?",
        type: "scale",
        dimension: "data",
        tags: ["finance", "tech", "science"],
        minLabel: "Raw Data Patterns",
        maxLabel: "Human Insight",
    },
    {
        id: "ada-1",
        text: "How often does your job require you to learn a completely new skill that didn't exist 3 years ago?",
        type: "multiple-choice",
        dimension: "adaptability",
        tags: ["tech", "design", "marketing"],
        options: [
            { label: "Stable patterns", value: 5 },
            { label: "Incremental changes", value: 35 },
            { label: "Constant evolution", value: 75 },
            { label: "Pioneering new unknowns", value: 100 },
        ]
    },
    {
        id: "cre-2",
        text: "Could a really smart parrot (or a really good LLM) mimic your writing/coding style perfectly?",
        type: "scale",
        dimension: "creativity",
        tags: ["writing", "tech", "content"],
        minLabel: "Easily, I'm very standard",
        maxLabel: "Impossible, I'm too weird",
    },
    {
        id: "rep-2",
        text: "Settle a debate: Is your job more like Chess (predictable rules) or more like Poker (incomplete info + bluffing)?",
        type: "multiple-choice",
        dimension: "repetition",
        tags: ["management", "sales", "legal"],
        options: [
            { label: "Chess - I follow the optimal moves", value: 90 },
            { label: "Mostly Chess, some intuition", value: 60 },
            { label: "Mostly Poker, heavy intuition", value: 30 },
            { label: "Poker - It's all about the 'vibe' and unknowns", value: 10 },
        ]
    },
    {
        id: "str-2",
        text: "How many people's lives or livelihoods are directly affected by your 'gut feeling' decisions?",
        type: "scale",
        dimension: "strategy",
        tags: ["leadership", "healthcare", "government"],
        minLabel: "Just me",
        maxLabel: "Countless others",
    },
    // NEW QUESTIONS START HERE
    {
        id: "cre-3",
        text: "In your role, how often do you have to 'lie' or use creatively flexible truths (e.g. fiction, marketing, acting)?",
        type: "scale",
        dimension: "creativity",
        tags: ["marketing", "entertainment", "sales"],
        minLabel: "Strict facts only",
        maxLabel: "Creative storytelling",
    },
    {
        id: "emo-2",
        text: "How often do you deal with people who are having the worst day of their lives?",
        type: "scale",
        dimension: "emotions",
        tags: ["healthcare", "legal", "customer service"],
        minLabel: "Never, they are vibing",
        maxLabel: "Literally every hour",
    },
    {
        id: "ada-2",
        text: "How quickly could you explain your job to a Victorian-era person without them fainting?",
        type: "multiple-choice",
        dimension: "adaptability",
        tags: ["tech", "science", "design"],
        options: [
            { label: "Easily - I handle goods or land", value: 10 },
            { label: "With some effort - I manage people", value: 40 },
            { label: "Hard - I work with invisible signals", value: 70 },
            { label: "Impossible - They'd think I was a sorcerer", value: 100 },
        ]
    },
    {
        id: "dat-2",
        text: "If the internet went down globally for 24 hours, what percentage of your 'work' could you still finish?",
        type: "scale",
        dimension: "data",
        tags: ["admin", "tech", "finance"],
        minLabel: "Can't even use the toilet",
        maxLabel: "I'd keep crushing it",
    },
    {
        id: "phy-2",
        text: "Could a robot with no sense of smell or touch perform your primary physical task?",
        type: "scale",
        dimension: "physical",
        tags: ["hospitality", "manufacturing", "healthcare"],
        minLabel: "Yes, it's just mechanics",
        maxLabel: "No, sensory feedback is life",
    },
    {
        id: "cre-4",
        text: "How often do you 'hallucinate' better results than you actually have? (Wait, that's an AI joke. Let's try again.) How often do you brainstorm things that don't exist yet?",
        type: "multiple-choice",
        dimension: "creativity",
        tags: ["design", "product", "writing"],
        options: [
            { label: "Rarely, I optimize what's there", value: 10 },
            { label: "Sometimes, usually small features", value: 50 },
            { label: "Frequently, it's my core value", value: 80 },
            { label: "Always, I'm a professional visionary", value: 100 },
        ]
    },
    {
        id: "str-3",
        text: "How much of your job involves navigating office politics or power dynamics?",
        type: "scale",
        dimension: "strategy",
        tags: ["management", "corporate", "hr"],
        minLabel: "I work alone",
        maxLabel: "Game of Thrones level",
    },
    {
        id: "emo-3",
        text: "Can a user tell if you are answering them with 'canned' responses vs. genuine care?",
        type: "scale",
        dimension: "emotions",
        tags: ["customer service", "hospitality", "sales"],
        minLabel: "They can't tell the difference",
        maxLabel: "It's obvious I'm human",
    },
    {
        id: "rep-3",
        text: "If you recorded your work screen for 8 hours, how repetitive would the time-lapse look?",
        type: "scale",
        dimension: "repetition",
        tags: ["data entry", "admin", "manufacturing"],
        minLabel: "Kaleidoscope of chaos",
        maxLabel: "A loop of 10 seconds",
    },
    {
        id: "ada-3",
        text: "How often do you have to pivot your strategy because a competitor or a platform changed their algorithm?",
        type: "multiple-choice",
        dimension: "adaptability",
        tags: ["marketing", "tech", "content"],
        options: [
            { label: "Never", value: 0 },
            { label: "Annually", value: 30 },
            { label: "Monthly", value: 70 },
            { label: "I am literally a squirrel in traffic", value: 100 },
        ]
    }
];
