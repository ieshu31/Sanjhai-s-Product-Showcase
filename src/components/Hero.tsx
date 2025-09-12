import { KanbanBoard } from "./KanbanBoard"
import { ProfileHeader } from "./ProfileHeader"
import { Footer } from "./Footer"
import { AuthButton } from "./AuthButton"

export function Hero() {
  return (
    <div>
      <section className="relative min-h-screen py-8 bg-background bg-grid-pattern">
        <div className="flex items-center justify-between w-full px-8">
          <ProfileHeader name="Sanjhai Prakash" />
          <AuthButton />
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
      <Footer />
    </div>
  )
}
