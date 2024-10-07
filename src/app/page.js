import RickPanel from "@/components/RickPanel";
import Image from "next/image";

export default async function Home() {
  return (
    <main className="container mx-auto max-w-screen-lg h-full flex flex-col items-center justify-center">
      <RickPanel />
    </main>
  );
}
