/* -------------------------------------------------------------------------- */
/*               Archivo de bloque de impresión de cadena simple              */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { BlockC } from "src/libs/interface/block-interface";

//JSON de definición de bloque
export const cPrintSimpleString = {
  "type": "c_print_simple_string",
  "tooltip": "Bloque para imprimir texto en consola o salida estandar.",
  "helpUrl": "https://es.wikibooks.org/wiki/Programación_en_C/Salida_por_pantalla:_printf()",
  "message0": "Imprimir: %1 %2",
  "args0": [
    {
      "type": "field_input",
      "name": "FIELD_INPUT_STRING",
      "text": "texto"
    },
    {
      "type": "input_dummy",
      "name": "INPUT_DUMMY_STRING"
    }
  ],
  "previousStatement": "Procedure",
  "nextStatement": "Procedure",
  "style": 'c_print_blocks'
}

//Registro de bloque
Blockly.Blocks["c_print_simple_string"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cPrintSimpleString);
    //Uso de biblioteca
    this.libraryUse = "stdio.h";
  }
} as BlockC;

//Generador de código del bloque
cGenerator.forBlock["c_print_simple_string"] = function(block) {
  return `printf("${block.getFieldValue('FIELD_INPUT_STRING')}")`;
}