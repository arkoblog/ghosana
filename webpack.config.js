var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
})


module.exports = {
    entry: [
        './src/index.js'
    ],
    output: {
        path: __dirname + '/docs',
        filename: "index_bundle.js",
    },
    module: {
        loaders: [
            {  test: /\.(png|jpg|gif)$/,  loader: 'url-loader'  },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    plugins: [HtmlWebpackPluginConfig],
    node: {
        fs: "empty"
    }

}
