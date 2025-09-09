import { ThemeToggle } from "./ThemeToggle"
import { KanbanBoard } from "./KanbanBoard"
import { ProfileHeader } from "./ProfileHeader"

export function Hero() {
  return (
    <section className="relative min-h-screen py-8">
      <div className="absolute top-8 left-8">
        <ProfileHeader 
          profileImage="/lovable-uploads/d4da20b2-a9af-4864-a0c9-bf7e9ff907f4.png"
          name="Sanjhai Prakash"
        />
      </div>
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 pt-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground mb-6">
            Building the Future
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Discover my collection of innovative tools and products designed to help you achieve more.
          </p>
        </div>
        
        <KanbanBoard />
      </div>
    </section>
  )
}
