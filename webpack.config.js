/* -------------------------------------------------------------------------- */
/*     Archivo de configuración de webpack para la aplicación de Blockly.     */
/* -------------------------------------------------------------------------- */

const path = require('path'); //Importar el módulo path para manejar rutas de archivos
const HtmlWebpackPlugin = require('html-webpack-plugin'); //Importar el módulo HtmlWebpackPlugin para generar archivos HTML

const config = {
  //Punto de entrada de la aplicación
  entry: './src/index.ts', 
  output: {
    //Compilar los archivos del código fuente en un solo bundle
    filename: 'bundle.js',
    //Ruta de salida del bundle generado
    path: path.resolve(__dirname, 'dist'),
    //Nombre de los archivos utilizados al dividir la aplicacion en varios archivos
    filename: "dist/[name].js", 
    //Limpiar la carpeta de salida antes de generar el nuevo bundle
    clean: true, 
  },
  //Configuración del servidor de desarrollo
  devServer: {
    //Directorio donde se encuentran los archivos estáticos
    static: './build',
    //Puerto donde se ejecuta el servidor
    port: process.env.PORT || 8080,
    //Permitir el acceso a la aplicación desde cualquier host
    allowedHosts: "all"
  },
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
  plugins: [
    /*Generar un archivo HTML a partir de una plantilla
    y agregar el bundle de JavaScript generado por webpack
    a la etiqueta script del archivo HTML*/
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
  //Configuración de optimización para producción
  optimization: {
    //Dividir el código en diferentes archivos para optimizar la carga
    splitChunks: {
      chunks: 'all',
    },
  },
  //Configuración de modo de producción
  mode: 'production',
  /*Configuración de rendimiento
    Desactivar las advertencias de tamaño de los archivos generados
    y establecer un tamaño máximo de 512KB para los archivos generados
    evitando que se generen archivos demasiado grandes*/
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};

//Configuración para el modo de desarrollo y producción
module.exports = (env, argv) => {
  //Modo de desarrollo
  if (argv.mode === 'development') {
    //Fijar la ruta de salida a la carpeta build y dejar la carpeta dist para producción
    config.output.path = path.resolve(__dirname, 'build');

    /*Generar source maps para facilitar la depuración del código
      El tipo de source map utilizado es eval-cheap-module-source-map
      que es más rápido que el tipo de source map por defecto
      y permite depurar el código de la aplicación sin perder el contexto
      de la aplicación*/
    config.devtool = 'eval-cheap-module-source-map';

    //Incluir el source maps para Blockly para facilitar la depuración del código de Blockly
    config.module.rules.push({
      test: /(blockly\/.*\.js)$/,
      use: [require.resolve('source-map-loader')],
      enforce: 'pre',
    });

    /* Ignorar las advertencias de source maps de Closure Compiler
      que no se pueden encontrar y que son esperadas*/
    config.ignoreWarnings = [/Failed to parse source map/];
  }
  return config;
};