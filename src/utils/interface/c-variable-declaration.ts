/* -------------------------------------------------------------------------- */
/*          Archivo de interfaz de bloque de declaración de variable          */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { arrayOptionsStruct } from '../datatype';
import { IBlockC } from './c-block';
import { IBlockCVariableOutput } from './c-variable-output';
import { buttonArrowLeft, buttonArrowRight, buttonBlockMinus, buttonBlockPlus } from 'src/assets/assets';

//Interfaz de bloque de declaración de variable
export interface IBlockCVariableDeclaration extends IBlockC {
  blocksIdUsingDeclaration: { [blockId: string]: string; }; //Diccionario de ID's de bloques que usan el bloque de declaración
  lastFieldDeclarationItemOption: string; //Ultima opción de tipo de dato seleccionada
  haveInitializationInput: boolean; //Bandera para verificar si el bloque tiene un input de inicialización
  haveArraySizeInput: boolean; //Bandera para verificar si el bloque tiene un input de índice de arreglo
  updateIdentifier(): void; //Método para actualizar identificador
  searchBlocksUsingDeclaration(): void; //Método para buscar bloques que usan la declaración de variable
  checkStructsDefined(newValue: string): void; //Método para verificar si hay estructuras definidas
  fieldDeclarationItemValidator(newValue: string): string; //Validador de campo de elemento de declaración
  fieldDatatypeValidator(newValue: string): string; //Validador de campo de tipo de dato
  updateArraySizeInput(): void; //Método para agregar campo de tamaño de arreglo
  toggleInitializationInput(): void; //Método para conmutar el input de inicialización
  updateInitializationBlockInput(): void; //Método para  actualizar el input de inicialización
}

