import Navbar from "../components/elements/navbar/Navbar";

export default function AboutLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Navbar />
      <main className="flex justify-center items-center flex-grow">
        {children}
      </main>
    </>
  );
}
