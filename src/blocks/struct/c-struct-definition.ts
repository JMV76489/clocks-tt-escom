/* -------------------------------------------------------------------------- */
/*                Archivo de bloque de definición de estructura               */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockCStructDefinition } from 'src/utils/interface/c-struct-definition';
import { addDatatypeStruct, datatypesDict, removeDatatypeStruct, updateDatatypeStruct } from 'src/utils/datatype';
import { showWarningIdentifierToast } from 'src/utils/toast/toast';
import { identifierDeclarationFieldValidator } from 'src/utils/validator';
import { CIdentifierFieldTextInput } from 'src/utils/blockly-custom/field/CIdentifierFieldTextInput';

//JSON de definición de bloque
const cStructDefinition = {
  "type": "c_struct_definition",
  "tooltip": "Bloque para definir una estructura y encapsular variables en un solo conjunto.",
  "helpUrl": "https://sites.google.com/site/programacioniiuno/temario/unidad-2---tipo-abstracto-de-dato/estructuras-de-datos-definidas-por-el-usuario-en-c",
  "message0": "Definir estructura llamado: %1 Miembros: %2",
  "args0": [
    {
      "type": "input_dummy",
      "name": "INPUT_DUMMY_STRUCT"
    },
    {
      "type": "input_statement",
      "name": "INPUT_STATEMENT_MEMBERS",
      "check": "Declaration"
    }
  ],
  "style": 'c_struct_blocks'
}

//Registro de bloque
Blockly.Blocks["c_struct_definition"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cStructDefinition);

    this.structTag = 'etiqueta'; //Etiqueta por defecto
    this.structTagName = `STRUCT_${this.structTag.toLocaleUpperCase()}`; //Nombre por defecto de la etiqueta

    //Verificar si la etiqueta ya existe y si si, crear un nuevo nombre basado en el anterior
    if(datatypesDict["STRUCT"][this.structTagName]){
      let i = 1;
      let newTagName = this.structTagName + i;
      while(datatypesDict["STRUCT"][newTagName]){
        i++;
        newTagName = this.structTagName + i;
      }
      this.structTagName = newTagName;
      this.structTag = this.structTag + i;
    }

    console.log(this.structTagName);

    this.getInput('INPUT_DUMMY_STRUCT')?.
    appendField(new CIdentifierFieldTextInput(this.structTag,identifierDeclarationFieldValidator), 'FIELD_INPUT_TAG')


  },
  //Método de destrucción del bloque
  destroy: function(){
    //Eliminar tipo de dato de estructura al eliminar el bloque que no se encuentra en el flyout
    if(!this.isInFlyout){
        removeDatatypeStruct(this.structTagName);  
    }
  },
  onchange: function(event){
    //Verificar que solo existan bloques de declaración de variables en el struct
    const descendants = this.getDescendants(true); //Obtener bloques descendientes al bloque
    //Verificar cada descendiente
    descendants.forEach((curBlock,index) => {
      if(index == 0) return; //Saltar el bloque de declaración de la estructura
      //Verificar si no se trata de un bloque de declaración de variables
      if(curBlock.type != "c_variable_declaration" && !curBlock.isShadow()){
          curBlock.getChildren(true).forEach(block => {
          block.dispose();
        });
        
        curBlock.dispose(true);
        showWarningIdentifierToast("Solamente puedes unir bloques de declaración de variables dentro de este bloque y no puedes inicializarlos.")
      }
    });
  },
  //Método de guardado de estado
  saveExtraState: function(state: any) {
    return {
      'structTag': this.structTag,
      'structTagName': this.structTagName
    }
  },
  //Método de cargado de estado
  loadExtraState: function(state: any) {
    this.structTag = state.structTag || 'etiqueta';
    this.structTagName = state.structTagName || `STRUCT_${this.structTag.toLocaleUpperCase()}`;
    addDatatypeStruct(this.structTagName,this.structTag);
  }
} as IBlockCStructDefinition;

//Generador de código del bloque
cGenerator.forBlock["c_struct_definition"] = function(block,generator) {
  const tagCode = block.getFieldValue('FIELD_INPUT_TAG');
  return `typedef struct ${tagCode}{\n${generator.statementToCode(block,'INPUT_STATEMENT_MEMBERS')}\n}${tagCode}`;
}