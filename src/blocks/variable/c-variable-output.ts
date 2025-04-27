/* -------------------------------------------------------------------------- */
/*                   Archivo de bloque de salida de variable                  */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { IBlockCVariableOutput } from 'src/utils/interface/c-variable-output';
import { IBlockCVariableDeclaration } from 'src/utils/interface/c-variable-declaration';
import { identifierFieldValidator } from 'src/utils/validator';
import { CIdentifierFieldTextInput } from 'src/utils/blockly-custom/field/CIdentifierFieldTextInput';

//JSON de definición de bloque
export const c_variable_output = {
  "type": "c_variable_output",
  "tooltip": "Bloque para obtener o acceder al valor de una variable, dirección de memoria de un apuntador o instancia de una estructura.",
  "helpUrl": "",
  "message0": "%1 %2",
  "args0": [
    {
      "type": "input_dummy",
      "name": "INPUT_DUMMY_LABEL"
    },
    {
      "type": "input_dummy",
      "name": "INPUT_DUMMY_VARIABLE_OUTPUT"
    }
  ],
  "output": null,
  "inputsInline": true,
  "style": 'c_variable_blocks',
  "mutator": 'mutator_variable_output'
}

//Registro de bloque
Blockly.Blocks["c_variable_output"] = {
    init: function(){
      //Inicializar bloque con JSON
      this.jsonInit(c_variable_output);

      this.getInput('INPUT_DUMMY_VARIABLE_OUTPUT')?.
      appendField(new CIdentifierFieldTextInput('identificador',identifierFieldValidator), 'FIELD_INPUT_IDENTIFIER');

      //Asignar validador al campo de identificador
      const fieldInputIdentifier = this.getField("FIELD_INPUT_IDENTIFIER") as Blockly.FieldTextInput;
      fieldInputIdentifier?.setValidator(identifierFieldValidator);

      
      this.getInput('INPUT_DUMMY_LABEL')?.appendField(new Blockly.FieldLabelSerializable(''),'FIELD_LABEL_TYPE');
    },
    //Manejador de cambio de bloque
    onchange: function (event) {
      if (!this.workspace || this.isInFlyout) return; // Evita llamadas innecesarias
      //Verifica si el evento es de creación de bloque o de movimiento de bloque
      if (event.type === Blockly.Events.BLOCK_MOVE || event.type == Blockly.Events.BLOCK_CHANGE) {
        const moveEvent = event as Blockly.Events.BlockMove;
        //Verificar si el id del bloque existe
        if(moveEvent.blockId){
          //Buscar bloque de declaración de variable si el bloque de movimiento es el bloque de declaración de variable
          if (moveEvent.blockId == this.id) {
            this.searchDeclarationBlock();
          }else{
            //Buscar bloque de declaración de variable si el bloque de movimiento es un bloque hijo
            const blockMoved = this.workspace.getBlockById(moveEvent.blockId);
            if(blockMoved?.getDescendants(true).includes(this))
              this.searchDeclarationBlock();
          }
        }
      }
    },
    //Método que se llama cuando el bloque es eliminado
    destroy: function(){
      if(!this.isInFlyout){
        if(this.blockIdVariableDeclaration){
          const blockDeclaration = this.workspace.getBlockById(this.blockIdVariableDeclaration) as IBlockCVariableDeclaration;
          delete blockDeclaration?.blocksIdUsingDeclaration[this.id];
        }
      }
    },
    //Método para checar si la variable esta declarada
    checkDeclarationBlock: function(){
      this.setWarningText(this.blockIdVariableDeclaration ? null : `"${this.getFieldValue('FIELD_INPUT_IDENTIFIER')}" no esta declarado`);
    },
    //Método para buscar declaración de la variable
    searchDeclarationBlock: function(){
      this.setDeclarationBlockId(null);
      this.searchDeclarationOnParameters();
      this.searchDeclarationOnBlocks(this.getParent()!);
    },
    //Método para buscar declaración en parametros
    searchDeclarationOnParameters: function(){
      const rootBlock = this.getRootBlock() as IBlockC as IBlockCVariableDeclaration;
      if(rootBlock.type == "c_function_definition"){
        const parametersInput = rootBlock.getInput('INPUT_STATEMENT_PARAMETERS');
        if(parametersInput && parametersInput.connection){
          let curBlock = parametersInput.connection.targetBlock() as IBlockC;
          for(;curBlock!=null;curBlock=curBlock.nextConnection?.targetBlock() as IBlockC){
            if(
                curBlock.type == 'c_function_parameter' 
                && curBlock.getFieldValue('FIELD_INPUT_IDENTIFIER') == this.getFieldValue('FIELD_INPUT_IDENTIFIER')
              ){
                this.setDeclarationBlockId(curBlock.id);
            }
          }
        }
      }
    },
    //Método para buscar declaración de la variable en los bloques
    searchDeclarationOnBlocks: function(curBlock) {
      if(curBlock){
        /*Verificar si el bloque es un bloque de declaración de variable y si el identificador 
        es el mismo que el del bloque de salida de variable*/
        if(
            curBlock.type == 'c_variable_declaration' 
            && curBlock.getFieldValue('FIELD_INPUT_IDENTIFIER') == this.getFieldValue('FIELD_INPUT_IDENTIFIER')
          ){        
            this.setDeclarationBlockId(curBlock.id);
            return;
        }
        this.searchDeclarationOnBlocks(curBlock.getParent());
      }
    },
     //Método para fijar el estilo del bloque con base al bloque de declaración
    setBlockStyleDeclaration(itemDeclarationName){
        switch(itemDeclarationName){
          case 'VARIABLE':{
            this.getField('FIELD_LABEL_TYPE')?.setValue('Valor de');
            this.setStyle('c_variable_blocks');
            break;
          }
          case 'POINTER':{
            this.getField('FIELD_LABEL_TYPE')?.setValue('dirección apuntado por');
            this.setStyle('c_pointer_blocks');
            break;
          }
          case 'INSTANCE':{
            this.getField('FIELD_LABEL_TYPE')?.setValue('instancia de');
            this.setStyle('c_struct_blocks');
            break;
          }
        }
    },
    //Método para asignar bloque de declaración
    setDeclarationBlockId: function(blockDeclarationId){
      
      this.blockIdVariableDeclaration = blockDeclarationId;
      if(this.blockIdVariableDeclaration){
        //Agergar ID del bloque al diccionario de bloques que usan la declaración del bloque de declaración asignado
        const blockDeclaration = this.workspace.getBlockById(this.blockIdVariableDeclaration) as IBlockCVariableDeclaration;
        if(blockDeclaration){
          blockDeclaration.blocksIdUsingDeclaration[this.id] = this.id;
          this.setBlockStyleDeclaration(blockDeclaration.getFieldValue('FIELD_DROPDOWN_DECLARATION_ITEM'));
        }
      }
      this.checkDeclarationBlock();
    },
} as IBlockCVariableOutput;

//Registrar mutator de declaración de variable
Blockly.Extensions.registerMutator('mutator_variable_output',{
  //Método de gaurdado de estado
  saveExtraState() {
    //Guardar id de bloque de declaración y nombre de estilo
    const state = {
      'blockIdVariableDeclaration': this.blockIdVariableDeclaration,
      'styleName': this.getStyleName()
    }
    return state ;
  },
  //Método de cargado de estado
  loadExtraState(state) {
    //Reasignar id bloque de declaración y nombre de estilo 
    this.blockIdVariableDeclaration = state.blockIdVariableDeclaration || null;
    this.setStyle(state.styleName);
    this.checkDeclarationBlock();
    console.log(this.blockIdVariableDeclaration)
  },
} as IBlockCVariableOutput)

//Generador de código del bloque
cGenerator.forBlock["c_variable_output"] = function(block) {
  return [block.getFieldValue('FIELD_INPUT_IDENTIFIER').toString(),0];
}