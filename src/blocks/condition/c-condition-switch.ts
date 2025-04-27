/* -------------------------------------------------------------------------- */
/*                  Archivo de bloque de condición de switch                  */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { IBlockCConditionSwitch } from 'src/utils/interface/c-condition-switch';

export const helpUrl = 'https://www2.eii.uva.es/fund_inf/cpp/temas/5_control_flujo_condicional/switch.html';

//Registro de bloque
Blockly.Blocks["c_condition_switch"]  = {
    init: function(this: IBlockCConditionSwitch){
      /* ---------------- Incializar bloqque con entradas y campos ---------------- */
      this.appendValueInput('INPUT_VALUE_VARIABLE')
          .appendField('Verificar valor de');
      this.appendStatementInput('INPUT_STATEMENT_CASES').setCheck('SwitchCase');
      this.setInputsInline(true)
      this.setPreviousStatement(true, 'Procedure');
      this.setNextStatement(true, 'Procedure');
      this.setTooltip('Bloque para realizar un control de flujo condicional mediante la instrucción switch. Permite evaluar una variable y ejecutar diferentes conjuntos de bloques de código según su valor.No elimines el bloque de romper bucle, ya que es necesario para el correcto funcionamiento del bloque.');
      this.setHelpUrl('https://www2.eii.uva.es/fund_inf/cpp/temas/5_control_flujo_condicional/switch.html');
      this.setStyle('c_condition_blocks');
    /* ------------------------------------  ----------------------------------- */
    
    if(this.isInFlyout){
      //Añadir bloque de casos de switch al crearse en el toolbox
      const casesBlock = this.workspace.newBlock('c_condition_switch_cases') as IBlockCConditionSwitch;
      casesBlock.previousConnection.connect(this.getInput('INPUT_STATEMENT_CASES')?.connection!)
      casesBlock.initSvg();
      //Volver inamovible y no eliminable al bloque de casos
      casesBlock.setMovable(false);
      casesBlock.setDeletable(false);
    }
  },
} as IBlockC; 

//Generador de código del bloque
cGenerator.forBlock["c_condition_switch"] = function(block,generator) {
  //Obtener códigos de entradas y campos
  const valueVariableCode = generator.valueToCode(block,'INPUT_VALUE_VARIABLE',-1);
  const casesStatementCode = generator.statementToCode(block,'INPUT_STATEMENT_CASES');
  return `switch(${valueVariableCode}){\n${casesStatementCode}\n}`;
}