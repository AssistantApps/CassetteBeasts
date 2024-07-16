module.exports = function (value, section) {
  const percentValue = value / 3;
  const a = percentValue * Math.sin(30 * (Math.PI / 180));
  const b = Math.sqrt(Math.pow(percentValue, 2) - Math.pow(a, 2));

  const maxA100 = Math.min(a, 100);
  const maxB100 = Math.min(b, 100);
  const minA0 = Math.max(maxA100, 0);
  const minB0 = Math.max(maxB100, 0);

  switch (section) {
    case 'max_hp':
      return `100,${(100 - percentValue).toFixed(2)}`;
    case 'melee_attack':
      return `${(100 + minB0).toFixed(2)},${(100 - minA0).toFixed(2)}`;
    case 'melee_defense':
      return `${(100 + minB0).toFixed(2)},${(100 + minA0).toFixed(2)}`;
    case 'ranged_attack':
      return `${(100 - minB0).toFixed(2)},${(100 - minA0).toFixed(2)}`;
    case 'ranged_defense':
      return `${(100 - minB0).toFixed(2)},${(100 + minA0).toFixed(2)}`;
    case 'speed':
      return `100,${(100 + percentValue).toFixed(2)}`;
  }

  return '100,100';
};
