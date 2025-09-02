// backend/routes/dev.mjs
import express from "express";
import Expense from "../models/Expense.mjs";

const router = express.Router();

/**
 * GET /api/dev/seed
 * Insert a small sample set (does NOT clear before)
 */
router.get("/seed", async (req, res, next) => {
  try {
    const today = new Date();
    const items = [
      { description: "Lunch",      category: "Food",      amount: 12.5, date: today, payment: "Card" },
      { description: "Bus ticket", category: "Transport", amount: 3,    date: today, payment: "Cash" },
      { description: "New jacket", category: "Shopping",  amount: 45,   date: today, payment: "Card" },
    ];
    const inserted = await Expense.insertMany(items);
    res.json({ ok: true, count: inserted.length, items: inserted });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/dev/clear
 * Remove all documents
 */
router.get("/clear", async (req, res, next) => {
  try {
    await Expense.deleteMany({});
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/dev/count
 * Return collection size
 */
router.get("/count", async (req, res, next) => {
  try {
    const count = await Expense.countDocuments();
    res.json({ ok: true, count });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/dev/peek?limit=10
 * Return first N docs (default 5)
 */
router.get("/peek", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit ?? 5);
    const items = await Expense.find().sort({ createdAt: -1 }).limit(limit);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/dev/reset
 * Clear then insert the sample set
 */
router.get("/reset", async (req, res, next) => {
  try {
    await Expense.deleteMany({});
    const today = new Date();
    const items = [
      { description: "Lunch",      category: "Food",      amount: 12.5, date: today, payment: "Card" },
      { description: "Bus ticket", category: "Transport", amount: 3,    date: today, payment: "Cash" },
      { description: "New jacket", category: "Shopping",  amount: 45,   date: today, payment: "Card" },
    ];
    const inserted = await Expense.insertMany(items);
    res.json({ ok: true, reset: true, count: inserted.length, items: inserted });
  } catch (err) {
    next(err);
  }
});

export default router;
