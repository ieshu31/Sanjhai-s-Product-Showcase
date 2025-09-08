import { useState, useMemo } from "react"
import { ProductCard, type Product } from "./ProductCard"
import { ProductFilters } from "./ProductFilters"

// Sample data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Analytics Pro",
    category: "Analytics",
    logo: "📊",
    revenue: [
      { month: "Jan", value: 100 },
      { month: "Feb", value: 120 },
      { month: "Mar", value: 140 },
      { month: "Apr", value: 180 },
      { month: "May", value: 220 },
      { month: "Jun", value: 280 },
    ],
  },
  {
    id: "2",
    name: "Design System",
    category: "Design",
    logo: "🎨",
    revenue: [
      { month: "Jan", value: 80 },
      { month: "Feb", value: 90 },
      { month: "Mar", value: 110 },
      { month: "Apr", value: 130 },
      { month: "May", value: 150 },
      { month: "Jun", value: 180 },
    ],
  },
  {
    id: "3",
    name: "Task Manager",
    category: "Productivity",
    logo: "✅",
    revenue: [
      { month: "Jan", value: 60 },
      { month: "Feb", value: 75 },
      { month: "Mar", value: 95 },
      { month: "Apr", value: 120 },
      { month: "May", value: 140 },
      { month: "Jun", value: 170 },
    ],
  },
  {
    id: "4",
    name: "Code Editor",
    category: "Development",
    logo: "💻",
    revenue: [
      { month: "Jan", value: 150 },
      { month: "Feb", value: 160 },
      { month: "Mar", value: 180 },
      { month: "Apr", value: 200 },
      { month: "May", value: 240 },
      { month: "Jun", value: 300 },
    ],
  },
  {
    id: "5",
    name: "API Gateway",
    category: "Development",
    logo: "🔗",
    revenue: [
      { month: "Jan", value: 200 },
      { month: "Feb", value: 220 },
      { month: "Mar", value: 250 },
      { month: "Apr", value: 280 },
      { month: "May", value: 320 },
      { month: "Jun", value: 380 },
    ],
  },
  {
    id: "6",
    name: "Email Marketing",
    category: "Marketing",
    logo: "📧",
    revenue: [
      { month: "Jan", value: 90 },
      { month: "Feb", value: 100 },
      { month: "Mar", value: 120 },
      { month: "Apr", value: 150 },
      { month: "May", value: 180 },
      { month: "Jun", value: 210 },
    ],
  },
]

export function ProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const categories = useMemo(() => {
    return Array.from(new Set(sampleProducts.map((product) => product.category)))
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = sampleProducts

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "category":
          return a.category.localeCompare(b.category)
        case "revenue":
          const aLatestRevenue = a.revenue[a.revenue.length - 1]?.value || 0
          const bLatestRevenue = b.revenue[b.revenue.length - 1]?.value || 0
          return bLatestRevenue - aLatestRevenue
        default:
          return 0
      }
    })
  }, [selectedCategory, sortBy])

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground">
            Our Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our suite of tools designed to streamline your workflow and boost productivity.
          </p>
        </div>

        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortBy}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}