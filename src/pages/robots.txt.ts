import type { APIRoute } from 'astro';

const devMode: boolean = !!import.meta.env.PUBLIC_DEV_MODE;

const robotsTxt = `
User-agent: *
${devMode ? "Disallow" : "Allow"}: /

Sitemap:  https://playsorbonne.fr/sitemap-index.xml`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};