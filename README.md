# Royal Wellness Spa

A luxury massage and spa booking website for Royal Wellness Spa in Phuket, Thailand. Built with Next.js, Supabase, and PaySolution payment gateway.

## Features

- **Luxury Design**: Modern, elegant UI with premium fonts and gold accents
- **Online Booking**: Complete booking flow with treatment selection, date/time picker
- **Payment Integration**: PaySolution payment gateway for Thai payment methods
- **Admin Dashboard**: Secure admin panel at `/xadmin` for managing bookings
- **Responsive**: Mobile-first design that works on all devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: PaySolution Gateway
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- PaySolution merchant account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd royal-wellness-spa
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PAYSOLUTION_MERCHANT_ID=your_merchant_id
PAYSOLUTION_SECRET_KEY=your_secret_key
```

5. Set up the database:
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the SQL from `supabase/schema.sql`

6. Create an admin user:
   - Go to Supabase Dashboard > Authentication > Users
   - Click "Add user" and create an admin account

7. Run the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (pages)/          # Public pages
│   ├── api/              # API routes
│   ├── xadmin/           # Admin dashboard
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── admin/            # Admin-specific components
│   └── ...               # Shared components
└── lib/
    ├── spa-data.ts       # Treatment data
    └── supabase/         # Supabase clients
```

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `PAYSOLUTION_MERCHANT_ID`
   - `PAYSOLUTION_SECRET_KEY`
   - `PAYSOLUTION_API_URL`
   - `NEXT_PUBLIC_BASE_URL` (your Vercel domain)
4. Deploy!

## Admin Access

- Navigate to `yourdomain.com/xadmin`
- Login with your Supabase admin credentials
- Manage bookings, view stats, and more

## PaySolution Integration

The payment flow:
1. Customer selects treatment and fills booking details
2. System creates a pending booking in database
3. Customer is redirected to PaySolution payment page
4. After payment, webhook updates booking status
5. Customer sees confirmation

## Spa Menu

The spa offers treatments in these categories:
- **Travel Recovery**: For jet lag, digital detox, posture reset
- **Skin & Radiance**: After-sun care, glow treatments
- **Couple & Special**: Romantic packages, bridal prep
- **Facial Treatments**: Various facial therapies
- **Classic Thai Heritage**: Traditional Thai massage
- **Top-Up / Add-On**: Enhancement treatments

## License

Private - All rights reserved.

## Contact

Royal Wellness Spa
3rd Floor, Phuket, Thailand
Open: 10AM - 11PM Daily
