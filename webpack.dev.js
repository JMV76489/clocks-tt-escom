/* -------------------------------------------------------------------------- */
/*       Archivo de configuración de Webpack para el modo de desarrollo       */
/* -------------------------------------------------------------------------- */

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

console.log('Ejecutando en modo de desarrollo'); //Mensaje para indicar que se está en modo de producción

module.exports = merge(common, {
  mode: 'development', //Modo de desarrollo
  devtool: 'eval-cheap-module-source-map', //Generar un mapa de origen para depurar el código

  //Configuración del servidor de desarrollo
  devServer: {
    //Directorio donde se encuentran los archivos estáticos
    static: './build',
    //Puerto donde se ejecuta el servidor
    port: process.env.PORT || 8080,
    //Permitir el acceso a la aplicación desde cualquier host
    allowedHosts: "all"
  },

});