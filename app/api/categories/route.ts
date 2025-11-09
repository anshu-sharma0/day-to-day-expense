import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

// GET all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST new category
export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, color } = await request.json();

    if (!name || !color) {
      return NextResponse.json({ error: "Name and color required" }, { status: 400 });
    }

    const newCategory = await Category.create({ name, color });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (err) {
    console.error("Error creating category:", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
