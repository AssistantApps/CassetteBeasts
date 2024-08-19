import type { APIRoute } from 'astro';
import { site } from '../constants/site';

const content = `
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
  xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>${site.meta.title}</ShortName>
  <Description>${site.meta.description}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <OutputEncoding>UTF-8</OutputEncoding>
  <AdultContent>false</AdultContent>
  <Developer>${site.humans.kurt.name}</Developer>
  <Contact>${site.assistantApps.email.replace('mailto:', '')}</Contact>
  <Description>${site.meta.description}</Description>
  <Tags>${site.meta.keywords.replaceAll(',', '')}</Tags>
  <Attribution>Search data from ${site.assistantApps.name}, ${
  site.assistantApps.website
}</Attribution>
  <Query role="example" searchTerms="Springheel"/>
  <Image width="16" height="16" type="image/x-icon">${site.rootUrl}/favicon.ico</Image>
  <Url type="text/html" template="${site.rootUrl}?q={searchTerms}">
    <Param name="searchTerms" value="{searchTerms}" />
  </Url>
  <Url type="application/x-suggestions+json" template="${site.rootUrl}?q={searchTerms}" />
</OpenSearchDescription>
`;

export const GET: APIRoute = () => {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
