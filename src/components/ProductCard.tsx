import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MoreHorizontal, Edit, ExternalLink } from "lucide-react"
import { ProductEditDialog } from "./ProductEditDialog"

export interface Product {
  id: string
  name: string
  description: string
  category: string
  logo: string
  revenue: string
  labels: string[]
  redirectUrl?: string
}

interface ProductCardProps {
  product: Product
  onUpdate?: (product: Product) => void
}

export function ProductCard({ product, onUpdate }: ProductCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on dropdown menu
    if ((e.target as HTMLElement).closest('[data-dropdown-menu]')) {
      return
    }
    
    if (product.redirectUrl) {
      window.open(product.redirectUrl, '_blank')
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditOpen(true)
  }

  const handleSave = (updatedProduct: Product) => {
    onUpdate?.(updatedProduct)
  }

  return (
    <>
      <Card 
        ref={setNodeRef}
        style={style}
        onClick={handleCardClick}
        className={`group hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 border-border bg-card cursor-pointer ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start space-x-3">
            <div 
              className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg font-medium flex-shrink-0 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              {product.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-card-foreground truncate">
                  {product.name}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      data-dropdown-menu
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" data-dropdown-menu>
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </DropdownMenuItem>
                    {product.redirectUrl && (
                      <DropdownMenuItem onClick={() => window.open(product.redirectUrl, '_blank')}>
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Open Link
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              {product.revenue}
            </span>
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>

          {product.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.labels.map((label, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5"
                >
                  {label}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ProductEditDialog
        product={product}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}