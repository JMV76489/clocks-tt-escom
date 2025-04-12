 /* -------------------------------------------------------------------------- */
 /*                   Archivo de bloque de retorno de función                  */
 /* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';

//JSON de definición de bloque
const cFunctionReturn = {
    "type": "c_function_return",
    "tooltip": "Bloque para hacer que una función devuelva un valor.",
    "helpUrl": "https://platzi.com/tutoriales/1968-funciones-c/7837-funciones-en-c-estructura-basica-de-una-funcion-en-c-y-como-llamar-una-funcion-en-otra-funcion-2/",
    "message0": "Devolver %1",
    "args0": [
        {
        "type": "input_value",
        "name": "INPUT_VALUE_RETURN"
        }
    ],
    "previousStatement": "Procedure",
    "nextStatement": "Procedure",
    "style": 'c_function_blocks'
}

//Registro de bloque
Blockly.Blocks["c_function_return"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cFunctionReturn);
    //Evitar que se pueda borrar
    this.setDeletable(false) 
  }
} as IBlockC

//Generador de código del bloque
cGenerator.forBlock["c_function_return"] = function(block,generator) {
  return `return(${generator.valueToCode(block,'INPUT_VALUE_RETURN',0)})`;
}