module.exports = function (imgUrl, options) {
  if ((imgUrl ?? '').indexOf('res://') < 0) return imgUrl;
  const newUrl = (imgUrl ?? '').replace('res://', '');
  if (newUrl.length < 1) return '/assets/img/passive_quest_icon.png?old=' + imgUrl;
  return `/assets/img/generated/${newUrl}`;
};
