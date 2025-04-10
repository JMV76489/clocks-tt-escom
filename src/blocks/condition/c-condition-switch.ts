/* -------------------------------------------------------------------------- */
/*                  Archivo de bloque de condición de switch                  */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { BlockC, BlockConditionSwitch } from 'src/libs/interface/block-interface';

//Registro de bloque
Blockly.Blocks["c_condition_switch"]  = {
    init: function(this: BlockConditionSwitch){
      /* ---------------- Incializar bloqque con entradas y campos ---------------- */
      this.appendValueInput('INPUT_VALUE_VARIABLE')
          .appendField('Verificar valor de');
      this.appendEndRowInput('INPUT_END_ROW_CONDITION')
      this.appendStatementInput('INPUT_STATEMENT_CASES').setCheck('SwitchCase');
      this.setInputsInline(true)
      this.setPreviousStatement(true, 'Procedure');
      this.setNextStatement(true, 'Procedure');
      this.setTooltip('');
      this.setHelpUrl('');
      this.setStyle('c_condition_blocks');
    /* ------------------------------------  ----------------------------------- */
    
    if(this.isInFlyout){
      //Añadir bloque de casos de switch al crearse en el toolbox
      const casesBlock = this.workspace.newBlock('c_condition_switch_cases') as BlockConditionSwitch;
      casesBlock.previousConnection.connect(this.getInput('INPUT_STATEMENT_CASES')?.connection!)
      casesBlock.initSvg();
      //Volver inamovible y no eliminable al bloque de casos
      casesBlock.setMovable(false);
      casesBlock.setDeletable(false);
    }
  },
} as BlockC; 

//Generador de código del bloque
cGenerator.forBlock["c_condition_switch"] = function(block,generator) {
  //Obtener códigos de entradas y campos
  const valueVariableCode = generator.valueToCode(block,'INPUT_VALUE_VARIABLE',0);
  const casesStatementCode = generator.statementToCode(block,'INPUT_STATEMENT_CASES');
  return `switch(${valueVariableCode}){\n${casesStatementCode}\n}`;
}