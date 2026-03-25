import { v4 as uuidv4 } from 'uuid';
import Transaction from '../models/Transaction.js';
import Order from '../models/Order.js';
import { sendReceiptEmail } from '../utils/email.js';

export const processPayment = async (req, res) => {
  try {
    // ✅ Check auth user FIRST
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const {
      amount,
      currency = 'INR',
      items = [],
      cardLast4 = '4242',
      sendEmail,
      address,
    } = req.body;

    // ✅ Get identity from JWT — never trust frontend for this
    const customerName = req.user.name;
    const email = req.user.email;
    const userId = req.user._id;

    // ✅ Validation
    if (!customerName || !email || !amount || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Missing: ${!customerName ? 'name ' : ''}${!email ? 'email ' : ''}${!amount ? 'amount ' : ''}${items.length === 0 ? 'items' : ''}`
      });
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    const transactionId = `TXN-${uuidv4().split('-')[0].toUpperCase()}`;

    // 1. Save Transaction
    const transaction = new Transaction({
      transactionId,
      customerName,
      email,
      amount,
      currency,
      items,
      paymentMethod: `Visa ending in ${cardLast4}`,
      status: 'SUCCESS',
    });
    await transaction.save();

    // 2. Create Order
    const order = new Order({
      user: userId,
      items,
      totalAmount: amount,
      address,
      paymentMethod: 'ONLINE',
      paymentStatus: 'PAID',
      transactionId,
      orderStatus: 'Processing',
    });
    await order.save();

    // 3. Send email (non-blocking)
    if (sendEmail) {
      try {
        await sendReceiptEmail(transaction);
      } catch (emailError) {
        console.error('📧 Email failed:', emailError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      receipt: transaction,
      orderId: order._id,
    });

  } catch (error) {
    console.error("💥 FULL ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
