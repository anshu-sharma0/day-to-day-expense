import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Coffee, ShoppingBag, Home, Utensils, Car, HeartPulse, Laptop, Wifi } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useState } from "react";
import { EditExpenseDialog } from "./EditExpenseDialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

interface ExpenseListProps {
  expenses: any[];
  categories: any[];
  onExpensesChange: () => void;
}

// Mapping icons with common categories
const categoryIcons: Record<string, any> = {
  "Food": Utensils,
  "Groceries": ShoppingBag,
  "Transport": Car,
  "Bills": Wifi,
  "Health": HeartPulse,
  "Home": Home,
  "Tech": Laptop,
  "Coffee": Coffee,
  "Other": ShoppingBag,
};

export const ExpenseList = ({ expenses, categories, onExpensesChange }: ExpenseListProps) => {
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error("Invalid expense ID");
      return;
    }
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete expense");
      toast.success("Expense deleted successfully");
      onExpensesChange();
      setDeletingExpense(null);
    } catch (err) {
      toast.error("Failed to delete expense");
      console.error(err);
    }
  };

  return (
    <>
      <Card className="border border-border bg-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-lg sm:text-xl font-semibold text-card-foreground flex items-center justify-between">
            Recent Expenses
            {expenses.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                {expenses.length} {expenses.length === 1 ? "item" : "items"}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground text-sm sm:text-base text-center">
                No expenses found. Add your first expense to get started!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
              {expenses.map((expense) => {
                const category =
                  categories.find(
                    (cat) => cat.id === expense.category_id || cat._id === expense.category_id
                  ) || {
                    name: "Uncategorized",
                    color: "#a1a1aa",
                  };

                const Icon =
                  categoryIcons[category.name] || categoryIcons["Other"];

                return (
                  <div
                    key={expense.id || expense._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-background/70 p-4 hover:bg-muted/40 hover:shadow-md transition-all duration-200"
                  >
                    {/* Expense Info */}
                    <div className="flex w-full items-center gap-4">
                      <div
                        className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-lg shadow-sm border border-border"
                        style={{ backgroundColor: category.color || "#a1a1aa" }}
                      >
                        <Icon className="h-5 w-5 text-white drop-shadow-md" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-medium text-foreground text-base sm:text-lg truncate">
                          {expense.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon className="h-3.5 w-3.5" />
                            {category.name}
                          </span>
                          <span>•</span>
                          <span>{format(new Date(expense.date), "MMM dd, yyyy")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount + Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <p className="text-lg sm:text-xl font-semibold text-foreground whitespace-nowrap">
                        ₹{Number(expense.amount).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10 active:scale-95 transition"
                          onClick={() => setEditingExpense(expense)}
                          aria-label="Edit Expense"
                        >
                          <Pencil className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-destructive/10 active:scale-95 transition"
                          onClick={() => setDeletingExpense(expense)} // open modal
                          aria-label="Delete Expense"
                        >
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                        </Button>

                        {/* Confirm Delete Modal */}
                        <Dialog open={!!deletingExpense} onOpenChange={(open) => !open && setDeletingExpense(null)}>
                          <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                              <DialogTitle>Delete Expense</DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-muted-foreground">
                              Are you sure you want to delete{" "}
                              <span className="font-medium text-foreground">{deletingExpense?.description}</span>? This action
                              cannot be undone.
                            </p>
                            <DialogFooter className="flex justify-end gap-2 mt-4">
                              <Button variant="outline" onClick={() => setDeletingExpense(null)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(deletingExpense._id || deletingExpense.id)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Expense Dialog */}
      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          categories={categories}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
          onExpenseUpdated={() => {
            onExpensesChange();
            setEditingExpense(null);
          }}
        />
      )}
    </>
  );
};
