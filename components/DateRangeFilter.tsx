"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateRangeFilterProps {
  filterType: "today" | "week" | "month" | "custom";
  dateRange: { from: Date; to: Date };
  onFilterChange: (type: "today" | "week" | "month" | "custom") => void;
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
}

export const DateRangeFilter = ({
  filterType,
  dateRange,
  onFilterChange,
  onDateRangeChange,
}: DateRangeFilterProps) => {
  const [monthsToShow, setMonthsToShow] = useState(2);

  // 🔧 Run only on client
  useEffect(() => {
    const updateMonths = () => {
      setMonthsToShow(window.innerWidth < 640 ? 1 : 2);
    };
    updateMonths();
    window.addEventListener("resize", updateMonths);
    return () => window.removeEventListener("resize", updateMonths);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-3 md:gap-4">
      {[
        { type: "today", label: "Today" },
        { type: "week", label: "This Week" },
        { type: "month", label: "This Month" },
      ].map(({ type, label }) => (
        <Button
          key={type}
          variant={filterType === type ? "default" : "outline"}
          onClick={() => onFilterChange(type as "today" | "week" | "month")}
          size="sm"
          className={cn(
            "rounded-lg transition-all text-sm sm:text-base font-medium shadow-sm",
            filterType === type
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "hover:bg-muted hover:text-foreground"
          )}
        >
          {label}
        </Button>
      ))}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={filterType === "custom" ? "default" : "outline"}
            size="sm"
            className={cn(
              "gap-2 rounded-lg shadow-sm transition-all text-sm sm:text-base font-medium hover:bg-muted hover:text-foreground",
              filterType === "custom" && "border-primary bg-primary/10 text-primary"
            )}
          >
            <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            {filterType === "custom"
              ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
              : "Custom"}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-3 sm:p-4 rounded-xl border border-border bg-card shadow-lg max-w-[90vw] sm:max-w-md"
          align="start"
        >
          <Calendar
            mode="range"
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onDateRangeChange({ from: range.from, to: range.to });
                onFilterChange("custom");
              }
            }}
            numberOfMonths={monthsToShow}
            className="rounded-md border border-border bg-background"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
