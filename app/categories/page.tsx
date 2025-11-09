'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { AddCategoryDialog } from "@/components/AddCategoryDialog";
import { EditCategoryDialog } from "@/components/EditCategoryDialog";
import toast from "react-hot-toast";
import type { Category } from "@/types/type";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Categories = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading categories");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 active:scale-95 transition"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Manage Categories
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Add Category Button */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2 py-2 px-4 sm:text-sm md:text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-transform active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Category Grid */}
        <AnimatePresence>
          {categories.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <p className="text-muted-foreground text-sm sm:text-base">
                No categories yet. Add one to get started!
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <motion.div
                  key={category._id || category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="border border-border bg-card hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
                      <CardTitle className="text-base sm:text-lg font-medium text-card-foreground">
                        {category.name}
                      </CardTitle>
                      <div
                        className="h-8 w-8 rounded-full shadow-md border border-border"
                        style={{ backgroundColor: category.color }}
                      />
                    </CardHeader>

                    <CardContent className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-lg hover:bg-primary/10 transition"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-lg hover:bg-destructive/10 text-destructive border-destructive/30 transition"
                        onClick={() => handleDelete(category._id || category.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Add Dialog */}
        <AddCategoryDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onCategoryAdded={fetchCategories}
        />

        {/* Edit Dialog */}
        {editingCategory && (
          <EditCategoryDialog
            category={editingCategory}
            open={!!editingCategory}
            onOpenChange={(open) => !open && setEditingCategory(null)}
            onCategoryUpdated={() => {
              fetchCategories();
              setEditingCategory(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Categories;
