import { ExternalLink } from "lucide-react"

export function Footer() {
  const socialLinks = [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/sanjhaiprakash/", iconSrc: "/LinkedIn Icon.svg" },
    { name: "Instagram", url: "https://www.instagram.com/sanjhai_18/", iconSrc: "/Instagram Icon.svg" },
    { name: "Reddit", url: "https://www.reddit.com/user/Appropriate-Look-875/", iconSrc: "/Reddit Icon.svg" },
    { name: "X", url: "https://x.com/Sanjhai_18", iconSrc: "/X Icon.svg" },
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
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <img
                  src={link.iconSrc}
                  alt={`${link.name} icon`}
                  className="h-5 w-5 dark:invert transition-all"
                />
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
