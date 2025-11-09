'use client';
import { useState } from "react";
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

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryAdded: () => void;
}

const PRESET_COLORS = [
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#6B7280", // Gray
  "#14B8A6", // Teal
];

export const AddCategoryDialog = ({
  open,
  onOpenChange,
  onCategoryAdded,
}: AddCategoryDialogProps) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add category");
      }

      toast.success("Category added successfully");
      setName("");
      setColor(PRESET_COLORS[0]);
      onOpenChange(false);
      onCategoryAdded();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-md sm:max-w-lg md:max-w-xl bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl transition-all duration-300 ease-in-out">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-card-foreground text-center">
            Add New Category
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Category Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Color</Label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`h-10 sm:h-12 w-full rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    color === presetColor
                      ? "border-primary scale-105 ring-primary/50"
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

          <Button
            type="submit"
            className="w-full py-3 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-transform active:scale-95"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
