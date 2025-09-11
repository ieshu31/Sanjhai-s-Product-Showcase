import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Upload } from "lucide-react";
import { ProductWithStatus } from "./KanbanBoard";

interface ProductEditDialogProps {
  product: ProductWithStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: ProductWithStatus) => void;
}

export function ProductEditDialog({ product, open, onOpenChange, onSave }: ProductEditDialogProps) {
  const [editedProduct, setEditedProduct] = useState(product);
  const [newLabel, setNewLabel] = useState("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedProduct({ ...editedProduct, logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addLabel = () => {
    if (newLabel.trim() && !editedProduct.labels.includes(newLabel.trim())) {
      setEditedProduct({
        ...editedProduct,
        labels: [...editedProduct.labels, newLabel.trim()]
      });
      setNewLabel("");
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setEditedProduct({
      ...editedProduct,
      labels: editedProduct.labels.filter(label => label !== labelToRemove)
    });
  };

  const handleSave = () => {
    onSave(editedProduct);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={editedProduct.name}
              onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editedProduct.description}
              onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
              placeholder="Enter product description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Status</Label>
            <Input
              id="section"
              value={editedProduct.section}
              onChange={(e) => setEditedProduct({ ...editedProduct, section: e.target.value })}
              placeholder="Enter section"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenue">Revenue</Label>
            <Input
              id="revenue"
              value={editedProduct.revenue}
              onChange={(e) => setEditedProduct({ ...editedProduct, revenue: e.target.value })}
              placeholder="$0/mo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-lg overflow-hidden">
                {editedProduct.logo.startsWith('data:') ? (
                  <img src={editedProduct.logo} alt="Product" className="w-full h-full object-cover" />
                ) : (
                  editedProduct.logo
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="redirect">Redirect Link</Label>
            <Input
              id="redirect"
              value={editedProduct.redirectUrl || ""}
              onChange={(e) => setEditedProduct({ ...editedProduct, redirectUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedProduct.labels.map((label, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeLabel(label)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Add new label"
                onKeyPress={(e) => e.key === 'Enter' && addLabel()}
              />
              <Button onClick={addLabel} size="sm">Add</Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}