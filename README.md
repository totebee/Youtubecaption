# YouTube Caption Generator

A web application that generates YouTube captions/subtitles using AI technology. Built with React, Supabase, and Cloudflare.

## Features

- YouTube video caption generation
- Amazon Pay integration
- User authentication
- Request history tracking
- Real-time status updates

## Tech Stack

- Frontend: React + Vite
- Backend: Cloudflare Workers
- Database: Supabase
- AI: Google Gemini API
- Payment: Amazon Pay
- Hosting: Cloudflare Pages

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_AMAZON_PAY_PUBLIC_KEY_ID=your_amazon_pay_public_key_id
VITE_AMAZON_PAY_PRIVATE_KEY=your_amazon_pay_private_key
VITE_AMAZON_PAY_MERCHANT_ID=your_amazon_pay_merchant_id
VITE_AMAZON_PAY_STORE_ID=your_amazon_pay_store_id
```

## Deployment

The application is automatically deployed to Cloudflare Pages when changes are pushed to the main branch.

## License

MIT 