import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'


const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
]
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

const twoDigits = (n: number): string => {
  if (n < 20) return ONES[n]
  const tens = Math.floor(n / 10)  
  const ones = n % 10   
  return ones ? `${TENS[tens]} ${ONES[ones]}` : TENS[tens]
}

const threeDigits = (n: number): string => {
  const hundreds = Math.floor(n / 100)
  const rest = n % 100
  if (hundreds && rest) return `${ONES[hundreds]} Hundred ${twoDigits(rest)}`
  if (hundreds) return `${ONES[hundreds]} Hundred`
  return twoDigits(rest)
}

/** Indian numbering system — crore / lakh / thousand / hundred. Hand-written (not a
 * dependency) so there's no risk of an unverifiable package name or a subtle
 * pluralisation bug in a third-party lib for something a legal receipt depends on. */
export const amountInWords = (amount: number): string => {
  const whole = Math.round(amount)
  if (whole === 0) return 'Zero Rupees Only'

  const crore = Math.floor(whole / 1_00_00_000)
  const lakh = Math.floor((whole % 1_00_00_000) / 1_00_000)
  const thousand = Math.floor((whole % 1_00_000) / 1000)
  const hundred = whole % 1000

  const parts: string[] = []
  if (crore) parts.push(`${threeDigits(crore)} Crore`)
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`)
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`)
  if (hundred) parts.push(threeDigits(hundred))

  return `${parts.join(' ')} Rupees Only`
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: 1, paddingBottom: 10 },
  orgName: { fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  small: { fontSize: 9, color: '#555555' },
  title: { fontSize: 14, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: '#555555' },
  section: { marginTop: 16, marginBottom: 16 },
  statement: { fontSize: 10, lineHeight: 1.5, marginTop: 16 },
  signatureBlock: { marginTop: 40 },
})

export type ReceiptPDFProps = {
  receiptNumber: string
  date: string
  donorName: string
  donorEmail: string
  donorPan?: string
  amount: number
  frequency: string
  orgName: string
  orgPan?: string
  org80G?: string
  signatoryName?: string
  signatoryRole?: string
  statement80G?: string
  signatureImageBase64?: string

}

export const ReceiptPDF: React.FC<ReceiptPDFProps> = ({
  receiptNumber,
  date,
  donorName,
  donorEmail,
  donorPan,
  amount,
  frequency,
  orgName,
  orgPan,
  org80G,
  signatoryName,
  signatoryRole,
  statement80G,
  signatureImageBase64,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.orgName}>{orgName}</Text>
        {orgPan ? <Text style={styles.small}>PAN: {orgPan}</Text> : null}
        {org80G ? <Text style={styles.small}>80G Registration: {org80G}</Text> : null}
      </View>

      <Text style={styles.title}>Donation Receipt</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Receipt No.</Text>
          <Text>{receiptNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text>{date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Donor Name</Text>
          <Text>{donorName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text>{donorEmail}</Text>
        </View>
        {donorPan ? (
          <View style={styles.row}>
            <Text style={styles.label}>Donor PAN</Text>
            <Text>{donorPan}</Text>
          </View>
        ) : null}
        <View style={styles.row}>
          <Text style={styles.label}>Frequency</Text>
          <Text>{frequency === 'monthly' ? 'Monthly (Recurring)' : 'One-time'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount</Text>
          <Text>Rs. {amount.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount in Words</Text>
          <Text>{amountInWords(amount)}</Text>
        </View>
      </View>

      {statement80G ? <Text style={styles.statement}>{statement80G}</Text> : null}

      <View style={styles.signatureBlock}>
      
       {signatureImageBase64 ? (
    <Image src={signatureImageBase64} style={{ width: 120, height: 50, objectFit: 'contain' }} />
  ) : null}
  <Text style={{ marginTop: 4 }}>_______________________</Text>
        {signatoryName ? <Text>{signatoryName}</Text> : null}
        {signatoryRole ? <Text style={styles.small}>{signatoryRole}</Text> : null}
      </View>
    </Page>
  </Document>
)
