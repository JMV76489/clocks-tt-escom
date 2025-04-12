/* -------------------------------------------------------------------------- */
/*                  Archivo de bloque de parametro de función                 */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { identifierValidator } from 'src/utils/validator';
import { arrayOptionsDeclarationItemVariable, datatypeOptionsGenerator } from 'src/utils/datatype';
import { IBlockCVariableOutput } from 'src/utils/interface/c-variable-output';
import { BlockCVariableDeclarationMethods } from 'src/utils/interface/c-variable-declaration';
import { IBlockCVariableDeclaration } from 'src/utils/interface/c-variable-declaration';
import { cGenerator } from 'src/generators/c';

//Registro de bloque de declaración de variable
Blockly.Blocks["c_function_parameter"] = {
  init: function(){
    /* ------------------------ Inicialización del bloque ----------------------- */
    this.appendDummyInput('INPUT_DUMMY_PARAMETER_INFO')
      .appendField('Parametro que es')
      .appendField(new Blockly.FieldDropdown(arrayOptionsDeclarationItemVariable,this.fieldDeclarationItemValidator), 'FIELD_DROPDOWN_DECLARATION_ITEM')
      .appendField(new Blockly.FieldLabel('de tipo'),'FIELD_LABEL_NEXUS')
      .appendField(new Blockly.FieldDropdown(function() {return datatypeOptionsGenerator(this.getSourceBlock() as IBlockCVariableDeclaration,'FIELD_DROPDOWN_DECLARATION_ITEM')}), 'FIELD_DROPDOWN_DATATYPE')
      .appendField('llamado')
      .appendField(new Blockly.FieldTextInput('identificador',identifierValidator), 'FIELD_INPUT_IDENTIFIER');
    this.setPreviousStatement(true,'Parameter');
    this.setNextStatement(true, 'Parameter');
    this.setTooltip('Usa este bloque para declarar un parametro dentro de la definición de una función.');
    this.setHelpUrl('https://platzi.com/tutoriales/1968-funciones-c/7837-funciones-en-c-estructura-basica-de-una-funcion-en-c-y-como-llamar-una-funcion-en-otra-funcion-2/');
    this.setStyle('c_function_blocks');
    /* -------------------------------------------------------------------------- */

    //Asignar validador al campo de identificador
    const fieldIdentifier = this.getField("FIELD_INPUT_IDENTIFIER") as Blockly.FieldTextInput
    fieldIdentifier.onFinishEditing_ = function(newValue: string){
      const block = this.getSourceBlock() as IBlockCVariableDeclaration;
      block.updateIdentifier();
    }
  },
  ...BlockCVariableDeclarationMethods,
  //Validador de campo de elemento de declaración
  fieldDeclarationItemValidator : function(this: Blockly.FieldDropdown,newValue: string){
    const block = this.getSourceBlock() as IBlockCVariableDeclaration;
    switch(newValue){
      case 'VARIABLE': {
        block.setFieldValue('de tipo','FIELD_LABEL_NEXUS');
        break;
      }
      case 'POINTER': {
        block.setFieldValue('hacia tipo','FIELD_LABEL_NEXUS');
        break;
      }
      case 'INSTANCE': {
        block.setFieldValue('de','FIELD_LABEL_NEXUS');
        break;
      }
    }

    (this.getSourceBlock() as IBlockCVariableDeclaration).checkStructsDefined(newValue);

    for(let blockId in block.blocksIdUsingDeclaration){
      const curBlockUsingDeclaration = block.workspace.getBlockById(block.blocksIdUsingDeclaration[blockId]) as IBlockCVariableOutput;
      curBlockUsingDeclaration?.setBlockStyleDeclaration(newValue);
    }
    return newValue;

  },
} as IBlockCVariableDeclaration;

//Generador de código del bloque
cGenerator.forBlock["c_function_parameter"] = function(block,generator) {
  return ``;
}