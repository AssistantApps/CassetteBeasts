import type { APIRoute } from 'astro';

const content = import.meta.env.SITE;

export const GET: APIRoute = () => {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
