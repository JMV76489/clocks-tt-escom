
/* ------------------------------------------------------------------------------ */
/*                      Archivo de clase de FieldTextInput customizado            */
/*                             para identificadores de C                          */
/* -------------------------------------------------------------------------------*/


import * as Blockly from 'blockly/core';
import { updateDatatypeStruct } from 'src/utils/datatype';
import { updateFunctionDefinition } from 'src/utils/function/function';
import { IBlockC } from 'src/utils/interface/c-block';
import { IBlockCFunctionDefinition } from 'src/utils/interface/c-function-definition';
import { IBlockCStructDefinition } from 'src/utils/interface/c-struct-definition';
import { IBlockCVariableDeclaration } from 'src/utils/interface/c-variable-declaration';
import { IBlockCVariableOutput } from 'src/utils/interface/c-variable-output';
import { showWarningIdentifierToast as showIdentifierWarningToast } from 'src/utils/toast/toast';
import { identifierDeclarationFieldValidator, identifierDeclarationInvalidCheckType } from 'src/utils/validator';

export class CIdentifierFieldTextInput extends Blockly.FieldTextInput {

    lastInvalidValue: string; //Ultimo valor inválido ingresado
    wasLastValueInvalid: boolean; //Booleano para indicar si el último valor ingresado fue inválido

    //Sobreescribir el constructor para agregar un validador de identificador
    constructor(text: string, validator?: (newValue: string) => string | null) {
        super(text, validator);
        this.validator_ = identifierDeclarationFieldValidator;
        this.lastInvalidValue = '';
        this.wasLastValueInvalid = false;
    }

    //Sobreescribir el método doValueInvalid_ para guardar el último valor inválido ingresado
    override doValueInvalid_(_invalidValue: any, fireChangeEvent?: boolean): void {
        super.doValueInvalid_(_invalidValue, fireChangeEvent);

        //Mostrar el mensaje de advertencia
        this.showInvalidIdentifierWarningToast(_invalidValue);
        this.lastInvalidValue = _invalidValue; // Guardar el último valor inválido ingresado
        this.wasLastValueInvalid = true; // Marcar que el último valor fue inválido
    }

    /*Sobreescribir metodo onFinishEditing_ para mostrar un mensaje de advertencia si el último valor
    ingresado fue inválido y hacer que los bloques realicen las acciones correspondientes*/
    override onFinishEditing_(_value: any): void {
        console.log("onFinishEditing_ CIdentifierFieldTextInput");
        const block = this.getSourceBlock() as IBlockC; // Obtener el bloque fuente
        
        // Si el último valor fue inválido, mostrar el mensaje de advertencia
        if(this.wasLastValueInvalid){
            this.showInvalidIdentifierWarningToast(this.lastInvalidValue);
            this.wasLastValueInvalid = false; // Reiniciar el estado
        }
        
        // Si el valor es válido, actualizar el bloque correspondiente
        if (block) {
            //Actualizar identificador del bloque declaración de variable
            if ('blocksIdUsingDeclaration' in block){
                console.log("Es un bloque de declaración de variable");
                (block as IBlockCVariableDeclaration).updateIdentifier();
            }
            //Actualizar identificador del bloque de salida de variable
            else if ('blockIdVariableDeclaration' in block) {
                console.log("Es un bloque de salida de variable");
                let blockOutput = block as IBlockCVariableOutput;
                if (blockOutput.blockIdVariableDeclaration) {
                    const blockDeclaration = block.workspace.getBlockById(blockOutput.blockIdVariableDeclaration) as IBlockCVariableDeclaration;
                    delete blockDeclaration.blocksIdUsingDeclaration[block.id];
                }
                blockOutput.searchDeclarationBlock();
            }
            //Actualizar identificador del bloque de definición de estructura
            else if ('structTag' in block) {
                const structBlock = block as IBlockCStructDefinition;
                //Verificar si se cambio el valor de la entrada
                if(structBlock.structTag != _value){
                    console.log("Se cambio el valor de la entrada");
                    //Actualizar valor de tipo de dato
                    const oldName = structBlock.structTagName;
                    structBlock.structTagName = `STRUCT_${(_value).toLocaleUpperCase()}`;
                    structBlock.structTag = _value;
                    updateDatatypeStruct(oldName,structBlock.structTagName,_value);
                }
            }
            else if ('functionIdentifier' in block) {
                const functionBlock = block as IBlockCFunctionDefinition;
                //Verificar si se cambio el valor de la entrada
                if(functionBlock.functionIdentifier != _value){
                    console.log("Se cambio el valor de la entrada");
                    //Actualizar valor de tipo de dato
                    const oldName = functionBlock.functionIdentifier;
                    functionBlock.functionIdentifier = _value;
                    updateFunctionDefinition(oldName,functionBlock.functionIdentifier);
                }
            }
        }
    }

    //Metodo para mostrar el mensaje de advertencia dependiendo del tipo de error
    showInvalidIdentifierWarningToast(identifier: string): void {
        //Eliminar el ultimo TOAST de toastify para evitar que se acumulen
        const lastToast = document.querySelector('.toastify') as HTMLDivElement;
        if (lastToast) 
            lastToast.remove();
        // Mostrar mensaje de advertencia dependiendo del tipo de error
        switch(identifierDeclarationInvalidCheckType(identifier)){
            case 0:
                showIdentifierWarningToast("El campo no puede estar vacio. Ingresa un identificador valido");
                break;
            case 1:
                showIdentifierWarningToast("Identificador invalido por que la sintaxis no es correcta");
                break;
            case 2:
                showIdentifierWarningToast("El identificador es una palabra reservada. Utiliza otro");
                break;
            case 3:
                showIdentifierWarningToast("El identificador es una función o constante de una librería. Utiliza otro");
                break;
        } 
    }
}