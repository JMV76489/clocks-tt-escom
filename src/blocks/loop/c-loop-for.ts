/* -------------------------------------------------------------------------- */
/*                Archivo de bloque de bucle for de incremento                */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { IBlockCLoopFor } from 'src/utils/interface/c-loop-for';
import { FOR_SIMPLE_INCREMENT_DICT_CODE } from 'src/utils/constants';

//JSON de definición de bloque
export const cLoopForIncrement = {
  "type": "c_loop_for_increment",
  "tooltip": "Bloque para iterar una variable desde un numero especifico mientras se cumpla una condición y realizandole un incremento especificado.",
  "helpUrl": "https://www.aprenderaprogramar.com/index.php?option=com_content&view=article&id=931:bucles-en-lenguaje-c-estructura-de-repeticion-condicion-contador-ejemplos-tabla-de-multiplicar-cu00533f&catid=82&Itemid=210",
  "message0": "Iterar %1 %2 desde %3 ; mientras %4 ; %5 por %6 y en cada iteración: %7",
  "args0": [
    {
      "type": "input_dummy",
      "name": "INPUT_DUMMY_FOR_OPTIONS"
    },
    {
      "type": "input_value",
      "name": "INPUT_VALUE_IDENTIFIER"
    },
    {
      "type": "input_value",
      "name": "INPUT_VALUE_BEGINNING"
    },
    {
      "type": "input_value",
      "name": "INPUT_VALUE_CONDITION"
    },
    {
      "type": "field_dropdown",
      "name": "FIELD_DROPDOWN_INCREMENT",
      "options": [
        [
          "Sumandose",
          "INCREMENT_ADDING"
        ],
        [
          "Restandose",
          "INCREMENT_SUBTRACTING"
        ],
        [
          "Multiplicandose",
          "INCREMENT_MULTIPLYING"
        ],
        [
          "Dividiendose",
          "INCREMENT_DIVIDING"
        ],
        [
          "Residuandose",
          "INCREMENT_REMAINDERING"
        ]
      ]
    },
    {
      "type": "input_value",
      "name": "INPUT_VALUE_INCREMENT"
    },
    {
      "type": "input_statement",
      "name": "INPUT_STATEMENT",
      "check": "Procedure"
    }
  ],
  "previousStatement": "Procedure",
  "nextStatement": "Procedure",
  "inputsInline": true,
  "style": 'c_loop_blocks',
}
                    
//Registro de bloque while
Blockly.Blocks["c_loop_for_increment"] = {
  init: function(this: IBlockCLoopFor){
    //Inicializar atributo de booleano de declaración de variable
    this.doDeclareVariable = true;
    //Inicializar bloque con JSON
    this.jsonInit(cLoopForIncrement);
  }
} as IBlockC

//Generador de código del bloque
cGenerator.forBlock["c_loop_for_increment"] = function(block,generator) {
  //Obtener código y campos de bloques
  const identifierValueCode = generator.valueToCode(block,'INPUT_VALUE_IDENTIFIER',0);
  const beginningValueCode = generator.valueToCode(block,'INPUT_VALUE_BEGINNING',0);
  const conditionValueCode = generator.valueToCode(block,'INPUT_VALUE_CONDITION',2);
  const incrementTypeCode = FOR_SIMPLE_INCREMENT_DICT_CODE[block.getFieldValue('FIELD_DROPDOWN_INCREMENT')];
  const incrementValueCode = generator.valueToCode(block,'INPUT_VALUE_INCREMENT',0);
  const statementCode = generator.statementToCode(block,'INPUT_STATEMENT');
  
  return `for(${identifierValueCode} = ${beginningValueCode};${conditionValueCode};${identifierValueCode} ${incrementTypeCode} ${incrementValueCode})${statementCode == '' ? ';' : `{\n${statementCode}\n}`}`;
}