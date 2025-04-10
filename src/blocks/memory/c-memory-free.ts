/* -------------------------------------------------------------------------- */
/*                 Archivo de bloque de liberación de memoria                 */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { BlockC, BlockVariableOutput } from 'src/libs/interface/block-interface';
import { arrayOptionsPrimitive, datatypeInfoGetFromName } from 'src/libs/datatype';

//JSON de definición de bloque
export const cMemoryFree = {
    "type": "c_memory_free",
    "tooltip": "Bloque para liberar memoria creado dinamicamente. Requiere el apuntador a la dirección de memoria reservada. Utilizala siempre cuando dejes de utilizar memoria reservada.",
    "helpUrl": "https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/free?view=msvc-170.",
    "message0": "Liberar memoria en %1",
    "args0": [
      {
        "type": "input_value",
        "name": "INPUT_VALUE_IDENTIFIER"
      }
    ],
    "previousStatement": "",
    "nextStatement": "Procedure",
    "inputsInline": true,
    "style": 'c_memory_blocks'
}
                      

//Registro de bloque
Blockly.Blocks["c_memory_free"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cMemoryFree);

    //Inicializar uso de biblioteca
    this.libraryUse = "stdlib.h";
  }
} as BlockC;

//Generador de código del bloque
cGenerator.forBlock["c_memory_free"] = function(block,generator) {
    const identifierValueCode = generator.valueToCode(block,'INPUT_VALUE_IDENTIFIER',0);
    return `free(${identifierValueCode})`;
}