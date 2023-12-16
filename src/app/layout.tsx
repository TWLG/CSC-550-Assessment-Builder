import "./globals.css";
import type {Metadata} from "next";
import {ThemeProvider} from "./components/elements/navbar/ThemeContext";

export const metadata: Metadata = {
  title: "Assessment Form App",
  description:
    "App for clinicians and organizations to manage/allow patients to take medical assessment forms",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body className="h-screen bg-[var(--background-color)]">
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
