import type { Metadata } from "next";
import CursorGlow from "@/components/CursorGlow";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import "./globals.css";

const SITE = "https://nearpulse-ai.vercel.app";
const DESCRIPTION =
  "Is NEAR usage really broadening? Real mainnet data, the SQL behind every number, and an AI that answers only from verified metrics.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "NEARPulse AI",
  description: DESCRIPTION,
  openGraph: {
    title: "NEARPulse AI",
    description: DESCRIPTION,
    url: SITE,
    siteName: "NEARPulse AI",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NEARPulse AI",
    description: DESCRIPTION,
    creator: "@NEARPulseAI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CursorGlow />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}