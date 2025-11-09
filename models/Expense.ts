// models/Expense.ts
import mongoose, { Schema, models } from "mongoose";

const ExpenseSchema = new Schema({
  amount: Number,
  description: String,
  date: String,
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  userId: String, // optional for multi-user later
});

export default models.Expense || mongoose.model("Expense", ExpenseSchema);
