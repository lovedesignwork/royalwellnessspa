# Royal Wellness Spa

A luxury massage and spa booking website for Royal Wellness Spa in Phuket, Thailand. Built with Next.js, Supabase, and 2C2P payment gateway.

## Features

- **Luxury Design**: Modern, elegant UI with premium fonts and gold accents
- **Online Booking**: Complete booking flow with treatment selection, date/time picker
- **Payment Integration**: 2C2P payment gateway for Thai and international payment methods
- **Admin Dashboard**: Secure admin panel at `/xadmin` for managing bookings
- **Responsive**: Mobile-first design that works on all devices
- **Bilingual**: English and Thai language support

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: 2C2P Payment Gateway
- **Hosting**: Vercel
- **i18n**: next-intl

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- 2C2P merchant account

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
TWOC2P_MERCHANT_ID=your_2c2p_merchant_id
TWOC2P_SECRET_KEY=your_2c2p_secret_key
TWOC2P_SANDBOX=true
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
│   ├── [locale]/         # Localized pages (en, th)
│   ├── api/              # API routes
│   ├── xadmin/           # Admin dashboard
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── admin/            # Admin-specific components
│   └── ...               # Shared components
├── lib/
│   ├── spa-data.ts       # Treatment data
│   ├── 2c2p.ts           # 2C2P payment gateway
│   └── supabase/         # Supabase clients
└── messages/             # i18n translations (en.json, th.json)
```

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `TWOC2P_MERCHANT_ID`
   - `TWOC2P_SECRET_KEY`
   - `TWOC2P_SANDBOX` (set to `false` for production)
   - `NEXT_PUBLIC_BASE_URL` (your Vercel domain)
   - `RESEND_API_KEY` (for contact form emails)
4. Deploy!

## Google Analytics

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to this site's GA4 web-stream measurement ID
and rebuild the deployment. This is a public tracking ID, never a private key.
Tracking loads only on the production spa domains, after a visitor chooses
**Allow analytics**. The bilingual notice and footer **Cookie settings** let
visitors decline or withdraw consent. Admin and payment routes are excluded.
Only public page views are sent; query strings, fragments, guest form data and
booking/payment identifiers are not sent. Advertising consent stays denied.

Keep **Enhanced measurement off** for this web stream: the client records one
page view per public route change, including Next.js navigation. Enabling
automatic history page views would double-count them. Basic session and user
metrics are provided by GA4. This change does not report successful payments,
confirmed bookings or inquiry conversions.

The hotel admin dashboard reads this property's reports with its separate
server-only Viewer service account. No reporting private key belongs in this
website. New properties have no historical data; standard reports need Google
processing time. Realtime can verify the first consented page views.

## Admin Access

- Navigate to `yourdomain.com/xadmin`
- Login with your Supabase admin credentials
- Manage bookings, view stats, and more

## 2C2P Payment Integration

The payment flow:
1. Customer selects treatment and fills booking details
2. System creates a pending booking in database
3. System requests a payment token from 2C2P
4. Customer is redirected to 2C2P hosted payment page
5. Customer completes payment (card, QR, bank transfer, etc.)
6. 2C2P sends backend notification to update booking status
7. Customer is redirected back and sees confirmation

### Supported Payment Methods

2C2P supports various payment methods including:
- Credit/Debit Cards (Visa, Mastercard, JCB, AMEX)
- QR Code Payments (PromptPay)
- Bank Transfers
- Digital Wallets
- And more...

## Spa Menu

The spa offers treatments in these categories:
- **Travel Recovery**: For jet lag, digital detox, posture reset
- **Skin & Radiance**: After-sun care, glow treatments
- **Couple & Special**: Romantic packages, bridal prep
- **Facial Treatments**: Various facial therapies
- **Classic Thai Heritage**: Traditional Thai massage

## License

Private - All rights reserved.

## Contact

Royal Wellness Spa
3rd Floor, Royal Phuket City Hotel, Phuket, Thailand
Open: 10AM - 11PM Daily
Phone: 090-596-9666
