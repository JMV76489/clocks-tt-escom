/* -------------------- Archivo de bloque de declaración de variable ------------------- */

import * as Blockly from 'blockly';
import { identifierDeclarationFieldValidator } from 'src/utils/validator';
import { datatypeInfoGetFromName, datatypeOptionsGenerator, arrayOptionsDeclarationItemVariable } from 'src/utils/datatype';
import { IBlockCVariableOutput } from 'src/utils/interface/c-variable-output';
import { BlockCVariableDeclarationMethods } from 'src/utils/interface/c-variable-declaration';
import { IBlockCVariableDeclaration } from 'src/utils/interface/c-variable-declaration';
import { cGenerator } from 'src/generators/c';
import { CIdentifierFieldTextInput } from 'src/utils/blockly-custom/field/CIdentifierFieldTextInput';

//Registro de bloque de declaración de variable
Blockly.Blocks["c_variable_declaration"] = {
  init: function(){
    /* --------------------------- Inicialización del bloque --------------------------- */
    this.appendValueInput('INPUT_VALUE_SET')
      .appendField('Declarar')
      .appendField(new Blockly.FieldDropdown(arrayOptionsDeclarationItemVariable,this.fieldDeclarationItemValidator), 'FIELD_DROPDOWN_DECLARATION_ITEM')
      .appendField(new Blockly.FieldLabel('de tipo'),'FIELD_LABEL_NEXUS')
      .appendField(
        new Blockly.FieldDropdown(function() {
        return datatypeOptionsGenerator(this.getSourceBlock() as IBlockCVariableDeclaration,'FIELD_DROPDOWN_DECLARATION_ITEM')
      },this.fieldDatatypeValidator), 'FIELD_DROPDOWN_DATATYPE')
      .appendField('llamado')
      .appendField(new CIdentifierFieldTextInput('identificador',identifierDeclarationFieldValidator), 'FIELD_INPUT_IDENTIFIER')
      .appendField('con');
    this.setPreviousStatement(true, ['Procedure','Declaration']);
    this.setNextStatement(true, ['Procedure','Declaration']);
    this.setTooltip('Bloque para declarar una variable, apuntador o instancia de estructura.');
    this.setHelpUrl('https://www.mikroe.com/ebooks/microcontroladores-pic-programacion-en-c-con-ejemplos/variables-y-constantes');
    this.setStyle('c_variable_blocks');
    /* -------------------------------------------------------------------------- */

    this.blocksIdUsingDeclaration = {}; //Diccionario de ID's de bloques que usan el bloque de declaración

    //Asignar validador al campo de identificador
    const fieldIdentifier = this.getField("FIELD_INPUT_IDENTIFIER") as CIdentifierFieldTextInput
  },
  ...BlockCVariableDeclarationMethods,
  //Validador de campo de elemento de declaración
  fieldDeclarationItemValidator : function(this: Blockly.FieldDropdown,newValue: string){
    const block = this.getSourceBlock() as IBlockCVariableDeclaration;
    switch(newValue){
      case 'VARIABLE': {
        block.setStyle('c_variable_blocks');
        block.setFieldValue('de tipo','FIELD_LABEL_NEXUS');
        break;
      }
      case 'POINTER': {
        block.setStyle('c_pointer_blocks');
        block.setFieldValue('hacia tipo','FIELD_LABEL_NEXUS');
        break;
      }
      case 'INSTANCE': {
        block.setStyle('c_struct_blocks');
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
cGenerator.forBlock["c_variable_declaration"] = function(block,generator) {
  const identifierCode = block.getFieldValue('FIELD_INPUT_IDENTIFIER');
  const datatypeCode = datatypeInfoGetFromName(block.getFieldValue('FIELD_DROPDOWN_DATATYPE'))?.code;
  const setValueCode = generator.valueToCode(block,'INPUT_VALUE_SET',0);
  return `<span class="codeVariable">${datatypeCode} ${block.getFieldValue('FIELD_DROPDOWN_DECLARATION_ITEM')=='POINTER' ? '*' : ''}${identifierCode}${setValueCode == '' ? '' : ` = ${setValueCode}`}</span>`;
}