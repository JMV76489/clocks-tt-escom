/* -------------------------------------------------------------------------- */
/*                 Archivo de bloque de definición de función                 */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { BlockCVariableDeclarationMethods } from 'src/utils/interface/c-variable-declaration';
import { IBlockCVariableDeclaration } from 'src/utils/interface/c-variable-declaration';
import { STRINGS_CODE_HTML_FORMAT } from 'src/utils/constants';
import { arrayOptionsDeclarationItemFunction, arrayOptionsPrimitive, datatypeInfoGetFromName, datatypeOptionsGenerator} from 'src/utils/datatype';
import { identifierValidator } from 'src/utils/validator';

//JSON de definición de bloque
export const cFunctionDefinition = {
"type": "c_function_definition",
  "tooltip": "Bloque para definir una función.",
  "helpUrl": "https://www.it.uc3m.es/pbasanta/asng/course_notes/functions_es.html",
  "message0": "Función llamado %1 que devuelve %2 de tipo %3 %4 Parametros: %5 Cuerpo: %6",
  "args0": [
    {
      "type": "field_input",
      "name": "FIELD_INPUT_IDENTIFIER",
      "text": "identificador"
    },
    {
      "type": "field_dropdown",
      "name": "FIELD_DROPDOWN_RETURN_ITEM",
      "options": arrayOptionsDeclarationItemFunction
    },
    {
      "type": "field_dropdown",
      "name": "FIELD_DROPDOWN_DATATYPE",
      "options": arrayOptionsPrimitive
    },
    {
      "type": "input_dummy",
      "name": "INPUT_DUMMY_INFO"
    },
    {
      "type": "input_statement",
      "name": "INPUT_STATEMENT_PARAMETERS",
      "check": "Parameter"
    },
    {
      "type": "input_statement",
      "name": "INPUT_STATEMENT_BODY",
      "check": "Procedure"
    }
  ],
  "style": 'c_function_blocks'
}

//Registro de bloque
Blockly.Blocks["c_function_definition"] = {
  init: function(){
    this.appendDummyInput('INPUT_DUMMY_INFO')
      .appendField('Función llamado')
      .appendField(new Blockly.FieldTextInput('identificador',identifierValidator), 'FIELD_INPUT_IDENTIFIER')
      .appendField('que devuelve')
      .appendField(new Blockly.FieldDropdown(arrayOptionsDeclarationItemFunction,this.fieldDeclarationItemValidator), 'FIELD_DROPDOWN_RETURN_ITEM')
      .appendField(new Blockly.FieldLabel('de tipo'),'FIELD_LABEL_NEXUS')
      .appendField(new Blockly.FieldDropdown(function(){return datatypeOptionsGenerator(this.getSourceBlock() as IBlockC,'FIELD_DROPDOWN_RETURN_ITEM')}), 'FIELD_DROPDOWN_DATATYPE');
    this.appendStatementInput('INPUT_STATEMENT_PARAMETERS')
      .appendField('Parametros:')
      .setCheck('Parameter');
    this.appendStatementInput('INPUT_STATEMENT_BODY')
      .appendField('Cuerpo:')
      .setCheck('Procedure');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(225);
    this.setStyle('c_function_blocks');

    //Poner gorra al bloque
    this.hat = "cap"; 

  },
  checkStructsDefined: BlockCVariableDeclarationMethods.checkStructsDefined,
  //Se encarga de cambiar el texto del bloque dependiendo del tipo de declaración
  fieldDeclarationItemValidator : function(this: Blockly.FieldDropdown,newValue) {
    const block = this.getSourceBlock() as IBlockCVariableDeclaration;

    if(newValue == 'VOID'){
      if(block.getField('FIELD_DROPDOWN_DATATYPE')){
        block.getInput("INPUT_DUMMY_INFO")?.removeField("FIELD_DROPDOWN_DATATYPE");
        block.setFieldValue('','FIELD_LABEL_NEXUS');
      }
    }else{
      if(!block.getField('FIELD_DROPDOWN_DATATYPE')){
        block.getInput("INPUT_DUMMY_INFO")?.appendField(new Blockly.FieldDropdown(function(){return datatypeOptionsGenerator(this.getSourceBlock() as IBlockC,'FIELD_DROPDOWN_RETURN_ITEM')}), 'FIELD_DROPDOWN_DATATYPE');
        block.setFieldValue('','FIELD_LABEL_NEXUS');
      }
    }

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
  },
} as IBlockCVariableDeclaration;

//Generador de código del bloque 
cGenerator.forBlock["c_function_definition"] = function(block,generator) {
  //Obtener código de campos
  const identifierCode = block.getFieldValue('FIELD_INPUT_IDENTIFIER');
  const datatypeReturnCode = block.getField('FIELD_DROPDOWN_DATATYPE') ? datatypeInfoGetFromName(block.getFieldValue('FIELD_DROPDOWN_DATATYPE'))!.code : '';
  const statementCode = generator.statementToCode(block,'INPUT_STATEMENT_BODY');

  //Generar código de parametros
  let parametersCode = "";
  let curConnection = block.getInput('INPUT_STATEMENT_PARAMETERS')?.connection;
  while(curConnection){
    const curBlockParameter = curConnection.targetBlock();
    if(curBlockParameter?.type == "c_function_parameter"){
      const identifierCode = curBlockParameter.getFieldValue('FIELD_INPUT_IDENTIFIER');
      const datatypeCode = datatypeInfoGetFromName(curBlockParameter.getFieldValue('FIELD_DROPDOWN_DATATYPE'))!.code;
      curConnection = curBlockParameter?.nextConnection;
      parametersCode +=  `${datatypeCode} ${block.getFieldValue('FIELD_DROPDOWN_DECLARATION_ITEM')=='POINTER' ? '*' : ''}${identifierCode}${curConnection?.targetBlock() ? STRINGS_CODE_HTML_FORMAT.COMMA : ''}`;
    }else
      break;
  }
  return `${block.getFieldValue('FIELD_DROPDOWN_RETURN_ITEM') == 'VOID' ? 'void' : datatypeReturnCode} ${block.getFieldValue('FIELD_DROPDOWN_RETURN_ITEM')=='POINTER' ? '*' : ''}${identifierCode}(${parametersCode}){\n${statementCode}\n}`;
}