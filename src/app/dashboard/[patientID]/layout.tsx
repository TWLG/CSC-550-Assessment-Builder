export default function AboutLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <main className="flex justify-center items-center flex-grow w-full">
        {children}
      </main>
    </>
  );
}
