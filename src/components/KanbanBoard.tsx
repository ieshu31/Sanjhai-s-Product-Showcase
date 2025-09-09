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
import { Button } from "@/components/ui/button"

export type ColumnId = "ideas" | "building" | "launched"

export interface ProductWithStatus extends Product {
  status: ColumnId
  redirectUrl?: string
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
    status: "ideas",
    redirectUrl: "https://example.com/analytics-pro",
  },
  {
    id: "2", 
    name: "Design System",
    description: "Complete design system with components, tokens, and documentation",
    category: "Design",
    logo: "🎨",
    revenue: "$8,200/mo",
    labels: ["UI/UX", "Components"],
    status: "building",
    redirectUrl: "https://example.com/design-system",
  },
  {
    id: "3",
    name: "Task Manager",
    description: "Intuitive project management tool for teams of all sizes",
    category: "Productivity",
    logo: "✅", 
    revenue: "$6,800/mo",
    labels: ["Productivity", "Teams"],
    status: "launched",
    redirectUrl: "https://example.com/task-manager",
  },
  {
    id: "4",
    name: "Code Editor",
    description: "Modern code editor with AI assistance and collaborative features",
    category: "Development",
    logo: "💻",
    revenue: "$15,300/mo",
    labels: ["Developer Tools", "AI"],
    status: "ideas",
    redirectUrl: "https://example.com/code-editor",
  },
  {
    id: "5",
    name: "API Gateway",
    description: "Secure and scalable API management platform for modern applications",
    category: "Development", 
    logo: "🔗",
    revenue: "$22,100/mo",
    labels: ["Infrastructure", "API"],
    status: "building",
    redirectUrl: "https://example.com/api-gateway",
  },
  {
    id: "6",
    name: "Email Marketing",
    description: "Email marketing automation with advanced segmentation and analytics",
    category: "Marketing",
    logo: "📧",
    revenue: "$9,600/mo",
    labels: ["Marketing", "Automation"],
    status: "launched",
    redirectUrl: "https://example.com/email-marketing",
  },
]

const columns = [
  { id: "ideas" as ColumnId, title: "Ideas" },
  { id: "building" as ColumnId, title: "Building" },
  { id: "launched" as ColumnId, title: "Launched" },
]

// Subtle grid background CSS
const boardBgStyle = {
  backgroundColor: "#fafbfc",
  backgroundImage:
    "repeating-linear-gradient(0deg, #f3f4f6 0px, #f3f4f6 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, #f3f4f6 0px, #f3f4f6 1px, transparent 1px, transparent 32px)",
};

export function KanbanBoard() {
  const [products, setProducts] = useState(sampleProducts)

  // DnD logic should be here (omitted for brevity, use your existing logic)
  // You can use useSensors, onDragEnd, etc. as per your current implementation

  const handleAddCard = (columnId: ColumnId) => {
    // Custom logic to add a card (open dialog / inline add etc.)
    // Placeholder: alert for now
    alert(`Add new card to ${columnId}`);
  };

  return (
    <div
      className="w-full p-6 rounded-xl"
      style={boardBgStyle}
    >
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="grid grid-cols-3 gap-6">
          {columns.map((col) => (
            <div key={col.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold bg-gray-50 text-gray-600`}>
                  {col.title}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleAddCard(col.id)}
                  aria-label={`Add card to ${col.title}`}
                >
                  +
                </Button>
              </div>
              <Droppable id={col.id}>
                <SortableContext
                  items={products.filter((p) => p.status === col.id).map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {products
                    .filter((p) => p.status === col.id)
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onProductUpdate={(updated) => {
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id === updated.id ? updated : p
                            )
                          );
                        }}
                        currentColumn={col.id}
                        onStatusChange={(id, newStatus) => {
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id === id ? { ...p, status: newStatus } : p
                            )
                          );
                        }}
                      />
                    ))}
                </SortableContext>
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
