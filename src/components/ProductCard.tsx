import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MoreHorizontal, ExternalLink, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProductEditDialog } from "./ProductEditDialog"
import { ProductWithStatus } from "./KanbanBoard"
import { useState } from "react"

export interface Product {
  id: string
  name: string
  description: string
  section: string
  logo: string
  revenue: string
  labels: string[]
  redirectUrl?: string
}

interface ProductCardProps {
  product: ProductWithStatus
  onProductUpdate?: (product: ProductWithStatus) => void
  onProductDelete?: (productId: string) => void
}

export function ProductCard({ product, onProductUpdate, onProductDelete }: ProductCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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

  const handleProductSave = (updatedProduct: ProductWithStatus) => {
    onProductUpdate?.(updatedProduct);
  };

  const handleRedirectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.redirectUrl) {
      window.open(product.redirectUrl, '_blank');
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onProductDelete?.(product.id);
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`group hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 border-border bg-card cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg font-medium flex-shrink-0 overflow-hidden">
              {product.logo.startsWith('data:') ? (
                <img src={product.logo} alt="Product" className="w-full h-full object-cover" />
              ) : (
                product.logo
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-card-foreground truncate">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-1">
            {product.redirectUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleRedirectClick}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditClick}>
                  Edit Product
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {product.revenue}
          </span>
          <Badge variant="secondary" className="text-xs">
            {product.section}
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
      
      <ProductEditDialog
        product={product}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleProductSave}
      />
    </Card>
  )
}