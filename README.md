# PromptVault - AI Prompt Marketplace

A production-ready AI prompt marketplace built with Next.js 14, Supabase, and Razorpay.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Shadcn UI
- **Backend**: Supabase (Auth, DB, Storage)
- **Payments**: Razorpay
- **Charts**: Recharts
- **Validation**: Zod + React Hook Form

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Setup Supabase**:
   - Create a project on [Supabase](https://supabase.com).
   - Run the contents of `supabase_schema.sql` in the SQL Editor.
4. **Environment Variables**:
   - Copy `.env.example` to `.env.local`.
   - Fill in your Supabase and Razorpay credentials.
5. **Run Development Server**: `npm run dev`

## Core Features
- ✅ Glassmorphism SaaS UI
- ✅ Prompt Preview with Blur Lock
- ✅ Coin-based Wallet System
- ✅ Razorpay Payment Integration
- ✅ Multi-step Prompt Listing
- ✅ Multi-charts Seller Dashboard
- ✅ Verified Reviews & Seller Profiles

## Security (RLS)
The database is secured using Supabase Row Level Security. Buyers can only access the `prompt_text` of prompts they have successfully purchased.

## Deployment
Deploy to Vercel with one click:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to add the environment variables in the Vercel project settings.
