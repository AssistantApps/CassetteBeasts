module.exports = function (context, options) {
    const valueNum = parseInt(context);
    let ret = "";
    for (let index = 0; index < valueNum; index++) {
        ret = ret + options.fn(context[index]);
    }

    return ret;
};