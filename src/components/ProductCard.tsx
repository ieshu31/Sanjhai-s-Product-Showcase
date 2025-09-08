import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer } from "recharts"

export interface Product {
  id: string
  name: string
  category: string
  logo: string
  revenue: Array<{ month: string; value: number }>
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 border-border bg-card">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg font-medium">
            {product.logo}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-card-foreground truncate">
              {product.name}
            </h3>
            <Badge variant="secondary" className="mt-1 text-xs">
              {product.category}
            </Badge>
          </div>
        </div>
        
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={product.revenue}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}