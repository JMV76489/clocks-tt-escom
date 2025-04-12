/* -------------------------------------------------------------------------- */
/*            Archivo de bloque de operaciones aritméticas unarias            */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { IBlockCMathUnaryOperator } from 'src/utils/interface/c-math-unary-operator';
import { OPERATION_UNARY_BASIC_NAME_CODE_DICT } from 'src/utils/constants';

//JSON de definición de bloque
export const cMathUnaryOperation = {
    "type": "c_math_unary_operation",
    "tooltip": "Bloque para realizar una operación matemática que requiere un unico valor especificado por el usuario.",
    "helpUrl": "http://maxus.fis.usal.es/FICHAS_C.WEB/03xx_PAGS/0305.html",
    "message0": "%1 %2",
    "args0": [
        {
        "type": "field_dropdown",
        "name": "FIELD_DROPDOWN_OPERATOR",
        "options": [
            [
              "√",
              "OPERATOR_SQUARE_ROOT"
            ],
            [
              "e^",
              "OPERATOR_EXP"
            ],
            [
              "ln",
              "OPERATOR_LOGARITHM_NATURAL"
            ],
            [
              "log",
              "OPERATOR_LOGARITHM_10"
            ],
            [
              "seno",
              "OPERATOR_SINE"
            ],
            [
              "coseno",
              "OPERATOR_COSINE"
            ],
            [
              "tangente",
              "OPERATOR_TANGENT"
            ],
            [
              "arcoseno",
              "OPERATOR_ARCSINE"
            ],
            [
              "arcocoseno",
              "OPERATOR_ARCCOSINE"
            ],
            [
              "arcotangente",
              "OPERATOR_ARCTANGENT"
            ]
        ]
        },
        {
        "type": "input_value",
        "name": "INPUT_VALUE_OPERAND"
        }
    ],
    "output": null,
    "inputsInline": true,
    "style": 'c_math_blocks',
}

//Registro de bloque
Blockly.Blocks["c_math_unary_operation"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cMathUnaryOperation);
    //Uso de biblioteca
    this.libraryUse = "math.h";

    this.getField('FIELD_DROPDOWN_OPERATOR')?.setValidator(this.operatorValidator)
  },
  //Validador de operador
  operatorValidator: function(this: Blockly.FieldDropdown,newValue : string){
    const block = this.getSourceBlock() as IBlockC;
    //Añadir label de radianes en caso de que se seleccione alguna operación trigonométrica
    if(['OPERATOR_SINE','OPERATOR_COSINE','OPERATOR_TANGENT'].indexOf(newValue) !=-1)
    {
      if(!block.getInput('INPUT_DUMMY_LABEL_RADIANS')){
        block.appendDummyInput('INPUT_DUMMY_LABEL_RADIANS').
        appendField(new Blockly.FieldLabel('radianes'))
      }
      //Eliminar label en caso contrario
    }else{
      if(block.getInput('INPUT_DUMMY_LABEL_RADIANS'))
        block.removeInput('INPUT_DUMMY_LABEL_RADIANS');
    }
    return newValue;
  }
} as IBlockCMathUnaryOperator;

//Generador de código de operaciones matemáticas básicas unarias
cGenerator.forBlock['c_math_unary_operation'] = function(block,generator){
  //Obtener código y campos de bloques
  const operandValueCode = generator.valueToCode(block,"INPUT_VALUE_OPERAND",0);
  const operationValueDropdown = OPERATION_UNARY_BASIC_NAME_CODE_DICT[block.getFieldValue("FIELD_DROPDOWN_OPERATOR")];
  const code = `${operationValueDropdown}(${operandValueCode})`;
  return  [code,0];
}