//Métodos de Bloque de declaración de variables
export const BlockCVariableDeclarationMethods = {
  //Método para actualizar identificador
  updateIdentifier: function () {
    //Actualizar campo de itentificador de los bloques que usan el bloque de declaración
    for (let blockId in this.blocksIdUsingDeclaration) {
      const curBlockUsingDeclaration = this.workspace.getBlockById(this.blocksIdUsingDeclaration[blockId]);
      curBlockUsingDeclaration?.setFieldValue(this.getFieldValue('FIELD_INPUT_IDENTIFIER'), 'FIELD_INPUT_IDENTIFIER');
    }

    //Buscar bloques que usen la declaración
    this.searchBlocksUsingDeclaration();
  },
  //Manejador de cambio de bloque de declaración de variable
  onchange: function (event) {
    if (!this.workspace || this.isInFlyout) return;

    //Actualizar campo de tipo de dato dependiendo del valor de campo de elemento de declaración
    const fieldDeclarationItemOption = this.getFieldValue('FIELD_DROPDOWN_DECLARATION_ITEM');
    const fieldDeclarationDatatypeOptions = (this.getField('FIELD_DROPDOWN_DATATYPE') as Blockly.FieldDropdown as Blockly.FieldDropdown).getOptions();

    if (this.lastFieldDeclarationItemOption != fieldDeclarationItemOption) {
      this.lastFieldDeclarationItemOption = fieldDeclarationItemOption;

      this.setFieldValue(fieldDeclarationDatatypeOptions[0][1], 'FIELD_DROPDOWN_DATATYPE');
    }

    /* ------------------------- Verificación de eventos ------------------------ */
    const moveEvent = event as Blockly.Events.BlockMove;
    const changeEvent = event as Blockly.Events.BlockChange;
    const createEvent = event as Blockly.Events.BlockCreate;

    //Verificar si el evento es de movimiento o cambio de bloque
    if (event.type === Blockly.Events.BLOCK_MOVE 
      || (event.type == Blockly.Events.BLOCK_CHANGE 
      && changeEvent.element === 'disabled')) {
      //Verificar si el bloque del evento es el bloque de declaración de variable
      if (moveEvent.blockId || changeEvent.blockId) {
        if (moveEvent.blockId === this.id || changeEvent.blockId === this.id){
          /*Cambiar la conexión dependiendo del bloque ráiz, para que el bloque pueda unicamente
          aceptar un bloque de declaración o tambíen aceptar otro bloque de procedimiento
          *
          *Bloque de definición de estructura: unicamente aceptar bloques de declaración
          *Cualquier otra: aceptar bloques de declaración y de procedimiento
          *
          */
          if (this.type == "c_variable_declaration") {
            if (this.getRootBlock().type == "c_struct_definition") {
              this.setNextStatement(true, "Declaration");
              this.setPreviousStatement(true, "Declaration");
            } else {
              this.setNextStatement(true, ['Procedure', 'Declaration']);
              this.setPreviousStatement(true, ['Procedure', 'Declaration']);
            }
          }
          //Eliminar los bloques que usan la declaración de variable del diccionario de bloques que usan la declaración
          for (let blockId in this.blocksIdUsingDeclaration) {
            const curBlock = this.workspace.getBlockById(this.blocksIdUsingDeclaration[blockId]) as IBlockCVariableOutput;
            curBlock?.setDeclarationBlockId(null);
          }
          //Limpiar el diccionario de bloques que usan la declaración de variable y buscar nuevamente
          this.blocksIdUsingDeclaration = {};
          this.searchBlocksUsingDeclaration();
        }
      }
    } else {
      //Verificar si el evento es de creación de bloque
      if(event.type === Blockly.Events.BLOCK_CREATE){
        /* 
        Si el evento es de creación de bloque, limpiar el diccionario de bloques que usan la declaración
        por alguna extraña razon el diccionario no se limpia al inicializar el bloque si este fue duplicado
        de otro
        */
        if(createEvent.blockId == this.id){
          this.blocksIdUsingDeclaration = {};
        }
      }
    }
  },
  //Método que se llama cuando el bloque es eliminado
  destroy: function () {
    if (!this.isInFlyout) {
      for (let blockId in this.blocksIdUsingDeclaration) {
        const curBlock = this.workspace.getBlockById(this.blocksIdUsingDeclaration[blockId]) as IBlockCVariableOutput;
        curBlock?.setDeclarationBlockId(null);
        curBlock?.searchDeclarationBlock();

      }
    }
  },
  //Método para buscar bloques usando la declaración de variable
  searchBlocksUsingDeclaration: function () {
    /*Fijar bloques de busqueda a descendientes si se trata de un bloque de declaración de variable
    o a los padres si se trata de un bloque de parametro*/
    const descendants = this.type == "c_variable_declaration" ? this.getDescendants(true) : this.getParent()?.getDescendants(true);
    (descendants as IBlockC[])?.forEach((block: IBlockC) => {
      if (block.type == 'c_variable_output') {
        if (block.getFieldValue('FIELD_INPUT_IDENTIFIER') == this.getFieldValue('FIELD_INPUT_IDENTIFIER')) {
          //Verificar que el bloque aun no este registrado en el diccionarios de bloques utilizando la declaración
          if (!this.blocksIdUsingDeclaration[block.id]) {
            (block as IBlockCVariableOutput).setDeclarationBlockId(this.id);
          }
        }
      }
    });
  },
  //Función de guardado de estado
  saveExtraState() {
    const state = {
      'blocksIdUsingDeclaration': this.blocksIdUsingDeclaration,
      'lastFieldDeclarationItemOption': this.lastFieldDeclarationItemOption,
      'haveInitializationInput': this.haveInitializationInput,
      'haveArrayIndexInput': this.haveArraySizeInput
    };
    return state;
  },
  //Función de cargado de estado
  loadExtraState(state) {
    this.blocksIdUsingDeclaration = state.blocksIdUsingDeclaration || {};
    this.lastFieldDeclarationItemOption = state.lastFieldDeclarationItemOption || this.getFieldValue('FIELD_DROPDOWN_DECLARATION_ITEM');
    this.haveInitializationInput = state.haveInitializationInput || false;
    this.haveArraySizeInput = state.haveArrayIndexInput || false;
    this.updateInitializationBlockInput();
    this.updateArraySizeInput();
  },
  //Método para verificar si hay estructuras
  checkStructsDefined: function (newValue: string) {
    if (newValue == 'INSTANCE') {
      if (arrayOptionsStruct.length == 0)
        this.setWarningText('No hay ninguna estructura definida.');

      else
        this.setWarningText(null);
    }
    else
      this.setWarningText(null);
  },
  //Método para agregar campo de tamaño de arreglo
  updateArraySizeInput: function () {
    if(this.haveArraySizeInput){
      if(!this.getInput('INPUT_VALUE_SIZE')) {
        const sizeValueInput = this.appendValueInput('INPUT_VALUE_SIZE');
        sizeValueInput.appendField('de tamaño');
        this.setInputsInline(true);
        this.moveInputBefore('INPUT_VALUE_SIZE', 'INPUT_DUMMY_TOGGLE_INITIALIZATION');

        //Agregar bloque de sombra para el input de tamaño si no hay bloque conectado
        if(!sizeValueInput.connection?.targetBlock()){
          const shadowBlock = this.workspace.newBlock('c_value_number');
          shadowBlock.setShadow(true);
          shadowBlock.setFieldValue('1', 'FIELD_NUMBER_VALUE');
          shadowBlock.initSvg();
          sizeValueInput.connection?.connect(shadowBlock.outputConnection);
        }
      }
    }else{
      if(this.getInput('INPUT_VALUE_SIZE')) {
        this.removeInput('INPUT_VALUE_SIZE');
      }
    }
  },
  //Método para agregar el input de inicialización
  toggleInitializationInput: function () {
    this.haveInitializationInput = !this.haveInitializationInput;
    this.updateInitializationBlockInput();
    if(this.haveInitializationInput){
      const initValueInput = this.getInput('INPUT_VALUE_INIT');
      if(initValueInput){
        const shadowBlock = this.workspace.newBlock('c_value_number');
        shadowBlock.setShadow(true);
        shadowBlock.setFieldValue('0', 'FIELD_NUMBER_VALUE');
        shadowBlock.initSvg();
        initValueInput.connection?.connect(shadowBlock.outputConnection);
      }
    }
  },
  //Método para agregar el input de inicialización
  updateInitializationBlockInput: function () {
    const initializationButton = this.getField('FIELD_BUTTON_INITIALIZE') as Blockly.FieldImage;
    if (this.haveInitializationInput) {
      if (!this.getInput('INPUT_VALUE_INIT')) {
        const initValueInput = this.appendValueInput('INPUT_VALUE_INIT');
        initValueInput.appendField('con');
        this.setInputsInline(true);
        initializationButton.setValue(buttonBlockMinus);
      }
    }else{
      if (this.getInput('INPUT_VALUE_INIT')) {
        this.removeInput('INPUT_VALUE_INIT');
        initializationButton.setValue(buttonBlockPlus);
      }
    }
  }
} as IBlockCVariableDeclaration;

