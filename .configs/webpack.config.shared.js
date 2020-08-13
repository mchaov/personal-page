const path = require("path");
const webpack = require("webpack");
const hljs = require("highlight.js");
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function isProd(mode) { return mode === "production" }

module.exports = (mode, outputFolder, tsconfigPath, fileSuffix, srcRoot) => {
    const inputRoot = path.resolve(__dirname, "../", "packages", outputFolder);
    const outRoot = path.resolve(__dirname, "../", "dist", outputFolder);
    const pagesConfig = require(path.join(srcRoot, "pages.json"));

    const entries = Object
        .keys(pagesConfig)
        .reduce((a, b) => {
            a[b] = path.join(srcRoot, pagesConfig[b])
            return a;
        }, {});

    console.log(entries);

    return {
        mode: mode,
        entry: entries,
        devtool: "source-map",
        output: {
            filename: `[name]${fileSuffix && "." + fileSuffix}.js`,
            path: outRoot,
            library: "__APP",
            libraryTarget: "umd"
        },
        resolve: {
            modules: [path.resolve(__dirname, "..", "src"), "node_modules"],
            extensions: [".ts", ".tsx", ".js", ".wasm", ".mjs", ".json"],
            alias: {
                types: path.resolve(srcRoot, "types"),
                helpers: path.resolve(srcRoot, "helpers")
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: "ts-loader",
                        options: {
                            configFile: path.resolve(tsconfigPath)
                        }
                    }],
                },
                {
                    test: /\.(less|css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            // options: { url: false }
                        },
                        {
                            loader: "less-loader",
                            options: {
                                sourceMap: true
                            },
                        }
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[name].[ext]",
                                outputPath: "assets"
                            }
                        }

                    ],
                },
                {
                    test: /\.md$/,
                    use: [
                        {
                            loader: "html-loader"
                        },
                        {
                            loader: "markdown-loader",
                            options: {
                                gfm: true,
                                highlight: (code, lang, callback) => {
                                    return hljs.highlight(lang, code).value
                                }
                                // https://marked.js.org/#/USING_ADVANCED.md#options
                            }
                        }
                    ]
                }
            ],
        },
        optimization: {
            splitChunks: {
                chunks: "initial",
                name: "vendor"
            },
            runtimeChunk: {
                name: "manifest"
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                IS_PRODUCTION: JSON.stringify(isProd(mode)),
                IS_DEVELOPMENT: JSON.stringify(!isProd(mode)),
                "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
            }),
            new MiniCssExtractPlugin({
                filename: `[name]${fileSuffix && "." + fileSuffix}.css`,
            }),
            new CopyPlugin({
                patterns: [
                    {
                        context: inputRoot,
                        from: "**/*.html",
                        to: outRoot
                    },
                    {
                        context: inputRoot,
                        from: "i/*.*",
                        to: outRoot
                    },
                    {
                        context: inputRoot,
                        from: "**/*.ico",
                        to: outRoot
                    }
                ],
            }),
            ...isProd(mode) ? [
                new BundleAnalyzerPlugin({
                    openAnalyzer: false,
                    analyzerMode: "static",
                    reportFilename: `REPORT-${outputFolder}.html`
                })
            ] : []
        ]
    }
};