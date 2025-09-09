import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Product } from "./ProductCard"

interface ProductEditDialogProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onSave: (updatedProduct: Product) => void
}

export function ProductEditDialog({ product, isOpen, onClose, onSave }: ProductEditDialogProps) {
  const [logo, setLogo] = useState(product.logo)
  const [redirectUrl, setRedirectUrl] = useState(product.redirectUrl || "")
  const [labels, setLabels] = useState(product.labels)
  const [newLabel, setNewLabel] = useState("")

  const handleSave = () => {
    onSave({
      ...product,
      logo,
      redirectUrl,
      labels,
    })
    onClose()
  }

  const addLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()])
      setNewLabel("")
    }
  }

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter(label => label !== labelToRemove))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="logo">Logo/Emoji</Label>
            <Input
              id="logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="🚀"
              className="text-2xl"
            />
          </div>

          <div>
            <Label htmlFor="url">Redirect URL</Label>
            <Input
              id="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {labels.map((label, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {label}
                  <button
                    onClick={() => removeLabel(label)}
                    className="ml-1 text-xs hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Add new label"
                onKeyPress={(e) => e.key === 'Enter' && addLabel()}
              />
              <Button onClick={addLabel} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}