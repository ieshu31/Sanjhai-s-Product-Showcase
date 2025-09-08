import { ThemeToggle } from "./ThemeToggle"

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground">
            Building the Future
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our collection of innovative tools and products designed to help you achieve more.
          </p>
        </div>
      </div>
    </section>
  )
}