
/* ------------------------------------------------------------------------------ */
/*                      Archivo de clase de FieldTextInput customizado            */
/*                             para identificadores de C                          */
/* -------------------------------------------------------------------------------*/


import * as Blockly from 'blockly/core';
import { updateDatatypeStruct } from 'src/utils/datatype';
import { IBlockC } from 'src/utils/interface/c-block';
import { IBlockCStructDefinition } from 'src/utils/interface/c-struct-definition';
import { IBlockCVariableDeclaration } from 'src/utils/interface/c-variable-declaration';
import { IBlockCVariableOutput } from 'src/utils/interface/c-variable-output';
import { showWarningToast } from 'src/utils/toast/toast';
import { identifierInvalidCheckType } from 'src/utils/validator';

export class CIdentifierFieldTextInput extends Blockly.FieldTextInput {

    lastInvalidValue: string; //Ultimo valor inválido ingresado
    wasLastValueInvalid: boolean; //Booleano para indicar si el último valor ingresado fue inválido

    constructor(text: string, validator?: (newValue: string) => string | null) {
        super(text, validator);
        // Inicializar el valor inválido y el booleano
        this.lastInvalidValue = '';
        this.wasLastValueInvalid = false;
        
    }

    //Sobreescribir el método doValueInvalid_ para guardar el último valor inválido ingresado
    override doValueInvalid_(_invalidValue: any, fireChangeEvent?: boolean): void {
        super.doValueInvalid_(_invalidValue, fireChangeEvent);
        this.lastInvalidValue = this.getText();
        this.wasLastValueInvalid = true;
    }

    /*Sobreescribir metodo onFinishEditing_ para mostrar un mensaje de advertencia si el último valor
    ingresado fue inválido y hacer que los bloques realicen las acciones correspondientes*/
    override onFinishEditing_(_value: any): void {
        console.log("onFinishEditing_ CIdentifierFieldTextInput");
        const block = this.getSourceBlock() as IBlockC; // Obtener el bloque fuente
        //Verificar si el ultimo valor ingresado fue inválido
        if (this.wasLastValueInvalid) {
            // Mostrar mensaje de advertencia dependiendo del tipo de error
            switch(identifierInvalidCheckType(this.lastInvalidValue)){
                case 0:
                    showWarningToast("El campo no puede estar vacio. Ingresa un identificador valido");
                    break;
                case 1:
                    showWarningToast("Identificador invalido por que la sintaxis no es correcta");
                    break;
                case 2:
                    showWarningToast("El identificador es una palabra reservada. Utiliza otro");
                    break;
                case 3:
                    showWarningToast("El identificador es una función o constante de una librería. Utiliza otro");
                    break;
            }
            // Restablecer el valor inválido y el booleano
            this.wasLastValueInvalid = false;
        }else{
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
            }
        }
    }
}