/* -------------------------------------------------------------------------- */
/*                      Archivo de bloque operador lógico                     */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC} from 'src/utils/interface/c-block';
import { BLOCKS_TYPE_BINARY_OPERATORS, LOGIC_OPERATOR_NAME_CODE_DICT } from 'src/utils/constants';
import { IBlockCLogicOperation } from 'src/utils/interface/c-logic-operation';

//JSON de definición de bloque
const cLogicOperator = {
    "type": "c_logic_operator",
    "tooltip": "Bloque para comparar dos expresiones logicamente.",
    "helpUrl": "https://www.freecodecamp.org/espanol/news/operador-c-operadores-logicos-de-programacion-en-c/",
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
            "o",
            "LOGIC_OR"
          ],
          [
            "y",
            "LOGIC_AND"
          ],
          [
            "no",
            "LOGIC_NOT"
          ]
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
    "style": 'c_logic_blocks'
}

//Registro de bloque
Blockly.Blocks["c_logic_operator"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cLogicOperator);
    //Asignar validador al Dropdown de operador para conmutar operador 1
    this.getField('FIELD_DROPDOWN_OPERATOR')?.setValidator(this.operatorValidatorDropdown);
  },
  // Función para conmutar operador 1 en el bloque
  operatorValidatorDropdown : function(this: Blockly.FieldDropdown,newValue: string){
    const block = this.getSourceBlock() as IBlockCLogicOperation;  
    const blockOperand1Input =  block.getInput('INPUT_VALUE_OPERAND_1');
    //Remover entrada del operador 1 cuando el valor del dropdown del operador este en un operador lógico unario
    if(newValue == 'LOGIC_NOT'){
      if(blockOperand1Input)
        block.removeInput('INPUT_VALUE_OPERAND_1');
    }else{
        //Agregar nuevamente el operador 1
        if(!blockOperand1Input){
            const newBlockOperand1Input = block.appendValueInput('INPUT_VALUE_OPERAND_1');
            block.moveInputBefore('INPUT_VALUE_OPERAND_1','INPUT_DUMMY_OPERATOR');
            //Crear bloque shadow con el valor por defecto de 1 y conectarlo al operador 1
            const shadowBlockValue = block.workspace.newBlock('c_value_number') as Blockly.BlockSvg;
            shadowBlockValue.setShadow(true);
            shadowBlockValue.setFieldValue(1,'FIELD_NUMBER_VALUE');
            shadowBlockValue.outputConnection.connect(newBlockOperand1Input.connection!);
            shadowBlockValue.initSvg();

        }
    }
    return newValue;
  }
} as IBlockCLogicOperation;

//Generador de código de operador lógico
cGenerator.forBlock['c_logic_operator'] = function(block,generator){
  //Obtener código y campos de bloques 
  const operand2ValueCode = generator.valueToCode(block,"INPUT_VALUE_OPERAND_2",0);
  const operatorValueCode = LOGIC_OPERATOR_NAME_CODE_DICT[block.getFieldValue("FIELD_DROPDOWN_OPERATOR")];
  let code = '';
  //Adaptar código si el operador lógico es unario
  if(block.getInput("INPUT_VALUE_OPERAND_1")){
      const operand1ValueCode = generator.valueToCode(block,"INPUT_VALUE_OPERAND_1",0);
      code = `${operand1ValueCode} ${operatorValueCode} ${operand2ValueCode}`;
  }else{
      code = `${operatorValueCode}${operand2ValueCode}`;
  }
  
  //Fijar orden dependiendo de si se encuentra dentro de un bloque de operación binaria
  const order = BLOCKS_TYPE_BINARY_OPERATORS.indexOf(block.getParent()?.type!) == -1 ? 0 : 1;

  return  [code,order];
}