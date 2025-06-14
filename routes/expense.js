import express from "express";
import Expense from "../models/Expense.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
    try {
        const expenses = await Expense.find({user: req.userId}).sort({createdAt: -1});
        res.json(expenses);
    } catch (err) {
        res.status(500).json({message: "sever Error"});
    }
})

router.post('/', protect, async (req, res) => {
  try {
    const { description, amount, category } = req.body;

    const newExpense = new Expense({
      description,
      amount,
      category,
      user: req.userId,
    });

    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (error) {
    // Handle validation errors from the schema
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Make sure user owns the expense
        if (expense.user.toString() !== req.userId) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await expense.deleteOne(); // Mongoose v6+ has deleteOne() on the document

        res.json({ message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;