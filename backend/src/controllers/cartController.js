import Cart from "../models/cart.js";

export const addToCart = async (req, res) => {

  const { book } = req.body
  const userId = req.user

  try {

    const existingItem = await Cart.findOne({
      user: userId,
      "book.id": book.id
    })

    if (existingItem) {

      existingItem.quantity += 1
      await existingItem.save()

      return res.json(existingItem)

    }

    const cartItem = await Cart.create({
      user: userId,
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image
      },
      quantity: 1
    })

    res.json(cartItem)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

}
//Get User Cart

export const getCart = async (req, res) => {
  try {

    const cartItems = await Cart.find({
      user: req.user
    })

    res.json(cartItems);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Remove Item Controller
export const removeCartItem = async (req,res)=>{

  try{

    await Cart.findByIdAndDelete(req.params.id)

    res.json({message:"Item removed"})

  }catch(error){

    res.status(500).json({message:error.message})

  }

}
//updated cart quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const updated = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    ).populate("book");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user._id });
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};