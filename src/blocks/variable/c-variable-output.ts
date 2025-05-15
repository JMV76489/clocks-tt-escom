/* -------------------------------------------------------------------------- */
/*                   Archivo de bloque de salida de variable                  */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { IBlockCVariableOutput } from 'src/utils/interface/c-variable-output';
import { IBlockCVariableDeclaration } from 'src/utils/interface/c-variable-declaration';
import { identifierDeclarationFieldValidator } from 'src/utils/validator';
import { CIdentifierFieldTextInput } from 'src/utils/blockly-custom/field/CIdentifierFieldTextInput';
import { buttonBlockMinus, buttonBlockPlus } from 'src/assets/assets';

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

      this.haveArrayIndexInput = true; //Inicializar el bloque con el input de índice de arreglo

      this.getInput('INPUT_DUMMY_VARIABLE_OUTPUT')?.
      appendField(new CIdentifierFieldTextInput('identificador',identifierDeclarationFieldValidator), 'FIELD_INPUT_IDENTIFIER');

      //Asignar validador al campo de identificador
      const fieldInputIdentifier = this.getField("FIELD_INPUT_IDENTIFIER") as Blockly.FieldTextInput;
      fieldInputIdentifier?.setValidator(identifierDeclarationFieldValidator);

      
      this.getInput('INPUT_DUMMY_LABEL')?.appendField(new Blockly.FieldLabelSerializable('Valor de'),'FIELD_LABEL_TYPE');
    },
    //Manejador de cambio de bloque
    onchange: function (event) {
      if (!this.workspace || this.isInFlyout) return; // Evita llamadas innecesarias
      //Verifica si el evento es de creación de bloque o de movimiento de bloque
      if (event.type === Blockly.Events.BLOCK_MOVE) {
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
      this.setWarningText(this.blockIdVariableDeclaration ? null : `No se encuentra "${this.getFieldValue('FIELD_INPUT_IDENTIFIER')}" dentro del alcance.`);
      if(!this.blockIdVariableDeclaration){
        this.getField('FIELD_LABEL_TYPE')?.setValue(''); 
      }
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

      //Asignar nombre de tipo de elemento al que se está accediendo
      if(this.itemTypeNameDeclaration!= itemDeclarationName){
        this.itemTypeNameDeclaration = itemDeclarationName;
      }

      if(itemDeclarationName != 'ARRAY'){
        //Eliminar input de índice de arreglo
        this.haveArrayIndexInput = true;
        this.updateBlockShape();
      }

      switch(itemDeclarationName){
        case 'VARIABLE':{
          this.getField('FIELD_LABEL_TYPE')?.setValue('Valor de');
          this.setStyle('c_variable_blocks');
          break;
        }
        case 'POINTER':{
          this.getField('FIELD_LABEL_TYPE')?.setValue('Dirección apuntado por');
          this.setStyle('c_pointer_blocks');
          break;
        }
        case 'INSTANCE':{
          this.getField('FIELD_LABEL_TYPE')?.setValue('Instancia de');
          this.setStyle('c_struct_blocks');
          break;
        }
        case 'ARRAY':{
          if(this.haveArrayIndexInput){
            this.getField('FIELD_LABEL_TYPE')?.setValue('Valor de arreglo');
          }else{
            this.getField('FIELD_LABEL_TYPE')?.setValue('Arreglo');
          }
          this.setStyle('c_variable_blocks');
          this.updateBlockShape();
          break;
        }
      }
    },
    //Método para asignar bloque de declaración
    setDeclarationBlockId: function(blockDeclarationId){
      
      this.blockIdVariableDeclaration = blockDeclarationId;
      if(this.blockIdVariableDeclaration){
        //Agregar ID del bloque al diccionario de bloques que usan la declaración del bloque de declaración asignado
        const blockDeclaration = this.workspace.getBlockById(this.blockIdVariableDeclaration) as IBlockCVariableDeclaration;
        if(blockDeclaration){
          blockDeclaration.blocksIdUsingDeclaration[this.id] = this.id;
          this.setBlockStyleDeclaration(blockDeclaration.getFieldValue('FIELD_DROPDOWN_DECLARATION_ITEM'));
        }
      }
      this.checkDeclarationBlock();
    },
    //Método para actualizar la forma del bloque
    updateBlockShape: function(){
      if(this.itemTypeNameDeclaration == 'ARRAY'){
        if(!this.getInput('INPUT_TOGGLE_INDEX')){
          const fieldImageToggleIndex = new Blockly.FieldImage(buttonBlockMinus, 20, 20, 'Alternar índice de arreglo');
          //Agregar input de índice de arreglo
          this.appendDummyInput('INPUT_TOGGLE_INDEX')
          .appendField(fieldImageToggleIndex, 'FIELD_TOGGLE_INDEX');
          fieldImageToggleIndex.setOnClickHandler(this.toggleArrayIndexInput.bind(this));
        }
        if(this.haveArrayIndexInput){
          if(!this.getInput('INPUT_VALUE_INDEX')){
            this.getField('FIELD_LABEL_TYPE')?.setValue('Valor de arreglo');
            const inputIndex = this.appendValueInput('INPUT_VALUE_INDEX');
            //Agregar input de índice de arreglo
            inputIndex.appendField('en');
            if(inputIndex){
              if(!inputIndex.connection?.targetBlock()){
                const shadowBlock = this.workspace.newBlock('c_value_number');
                shadowBlock.setShadow(true);
                shadowBlock.initSvg();
                inputIndex.connection?.connect(shadowBlock.outputConnection);
              }
            }
          }
        }else{
          //Eliminar input de índice de arreglo para hacer referencia al arreglo (apuntador) y no a uno de sus elementos
          if(this.getInput('INPUT_VALUE_INDEX')){
            this.getField('FIELD_LABEL_TYPE')?.setValue('Arreglo');
            //Eliminar input de índice de arreglo
            this.removeInput('INPUT_VALUE_INDEX');
          }
        }
      }else{
        if(this.getInput('INPUT_VALUE_INDEX')){
          //Eliminar input de índice de arreglo
          this.removeInput('INPUT_VALUE_INDEX');
        }
        if(this.getInput('INPUT_TOGGLE_INDEX')){
          //Eliminar input de botón de activación de índice de arreglo
          this.removeInput('INPUT_TOGGLE_INDEX');
        }
      }
    },
    toggleArrayIndexInput: function(){
      this.haveArrayIndexInput = !this.haveArrayIndexInput;
      this.updateBlockShape();

    }
} as IBlockCVariableOutput;

