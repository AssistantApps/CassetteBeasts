module.exports = function (index, multiply, clamp) {
    const indexNum = parseInt(index);
    const multiplyNum = parseInt(multiply);
    const clampNum = parseInt(clamp);

    return Math.min(indexNum * multiplyNum, clampNum);
};
