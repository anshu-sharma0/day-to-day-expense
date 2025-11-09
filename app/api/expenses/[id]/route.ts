import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

// UPDATE expense
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Note the Promise wrapper
) {
  try {
    const { id } = await context.params; // unwrap the Promise
    await connectDB();
    const data = await req.json();

    const expense = await Expense.findByIdAndUpdate(id, data, { new: true });
    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json(expense);
  } catch (err: any) {
    console.error("Failed to update expense:", err);
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // The `id` param comes as a Promise
) {
  try {
    const { id } = await context.params; // Extract the ID from params
    await connectDB(); // Connect to the MongoDB database

    // Find and delete the expense by ID
    const expense = await Expense.findByIdAndDelete(id);

    // If no expense is found with that ID
    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Respond with a success message
    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (err: any) {
    console.error("Failed to delete expense:", err);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
