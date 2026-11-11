import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quadri Olaniyan | Software Engineer — Enterprise Workflows & Frontend Architecture",
  description:
    "Software Engineer specializing in Next.js, TypeScript, BPMN 2.0 enterprise process automation, core banking API integrations, and zero-defect quality engineering.",
  keywords: [
    "Quadri Olaniyan",
    "Software Engineer",
    "Frontend Architect",
    "Enterprise Workflow Automation",
    "BPMN",
    "Next.js",
    "TypeScript",
    "Lagos",
    "Nigeria",
  ],
  openGraph: {
    title: "Quadri Olaniyan — Software Engineer & Workflow Architect",
    description:
      "Engineering resilient interfaces, automated BPMN approval engines, and mission-critical enterprise systems.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}