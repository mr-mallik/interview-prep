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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Interview Prep Generator | AI-Powered Mock Interviews",
    template: "%s | Interview Prep Generator",
  },
  description: "Ace your next interview with the Interview Prep Generator. Paste your resume and job description to get tailored AI interview questions, answers, and a 'Tell me about yourself' script. Built by Gulger Mallik.",
  keywords: [
    "Interview Prep Generator",
    "AI interview tool",
    "resume analyzer",
    "mock interview generator",
    "interview questions and answers",
    "Gulger Mallik",
    "software engineer interview prep",
    "job interview practice",
  ],
  authors: [{ name: "Gulger Mallik", url: "https://mrmallik.com" }],
  creator: "Gulger Mallik",
  publisher: "Gulger Mallik",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Interview Prep Generator | AI-Powered Mock Interviews",
    description: "Generate tailored interview questions and answers from your resume and job description. Master your interview with AI insights.",
    siteName: "Interview Prep Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Prep Generator | AI-Powered Mock Interviews",
    description: "Generate tailored interview questions and answers from your resume and job description.",
    creator: "@mrmallik", // Assuming handle based on linkedin, can be updated if known
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Interview Prep Generator",
    "url": baseUrl,
    "description": "AI-powered tool to generate interview questions and answers based on resume and job description.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "author": {
      "@type": "Person",
      "name": "Gulger Mallik",
      "url": "https://mrmallik.com",
      "sameAs": ["https://linkedin.com/in/mrmallik"]
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
