import { useState, useEffect } from "react"
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
import { Button } from "@/components/ui/button"
import { Droppable } from "./Droppable"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export type ColumnId = "ideas" | "building" | "launched"

export interface ProductWithStatus extends Product {
  status: ColumnId
  redirectUrl?: string
}

const columns = [
  { id: "ideas" as ColumnId, title: "Ideas" },
  { id: "building" as ColumnId, title: "Building" },
  { id: "launched" as ColumnId, title: "Launched" },
]

export function KanbanBoard() {
  const [products, setProducts] = useState<ProductWithStatus[]>([])
  const [activeProduct, setActiveProduct] = useState<ProductWithStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Load products from Supabase
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error

      const formattedProducts: ProductWithStatus[] = data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        section: product.status === 'ideas' ? 'Ideas' : 
                 product.status === 'building' ? 'Building' : 'Launched',
        logo: product.logo || '📦',
        revenue: product.revenue || '$0',
        labels: product.labels || [],
        redirectUrl: product.redirect_url,
        status: product.status as ColumnId
      }))

      setProducts(formattedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

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
          products[activeIndex].section = products[overIndex].status.charAt(0).toUpperCase() + products[overIndex].status.slice(1)
          
          // Update in database
          supabase
            .from('products')
            .update({ status: products[activeIndex].status })
            .eq('id', activeId.toString())
            .then(({ error }) => {
              if (error) console.error('Error updating product status:', error)
            })
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
          products[activeIndex].section = (overId as string).charAt(0).toUpperCase() + (overId as string).slice(1)
          
          // Update in database
          supabase
            .from('products')
            .update({ status: overId.toString() })
            .eq('id', activeId.toString())
            .then(({ error }) => {
              if (error) console.error('Error updating product status:', error)
            })
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

  const handleProductUpdate = async (updatedProduct: ProductWithStatus) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          description: updatedProduct.description,
          status: updatedProduct.status,
          logo: updatedProduct.logo,
          revenue: updatedProduct.revenue,
          labels: updatedProduct.labels,
          redirect_url: updatedProduct.redirectUrl
        })
        .eq('id', updatedProduct.id)

      if (error) throw error

      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
      
      toast({
        title: "Success",
        description: "Product updated successfully."
      })
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleAddProduct = async (status: ColumnId) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      if (userError || !userData.user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to add products.",
          variant: "destructive"
        })
        return
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          user_id: userData.user.id,
          name: "New Product",
          description: "Add your product description",
          status: status,
          logo: "📦",
          revenue: "$0/mo",
          labels: [],
          position: products.length
        })
        .select()
        .single()

      if (error) throw error

      const newProduct: ProductWithStatus = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        section: status.charAt(0).toUpperCase() + status.slice(1),
        logo: data.logo || '📦',
        revenue: data.revenue || '$0',
        labels: data.labels || [],
        redirectUrl: data.redirect_url,
        status: data.status as ColumnId
      }

      setProducts([...products, newProduct])
      
      toast({
        title: "Success",
        description: "New product added successfully."
      })
    } catch (error) {
      console.error('Error adding product:', error)
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      setProducts(products.filter(p => p.id !== productId))
      
      toast({
        title: "Success",
        description: "Product deleted successfully."
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-6">
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
        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                      column.id === 'ideas' ? 'bg-ideas text-ideas-foreground' :
                      column.id === 'building' ? 'bg-building text-building-foreground' :
                      'bg-launched text-launched-foreground'
                    }`}>
                      {column.title}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getProductsByStatus(column.id).length} products
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleAddProduct(column.id)}
                  >
                    +
                  </Button>
                </div>
                
                <Droppable id={column.id}>
                  <div className="flex-1 space-y-3 min-h-[400px] p-4 rounded-lg border border-dashed border-border bg-muted/30">
                    <SortableContext 
                      items={getProductsByStatus(column.id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      {getProductsByStatus(column.id).map((product) => (
                        <ProductCard 
                          key={product.id} 
                          product={product} 
                          onProductUpdate={handleProductUpdate}
                          onProductDelete={handleDeleteProduct}
                        />
                      ))}
                    </SortableContext>
                  </div>
                </Droppable>
              </div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeProduct ? (
            <ProductCard product={activeProduct} onProductUpdate={handleProductUpdate} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}