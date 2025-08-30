import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monadle - Web3 Melody & Word Games on Monad",
  description:
    "Play Melodle and Wordle games on Monad blockchain. Guess melodies with piano keys and solve word puzzles while earning tokens!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
