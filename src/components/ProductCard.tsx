import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export interface Product {
  id: string
  name: string
  description: string
  category: string
  logo: string
  revenue: string
  labels: string[]
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
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
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg font-medium flex-shrink-0">
            {product.logo}
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
  )
}