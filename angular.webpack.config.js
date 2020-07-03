const { AngularCompilerPlugin } = require('@ngtools/webpack');
const path = require("path");

module.exports = {
    entry: './client-angular/main.ts',
    devServer: {
        contentBase: path.join(__dirname, 'dist-angular'),
        compress: true,
        port: 8060
      },
    output: {
        path: path.join(__dirname, "/dist-angular"),
        filename: "main.js"
    },
    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: '@ngtools/webpack'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    'to-string-loader',
                    { 
                        loader: 'css-loader', 
                        options: { 
                            sourceMap: true 
                        } 
                    },
                    { 
                        loader: 'sass-loader', 
                        options: { 
                            sourceMap: true 
                        } 
                    }
                ]
            }
        ]
    },
     
    plugins: [
        new AngularCompilerPlugin({
            tsConfigPath: './tsconfig.angular.json',
            entryModule: './client-angular/app/app.module#AppModule',
            sourceMap: true
        })
    ]
}