export const translator = (translationLookup: Record<string, string>) => ({
  translate: (key: string, ...replaceValues: Array<string>) => {
    let value = translationLookup?.[key];
    if (value == null) return key;

    for (let index = 0; index < replaceValues.length; index++) {
      const replaceValue = replaceValues[index];
      value = value.replaceAll(`{${index}}`, replaceValue);
    }

    return value;
  },
});
