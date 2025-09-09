import { ThemeToggle } from "./ThemeToggle"
import { KanbanBoard } from "./KanbanBoard"

export function Hero() {
  return (
    <section className="relative min-h-screen py-8">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 pt-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground mb-6">
            Building the Future
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
            Discover our collection of innovative tools and products designed to help you achieve more.
          </p>
        </div>
        
        <KanbanBoard />
      </div>
    </section>
  )
}