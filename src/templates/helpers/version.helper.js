const { getConfig } = require("services/internal/configService");

module.exports = function (context, options) {
    return getConfig().packageVersion();
};