import type {Metadata} from "next";
export const metadata: Metadata = {
  title: "AssessmentBuilder",
  description: "Welcome to the Assessment Builder Page",
};

export default function AboutLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <main className="bg-[var(--background-color)] text-[var(--text-color2)]">
        {children}
      </main>
    </>
  );
}
