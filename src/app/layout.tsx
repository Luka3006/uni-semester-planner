import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uni Stundenplaner",
  description: "Erstelle und verwalte deinen Uni-Stundenplan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
