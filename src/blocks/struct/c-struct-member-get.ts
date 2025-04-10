/* -------------------------------------------------------------------------- */
/*            Archivo de bloque de salida de miembro de estructura            */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { BlockC } from 'src/libs/interface/block-interface';

//JSON de definición de bloque
export const cStructMemberGet = {
    "type": "c_struct_member_get",
    "tooltip": "Bloque para obtener el miembro (variable) de una instancia de una estructura.",
    "helpUrl": "https://www-tutorialspoint-com.translate.goog/cprogramming/c_dot_operator.htm?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc",
    "message0": "%1 de %2",
    "args0": [
      {
        "type": "field_input",
        "name": "FIELD_INPUT_MEMBER_IDENTIFIER",
        "text": "miembro"
      },
      {
        "type": "input_value",
        "name": "INPUT_VALUE_IDENTIFIER"
      }
    ],
    "output": null,
    "inputsInline": true,
    "style": 'c_struct_blocks'
}

//Registro de bloque
Blockly.Blocks["c_struct_member_get"] = {
    init: function(){
      //Inicializar bloque con JSON
      this.jsonInit(cStructMemberGet);
    }
} as BlockC;

//Generador de código del bloque
cGenerator.forBlock["c_struct_member_get"] = function(block,generator) {
  return [`${generator.valueToCode(block,'INPUT_VALUE_IDENTIFIER',0)}.${block.getFieldValue('FIELD_INPUT_MEMBER_IDENTIFIER')}`,0];
}