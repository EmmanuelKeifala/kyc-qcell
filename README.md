# KYC Verification System

This project is a KYC (Know Your Customer) application that simplifies user verification through secure mobile number authentication and biometric verification.

## Getting Started

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser.

## Verification Steps

This KYC app streamlines user verification with the following steps:

1. **Enter Mobile Number**  
   Start by entering your mobile number. We’ll send a secure OTP to verify your identity.

2. **Upload Your ID**  
   Upload your government-issued ID. Our OCR technology will instantly extract key details for faster processing.

3. **Take a Selfie**  
   Capture a selfie to match with your ID photo, adding an extra layer of security to the verification process.

4. **Get Verified**  
   Once verification is successful, your account is activated and fully secured!

## Tech Stack

- **Framework**: Next.js, Tailwind CSS, ShadCN
- **UI Components**: Ant Design (AntD), Radix UI, Gemini, Lucide React
- **Authentication & Storage**: Supabase, Google Generative AI
- **OCR**: FreeOnlineOCR
- **Map Integration**: Leaflet, React-Leaflet
- **Data Visualization**: Recharts
- **Form Handling**: React Hook Form, Zod
- **Additional Libraries**: Framer Motion, React Toastify, Zustand, XLSX

## Learn More

To learn more about Next.js and other tools used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

Deploy your Next.js app easily with [Vercel](https://vercel.com). For more information, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
