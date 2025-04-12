/* -------------------------------------------------------------------------- */
/*              Archivo de bloque de salida de dato de apuntador              */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';

//JSON de definición de bloque
export const cPointerOutput = {
    "type": "c_pointer_output",
    "tooltip": "Bloque para obtener el contenido de una variable a través de un apuntador que apunta hacia esa variable.",
    "helpUrl": "https://www.it.uc3m.es/pbasanta/asng/course_notes/pointers_indirection_with_pointers_es.html#:~:text=En%20C%20la%20indirección%20se,declarar%20este%20tipo%20de%20variables.",
    "message0": "Dato en %1",
    "args0": [
      {
        "type": "input_value",
        "name": "INPUT_VALUE_IDENTIFIER"
      }
    ],
    "output": null,
    "inputsInline": true,
    "style": 'c_pointer_blocks'
}
                      

//Registro de bloque de salida de variable
Blockly.Blocks["c_pointer_output"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cPointerOutput);
  }
} as IBlockC; 

//Generador de código del bloque
cGenerator.forBlock["c_pointer_output"] = function(block,generator) {
  return [`*${generator.valueToCode(block,'INPUT_VALUE_IDENTIFIER',0)}`,0];
}