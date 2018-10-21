const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist/"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: 'SharePoint Template Hub'
          })
      ],

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    devServer: {
        // Display only errors to reduce the amount of output.
        stats: "errors-only",
        open: true, // Open the page in browser
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? "warning" : false
      },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            
            { test:/\.css$/, use:['style-loader','css-loader']
            }
        ]
    }
};