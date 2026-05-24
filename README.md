# GlaucusAtlanticus

Ethical job-search copilot built with Next.js and Tailwind CSS.

## Current Scope

- Frontend-only local analysis
- Rule-based fit scoring
- Resume/profile text input
- Job description input
- Target role categories: Tech, Tutoring, Art, Casual, Freelance
- Local skill extraction, fit score, apply/maybe/skip recommendation, matching skills, missing skills, red flags, and a draft cover letter
- Local saved jobs tracker with status and notes stored in browser localStorage only

## Safety Boundaries

- No auto-apply workflow
- No scraping
- No paid APIs
- No backend database
- No login or account system
- Tracker data is stored in browser localStorage only
- No server-side handling of sensitive resume/job text

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.

## Notes

The first version intentionally keeps all text in browser state only. Future versions can add explicit consent, persistence, and API-backed analysis after the safety model is designed. The current local analysis flow can be treated as the JobPilot MVP feature, but GlaucusAtlanticus remains the project and product brand.

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
