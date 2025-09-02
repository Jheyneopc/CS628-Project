import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true, maxlength: 120 },
    category: {
      type: String,
      enum: ["Food", "Transport", "Shopping", "Bills", "Education", "Health", "Other"],
      default: "Other",
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    payment: { type: String, enum: ["Cash", "Card", "PIX"], default: "Cash" },
  },
  { timestamps: true, collection: "expenses" } 
);

export default mongoose.model("Expense", ExpenseSchema);
