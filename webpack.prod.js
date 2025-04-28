/* -------------------------------------------------------------------------- */
/*             Archivo de configuración de Webpack para producción            */
/* -------------------------------------------------------------------------- */

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

console.log('Compilando para modo de producción'); //Mensaje para indicar que se está en modo de producción

module.exports = merge(common, {
    mode: 'production', //Modo de producción
    optimization: {
        usedExports: true, //Eliminar el código muerto que no se utiliza en la aplicación
        splitChunks: {
            chunks: 'all', //Dividir el código en diferentes archivos para optimizar la carga
        },
        runtimeChunk: 'single', //Crear un archivo de código de ejecución único para optimizar la carg
        minimize: true, //Minificar el código para reducir el tamaño del bundle
        //Utilizar el plugin TerserPlugin para minificar el código
        minimizer: [
            new (require('terser-webpack-plugin'))({
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
        maxEntrypointSize: 512000, //Establecer un tamaño máximo de 512KB para los archivos generados
        maxAssetSize: 512000, //Establecer un tamaño máximo de 512KB para los archivos generados
    },
    output: {
        //Nombre del archivo de salida
        filename: '[name].[contenthash].bundle.js', //Agregar un hash al nombre del archivo para evitar problemas de caché
        chunkFilename: '[id].js', //Nombre del archivo de salida para los chunks
        //Limpiar la carpeta de salida antes de generar el nuevo bundle
        clean: true,
    }
});