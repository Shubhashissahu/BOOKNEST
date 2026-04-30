//backend/src/controller/bookcontroller.js
import Book from "../models/Book.js";

// ✅ FIX #7 — paginated response
export const getBooks = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;
    const search = req.query.search
      ? { title: { $regex: req.query.search, $options: "i" } }
      : {};

    const [books, total] = await Promise.all([
      Book.find(search).skip(skip).limit(limit).lean(),
      Book.countDocuments(search),
    ]);

    res.json({
      books,
      total,
      page,
      pages: Math.ceil(total / limit),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ FIX #5 — validation added (protect + isAdmin should be on the route)
export const createBook = async (req, res) => {
  try {
    const { title, price, author } = req.body;

    if (!title?.trim() || !price || !author?.trim())
      return res.status(400).json({ message: "Title, author and price are required" });

    if (isNaN(price) || price <= 0)
      return res.status(400).json({ message: "Price must be a positive number" });

    const book = new Book({
      ...req.body,
      title: title.trim(),
      author: author.trim(),
      price: parseFloat(price),
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};