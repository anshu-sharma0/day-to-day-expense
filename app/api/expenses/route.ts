// app/api/expenses/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // Check if body is empty or malformed
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 });
    }

    const data = await req.json();
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const expense = await Expense.create(data);
    return NextResponse.json(expense);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add expense" }, { status: 500 });
  }
}

// GET handler to fetch all expenses
export async function GET(req: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all expenses from the database
    const expenses = await Expense.find();  // Assuming Expense is a Mongoose model

    // Return the fetched expenses as a JSON response
    return NextResponse.json(expenses);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}