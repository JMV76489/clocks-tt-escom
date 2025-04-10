/* -------------------------------------------------------------------------- */
/*                   Archivo de bloque de salida de variable                  */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { BlockC, BlockVariableDeclaration, BlockVariableOutput } from 'src/libs/interface/block-interface';
import { identifierValidator } from 'src/libs/validator';

//JSON de definición de bloque
export const c_variable_output = {
  "type": "c_variable_output",
  "tooltip": "Bloque para obtener o acceder al valor de una variable, dirección de memoria de un apuntador o instancia de una estructura.",
  "helpUrl": "",
  "message0": "%1 %2 %3",
  "args0": [
    {
      "type": "input_dummy",
      "name": "INPUT_DUMMY_LABEL"
    },
    {
      "type": "field_input",
      "name": "FIELD_INPUT_IDENTIFIER",
      "text": "identificador"
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

      //Asignar validador al campo de identificador
      const fieldInputIdentifier = this.getField("FIELD_INPUT_IDENTIFIER") as Blockly.FieldTextInput;
      fieldInputIdentifier?.setValidator(identifierValidator);

      //Reasignar función a onFinishingEdition_ para ejecutar una busqueda de variable cuando se termine de editar el campo
      fieldInputIdentifier.onFinishEditing_ = function(newValue: string){
        console.log("Actualizando identificador de bloque de salida de variable");
        const block = this.getSourceBlock() as BlockVariableOutput; 
        if(block.blockIdVariableDeclaration){
          //Borrar el id del bloque en el bloque de declaración que estaba usando y realizar una busqueda nueva de bloque de declaración
          const blockDeclaration = block.workspace.getBlockById(block.blockIdVariableDeclaration) as BlockVariableDeclaration;
          delete blockDeclaration.blocksIdUsingDeclaration[block.id];
        }
        block.searchDeclarationBlock();
        return newValue;
      }


      this.getInput('INPUT_DUMMY_LABEL')?.appendField(new Blockly.FieldLabelSerializable(''),'FIELD_LABEL_TYPE');
    },
    //Manejador de cambio de bloque
    onchange: function (event) {
      if (!this.workspace || this.isInFlyout) return; // Evita llamadas innecesarias
      if (event.type === Blockly.Events.BLOCK_MOVE || event.type == Blockly.Events.BLOCK_CHANGE) {
        const moveEvent = event as Blockly.Events.BlockMove;
        if(moveEvent.blockId){
          if (moveEvent.blockId === this.id) {
            this.searchDeclarationBlock();
          }else{
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
          const blockDeclaration = this.workspace.getBlockById(this.blockIdVariableDeclaration) as BlockVariableDeclaration;
          delete blockDeclaration?.blocksIdUsingDeclaration[this.id];
        }
      }
    },
    //Método para checar si la variable esta declarada
    checkDeclarationBlock: function(){
      this.setWarningText(this.blockIdVariableDeclaration ? null : 'Error variable no declarada');
    },
    //Método para buscar declaración de la variable
    searchDeclarationBlock: function(){
      this.setDeclarationBlockId(null);
      this.searchDeclarationOnParameters();
      this.searchDeclarationOnBlocks(this.getParent()!);
    },
    //Método para buscar declaración en parametros
    searchDeclarationOnParameters: function(){
      const rootBlock = this.getRootBlock() as BlockC as BlockVariableDeclaration;
      if(rootBlock.type == "c_function_definition"){
        const parametersInput = rootBlock.getInput('INPUT_STATEMENT_PARAMETERS');
        if(parametersInput && parametersInput.connection){
          let curBlock = parametersInput.connection.targetBlock() as BlockC;
          for(;curBlock!=null;curBlock=curBlock.nextConnection?.targetBlock() as BlockC){
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
        const blockDeclaration = this.workspace.getBlockById(this.blockIdVariableDeclaration) as BlockVariableDeclaration;
        if(blockDeclaration){
          blockDeclaration.blocksIdUsingDeclaration[this.id] = this.id;
          this.setBlockStyleDeclaration(blockDeclaration.getFieldValue('FIELD_DROPDOWN_DECLARATION_ITEM'));
        }
      }
      this.checkDeclarationBlock();
    },
} as BlockVariableOutput;

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
  },
} as BlockVariableOutput)

//Generador de código del bloque
cGenerator.forBlock["c_variable_output"] = function(block) {
  return [block.getFieldValue('FIELD_INPUT_IDENTIFIER').toString(),0];
}