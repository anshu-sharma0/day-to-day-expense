export interface Category {
  id: string;
  _id?: any;
  name: string;
  color: string;
}

export interface Expense {
  _id: string; // MongoDB ObjectId
  amount: number;
  description: string;
  date: string;
  categoryId: string | null;
  category_id: string | null;
  category?: Category | null; // optional populated category
}