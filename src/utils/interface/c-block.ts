/* -------------------------------------------------------------------------- */
/*                       Archivo de interfaz de bloque C                      */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';

/*Interfaz de bloque C que hereda todas las propiedades de la clase de bloque, pero que tienen ciertos 
atributos globales que se utilizaran para un funcionamiento avanzado o la generación de código */
export interface IBlockC extends Blockly.BlockSvg{
  libraryUse: string | undefined; //Biblioteca que utiliza
  updateShape(): void; //Método para actualizar forma de bloque
  libraryUseValidatorDropdown(newValue: string): string; //Validador de FieldDropdown para verificar uso de biblioteca
  datatypeOptionsGenerator(): [string,string][]; //Generador de opciones de tipos de datos
}