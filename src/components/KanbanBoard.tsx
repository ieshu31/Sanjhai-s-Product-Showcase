import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { ProductCard, type Product } from "./ProductCard"
import { Droppable } from "./Droppable"

export type ColumnId = "to-develop" | "in-development" | "done"

export interface ProductWithStatus extends Product {
  status: ColumnId
}

const sampleProducts: ProductWithStatus[] = [
  {
    id: "1",
    name: "Analytics Pro",
    description: "Advanced analytics platform with real-time insights and custom dashboards",
    category: "Analytics",
    logo: "📊",
    revenue: "$12,500/mo",
    labels: ["SaaS", "B2B", "Enterprise"],
    status: "to-develop",
  },
  {
    id: "2", 
    name: "Design System",
    description: "Complete design system with components, tokens, and documentation",
    category: "Design",
    logo: "🎨",
    revenue: "$8,200/mo",
    labels: ["UI/UX", "Components"],
    status: "in-development",
  },
  {
    id: "3",
    name: "Task Manager",
    description: "Intuitive project management tool for teams of all sizes",
    category: "Productivity",
    logo: "✅", 
    revenue: "$6,800/mo",
    labels: ["Productivity", "Teams"],
    status: "done",
  },
  {
    id: "4",
    name: "Code Editor",
    description: "Modern code editor with AI assistance and collaborative features",
    category: "Development",
    logo: "💻",
    revenue: "$15,300/mo",
    labels: ["Developer Tools", "AI"],
    status: "to-develop",
  },
  {
    id: "5",
    name: "API Gateway",
    description: "Secure and scalable API management platform for modern applications",
    category: "Development", 
    logo: "🔗",
    revenue: "$22,100/mo",
    labels: ["Infrastructure", "API"],
    status: "in-development",
  },
  {
    id: "6",
    name: "Email Marketing",
    description: "Email marketing automation with advanced segmentation and analytics",
    category: "Marketing",
    logo: "📧",
    revenue: "$9,600/mo",
    labels: ["Marketing", "Automation"],
    status: "done",
  },
]

const columns = [
  { id: "to-develop" as ColumnId, title: "To Develop" },
  { id: "in-development" as ColumnId, title: "In Development" },
  { id: "done" as ColumnId, title: "Done" },
]

export function KanbanBoard() {
  const [products, setProducts] = useState(sampleProducts)
  const [activeProduct, setActiveProduct] = useState<ProductWithStatus | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const product = products.find((p) => p.id === active.id)
    setActiveProduct(product || null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveAProduct = products.some((product) => product.id === activeId)
    const isOverAProduct = products.some((product) => product.id === overId)
    const isOverAColumn = columns.some((column) => column.id === overId)

    if (!isActiveAProduct) return

    // Dropping a product over another product
    if (isActiveAProduct && isOverAProduct) {
      setProducts((products) => {
        const activeIndex = products.findIndex((p) => p.id === activeId)
        const overIndex = products.findIndex((p) => p.id === overId)

        if (products[activeIndex].status !== products[overIndex].status) {
          products[activeIndex].status = products[overIndex].status
        }

        return arrayMove(products, activeIndex, overIndex)
      })
    }

    // Dropping a product over a column
    if (isActiveAProduct && isOverAColumn) {
      setProducts((products) => {
        const activeIndex = products.findIndex((p) => p.id === activeId)
        
        if (products[activeIndex].status !== overId) {
          products[activeIndex].status = overId as ColumnId
        }

        return [...products]
      })
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveProduct(null)
  }

  function getProductsByStatus(status: ColumnId) {
    return products.filter((product) => product.status === status)
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-foreground">
          Our Product Portfolio
        </h2>
        <p className="text-muted-foreground">
          Drag products between columns to track development progress
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  {column.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {getProductsByStatus(column.id).length} products
                </p>
              </div>
              
              <Droppable id={column.id}>
                <div className="flex-1 space-y-3 min-h-[400px] p-4 rounded-lg border border-dashed border-border bg-muted/30">
                  <SortableContext 
                    items={getProductsByStatus(column.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    {getProductsByStatus(column.id).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </SortableContext>
                </div>
              </Droppable>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeProduct ? (
            <ProductCard product={activeProduct} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}