/* -------------------------------------------------------------------------- */
/*                      Archivo de bloque de condición if                     */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { buttonBlockMinus, buttonBlockPlus } from 'src/assets/assets';
import { cGenerator } from 'src/generators/c';
import { IBlockCConditionIf } from 'src/utils/interface/c-condition-if';

//JSON de bloque de condición if
const cConditionIf = {
  "type": "c_condition_if",
  "tooltip": "Bloque para verificar una condición y ejecutar un conjunto de bloques en caso de cumplirse.",
  "helpUrl": "https://www.freecodecamp.org/espanol/news/sentencia-if-else-en-c-explicada/",
  "message0": "Sí %1 Entonces %2 %3 %4",
  "args0": [
    {
      "type": "input_value",
      "name": "INPUT_VALUE_CONDITION"
    },
    {
      "type": "input_statement",
      "name": "INPUT_STATEMENT_THEN",
      "check": "Procedure"
    },
    {
      "name": "FIELD_IMAGE_TOGGLE_ELSE",
      "type": "field_image",
      "src": buttonBlockPlus,
      "width": 15,
      "height": 15,
      "alt": "Button toggle else",
      "flipRtl": "FALSE"
    },
    {
      "type": "input_dummy",
      "name": "INPUT_FIELD_IMAGE_TOGGLE_ELSE"
    },
  ],
  "previousStatement": "Procedure",
  "nextStatement": "Procedure",
  "inputsInline": true,
  "style": 'c_condition_blocks',
}

//Registro de bloque if
Blockly.Blocks["c_condition_if"]  = {
  init: function(this: IBlockCConditionIf){

    //Inicializar bloque con JSON
    this.jsonInit(cConditionIf);

    this.haveElse = false; //Booleano para controlar la existencia de else

    //Obtener boton de agregar y quitar else
    const buttonToggleElse = this.getField("FIELD_IMAGE_TOGGLE_ELSE") as Blockly.FieldImage;

    //Asignar funcion a boton de agregar y quitar else
    buttonToggleElse.setOnClickHandler(() =>{
      this.toggleElse();
    });
    
  },
  //Función de guardado de estado
  saveExtraState: function(this: IBlockCConditionIf){
    return {'haveElse': this.haveElse};
  },

  //Función de cargado de estado
  loadExtraState: function(this: IBlockCConditionIf,state: {[key:string]:any}){
    this.haveElse = state.haveElse || false; //Cargar valor almacenado de haveElse_
    this.updateShape(); //Actualizar forma al cargar
  },

  //Función de actualización de forma de bloque
  updateShape: function(this: IBlockCConditionIf){

    const fieldImageToggleElse = this.getField('FIELD_IMAGE_TOGGLE_ELSE'); //Boton de conmutación de else

    //Colocar o remover la sentencia else del bloque dependiendo del booleano "haveElse_"
    if(this.haveElse){
      if(!this.getInput('INPUT_ELSE_STATEMENT')){
        this.appendStatementInput('INPUT_ELSE_STATEMENT')
        .appendField(new Blockly.FieldLabel('Si no'))
        fieldImageToggleElse?.setValue(buttonBlockMinus);
      }
    }else{
      if(this.getInput('INPUT_ELSE_STATEMENT')){
        this.removeInput('INPUT_ELSE_STATEMENT')
        fieldImageToggleElse?.setValue(buttonBlockPlus);
      }
    }
  },

  //Función de conmutación de else
  toggleElse: function(this: IBlockCConditionIf){
    this.haveElse = !this.haveElse;
    this.updateShape();
  }
}   

//Generador de código del bloque
cGenerator.forBlock["c_condition_if"] = function(block,generator) {
  //Obtener códigos de entradas y campos
  const conditionCode = generator.valueToCode(block,'INPUT_VALUE_CONDITION',0);
  const statementThenCode = generator.statementToCode(block,'INPUT_STATEMENT_THEN');
  const statementElseCode = block.getInput('INPUT_ELSE_STATEMENT') ? generator.statementToCode(block,'INPUT_ELSE_STATEMENT') : null;
  
  return `if(${conditionCode}){\n${statementThenCode}\n}${statementElseCode!= null ? `\nelse{\n${statementElseCode}\n}` : ''}`;
}