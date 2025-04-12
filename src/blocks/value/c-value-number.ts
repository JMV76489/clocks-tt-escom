/* -------------------------------------------------------------------------- */
/*                     Archivo de bloque de valor numérico                    */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';

//JSON de bloque de valor numérico
const cValueNumber = {
    "type": "c_value_number",
    "tooltip": "Bloque que representa un valor numérico.",
    "helpUrl": "",
    "message0": "%1 %2",
    "args0": [
      {
        "type": "field_number",
        "name": "FIELD_NUMBER_VALUE",
        "value": 0
      },
      {
        "type": "input_dummy",
        "name": "INPUT_DUMMY_VALUE"
      }
    ],
    "output": null,
    "style": 'c_value_blocks',
}

//Registro de bloque de valor númerico
Blockly.Blocks["c_value_number"] = {
    init: function(){
      //Inicializar bloque con JSON
      this.jsonInit(cValueNumber);
    }
} as IBlockC;

//Generador de código del bloque
cGenerator.forBlock["c_value_number"] = function(block) {
  return [block.getFieldValue('FIELD_NUMBER_VALUE').toString(),0];
}
