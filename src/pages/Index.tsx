import { Hero } from "@/components/Hero";
import { AuthButton } from "@/components/AuthButton";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background cursor-mac">
      <div className="flex justify-end items-center p-6 gap-4">
        <ThemeToggle />
        <AuthButton />
      </div>
      <Hero />
    </div>
  );
};

export default Index;
