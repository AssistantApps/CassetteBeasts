import type { APIRoute } from 'astro';
import { site } from 'constants/site';

export const GET: APIRoute = () => {
  return new Response(site.cname, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
