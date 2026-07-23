import { Resend } from 'resend'

const FORM_TYPE_LABELS: Record<string, string> = {
  contact: 'Contact',
  volunteer: 'Volunteer',
  csr: 'CSR',
  career: 'Career',
  newsletter: 'Newsletter',
}

type SendFormNotificationArgs = {
  to: string
  formType: string
  entries: Array<{ label: string; value: unknown }>
}

/** Staff ko naye form submission ka alert — sendReceiptEmail.ts jaisa hi credential-guard
 * pattern: RESEND_API_KEY na ho toh chup-chaap skip, poori submission fail nahi honi chahiye
 * sirf isliye ki email bhejna kaam nahi kiya. */
export const sendFormNotification = async ({
  to,
  formType,
  entries,
}: SendFormNotificationArgs): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !from) {
    console.warn(`[sendFormNotification] RESEND_API_KEY not set — skipped notification for ${formType}`)
    return
  }

  const resend = new Resend(apiKey)
  const label = FORM_TYPE_LABELS[formType] ?? formType

  const rowsHtml = entries
    .map(
      (e) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#555;">${e.label}</td><td>${e.value ?? ''}</td></tr>`,
    )
    .join('')

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `New ${label} form submission — ODH website`,
    html: `
      <p>A new <strong>${label}</strong> form was submitted on the website.</p>
      <table>${rowsHtml}</table>
    `,
  })

  if (error) {
    console.error(`[sendFormNotification] Resend error for ${formType}:`, error)
  }
}
