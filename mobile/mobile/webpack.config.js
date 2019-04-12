//JavaScript Document
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        index: "./src/index.js"
    },
    output: {
        path: __dirname + "/build",
        //publicPath: "/",
        filename: "js/[name].bundle.js",
        chunkFilename: "js/[name].chunk.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/i,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: [
                            "@babel/plugin-transform-runtime",
                            "@babel/plugin-syntax-dynamic-import",
                            ["@babel/plugin-proposal-class-properties", {loose: false}],
                            ["@babel/plugin-proposal-decorators", {legacy: true}],
                            ["babel-plugin-import", {libraryName: "antd-mobile", style: "css"}]
                        ]
                    }
                },
                exclude: /node_modules/,
                include: /src/
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            //publicPath: "/"
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            minimize: process.env.NODE_ENV == "production"
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [require("autoprefixer")]
                        }
                    }
                ]
            },
            /* {
                test: /\.html?$/,
                use: "html-loader"
            }, */
            {
                test: /\.(jpe?g|png|gif|svg)/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 1024,
                        outputPath: "images/",
                        name: "[name].[ext]"
                    }
                }
            },
            {
                test: /\.(eot|ttf|woff2?)/i,
                use: {
                    loader: "url-loader",
                    options: {
                        outputPath: "fonts/",
                        name: "[name].[ext]"
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            hash: true,
            chunks: ["index", "common", "vender", "loader"]
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].bundle.css",
            chunkFilename: "css/[name].chunk.css"
        })
    ],
    resolve: {
        extensions: [".js", ".jsx", ".json", ".css", ".html"]
    },
    devtool: "source-map",
    optimization: {
        splitChunks: {
            cacheGroups: {
                vender: {
                    chunks: "all",
                    name: "vender",
                    test: /node_modules/
                },
                common: {
                    chunks: "initial",
                    name: "common",
                    //test: /src/,
                    minChunks: 2,
                    minSize: 0
                }
            }
        }
    },
    devServer: {
        compress: false,
        //contentBase: "./public",
        port: 8080,
        proxy: {
            "/": "http://localhost:3000"
        }
    }
};