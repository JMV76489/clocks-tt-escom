/* -------------------------------------------------------------------------- */
/*                   Archivo de bloque de llamada de función                  */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { buttonBlockMinus, buttonBlockOutput, buttonBlockPlus, buttonBlockStatement } from 'src/assets/assets';
import { cGenerator } from 'src/generators/c';
import { IBlockCFunctionCall } from 'src/utils/interface/c-function-call';
import { identifierValidator } from 'src/utils/validator';

//JSON de blqoue de llamada de función
export const c_function_call = {
    "type": "c_function_call",
    "tooltip": "Bloque para llamar una función u obtener el valor devuelto por esta.",
    "helpUrl": "https://platzi.com/tutoriales/1968-funciones-c/7837-funciones-en-c-estructura-basica-de-una-funcion-en-c-y-como-llamar-una-funcion-en-otra-funcion-2/",
    "message0": "%1 %2 %3 %4 con parametros: %5 %6 %7",
    "args0": [
      {
        "type": "field_image",
        "name": "FIELD_IMAGE_TOGGLE_OUTPUT",
        "src": buttonBlockOutput,
        "width": 18,
        "height": 18,
        "alt": "Button toggle output",
        "flipRtl": "FALSE"
      },
      {
        "type": "field_label",
        "name": "FIELD_LABEL_FUNCTION",
        "text": "Llamar función"
      },
      {
        "type": "field_input",
        "name": "FIELD_INPUT_IDENTIFIER",
        "text": "identificador"
      },
      {
        "type": "input_dummy",
        "name": "INPUT_DUMMY_IDENTIFIER"
      },
      {
        "type": "field_image",
        "name": "FIELD_IMAGE_PARAMETER_ADD",
        "src": buttonBlockPlus,
        "width": 15,
        "height": 15,
        "alt": "Button add parameter",
        "flipRtl": "FALSE"
      },
      {
        "type": "field_image",
        "name": "FIELD_IMAGE_PARAMETER_REMOVE",
        "src": buttonBlockMinus,
        "width": 15,
        "height": 15,
        "alt": "Button remove parameter",
        "flipRtl": "FALSE"
      },
      {
        "type": "input_dummy",
        "name": "INPUT_DUMMY_PARAMETERS"
      }
    ],
    "previousStatement": "Procedure",
    "nextStatement": "Procedure",
    "inputsInline": true,
    "style": 'c_function_blocks'
}

