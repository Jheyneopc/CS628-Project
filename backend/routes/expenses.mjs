// backend/routes/expenses.mjs
import express from "express";
import Expense from "../models/Expense.mjs";

const router = express.Router();

// CREATE
router.post("/", async (req, res, next) => {
  try {
    const created = await Expense.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// LIST
router.get("/", async (req, res, next) => {
  try {
    const rows = await Expense.find().sort({ date: -1, createdAt: -1 });
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET ONE
router.get("/:id", async (req, res, next) => {
  try {
    const row = await Expense.findById(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const row = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const row = await Expense.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
