import { ThemeToggle } from "./ThemeToggle"
import { KanbanBoard } from "./KanbanBoard"
import { ProfileHeader } from "./ProfileHeader"
import { RemixButton } from "./RemixButton"

export function Hero() {
  return (
    <section className="relative min-h-screen py-8">
      <div className="flex justify-between items-center p-8">
        <ProfileHeader 
          profileImage="/lovable-uploads/d4da20b2-a9af-4864-a0c9-bf7e9ff907f4.png"
          name="Sanjhai Prakash"
        />
        <div className="flex items-center space-x-4">
          <RemixButton />
          <ThemeToggle />
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground mb-6">
            Building the Future
          </h1>
          <p className="text-xl font-handwritten text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Drag products between columns to track development progress
          </p>
        </div>
        
        <KanbanBoard />
      </div>
    </section>
  )
}