module.exports = function (translationMap, transKey, ...replaceValues) {
  let value = translationMap[transKey];
  if (value == null) return transKey;

  for (let index = 0; index < replaceValues.length - 1; index++) {
    const replaceValue = replaceValues[index];
    value = value.replaceAll(`{${index}}`, replaceValue);
  }

  return value;
};
