// lib/db.ts
// NOTE: This is a volatile in-memory store. 
// On Vercel (Serverless), this data will be lost when the function cold-starts.
// For a production app, connect this to a real database like MongoDB, PostgreSQL, or Supabase.

export const db = {
  briefings: [
    {
      id: 'demo-1',
      companyName: 'Nexbox Demo',
      siteType: 'landing-page',
      status: 'aguardando cliente',
      createdAt: new Date().toISOString(),
      files: []
    }
  ],
  portfolio: [
    { id: '1', title: 'Landing Page Advocacia', link: '#', thumb: 'https://picsum.photos/seed/law/400/300' },
    { id: '2', title: 'E-commerce Fitness', link: '#', thumb: 'https://picsum.photos/seed/gym/400/300' },
    { id: '3', title: 'Site Institucional Engenharia', link: '#', thumb: 'https://picsum.photos/seed/tech/400/300' },
  ],
  settings: {
    affiliateLink: process.env.DEFAULT_AFFILIATE_LINK || 'https://www.hostgator.com.br/afiliados',
  },
  messages: [] as any[],
};

// Helper to simulate persistence in local dev (optional, won't work on Vercel)
// In a real scenario, you'd use something like:
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
