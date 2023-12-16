import Navbar from "../components/elements/navbar/Navbar";
import type {Metadata} from "next";
export const metadata: Metadata = {
  title: "AssessmentBuilder",
  description: "Welcome to the Assessment Builder Page",
};

export default function AboutLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar />
        <main className="flex-grow overflow-auto flex justify-center items-center flex-grow">
          {children}
        </main>
      </div>
    </>
  );
}
