/* -------------------------------------------------------------------------- */
/*             Archivo de bloque para scanf simple a variable                 */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { arrayOptionsPrimitive, datatypeInfoGetFromName } from 'src/utils/datatype';

//JSON de definición de bloque
export const cInputScanfSimple = {
    "type": "c_input_scanf_simple",
    "tooltip": "Bloque para leer un valor desde el teclado (consola o entrada estandar).",
    "helpUrl": "https://www.it.uc3m.es/pbasanta/asng/course_notes/input_output_function_scanf_es.html",
    "message0": "Leer %1 y almacenarlo en %2 %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "FIELD_DROPDOWN_DATATYPE",
        "options": arrayOptionsPrimitive
      },
      {
        "type": "input_value",
        "name": "INPUT_VALUE_IDENTIFIER"
      },
      {
        "type": "input_dummy",
        "name": "INPUT_DUMMY"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "c_input_blocks"
}
   
//Registro de bloque
Blockly.Blocks["c_input_scanf_simple"] = {
  init: function(this: IBlockC){
    //Inicializar bloque con JSON
    this.jsonInit(cInputScanfSimple);
  }
}    

//Generador de código de bloque de lectura simple desde entrada estandar
cGenerator.forBlock['c_input_scanf_simple'] = function(block,generator) {
  return `scanf("${datatypeInfoGetFromName(block.getFieldValue('FIELD_DROPDOWN_DATATYPE'))?.formatSpecifier}",&${generator.valueToCode(block,'INPUT_VALUE_IDENTIFIER',0)})`;
}