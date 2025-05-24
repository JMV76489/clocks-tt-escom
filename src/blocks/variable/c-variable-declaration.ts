/* -------------------- Archivo de bloque de declaración de variable ------------------- */

import * as Blockly from 'blockly';
import { identifierDeclarationFieldValidator } from 'src/utils/validator';
import { datatypeInfoGetFromName, datatypeOptionsGenerator, arrayOptionsDeclarationItemVariable } from 'src/utils/datatype';
import { IBlockCVariableOutput } from 'src/utils/interface/c-variable-output';
import { BlockCVariableDeclarationMethods } from 'src/utils/interface/c-variable-declaration';
import { IBlockCVariableDeclaration } from 'src/utils/interface/c-variable-declaration';
import { cGenerator } from 'src/generators/c';
import { CIdentifierFieldTextInput } from 'src/utils/blockly-custom/field/CIdentifierFieldTextInput';
import { buttonBlockPlus } from 'src/assets/assets';

//Registro de bloque de declaración de variable
Blockly.Blocks["c_variable_declaration"] = {
  init: function(){
    /* --------------------------- Inicialización del bloque --------------------------- */
    this.appendDummyInput('INPUT_DUMMY')
      .appendField('Declarar')
      .appendField(new Blockly.FieldDropdown(arrayOptionsDeclarationItemVariable,this.fieldDeclarationItemValidator), 'FIELD_DROPDOWN_DECLARATION_ITEM')
      .appendField(new Blockly.FieldLabel('de tipo'),'FIELD_LABEL_NEXUS')
      .appendField(
        new Blockly.FieldDropdown(function() {
        return datatypeOptionsGenerator(this.getSourceBlock() as IBlockCVariableDeclaration,'FIELD_DROPDOWN_DECLARATION_ITEM')
      },this.fieldDatatypeValidator), 'FIELD_DROPDOWN_DATATYPE')
      .appendField('llamado')
      .appendField(new CIdentifierFieldTextInput('identificador',identifierDeclarationFieldValidator), 'FIELD_INPUT_IDENTIFIER');
    this.appendDummyInput('INPUT_DUMMY_TOGGLE_INITIALIZATION')
      .appendField(new Blockly.FieldImage(buttonBlockPlus, 20, 20, 'Agregar inicialización'), 'FIELD_BUTTON_INITIALIZE');
    this.setPreviousStatement(true, ['Procedure','Declaration']);
    this.setNextStatement(true, ['Procedure','Declaration']);
    this.setTooltip('Bloque para declarar una variable, apuntador o instancia de estructura.');
    this.setHelpUrl('https://www.mikroe.com/ebooks/microcontroladores-pic-programacion-en-c-con-ejemplos/variables-y-constantes');
    this.setStyle('c_variable_blocks')
    this.setInputsInline(true);
    /* -------------------------------------------------------------------------- */

    this.blocksIdUsingDeclaration = {}; //Diccionario de ID's de bloques que usan el bloque de declaración
    this.haveInitializationInput = false; //Inicializar el bloque con el input de inicialización
    this.haveArraySizeInput = false; //Inicializar el bloque con el input de índice de arreglo

    //Asginar función al boton de agregar inicialización
    const initializationButton = this.getField('FIELD_BUTTON_INITIALIZE') as Blockly.FieldImage;
    initializationButton.setOnClickHandler(() => {
      this.toggleInitializationInput();
    })
  },
  ...BlockCVariableDeclarationMethods,
  //Validador de campo de elemento de declaración
  fieldDeclarationItemValidator : function(this: Blockly.FieldDropdown,newValue: string){
    const block = this.getSourceBlock() as IBlockCVariableDeclaration;

    console.log(newValue);

    if(newValue != 'ARRAY'){
      block.haveArraySizeInput = false;
      block.updateArraySizeInput();
    }

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
      case 'ARRAY': {
        block.setStyle('c_variable_blocks');
        block.setFieldValue('de tipo','FIELD_LABEL_NEXUS');
        block.haveArraySizeInput = true;
        block.updateArraySizeInput();
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
  const initValueCode = block.getInput('INPUT_VALUE_INIT')? generator.valueToCode(block,'INPUT_VALUE_INIT',0) : '';
  const itemOption = block.getFieldValue('FIELD_DROPDOWN_DECLARATION_ITEM');
  const arraySizeCode = block.getInput('INPUT_VALUE_SIZE')?  generator.valueToCode(block,'INPUT_VALUE_SIZE',0) : '';

  return `${datatypeCode} ${itemOption=='POINTER' ? '*' : ''}${identifierCode}${itemOption=='ARRAY' ? `[${arraySizeCode}]` : ''}${(initValueCode == '' || block.getRootBlock()?.type == 'c_struct_definition'? '' : ` = ${initValueCode}`)}`;
}