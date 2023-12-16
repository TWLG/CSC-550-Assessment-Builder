import type {Metadata} from "next";
export const metadata: Metadata = {
  title: "ChooseAssessmentPage",
  description: "Welcome to the Choose an Assesment Page",
};

export default function AboutLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
