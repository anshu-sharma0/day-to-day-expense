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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import type { Category, Expense } from "@/types/type";

interface EditExpenseDialogProps {
  expense: Expense;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseUpdated: () => void;
}

export const EditExpenseDialog = ({
  expense,
  categories,
  open,
  onOpenChange,
  onExpenseUpdated,
}: EditExpenseDialogProps) => {
  const [amount, setAmount] = useState(expense.amount.toString());
  const [description, setDescription] = useState(expense.description);
  const [date, setDate] = useState(expense.date);
  const [categoryId, setCategoryId] = useState<string>(
    expense.categoryId || expense.category_id || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setDescription(expense.description);
      setDate(expense.date);
      setCategoryId(expense.categoryId || expense.category_id || "");
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description || !categoryId) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/expenses/${expense._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description,
          date,
          categoryId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update expense");
      }

      toast.success("Expense updated successfully");
      onExpenseUpdated();
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
            Edit Expense
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-amount" className="text-sm font-medium">
              Amount (₹)
            </Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm font-medium">
              Description
            </Label>
            <Input
              id="edit-description"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date" className="text-sm font-medium">
              Date
            </Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="w-full rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary transition-all">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
