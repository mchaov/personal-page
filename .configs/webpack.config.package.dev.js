const path = require('path');
const baseConfig = require("./webpack.config.shared");

const srcRoot = path.resolve(__dirname, "..", "packages", "package", "src");

module.exports = {
    ...baseConfig(
        "development",
        "package",
        "./packages/package/tsconfig.json",
        "dev",
        srcRoot
    ),
};