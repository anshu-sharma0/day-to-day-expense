'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Settings, TrendingUp, Calendar, IndianRupee } from "lucide-react";
import { ExpenseList } from "@/components/ExpenseList";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { ExpenseChart } from "@/components/ExpenseChart";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { format, startOfWeek, startOfMonth, endOfDay, startOfDay } from "date-fns";
import { useRouter } from "next/navigation";

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string | null;
  categories: Category | null;
}

const Dashboard = () => {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  });
  const [filterType, setFilterType] = useState<"today" | "week" | "month" | "custom">("today");

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, [dateRange]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        `/api/expenses?from=${format(dateRange.from, "yyyy-MM-dd")}&to=${format(dateRange.to, "yyyy-MM-dd")}`
      );
      const data = await response.json();
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // 👇 when new expense added
  const handleExpenseAdded = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleSignOut = () => router.push("/login");

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const expensesByCategory = categories
    .map((category) => {
      const categoryExpenses = expenses.filter((expense) => expense.category_id === category.id);
      const total = categoryExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      return {
        category: category.name,
        amount: total,
        color: category.color,
      };
    })
    .filter((item) => item.amount > 0);

  const handleFilterChange = (type: "today" | "week" | "month" | "custom") => {
    setFilterType(type);
    const today = new Date();
    switch (type) {
      case "today":
        setDateRange({ from: startOfDay(today), to: endOfDay(today) });
        break;
      case "week":
        setDateRange({ from: startOfWeek(today, { weekStartsOn: 1 }), to: endOfDay(today) });
        break;
      case "month":
        setDateRange({ from: startOfMonth(today), to: endOfDay(today) });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted text-foreground transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:flex-nowrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
              <IndianRupee className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold sm:text-2xl">ExpenseTracker</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="hover:scale-105 transition-transform"
              aria-label="Settings"
              onClick={() => router.push("/categories")}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="hover:scale-105 transition-transform"
              aria-label="Log Out"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DateRangeFilter
            filterType={filterType}
            dateRange={dateRange}
            onFilterChange={handleFilterChange}
            onDateRangeChange={setDateRange}
          />
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Total Expenses",
              value: `₹${totalExpenses.toFixed(2)}`,
              icon: <IndianRupee className="h-5 w-5 text-muted-foreground" />,
              desc:
                filterType === "today"
                  ? "Today"
                  : filterType === "week"
                  ? "This week"
                  : filterType === "month"
                  ? "This month"
                  : "Selected period",
            },
            {
              title: "Transactions",
              value: expenses.length.toString(),
              icon: <TrendingUp className="h-5 w-5 text-muted-foreground" />,
              desc: "Total recorded",
            },
            {
              title: "Active Categories",
              value: expensesByCategory.length.toString(),
              icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
              desc: "Expense categories used",
            },
          ].map((card, i) => (
            <Card
              key={i}
              className="border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200 rounded-xl"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        {expenses.length > 0 && (
          <div className="mt-10 rounded-xl border border-border bg-card p-4 shadow-sm">
            <ExpenseChart data={expensesByCategory} />
          </div>
        )}

        {/* Expense List */}
        <div className="mt-8 rounded-xl border border-border bg-card shadow-sm">
          <ExpenseList expenses={expenses} categories={categories} onExpensesChange={fetchExpenses} />
        </div>

        {/* Add Expense Dialog */}
        <AddExpenseDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          categories={categories}
          onExpenseAdded={handleExpenseAdded} // 👈 new prop
        />
      </main>
    </div>
  );
};

export default Dashboard;
