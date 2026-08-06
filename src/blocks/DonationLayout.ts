import type { Block } from 'payload'
export const DonationLayout: Block = {
  slug: 'donationLayout',

  fields: [
    {
      name: 'formHeading',
      type: 'text',
      defaultValue: 'Make a Donation Now!',
    },
    {
      name: 'campaignLabel',
      type: 'text',
      defaultValue: 'Support The Cause',
    },
    {
      name: 'amountLabel',
      type: 'text',
      defaultValue: 'How much do you want to donate?',
    },
    {
      name: 'customAmountPlaceholder',
      type: 'text',
      defaultValue: 'Enter Amount',
    },
    {
      name: 'submitButtonLabel',
      type: 'text',
      defaultValue: 'Donate Now',
    },
  ],
}