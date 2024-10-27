import RetirementPanel from "@/components/RetirementPanel";
import RickPanel from "@/components/RickPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export default async function Home() {
  return (
    <main className="container mx-auto max-w-screen-lg h-full flex flex-col items-center justify-center">
      <ScrollArea>
        <div className="flex flex-col gap-2">
          <RetirementPanel />
          <RickPanel />
        </div>
      </ScrollArea>
    </main>
  );
}
