import Navbar from "../../../components/elements/navbar/Navbar";
import type {Metadata} from "next";
export const metadata: Metadata = {
  title: "ViewAssessmentPage",
  description: "Welcome to the View Assessment Page",
};

export default function AboutLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
