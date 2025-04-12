 /* -------------------------------------------------------------------------- */
 /*                  Archivo de bloque de dirección de memoria                 */
 /* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';

//JSON de definición de bloque
export const cMemoryAddress = {
  "type": "c_memory_address",
  "tooltip": "Bloque para obtener la dirección de memoria de un variable. (Debe utilizarse con un apuntador)",
  "helpUrl": "https://learn.microsoft.com/es-es/cpp/cpp/address-of-operator-amp?view=msvc-170",
  "message0": "Dirección de memoria de %1",
  "args0": [
    {
      "type": "input_value",
      "name": "INPUT_VALUE_IDENTIFIER"
    }
  ],
  "output": null,
  "inputsInline": true,
  "style": 'c_memory_blocks'
}

//Registro de bloque
Blockly.Blocks["c_memory_address"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cMemoryAddress);
  }
} as IBlockC;

//Generador de código del bloque
cGenerator.forBlock["c_memory_address"] = function(block,generator) {
  return [`&${generator.valueToCode(block,'INPUT_VALUE_IDENTIFIER',0)}`,0];
}