const { override, fixBabelImports, addLessLoader, addWebpackPlugin, addWebpackAlias, addDecoratorsLegacy, addBabelPlugins, useEslintRc, addPostcssPlugins } = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FilterWarningsPlugin = require('./plugin/filter-warning-plugin');
const webpack = require('webpack');
const cssnano = require("cssnano");

const myPlugin = [
    new UglifyJsPlugin(
        {
            sourceMap: false,
            uglifyOptions: {
                warnings: false,
                compress: {
                    drop_debugger: true,
                    drop_console: true
                }
            }
        }
    ),
    // 过滤掉mini-css-extract-plugin中的waring
    new FilterWarningsPlugin({
        exclude: 'mini-css-extract-plugin'
    })
];

const removeManifest = () => config => {
    config.plugins = config.plugins.filter(
        p => p.constructor.name !== "ManifestPlugin"
    );
    return config;
};

module.exports = override(
    addPostcssPlugins([
        cssnano({
            // 压缩和清理CSS代码
            autoprefixer: false,
            "postcss-zindex": false
        })
    ]),
    removeManifest(),
    useEslintRc(path.resolve(__dirname, ".eslintrc.js")), // 这个是控制eslint检查的配置，如果不想用就直接注释掉
    addDecoratorsLegacy(), // 装饰器
    addWebpackAlias({
        ["@"]: path.resolve(__dirname, "src")
    }),
    // antd 按需引入
    fixBabelImports('import', { libraryName: 'antd', libraryDirectory: 'es', style: true }),
    // 添加less加载器，可以在这里配置全局主题色，如果不用css modules，一定要吧modules设置成false，不然编译出来的样式选择会带上hash值
    addLessLoader({
        javascriptEnabled: true,
        modules: false,
        modifyVars: {
            'layout-header-background': 'rgb(30,30,40)'
        }
    }),
    // 用dayjs替换momentjs
    addWebpackPlugin(new AntdDayjsWebpackPlugin()),
    addBabelPlugins(
        ['syntax-dynamic-import', { legacy: true }]
    ),
    (config, env) => {
        config.plugins = [...config.plugins, new webpack.DefinePlugin({
            'PUBLIC_PATH': JSON.stringify(config.output.publicPath)
        })];
        if (config.mode === 'production') {
            config.devtool = false; //去掉js map文件
            config.plugins = [...config.plugins, ...myPlugin];
            process.env.GENERATE_SOURCEMAP = "false"; // 去掉 css map
            const splitChunksConfig = config.optimization.splitChunks;

            config.optimization.splitChunks = Object.assign(splitChunksConfig, {
                chunks: 'all',
                cacheGroups: {
                    vendors: {
                        test: /node_modules/,
                        name: 'vendors',
                        priority: -10,
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        minSize: 30000,
                        chunks: 'all'
                    }
                }
            })
        }
        return config
    }
);