//Registrar mutator de declaración de variable
Blockly.Extensions.registerMutator('mutator_variable_output',{
  //Método de guardado de estado
  saveExtraState() {
    //Guardar id de bloque de declaración y nombre de estilo
    const state = {
      'blockIdVariableDeclaration': this.blockIdVariableDeclaration,
      'styleName': this.getStyleName(),
      'haveArrayIndexInput': this.haveArrayIndexInput,
      'itemTypeNameDeclaration': this.itemTypeNameDeclaration
    }
    return state ;
  },
  //Método de cargado de estado
  loadExtraState(state) {
    this.blockIdVariableDeclaration = state.blockIdVariableDeclaration || null;
    this.haveArrayIndexInput = state.haveArrayIndexInput || false;
    this.itemTypeNameDeclaration = state.itemTypeNameDeclaration || '';
    this.updateBlockShape();
    //Reasignar id bloque de declaración y nombre de estilo
    this.setStyle(state.styleName);
    this.checkDeclarationBlock();
  },
} as IBlockCVariableOutput)

//Generador de código del bloque
cGenerator.forBlock["c_variable_output"] = function(block) {
  const arrayIndexInput = block.getInput('INPUT_VALUE_INDEX');
  const arrayIndexCode = arrayIndexInput ? cGenerator.valueToCode(block,'INPUT_VALUE_INDEX',0) : '';
  return [`${block.getFieldValue('FIELD_INPUT_IDENTIFIER').toString()}${arrayIndexInput ? `[${arrayIndexCode}]` : ''}`,0];
}