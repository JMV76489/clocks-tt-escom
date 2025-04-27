/* -------------------------------------------------------------------------- */
/*                     Archivo de bloque comparador lógico                    */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { BLOCKS_TYPE_BINARY_OPERATORS, COMPARATOR_NAME_CODE_DICT } from 'src/utils/constants';

//JSON de definición de bloque
export const cLogicComparator = {
  "type": "c_logic_comparator",
  "tooltip": "Bloque para comparar dos valores entre si.",
  "helpUrl": "https://learn.microsoft.com/es-es/cpp/c-language/c-relational-and-equality-operators?view=msvc-170",
  "message0": "%1 %2 %3 %4",
  "args0": [
    {
      "type": "input_value",
      "name": "INPUT_VALUE_COMPARAND_1"
    },
    {
      "type": "field_dropdown",
      "name": "FIELD_DROPDOWN_COMPARATOR",
      "options": [
        [
          "igual a",
          "COMPARATOR_EQUAL"
        ],
        [
          "mayor a",
          "COMPARATOR_GREATER"
        ],
        [
          "menor a",
          "COMPARATOR_LESS"
        ],
        [
          "mayor o igual a",
          "COMPARATOR_GREATER_EQUAL"
        ],
        [
          "menor o igual a",
          "COMPARATOR_LESS_EQUAL"
        ],
        [
          "no igual",
          "COMPARATOR_EQUAL_NOT"
        ]
      ]
    },
    {
      "type": "input_dummy",
      "name": "INPUT_DUMMY_COMPARATOR"
    },
    {
      "type": "input_value",
      "name": "INPUT_VALUE_COMPARAND_2"
    }
  ],
  "output": null,
  "inputsInline": true,
  "style": 'c_logic_blocks'
}

//Registro de bloque
Blockly.Blocks["c_logic_comparator"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cLogicComparator);
  }
} as IBlockC

//Generador de código del bloque
cGenerator.forBlock['c_logic_comparator'] = function(block,generator){
  //Obtener código y campos de bloques
  const comparand1ValueCode = generator.valueToCode(block,"INPUT_VALUE_COMPARAND_1",0);
  const comparand2ValueCode = generator.valueToCode(block,"INPUT_VALUE_COMPARAND_2",0);
  const comparatorValueCode = COMPARATOR_NAME_CODE_DICT[block.getFieldValue("FIELD_DROPDOWN_COMPARATOR")];
  const code = `${comparand1ValueCode} ${comparatorValueCode} ${comparand2ValueCode}`;

  return  [code,1];
}