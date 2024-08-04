import type { APIRoute } from 'astro';
import { site } from '../constants/site';
import { isoDate } from '../helpers/dateHelper';

const content: Array<string> = [];

const human = site.humans.kurt;
content.push('/* TEAM */');
content.push(`${human.jobTitle}: ${human.name}`);
content.push(`Contact: ${human.email}`);
if (human.twitter != null) content.push(`Twitter: ${human.twitter}`);
content.push(`From: ${human.location}\n`);

content.push('/* SITE */');
content.push(`Last update: ${isoDate()}`);
content.push('Language: English');
content.push('Doctype: HTML5');
content.push('IDE: Visual Studio Code');

export const GET: APIRoute = () => {
  return new Response(content.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
