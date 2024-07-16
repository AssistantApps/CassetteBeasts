module.exports = function (text, options) {
  const colonIndex = (text ?? '').toString().indexOf(':');
  if (colonIndex < 0) return text;
  return text.subString(0, colonIndex);
};
