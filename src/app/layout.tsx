import type { Metadata } from "next";
import CursorGlow from "@/components/CursorGlow";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEARPulse AI",
  description: "The intelligence layer for the NEAR ecosystem.",
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