//Registro de bloque de llamada de función
Blockly.Blocks["c_function_call"] = {
    init: function(){
        //Atributos del bloque
        this.isOutput_ = false; //Booleano para indicar que el bloque es de salida
        this.parametersCount = 0; //Número de parametros de llamada de función

        //Inicializar bloque con JSON
        this.jsonInit(c_function_call);

        this.getField('FIELD_INPUT_IDENTIFIER')?.setValidator(identifierValidator);

        //Asignar funciones a botones para conmutar bloque de salida y para agregar y quitar parametros
        let buttonToggleOutput = this.getField('FIELD_IMAGE_TOGGLE_OUTPUT') as Blockly.FieldImage;
        let buttonParameterAdd = this.getField('FIELD_IMAGE_PARAMETER_ADD') as Blockly.FieldImage;
        let buttonParameterRemove = this.getField('FIELD_IMAGE_PARAMETER_REMOVE') as Blockly.FieldImage;

        buttonToggleOutput.setOnClickHandler(() =>{
        this.toggleIsOutput();
        })

        buttonParameterAdd.setOnClickHandler(() =>{
        this.addParameter();
        })

        buttonParameterRemove.setOnClickHandler(() =>{
        this.removeParameter();
        })

    },
    //Función de guardado de estado
    saveExtraState:function(){
        return {
        'isOutput' : this.isOutput_,
        'parametersCount': this.parametersCount
        };
    },

    //Función de cargado de estado
    loadExtraState:function(state){
        this.isOutput_ = state.isOutput || false; //Cargar booleano de bloque de salida
        this.parametersCount = state.parametersCount || 0; //Cargar numero de parametros de salida
        this.updateOutputShape();
        this.updateParametersShape();
    },

    //Función de conmutación de bloque de salida
    toggleIsOutput: function(){
        this.isOutput_ = !this.isOutput_;
        this.updateOutputShape();
    },

    //Función para actualizar forma de bloque de salida
    updateOutputShape: function(){
        const buttonToggleOutput = this.getField('FIELD_IMAGE_TOGGLE_OUTPUT') as Blockly.FieldImage;
        //Actualizar imagen de botón de conmutación de bloque de salida
        buttonToggleOutput.setValue(this.isOutput_? buttonBlockStatement : buttonBlockOutput);
        const fieldLabel = this.getField('FIELD_LABEL_FUNCTION') as Blockly.FieldLabel;
        fieldLabel.setValue(this.isOutput_? "Valor de función" : "Llamar función");

        //Conmutar forma de bloque dependiendo del valor del booleano de conmutación de bloque de salida
        if(this.isOutput_){
            //Remover conexiones de sentencias
            const previousStatement = this.previousConnection as Blockly.Connection;
            const nextStatement = this.nextConnection as Blockly.Connection;
            previousStatement.disconnect();
            nextStatement.disconnect();
            //Eliminar conexiones de sentencias
            this.setPreviousStatement(false);
            this.setNextStatement(false);
            //Activar formato de bloque de salida
            this.setOutput(true);
        }else{
            //Remover conexión de salida
            const outputConnection = this.outputConnection as Blockly.Connection;
            if(outputConnection)
                outputConnection.disconnect();
            //Agregar conexiones de sentencias
            this.setPreviousStatement(true,"Procedure");
            this.setNextStatement(true,"Procedure");
            //Desactivar formato de bloque de salida
            this.setOutput(false);
        }
    },

    //Función para actualizar forma de de bloque de parametros
    updateParametersShape:function(){
        //Agregar entradas de valor
        for(let i = 0;i < this.parametersCount; i++){
        const curParameterInputName = `INPUT_VALUE_PARAMETER_${i}`;
            if(!this.getInput(curParameterInputName)){
                const curParameterInput = this.appendValueInput(curParameterInputName);
                const shadowBlockValue = (this.workspace.newBlock('c_value_number') as Blockly.BlockSvg)
                shadowBlockValue.setShadow(true);
                shadowBlockValue.setFieldValue(0,'FIELD_NUMBER_VALUE');
                shadowBlockValue.outputConnection.connect(curParameterInput.connection!);
                shadowBlockValue.initSvg();
            }
        }
        //Eliminar entrada de valor innecesario
        const uselessInputParameterName = `INPUT_VALUE_PARAMETER_${this.parametersCount}`;
        if(this.getInput(uselessInputParameterName)){
            this.removeInput(uselessInputParameterName);
        }
    },

    //Función para agregar parametros de llamada
    addParameter: function(){
        this.parametersCount++;
        this.updateParametersShape();
    },

    //Función para quitar parametros de llamada
    removeParameter:function(){
        if(this.parametersCount > 0){
            this.parametersCount--;
            this.updateParametersShape();
        }
    }
    
} as IBlockCFunctionCall;   

//Generador de código del bloque
cGenerator.forBlock['c_function_call'] = function(block,generator){
    //Obtener código de entradas de parametros
    const blockParametersCount = (block as IBlockCFunctionCall).parametersCount; 
    let parametersCode = '';
    for(var i = 0; i < blockParametersCount;i++){
        const curValueCode = generator.valueToCode(block,`INPUT_VALUE_PARAMETER_${i}`,0); 
        parametersCode+= `${curValueCode}${(i < blockParametersCount - 1) ? ',' : ''}`;
    }

    //Construir código de función
    const functionIdentifier = block.getFieldValue('FIELD_INPUT_IDENTIFIER');
    const code = `${functionIdentifier}(${parametersCode})`;

    //Devolver código dependiendo de si es un bloque de entrada o de salida
    return block.outputConnection ? [code,0] : code;
}
  