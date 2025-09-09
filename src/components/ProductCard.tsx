import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MoreHorizontal, ExternalLink } from "lucide-react"
import { ProductEditDialog } from "./ProductEditDialog"
import { ProductWithStatus } from "./KanbanBoard"
import { useState } from "react"

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
  product: ProductWithStatus
  onProductUpdate?: (product: ProductWithStatus) => void
  currentColumn: string
  onStatusChange?: (id: string, newStatus: string) => void
}

const statusColors: Record<string, string> = {
  ideas: "bg-blue-50 text-blue-700",
  building: "bg-yellow-50 text-yellow-700",
  launched: "bg-green-50 text-green-700"
};

export function ProductCard({
  product,
  onProductUpdate,
  currentColumn,
  onStatusChange
}: ProductCardProps) {
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
    onProductUpdate?.(updatedProduct)
    setIsEditDialogOpen(false)
  }

  const handleRedirectClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (product.redirectUrl) {
      window.open(product.redirectUrl, '_blank')
    }
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditDialogOpen(true)
  }

  // Label editing logic
  const [labelEdit, setLabelEdit] = useState(false)
  const [editedLabel, setEditedLabel] = useState(product.status)

  const handleLabelSave = () => {
    setLabelEdit(false)
    if (editedLabel && editedLabel !== product.status && onStatusChange) {
      onStatusChange(product.id, editedLabel)
    }
  }

  // Update label automatically when dragged
  if (currentColumn !== product.status && onStatusChange) {
    onStatusChange(product.id, currentColumn)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 border-border bg-card cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg font-medium flex-shrink-0 overflow-hidden">
              {product.logo.startsWith("data:") ? (
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
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleEditClick}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {labelEdit ? (
            <>
              <select
                value={editedLabel}
                onChange={(e) => setEditedLabel(e.target.value)}
                className="rounded px-2 py-1 border border-gray-200 text-sm"
              >
                <option value="ideas">Ideas</option>
                <option value="building">Building</option>
                <option value="launched">Launched</option>
              </select>
              <Button
                variant="outline"
                size="xs"
                onClick={handleLabelSave}
                className="px-2 py-1"
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <span
                className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${statusColors[product.status]}`}
                onClick={() => setLabelEdit(true)}
                title="Edit section label"
              >
                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
              </span>
              <Button
                variant="ghost"
                size="xs"
                className="p-1"
                onClick={() => setLabelEdit(true)}
                aria-label="Edit section label"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
      {isEditDialogOpen && (
        <ProductEditDialog
          open={isEditDialogOpen}
          product={product}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleProductSave}
        />
      )}
    </Card>
  );
}
