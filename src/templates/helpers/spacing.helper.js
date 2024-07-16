module.exports = function (offset, index, spacing, suffix) {
  const offsetNum = parseInt(offset);
  const indexNum = parseInt(index);
  const spacingNum = parseInt(spacing);
  // return `${indexNum * spacingNum + offsetNum}${suffix}`;
  return indexNum * spacingNum + offsetNum;
};
