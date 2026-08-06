import type { Block } from 'payload'
export const LoginForm: Block = {
    slug: 'loginForm',

    fields: [

        {
            name: 'heading',
            type: 'text',
            defaultValue: 'Login',
        },

        {
            name: 'subHeading',
            type: 'textarea',
        },

        {
            name: 'mobileTabLabel',
            type: 'text',
            defaultValue: 'Mobile',
        },
        {
            name: 'mobilePlaceholder',
            type: 'text',
            defaultValue: '10-digit mobile number',
        },

        {
            name: 'emailTabLabel',
            type: 'text',
            defaultValue: 'Email',
        },
        {
            name: 'emailPlaceholder',
            type: 'text',
            defaultValue: 'Enter your email',
        },

        {
            name: 'otpButtonLabel',
            type: 'text',
            defaultValue: 'Login with OTP',
        },

        {
            name: 'passwordButtonLabel',
            type: 'text',
            defaultValue: 'Login with Password',
        },
        {
            name: 'passwordPlaceholder',
            type: 'text',
            defaultValue: 'Enter your password',
        },
        {
            name: 'whatsappLabel',
            type: 'text',
            defaultValue: 'Receive donation updates on WhatsApp',
        },
        {
            name: 'showWhatsappCheckbox',
            type: 'checkbox',
            defaultValue: true,
        },

        {
            name: 'loginButtonLabel',
            type: 'text',
            defaultValue: 'Login',
        },
        {
            name: 'termsText',
            type: 'textarea',
        },
        {
            name: 'termsPage',
            type: 'relationship',
            relationTo: 'pages',
        },
        {
            name: 'privacyPage',
            type: 'relationship',
            relationTo: 'pages',
        },
        {
            name: 'footerText',
            type: 'textarea',
        }

    ]
}