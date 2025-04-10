/* -------------------------------------------------------------------------- */
/*              Archivo de bloque de impresión de variable simple             */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { BlockC } from 'src/libs/interface/block-interface';
import { arrayOptionsPrimitive, datatypeInfoGetFromName } from 'src/libs/datatype';

//JSON de definición de bloque
export const cPrintSimpleVariable = {
  "type": "c_print_simple_variable",
  "tooltip": "Bloque para imprimir el valor de una variable en consola o salida estandar.",
  "helpUrl": "https://www.it.uc3m.es/pbasanta/asng/course_notes/input_output_printf_es.html",
  "message0": "Imprimir %1 como %2 %3",
  "args0": [
    {
      "type": "input_value",
      "name": "INPUT_VALUE_OUTPUT"
    },
    {
      "type": "field_dropdown",
      "name": "FIELD_DROPDOWN_DATATYPE",
      "options": arrayOptionsPrimitive
    },
    {
      "type": "input_dummy",
      "name": "INPUT_DUMMY_DATATYPE"
    }
  ],
  "previousStatement": "Procedure",
  "nextStatement": 'Procedure',
  "inputsInline": true,
  "style": 'c_print_blocks'
}

  //Registro de bloque
Blockly.Blocks["c_print_simple_variable"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cPrintSimpleVariable);
    //Uso de biblioteca
    this.libraryUse = "stdio.h";
  }
} as BlockC;

//Generador de código del bloque
cGenerator.forBlock["c_print_simple_variable"] = function(block,generator) {
  return `printf("${datatypeInfoGetFromName(block.getFieldValue('FIELD_DROPDOWN_DATATYPE'))?.formatSpecifier}",`+
  `${generator.valueToCode(block,'INPUT_VALUE_OUTPUT',0)})`;
}