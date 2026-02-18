import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AI Proof | Discover Your Human Edge",
  description: "Evaluate your role's resilience against automation and identify the unique strengths that make you irreplaceable in the AI era.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="antialiased min-h-screen font-sans bg-background text-foreground">
        <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
          {children}
        </main>
      </body>
    </html>
  );
}

