/* -------------------------------------------------------------------------- */
/*     Archivo de configuración de webpack para la aplicación de Blockly.     */
/* -------------------------------------------------------------------------- */

const path = require('path'); //Importar el módulo path para manejar rutas de archivos
const HtmlWebpackPlugin = require('html-webpack-plugin'); //Importar el módulo HtmlWebpackPlugin para generar archivos HTML

module.exports = {
  //Punto de entrada de la aplicación
  entry: './src/index.ts',
  plugins: [
    /*Generar un archivo HTML a partir de una plantilla
    y agregar el bundle de JavaScript generado por webpack
    a la etiqueta script del archivo HTML*/
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: 'Clocks',
    }),
  ], 
  module: {
    rules: [
      //Cargar archivos de typescript.
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      //Cargar archivos de css para que puedan ser importados en un archivo de JavaScript.
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      //Cargar archivos de imagenes.
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource"
      },
    ],
  },
  resolve: {
    //Extensiones de archivo que se pueden importar sin especificar la extensión
    extensions: ['.tsx', '.ts', '.js'],
    /*Agregar la carpeta src a la ruta de búsqueda de módulos para que se puedan 
    importar archivos sin especificar la ruta completa*/
    alias: {
      src: path.resolve(__dirname, 'src'), 
    },
  },
};