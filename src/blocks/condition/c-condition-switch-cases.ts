/* -------------------------------------------------------------------------- */
/*               Archivo de bloque de casos de sentencia switch               */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { buttonBlockMinus, buttonBlockPlus, buttonRemove } from 'src/assets/assets';
import { cGenerator } from 'src/generators/c';
import { IBlockCConditionSwitch } from 'src/utils/interface/c-condition-switch';
import { STRINGS_CODE_HTML_FORMAT } from 'src/utils/constants';

//Registro de bloque
Blockly.Blocks["c_condition_switch_cases"]  = {
  init: function(this: IBlockCConditionSwitch){

    /* ---------------- Incializar bloque con entradas y campos ---------------- */
    this.appendDummyInput('INPUT_DUMMY_CASE_CONTROL')
      .appendField(new Blockly.FieldImage(buttonBlockPlus, 15, 15,'Añadir caso',(p1) => {this.addCase()}))
      .appendField('Agregar caso')
    this.appendEndRowInput('INPUT_END_ROW_CASE_CONTROL')
    this.appendDummyInput('INPUT_DUMMY_DEFAULT_CASE_CONTROL')
      .appendField(new Blockly.FieldImage(buttonBlockPlus, 15, 15,'Activar caso por defecto',(p1) => {this.toggleDefaultCase()}),'FIELD_IMAGE_CASE_DEFAULT_CONTROL')
      .appendField(new Blockly.FieldLabelSerializable('Agregar caso por defecto'),'FIELD_LABEL_CASE_DEFAULT_CONTROL');
    this.setInputsInline(true)
    this.setPreviousStatement(true, 'SwitchCase');
    this.setNextStatement(true, 'SwitchCase');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setStyle('c_condition_blocks');

    /* -------------------------------------------------------------------------- */

    //Incializar atributos de bloque
    if(this.isInFlyout){
      this.caseIndex = 0;
      this.caseIndexArray = [];
      this.isDefaultCaseEnabled =  false;
      this.addCase();
    }

  },
  //Método para añadir entradas de caso
  appendCaseInputs:function(caseIndex){
    const inputValueCaseName = `INPUT_VALUE_CASE_${caseIndex}`;
    const inputStatementName = `INPUT_STATEMENT_${caseIndex}`;
    const valueInputCase = this.appendValueInput(inputValueCaseName)
      .appendField(new Blockly.FieldImage(
        buttonRemove, 15, 15,`DELETE_CASE_${this.caseIndex}`,(p1) =>{this.deleteCase(caseIndex)}
      ),`FIELD_IMAGE_DELETE_CASE_${this.caseIndex}`)        
      .appendField('Cuando sea')
    this.appendStatementInput(inputStatementName)
      .appendField('Hacer:');
    const shadowBlockValue = this.workspace.newBlock('c_value_number') as Blockly.BlockSvg;
    shadowBlockValue.setMovable(false);
    shadowBlockValue.setDeletable(false);
    shadowBlockValue.setFieldValue(this.caseIndex,'FIELD_NUMBER_VALUE');
    shadowBlockValue.outputConnection.connect(valueInputCase.connection!);
    shadowBlockValue.initSvg();
    
    this.moveInputBefore(inputValueCaseName,'INPUT_DUMMY_CASE_CONTROL');
    this.moveInputBefore(inputStatementName,'INPUT_DUMMY_CASE_CONTROL');

    if(this.getInput('INPUT_STATEMENT_CASE_DEFAULT') && this.getInput('INPUT_STATEMENT_CASE_DEFAULT') ){
      this.moveInputBefore(inputValueCaseName,'INPUT_DUMMY_CASE_DEFAULT');
      this.moveInputBefore(inputStatementName,'INPUT_DUMMY_CASE_DEFAULT');
    }
  },
  //Método para añadir casos de switch
  addCase: function() {
    this.appendCaseInputs(this.caseIndex);
    this.caseIndexArray.push(this.caseIndex);
    this.caseIndex++;
  },
  //Método para actualizar forma de caso por defecto
  updateDefaultCaseShape: function(isDefaultCaseEnabled: boolean){
    this.setFieldValue(!isDefaultCaseEnabled ? buttonBlockPlus : buttonBlockMinus,'FIELD_IMAGE_CASE_DEFAULT_CONTROL');
    this.setFieldValue(!isDefaultCaseEnabled ? 'Agregar caso por defecto' : 'Eliminar caso por defecto','FIELD_LABEL_CASE_DEFAULT_CONTROL')

    if(isDefaultCaseEnabled){
      if(!this.getInput('INPUT_DUMMY_CASE_DEFAULT')){
        this.appendDummyInput("INPUT_DUMMY_CASE_DEFAULT")
          .appendField('Por defecto');
        this.moveInputBefore('INPUT_DUMMY_CASE_DEFAULT','INPUT_DUMMY_CASE_CONTROL');
      }
      if(!this.getInput('INPUT_STATEMENT_CASE_DEFAULT')){
        this.appendStatementInput('INPUT_STATEMENT_CASE_DEFAULT')
          .appendField('Hacer:');
        this.moveInputBefore('INPUT_STATEMENT_CASE_DEFAULT','INPUT_DUMMY_CASE_CONTROL');
      }
    }else{
      if(this.getInput('INPUT_DUMMY_CASE_DEFAULT'))
        this.removeInput('INPUT_DUMMY_CASE_DEFAULT')
      if(this.getInput('INPUT_STATEMENT_CASE_DEFAULT'))
        this.removeInput('INPUT_STATEMENT_CASE_DEFAULT')
    }
  },
  //Método para activar o desactivar caso por defecto
  toggleDefaultCase: function(){
    this.isDefaultCaseEnabled = !this.isDefaultCaseEnabled;
    this.updateDefaultCaseShape(this.isDefaultCaseEnabled);
  },
  //Método para eliminar caso de switch
  deleteCase(caseIndexName) {
    this.removeInput(`INPUT_VALUE_CASE_${caseIndexName}`);
    this.removeInput(`INPUT_STATEMENT_${caseIndexName}`);
    this.caseIndexArray.splice(this.caseIndexArray.indexOf(caseIndexName),1);
    //Reiniciar el caseIndex al menor valor de caseIndexArray
    this.caseIndex = -1;
    this.caseIndexArray.forEach(value =>{
      if(this.caseIndex < value)
        this.caseIndex = value;
    })
    this.caseIndex++;
  },
  //Método para guardar estado de bloque
  saveExtraState() {
    return {
      'caseIndex': this.caseIndex,
      'caseIndexArray': this.caseIndexArray,
      'isDefaultCaseEnabled': this.isDefaultCaseEnabled
    }
  },
  //Método para cargar estado de bloque
  loadExtraState(state){
    this.caseIndex = state.caseIndex || 0;
    this.caseIndexArray = state.caseIndexArray || [];
    this.isDefaultCaseEnabled = state.isDefaultCaseEnabled || false;
    this.caseIndexArray.forEach(value =>{
      this.appendCaseInputs(value);
    })
   this.updateDefaultCaseShape(this.isDefaultCaseEnabled);
  },
} as IBlockCConditionSwitch; 

//Generador de código del bloque
cGenerator.forBlock["c_condition_switch_cases"] = function(block,generator) {
  let casesCode = '';
  const blockSwitch = block as IBlockCConditionSwitch;
  blockSwitch.caseIndexArray.forEach((value,index) =>{
    casesCode += `case ${generator.valueToCode(block,`INPUT_VALUE_CASE_${value}`,0)}: {\n${generator.statementToCode(block,`INPUT_STATEMENT_${value}`)}\n  ${STRINGS_CODE_HTML_FORMAT.BREAK}${STRINGS_CODE_HTML_FORMAT.SEMICOLON}\n}${index == blockSwitch.caseIndexArray.length - 1 ? '' : '\n'}`;
  })

  
  
  if(block.getInput('INPUT_STATEMENT_CASE_DEFAULT') && block.getInput('INPUT_DUMMY_CASE_DEFAULT'))
    casesCode+= `\ndefault: {\n${generator.statementToCode(block,'INPUT_STATEMENT_CASE_DEFAULT')}\n  break;\n}`
  
  return casesCode;
}