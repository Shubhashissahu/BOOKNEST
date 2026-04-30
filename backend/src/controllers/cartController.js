import Cart from "../models/cart.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  // ✅ FIX #5 — validate book payload
  const { book } = req.body;
  if (!book?.id || !book?.title || !book?.price)
    return res.status(400).json({ message: "Invalid book data" });

  // ✅ FIX #1 — always use req.user._id
  const userId = req.user._id;

  try {
    const existingItem = await Cart.findOne({
      user: userId,
      "book.id": book.id,
    });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      return res.json(existingItem);
    }

    const cartItem = await Cart.create({
      user: userId,
      book: {
        id:     book.id,
        title:  book.title,
        author: book.author,
        price:  book.price,
        image:  book.image,
      },
      quantity: 1,
    });

    // ✅ FIX #7 — 201 Created
    res.status(201).json(cartItem);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    // ✅ FIX #1 — use ._id
    const cartItems = await Cart.find({ user: req.user._id });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE ITEM
export const removeCartItem = async (req, res) => {
  try {
    // ✅ FIX #3 — ownership check
    // ✅ FIX #6 — 404 if not found
    const deleted = await Cart.findOneAndDelete({
      _id:  req.params.id,
      user: req.user._id,
    });

    if (!deleted)
      return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item removed" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE QUANTITY
export const updateCartQuantity = async (req, res) => {
  // ✅ FIX #4 — validate quantity
  const quantity = parseInt(req.body.quantity);
  if (!quantity || quantity < 1)
    return res.status(400).json({ message: "Quantity must be at least 1" });

  try {
    // ✅ FIX #3 — ownership check
    // ✅ FIX #2 — removed .populate("book")
    const updated = await Cart.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { quantity },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Item not found" });

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CLEAR CART
export const clearCart = async (req, res) => {
  try {
    // ✅ FIX #1 — already correct, kept consistent
    await Cart.deleteMany({ user: req.user._id });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};