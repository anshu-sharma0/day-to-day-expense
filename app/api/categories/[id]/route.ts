import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

// UPDATE category
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // <-- wrap in Promise
) {
  try {
    const { id } = await context.params; // unwrap the promise
    await connectDB();
    const { name, color } = await req.json();
    const updated = await Category.findByIdAndUpdate(id, { name, color }, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating category:", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
