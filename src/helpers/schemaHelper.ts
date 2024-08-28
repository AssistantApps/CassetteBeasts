type SchemaType = 'ItemPage' | 'Article' | 'Guide' | 'Person';
export const toSchemaOrgProperty = <T>(type: SchemaType, data: T) => {
  const schemaObj: Record<string, string> = {
    '@context': 'https://schema.org/',
    '@type': type,
    ...data,
  };
  return JSON.stringify(schemaObj, null, 2);
};
