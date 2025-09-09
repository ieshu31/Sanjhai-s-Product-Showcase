import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"

export function RemixButton() {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRemix = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a copy/remix of the current project
      const newTab = window.open(window.location.href, '_blank')
      if (newTab) {
        // Add a query parameter to indicate it's a remix
        const remixUrl = `${window.location.href}?remix=true&original=${Date.now()}`
        newTab.location.href = remixUrl
      }
    } catch (error) {
      console.error('Remix failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      onClick={handleRemix}
      disabled={isProcessing}
      className="bg-primary text-primary-foreground hover:bg-primary/90 border border-border rounded-2xl px-6 py-2"
    >
      <Palette className="w-4 h-4 mr-2" />
      {isProcessing ? 'Processing $4...' : 'Remix for $4'}
    </Button>
  )
}