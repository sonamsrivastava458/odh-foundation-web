import { Resend } from 'resend'

type SendReceiptEmailArgs = {
  to: string
  donorName: string
  receiptNumber: string
  amount: number
  orgName: string
  pdfBuffer: Buffer
}

/** Receipt email — credentials abhi configure nahi hain (RESEND_API_KEY .env
 * mein khaali hai), isliye missing-key case throw nahi karta, sirf warn karke
 * return kar deta hai. Email fail hona chahiye tabhi jab donation/receipt fail
 * na ho — paisa aur PDF already save ho chuke hain, email sirf notification hai. */
export const sendReceiptEmail = async ({
  to,
  donorName,
  receiptNumber,
  amount,
  orgName,
  pdfBuffer,
}: SendReceiptEmailArgs): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !from) {
    console.warn(
      `[sendReceiptEmail] RESEND_API_KEY not set — skipped email to ${to} for ${receiptNumber}`,
    )
    return
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `Your donation receipt — ${receiptNumber}`,
    html: `
      <p>Dear ${donorName},</p>
      <p>Thank you for your generous donation of ₹${amount.toLocaleString('en-IN')} to ${orgName}.</p>
      <p>Your official 80G receipt (<strong>${receiptNumber}</strong>) is attached to this email.</p>
      <p>Warm regards,<br/>${orgName}</p>
    `,
    attachments: [
      {
        filename: `${receiptNumber.replace(/\//g, '-')}.pdf`,
        content: pdfBuffer,
      },
    ],
  })

  if (error) {
    console.error(`[sendReceiptEmail] Resend error for ${receiptNumber}:`, error)
  }
}
