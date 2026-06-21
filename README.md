# web-base-portfolio

A polished data science and analytics portfolio built with React, Vite, Tailwind, Supabase, and TanStack Router.

## About

This repository contains a portfolio website for a data science student and machine learning practitioner. The homepage features animated hero content, orbital technology badges, social links, certifications, projects, experience, and contact sections.

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Preview the production build locally:
   ```bash
   npm run preview
   ```

## Vercel deployment

This repo is ready to deploy to Vercel as a static / SSR portfolio site.

### Recommended repo name
- `web-base-portfolio`

### Build settings
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### Environment variables

If you use Supabase features, set these secrets in Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PUBLISHABLE_KEY`

### Deploy steps

1. Push this repository to GitHub.
2. Sign in to Vercel and click **New Project**.
3. Import the GitHub repository named `web-base-portfolio`.
4. Confirm build settings and add the environment variables above.
5. Deploy.

## Project structure

- `src/` - application source code
- `src/routes/` - page routes
- `src/components/` - reusable UI and portfolio components
- `src/integrations/supabase/` - Supabase client and auth helpers
- `package.json` - scripts and dependencies
- `vite.config.ts` - Vite/TanStack Start config

## Notes

- The hero now displays direct section navigation buttons for About, Certifications, Experience, and Projects.
- A decorative data/ML environment is layered behind the hero avatar.
- External links are normalized for GitHub, LinkedIn, email, WhatsApp, and project demos.

## Important

I cannot deploy directly to your Vercel account from this environment. Use the README instructions to connect the repository and deploy it yourself.
