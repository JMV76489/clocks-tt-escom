/* -------------------------------------------------------------------------- */
/*             Archivo de configuración de Webpack para producción            */
/* -------------------------------------------------------------------------- */

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');


console.log('Compilando para modo de producción'); //Mensaje para indicar que se está en modo de producción

module.exports = merge(common, {
    mode: 'production', //Modo de producción
    devtool:false, //Desactivar el source map para producción
    optimization: {
        usedExports: true, //Eliminar el código muerto que no se utiliza en la aplicación
        //Dividir el código en diferentes archivos para optimizar la carga
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                  reuseExistingChunk: true,
                },
                default: {
                  minChunks: 2,
                  priority: -20,
                  reuseExistingChunk: true,
                },
            },
        },
        runtimeChunk: 'single', //Crear un archivo de código de ejecución único para optimizar la carga
        minimize: true, //Minificar el código para reducir el tamaño del bundle
        //Utilizar el plugin TerserPlugin para minificar el código
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true, //Eliminar los console.log del código
                    },
                },
            }),
        ],
    },
    performance: {
        hints: false, //Desactivar las advertencias de tamaño de los archivos generados
        maxEntrypointSize: 512000, //Establecer un tamaño máximo de 512KB para los archivos de entrada
        maxAssetSize: 512000, //Establecer un tamaño máximo de 512KB para los archivos emitidos por webpack
    },
    output: {
        //Nombre del archivo de salida
        filename: '[name].[contenthash].bundle.js', //Agregar un hash al nombre del archivo para evitar problemas de caché
        chunkFilename: '[id].js', //Nombre del archivo de salida para los chunks
        clean: true, //Limpiar la carpeta de salida antes de generar el nuevo bundle

    }
});
