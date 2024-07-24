module.exports = function (email) {
  const chars = (email ?? '').toString().split('');
  return encodeURI(btoa(chars.map((c) => `<${c}>`).join('')));
};
