export const toSchemaOrgProperty = <T>(property: string, type: string, data: T) => {
  const objStr = JSON.stringify(
    {
      '@type': type,
      ...data,
    },
    null,
    2,
  );
  return `"${property}": ${objStr},`;
};
