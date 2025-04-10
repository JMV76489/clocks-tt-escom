/* -------------------------------------------------------------------------- */
/*                     Archivo de bloque de bucle do while                    */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { BlockC } from 'src/libs/interface/block-interface';

//JSON de definición de bloque
export const cLoopDoWhile = {
    "type": "c_loop_do_while",
    "tooltip": "Similar al bucle while, pero ejecuta primero la acción antes de evaluar la condición.",
    "helpUrl": "https://www.carlospes.com/curso_de_lenguaje_c/03_02_repetitiva_hacer_mientras.php",
    "message0": "Hacer: %1 Mientras: %2",
    "args0": [
      {
        "type": "input_statement",
        "name": "INPUT_STATEMENT_DO",
        "check": "Procedure"
      },
      {
        "type": "input_value",
        "name": "INPUT_VALUE_CONDITION"
      }
    ],
    "previousStatement": "Procedure",
    "nextStatement": "Procedure",
    "inputsInline": true,
    "style": 'c_loop_blocks'
}

//Registro de bloque
Blockly.Blocks["c_loop_do_while"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cLoopDoWhile);
  }
} as BlockC;

//Generador de código del bloque
cGenerator.forBlock["c_loop_do_while"] = function(block,generator) {
  return `do{\n${generator.statementToCode(block,'INPUT_STATEMENT_DO')}\n}while(${generator.valueToCode(block,'INPUT_VALUE_CONDITION',0)})`;
}