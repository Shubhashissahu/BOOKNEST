import Book from "../models/Book.js";

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};