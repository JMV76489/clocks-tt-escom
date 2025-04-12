/* -------------------------------------------------------------------------- */
/*                 Archivo de bloque de asignación de variable                */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { IBlockC } from 'src/utils/interface/c-block';
import { cGenerator } from 'src/generators/c';

//JSON de definición de bloque
export const cVariableSet = {
    "type": "c_variable_set",
    "tooltip": "Bloque para fijar, asignar o modificar el valor de una variable, dirección de memoria de un apuntador o instancia de una estructura.",
    "helpUrl": "",
    "message0": "Fijar %1 a %2",
    "args0": [
      {
        "type": "input_value",
        "name": "INPUT_VALUE_IDENTIFIER"
      },
      {
        "type": "input_value",
        "name": "INPUT_VALUE_SET"
      }
    ],
    "previousStatement": 'Procedure',
    "nextStatement": 'Procedure',
    "inputsInline": true,
    "style": 'c_variable_blocks'
}

//Registro de bloque de declaración de variable
Blockly.Blocks["c_variable_set"] = {
    init: function(){
      //Inicializar bloque con JSON
      this.jsonInit(cVariableSet);
  }
} as IBlockC;

//Generador de código del bloque
cGenerator.forBlock["c_variable_set"] = function(block,generator) {
  const identifierCode = generator.valueToCode(block,'INPUT_VALUE_IDENTIFIER',0);
  const valueSetCode = generator.valueToCode(block,'INPUT_VALUE_SET',0);

  return `${identifierCode} = ${valueSetCode}`;
}