import { site } from 'constants/site';

type SchemaType = 'ItemPage' | 'Article' | 'Guide' | 'Person';
export const toSchemaOrgProperty = <T>(
  type: SchemaType,
  data: T,
): Record<string, string | unknown> => {
  const schemaObj: Record<string, string | unknown> = {
    '@context': 'https://schema.org/',
    '@type': type,
    author: {
      '@type': 'Person',
      name: site.humans.kurt.name,
      givenName: site.humans.kurt.name,
      familyName: site.humans.kurt.name,
      additionalName: site.humans.kurt.additionalName,
      url: site.humans.kurt.website,
      image: site.humans.kurt.image,
      jobTitle: site.humans.kurt.jobTitle,
    },
    ...data,
  };
  return schemaObj;
};
