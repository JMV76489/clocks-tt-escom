/* -------------------------------------------------------------------------- */
/*                      Archivo de bloque de función main                     */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';

//JSON de definición de bloque
const cFunctionMain = {
  "type": "c_function_main",
  "tooltip": "",
  "helpUrl": "",
  "message0": "Al iniciar %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "INPUT_STATEMENT",
      "check": "Procedure"
    }
  ],
  "disable": false,
  "style": 'c_function_blocks'
  
}

//Registro de bloque
Blockly.Blocks["c_function_main"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cFunctionMain);
    //Evitar que se pueda borrar
    this.setDeletable(false) 
    //Poner gorra al bloque
    this.hat = "cap"; 
  },
  customContextMenu: function(options: any[]) {
    
    // Filtrar la opción "Desactivar bloque"
    const disableIndex = options.findIndex(option => 
      'text' in option && option.text === Blockly.Msg.DISABLE_BLOCK
    );
    if (disableIndex !== -1) {
      options.splice(disableIndex, 1);
    }
  }
} as IBlockC

//Generador de código del bloque
cGenerator.forBlock["c_function_main"] = function(block,generator) {
  return `void main(){\n${generator.statementToCode(block,'INPUT_STATEMENT')}\n}`;
}