/* -------------------------------------------------------------------------- */
/*                      Archivo de bloque de bucle while                      */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';

//JSON de definición de bloque
export const cLoopWhile = {
    "type": "c_loop_while",
    "tooltip": "Bloque para realizar una repetición de instrucciones mientras una condición sea cierta. Se evalua la condición y si se cumple ejecuta las instrucciones dentro de el.",
    "helpUrl": "https://learn.microsoft.com/es-es/cpp/c-language/while-statement-c?view=msvc-170",
    "message0": "Mientras: %1 Hacer: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "INPUT_VALUE_CONDITION"
      },
      {
        "type": "input_statement",
        "name": "INPUT_STATEMENT_DO",
        "check": "Procedure"
      }
    ],
    "previousStatement": "Procedure",
    "nextStatement": "Procedure",
    "inputsInline": true,
    "style": 'c_loop_blocks'
}

//Registro de bloque
Blockly.Blocks["c_loop_while"] = {
    init: function(){
      //Inicializar bloque con JSON
      this.jsonInit(cLoopWhile);
    }
} as IBlockC;

//Generador de código del bloque
cGenerator.forBlock["c_loop_while"] = function(block,generator) {
  return `while${generator.valueToCode(block,'INPUT_VALUE_CONDITION',-1)}{\n${generator.statementToCode(block,'INPUT_STATEMENT_DO')}\n}`;
}