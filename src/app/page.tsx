"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JobForm, { JobData } from "@/components/JobForm";
import Quiz from "@/components/Quiz";
import Results from "@/components/Results";
import { Question } from "@/data/questions";
import { Zap, Sparkles, ShieldCheck } from "lucide-react";

type AppState = "landing" | "quiz" | "results";

export default function Home() {
  const [state, setState] = useState<AppState>("landing");
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questions, setQuestions] = useState<Question[]>([]); // Added questions state

  const handleJobSubmit = (data: JobData) => {
    setJobData(data);
    setState("quiz");
  };

  const handleQuizComplete = (finalAnswers: Record<string, number>, sessionQuestions: Question[]) => { // Updated signature
    setAnswers(finalAnswers);
    setQuestions(sessionQuestions); // Set questions
    setState("results");
  };

  const handleRestart = () => {
    setJobData(null);
    setAnswers({});
    setQuestions([]); // Clear questions on restart
    setState("landing");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <AnimatePresence mode="wait">
        {state === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full space-y-12"
          >
            <div className="text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground font-bold text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-slate-800" />
                <span>Measure your resilience in the AI era</span>
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-tight">
                AI <span className="text-primary italic text-7xl md:text-9xl">Proof</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium">
                Discover your <span className="text-secondary font-bold"> Human Edge </span>
                and see how <span className="text-primary font-bold"> resilient </span> you are.
              </p>
            </div>

            <div className="max-w-xl mx-auto w-full">
              <JobForm onSubmit={handleJobSubmit} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              <FeatureCard
                icon={<ShieldCheck className="w-6 h-6 text-primary" />}
                title="Resilience Score"
                description="A 0-100% measure of your role's immunity to automation."
              />
              <FeatureCard
                icon={<Sparkles className="w-6 h-6 text-secondary" />}
                title="Human Edge"
                description="Identify the unique strengths that make you irreplaceable."
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-orange-400" />}
                title="Identity Badges"
                description="Generate and share your 'Certified AI Proof' status."
              />
            </div>
          </motion.div>
        )}

        {state === "quiz" && jobData && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <Quiz
              jobTitle={jobData.title}
              industry={jobData.industry}
              experience={jobData.experience}
              onComplete={handleQuizComplete}
              onExit={handleRestart}
            />
          </motion.div>
        )}

        {state === "results" && jobData && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Results
              jobTitle={jobData.title}
              answers={answers}
              questions={questions}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {state === "landing" && (
        <footer className="text-center pt-12 text-slate-400 text-sm italic font-medium">
          "The future belongs to the humans who build it."
        </footer>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border-2 border-slate-50 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
