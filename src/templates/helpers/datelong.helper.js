module.exports = function (context, options) {
  return new Date().toString().split(' ').slice(0, 4).join(' ');
};
