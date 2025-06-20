/* -------------------------------------------------------------------------- */
/*              Archivo de bloque de inicialización de elementos              */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { buttonBlockMinus, buttonBlockPlus } from 'src/assets/assets';
import { cGenerator } from 'src/generators/c';
import { IBlockCElementsInitialization } from 'src/utils/interface/c-value-elements-initialization';

Blockly.Blocks['c_value_elements_initialization'] = {
  init: function () {
    /* ------------------------ Inicialización del bloque ------------------------ */
    const fieldImageAddElement = new Blockly.FieldImage(buttonBlockPlus, 20, 20, "Agregar elemento", this.addElement.bind(this));
    const fieldImageRemoveElement = new Blockly.FieldImage(buttonBlockMinus, 20, 20, "Eliminar elemento", this.removeElement.bind(this));
    this.appendDummyInput("INPUT_DUMMY_BUTTONS")
      .appendField(fieldImageAddElement)
      .appendField(fieldImageRemoveElement)
      .appendField('Elementos:');
    this.setStyle('c_value_blocks');
    this.setTooltip("Utiliza este bloque unicamente para inicializar los elementos de un arreglo o estructura.");
    this.setHelpUrl("");
    this.setOutput(true);
    this.setInputsInline(true);
    /* -----------------------------------  ----------------------------------- */

    this.elementsCount = 1; //Inicializa el contador de elementos
    this.updateShape(); //Actualiza la forma del bloque

  },
  //Función para añadir un nuevo elemento al bloque
  addElement: function () {
    this.elementsCount++;
    this.updateShape();
  },
  //Función para eliminar un elemento del bloque
  removeElement: function () {
    if(this.elementsCount > 1){
      this.elementsCount--;
      this.updateShape();
    }
  },
  //Función para actualizar la forma del bloque
  updateShape: function () {
    console.log(this.elementsCount);
    for (let i = 0; i < this.elementsCount; i++) {
      const curInputName = `INPUT_ELEMENT_${i}`;
      if(!this.getInput(curInputName)){
        const curInput = this.appendValueInput(curInputName);
        curInput.setCheck(null)
          .appendField(`[${i}]:`);
        if(!curInput.connection?.targetBlock()){
          const shadowBlock = this.workspace.newBlock('c_value_number');
          shadowBlock.setShadow(true);
          shadowBlock.initSvg();
          curInput?.connection?.connect(shadowBlock.outputConnection);
        }
      }
      const inputExcessName = `INPUT_ELEMENT_${this.elementsCount}`;
      if (this.getInput(inputExcessName)) {
        this.removeInput(inputExcessName);
      }
    }
  },
  //Función SaveExtraState para guardar el estado del bloque
  saveExtraState: function (state: any) {
    return {
      "elementsCount": this.elementsCount,
    };
  },
  //Función LoadExtraState para cargar el estado del bloque
  loadExtraState: function (state: any) {
    this.elementsCount = state.elementsCount || 1;
    this.updateShape();
  }
} as IBlockCElementsInitialization;

//Generador de código del bloque
cGenerator.forBlock['c_value_elements_initialization'] = function (block,generator) {

  let elementsCode = '';
  const blockElementsCount = (block as IBlockCElementsInitialization).elementsCount;
  for(let i = 0; i < blockElementsCount; i++) {
    const curInputName = `INPUT_ELEMENT_${i}`;
    if(block.getInput(curInputName)){
      elementsCode += generator.valueToCode(block, curInputName, 0);
      //Si no es el último elemento, añade una coma
      if(i < blockElementsCount - 1){
        elementsCode += ',';
      }
    }
  }

  return [`\{${elementsCode}\}`,0];
}
