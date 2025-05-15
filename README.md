# Vape Store Billing System

A modern, user-friendly billing system for vape stores built with Next.js and React.

## Features

- Display ELFBAR brand and its flavors (SHISHA LUXE, ICEKING, BC10000)
- Select flavors, enter quantities, and set prices
- Calculate totals automatically
- Export billing details as PDF
- Responsive design for desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd vape-bill
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click on the ELFBAR brand card to view available flavors
2. Enter quantities and prices for the flavors you want to add to the bill
3. Review the billing summary at the bottom
4. Click "Export PDF" to download the bill as a PDF file

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- react-to-pdf for PDF generation

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
