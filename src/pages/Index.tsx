import { Hero } from "@/components/Hero";
import { AuthButton } from "@/components/AuthButton";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background cursor-mac">
      <div className="flex justify-between items-center p-6">
        <AuthButton />
        <ThemeToggle />
      </div>
      <Hero />
    </div>
  );
};

export default Index;
