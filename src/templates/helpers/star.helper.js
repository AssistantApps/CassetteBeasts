module.exports = function (amount, options) {
  if (isNaN(amount)) return '';
  return '★'.repeat(amount + 1);
};
