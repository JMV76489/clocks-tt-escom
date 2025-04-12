 /* -------------------------------------------------------------------------- */
 /*        Archivo de bloque de operaciones aritméticas binarias básicas       */
 /* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { BLOCKS_TYPE_BINARY_OPERATORS, OPERATION_BINARY_BASIC_NAME_CODE_DICT } from 'src/utils/constants';

//JSON de definición de bloque
export const cMathBinaryOperationArithmetic = {
    "type": "c_math_binary_operation_arithmetic",
    "tooltip": "Bloque para realizar operaciones aritmeticas entre dos valores.",
    "helpUrl": "https://www.aprenderaprogramar.com/index.php?option=com_content&view=article&id=907:operadores-aritmeticos-basicos-en-lenguaje-c-prioridades-concepto-de-modulo-o-resto-de-division-cu00518f&catid=82&Itemid=210",
    "message0": "%1 %2 %3 %4",
    "args0": [
      {
        "type": "input_value",
        "name": "INPUT_VALUE_OPERAND_1"
      },
      {
        "type": "field_dropdown",
        "name": "FIELD_DROPDOWN_OPERATOR",
        "options": [
          [
            "+",
            "OPERATION_ADDITION"
          ],
          [
            "-",
            "OPERATION_SUBSTRACTION"
          ],
          [
            "*",
            "OPERATION_MULTIPLICATION"
          ],
          [
            "/",
            "OPERATION_DIVISION"
          ],
          [
            "Elevado a",
            "OPERATION_EXPONENTIATION"
          ],
          [
            "Residuo entre",
            "OPERATION_REMAINDER"
          ],
        ]
      },
      {
        "type": "input_dummy",
        "name": "INPUT_DUMMY_OPERATOR"
      },
      {
        "type": "input_value",
        "name": "INPUT_VALUE_OPERAND_2"
      }
    ],
    "output": null,
    "inputsInline": true,
    "style": 'c_math_blocks',
}

//Registro de bloque
Blockly.Blocks["c_math_binary_operation_arithmetic"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cMathBinaryOperationArithmetic);
    
    //Inicializar uso de biblioteca
    this.libraryUse = "math.h";

    //Asignar validador de uso de biblioteca
    const fieldOperators = this.getField('FIELD_DROPDOWN_OPERATOR')
    fieldOperators?.setValidator(this.libraryUseValidatorDropdown);
  },

  //Validador de uso de biblioteca
  libraryUseValidatorDropdown: function(this: Blockly.FieldDropdown,newValue : string){
    (this.getSourceBlock() as IBlockC).libraryUse = (newValue == 'OPERATION_EXPONENTIATION') ? "math.h" : undefined;
    return newValue;
  }
} as IBlockC;

//Generador de código del bloque
cGenerator.forBlock["c_math_binary_operation_arithmetic"] = function(block,generator) {
  //Código de entradas y campos
  const operand1Code = generator.valueToCode(block,'INPUT_VALUE_OPERAND_1',0);
  const operand2Code = generator.valueToCode(block,'INPUT_VALUE_OPERAND_2',0);
  const operatorValue = block.getFieldValue('FIELD_DROPDOWN_OPERATOR');
  let code = '';

  //Fijar orden dependiendo de si se encuentra dentro de un bloque de operación binaria
  let order = BLOCKS_TYPE_BINARY_OPERATORS.indexOf(block.getParent()?.type!) == -1 ? 0 : 1;

  switch(operatorValue){
    case "OPERATION_EXPONENTIATION": {
      code = `pow(${operand1Code},${operand2Code})`;
      order = 0;
      break;
    }
    default: {
      code = `${operand1Code} ${OPERATION_BINARY_BASIC_NAME_CODE_DICT[operatorValue]} ${operand2Code}`;
      break;
    }
  }
  return [code,order];
}