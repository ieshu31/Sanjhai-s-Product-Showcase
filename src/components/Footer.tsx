import { ExternalLink } from "lucide-react"

export function Footer() {
  const socialLinks = [
    { name: "LinkedIn", url: "https://linkedin.com", icon: "🔗" },
    { name: "Instagram", url: "https://instagram.com", icon: "📷" },
    { name: "Reddit", url: "https://reddit.com", icon: "🤖" },
    { name: "X", url: "https://x.com", icon: "❌" },
  ]

  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-sm">{link.name}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}