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
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { ProductCard, type Product } from "./ProductCard"

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Analytics Pro",
    description: "Advanced analytics platform with real-time insights and custom dashboards",
    category: "Analytics",
    logo: "📊",
    revenue: "$12,500/mo",
    labels: ["SaaS", "B2B", "Enterprise"],
  },
  {
    id: "2", 
    name: "Design System",
    description: "Complete design system with components, tokens, and documentation",
    category: "Design",
    logo: "🎨",
    revenue: "$8,200/mo",
    labels: ["UI/UX", "Components"],
  },
  {
    id: "3",
    name: "Task Manager",
    description: "Intuitive project management tool for teams of all sizes",
    category: "Productivity",
    logo: "✅", 
    revenue: "$6,800/mo",
    labels: ["Productivity", "Teams"],
  },
  {
    id: "4",
    name: "Code Editor",
    description: "Modern code editor with AI assistance and collaborative features",
    category: "Development",
    logo: "💻",
    revenue: "$15,300/mo",
    labels: ["Developer Tools", "AI"],
  },
  {
    id: "5",
    name: "API Gateway",
    description: "Secure and scalable API management platform for modern applications",
    category: "Development", 
    logo: "🔗",
    revenue: "$22,100/mo",
    labels: ["Infrastructure", "API"],
  },
  {
    id: "6",
    name: "Email Marketing",
    description: "Email marketing automation with advanced segmentation and analytics",
    category: "Marketing",
    logo: "📧",
    revenue: "$9,600/mo",
    labels: ["Marketing", "Automation"],
  },
]

const columns = [
  { id: "in-progress", title: "In Progress" },
  { id: "completed", title: "Completed" },
  { id: "planning", title: "Planning" },
]

export function KanbanBoard() {
  const [products, setProducts] = useState(sampleProducts)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setProducts((products) => {
        const oldIndex = products.findIndex((p) => p.id === active.id)
        const newIndex = products.findIndex((p) => p.id === over?.id)

        return arrayMove(products, oldIndex, newIndex)
      })
    }

    setActiveProduct(null)
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-foreground">
          Our Product Portfolio
        </h2>
        <p className="text-muted-foreground">
          Drag and organize our products to explore what we've built
        </p>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SortableContext items={products} strategy={verticalListSortingStrategy}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SortableContext>
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