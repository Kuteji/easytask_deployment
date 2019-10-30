const path = require('path');
const webpack = require('webpack');

//configuracion de babel
module.exports = {
    entry : './public/js/app.js',
    output : {
        filename : 'bundle.js',
        path : path.join(__dirname, './public/dist')
    },
    module : {
        rules : [
            {
                //js
                test: /\.m?js$/,   //busca todods los archivos js
                use : {
                    loader: 'babel-loader',
                    options:{
                        presets:['@babel/preset-env']
                    }
                }
            }
        ]       
    }
}