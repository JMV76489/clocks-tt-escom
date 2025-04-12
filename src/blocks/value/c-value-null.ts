/* -------------------------------------------------------------------------- */
/*                       Archivo de bloque de valor nulo                      */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';

//JSON de bloque de valor numérico
const cNullValue = {
    "type": "c_value_null",
    "tooltip": "Bloque de valor NULO. Utilizalo unicamente cuando quieres que un apuntador no apunte a ninguna dirección de memoria a la hora de asignar o modificarlo.",
    "helpUrl": "",
    "message0": "NULO %1",
    "args0": [
      {
        "type": "input_dummy",
        "name": "INPUT_DUMMY_VALUE"
      }
    ],
    "output": null,
    "style": 'c_value_blocks',
}
                      

//Registro de bloque de valor númerico
Blockly.Blocks["c_value_null"] = {
    init: function(){
      //Inicializar bloque con JSON
      this.jsonInit(cNullValue);
    }
} as IBlockC;

//Generador de código del bloque
cGenerator.forBlock["c_value_null"] = function(block) {
  return ['NULL',0];
}
