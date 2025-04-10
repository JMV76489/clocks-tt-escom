/* -------------------------------------------------------------------------- */
/*                Archivo de bloque de declaración de estrutura               */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { datatypePrimitiveValidator, identifierValidator } from 'src/libs/validator';
import { arrayOptionsPrimitive, datatypeInfoGetFromName } from 'src/libs/datatype';
import { BlockC } from 'src/libs/interface/block-interface';
import { cGenerator } from 'src/generators/c';
import { buttonArrow } from 'src/assets/assets';

//JSON de definición de bloque
export const cPointerDeclaration = {
  "type": "c_pointer_declaration",
  "tooltip": "",
  "helpUrl": "",
  "message0": "Declarar apuntador hacia tipo %1 llamado: %2 %3 %4",
  "args0": [
  {
      "type": "field_dropdown",
      "name": "FIELD_DROPDOWN_DATATYPE",
      "options": arrayOptionsPrimitive
      },
    {
      "type": "field_image",
      "src": buttonArrow,
      "width": 15,
      "height": 15,
      "alt": "*",
      "flipRtl": "FALSE"
    },
    {
      "type": "field_input",
      "name": "FIELD_INPUT_IDENTIFIER",
      "text": "identificador"
    },
    {
      "type": "input_value",
      "name": "INPUT_VALUE_SET"
    }
  ],  
  "previousStatement": "Procedure",
  "nextStatement": "Procedure",
  "style": 'c_pointer_blocks'
}

//Registro de bloque de declaración de variable
Blockly.Blocks["c_pointer_declaration"] = {
    init: function(){
      //Inicializar bloque con JSON
      this.jsonInit(cPointerDeclaration);
  
      //Asignar validador al campo de tipo de dato
      this.getField("FIELD_INPUT_DATATYPE")?.setValidator(datatypePrimitiveValidator);
      
      //Asignar validador al campo de identificador
      this.getField("FIELD_INPUT_IDENTIFIER")?.setValidator(identifierValidator);
      
  }
} as BlockC;

//Generador de código del bloque
cGenerator.forBlock["c_pointer_declaration"] = function(block,generator) {
  const identifierCode = block.getFieldValue('FIELD_INPUT_IDENTIFIER');
  const datatypeCode = datatypeInfoGetFromName(block.getFieldValue('FIELD_DROPDOWN_DATATYPE'))?.code;
  const setValueCode = generator.valueToCode(block,'INPUT_VALUE_SET',0);
  return `${datatypeCode} *${identifierCode}${setValueCode == '' ? '' : ` = ${setValueCode}`}`;
}