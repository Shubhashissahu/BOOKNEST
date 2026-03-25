import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendReceiptEmail = async (transaction) => {
  const itemRowsHtml = transaction.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;">${item.quantity}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;">$${Number(item.price).toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Payment Receipt</title>
      </head>
      <body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0"
                style="background:#ffffff;border-radius:10px;overflow:hidden;
                       border:1px solid #ddd;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

                <!-- HEADER -->
                <tr>
                  <td style="background:#1976d2;padding:28px;text-align:center;">
                    <h2 style="margin:0;color:#ffffff;font-size:24px;">✅ Payment Successful!</h2>
                    <p style="margin:8px 0 0;color:#bbdefb;font-size:14px;">Thank you for your purchase</p>
                  </td>
                </tr>

                <!-- BODY -->
                <tr>
                  <td style="padding:28px 32px;">
                    <p style="font-size:16px;color:#333;margin:0 0 8px;">
                      Hi <strong>${transaction.customerName}</strong>,
                    </p>
                    <p style="font-size:15px;color:#555;margin:0 0 24px;">
                      Your payment of <strong style="color:#1976d2;">$${Number(transaction.amount).toFixed(2)}</strong> has been processed successfully.
                    </p>

                    <!-- Transaction Details -->
                    <h3 style="font-size:16px;color:#333;margin:0 0 12px;border-left:4px solid #1976d2;padding-left:10px;">
                      Transaction Details
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0"
                      style="border:1px solid #eee;border-radius:6px;overflow:hidden;margin-bottom:28px;">
                      <tr style="background:#f9f9f9;">
                        <td style="padding:10px 14px;color:#888;font-size:13px;width:45%;">Transaction ID</td>
                        <td style="padding:10px 14px;color:#333;font-size:13px;font-weight:bold;">${transaction.transactionId}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 14px;color:#888;font-size:13px;">Date</td>
                        <td style="padding:10px 14px;color:#333;font-size:13px;">${new Date(transaction.createdAt).toLocaleString()}</td>
                      </tr>
                      <tr style="background:#f9f9f9;">
                        <td style="padding:10px 14px;color:#888;font-size:13px;">Payment Method</td>
                        <td style="padding:10px 14px;color:#333;font-size:13px;">${transaction.paymentMethod}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 14px;color:#888;font-size:13px;">Status</td>
                        <td style="padding:10px 14px;font-size:13px;color:#2e7d32;font-weight:bold;">✅ SUCCESS</td>
                      </tr>
                    </table>

                    <!-- Order Summary -->
                    <h3 style="font-size:16px;color:#333;margin:0 0 12px;border-left:4px solid #1976d2;padding-left:10px;">
                      Order Summary
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0"
                      style="border:1px solid #eee;border-radius:6px;overflow:hidden;">
                      <thead>
                        <tr style="background:#f5f5f5;">
                          <th style="padding:10px 8px;text-align:left;font-size:13px;color:#555;font-weight:600;">Item</th>
                          <th style="padding:10px 8px;text-align:left;font-size:13px;color:#555;font-weight:600;">Qty</th>
                          <th style="padding:10px 8px;text-align:left;font-size:13px;color:#555;font-weight:600;">Price</th>
                        </tr>
                      </thead>
                      <tbody>${itemRowsHtml}</tbody>
                    </table>

                    <!-- Total -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                      <tr>
                        <td style="text-align:right;font-size:18px;font-weight:bold;color:#1976d2;">
                          Total Paid: $${Number(transaction.amount).toFixed(2)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                  <td style="background:#f5f5f5;padding:18px;text-align:center;font-size:12px;color:#999;border-top:1px solid #eee;">
                    This is a simulated receipt. No real charge was made.<br/>
                    © ${new Date().getFullYear()} BookNest — All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"BookNest Payments" <${process.env.EMAIL_USER}>`,
    to: transaction.email,
    subject: `✅ Your BookNest Receipt — ${transaction.transactionId}`,
    html: htmlContent,
  });
};