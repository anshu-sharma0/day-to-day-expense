'use client';
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface EditCategoryDialogProps {
  category: {
    _id?: string;
    name: string;
    color: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryUpdated: () => void;
}

const PRESET_COLORS = [
  "#EF4444", "#F59E0B", "#10B981", "#3B82F6",
  "#8B5CF6", "#EC4899", "#6B7280", "#14B8A6",
];

export const EditCategoryDialog = ({
  category,
  open,
  onOpenChange,
  onCategoryUpdated,
}: EditCategoryDialogProps) => {
  const [name, setName] = useState(category?.name || "");
  const [color, setColor] = useState(category?.color || PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);

  // Sync dialog data when category changes
  useEffect(() => {
    setName(category?.name || "");
    setColor(category?.color || PRESET_COLORS[0]);
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/categories/${category._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update category");
      }

      toast.success("Category updated successfully");
      onCategoryUpdated();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-md sm:max-w-lg bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl transition-all duration-300 ease-in-out">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-card-foreground text-center">
            Edit Category
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Category Name
            </Label>
            <Input
              id="edit-name"
              placeholder="e.g., Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Color</Label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`h-10 sm:h-12 w-full rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                    color === presetColor
                      ? "border-primary scale-105 ring-2 ring-primary/30"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 pt-2 text-sm text-muted-foreground">
              <span>Selected:</span>
              <span
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 py-3 rounded-xl hover:bg-muted transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-transform active:scale-95"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
