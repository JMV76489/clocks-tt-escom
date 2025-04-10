/* -------------------------------------------------------------------------- */
/*                        Archivo de interfaces bloques                       */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { Variable } from 'src/libs/variable/Variable';
import { arrayOptionsStruct } from '../datatype';

/*Interfaz de bloque C que hereda todas las propiedades de la clase de bloque, pero que tienen ciertos 
atributos globales que se utilizaran para un funcionamiento avanzado o la generación de código */
export interface BlockC extends Blockly.BlockSvg{
  libraryUse: string | undefined; //Biblioteca que utiliza
  updateShape(): void; //Método para actualizar forma de bloque
  libraryUseValidatorDropdown(newValue: string): string; //Validador de FieldDropdown para verificar uso de biblioteca
  datatypeOptionsGenerator(): [string,string][]; //Generador de opciones de tipos de datos
}



//Interfaz de bloque de declaración de variable
export interface BlockVariableDeclaration extends BlockC{
  variableDeclaring: Variable;
  blocksIdUsingDeclaration: {[blockId:string]: string} //Diccionario de ID's de bloques que usan el bloque de declaración
  updateIdentifier(): void; //Método para actualizar identificador
  searchBlocksUsingDeclaration(): void; //Método para buscar bloques que usan la declaración de variable
  checkStructsDefined(newValue: string): void; //Método para verificar si hay estructuras definidas
  fieldDeclarationItemValidator(newValue:string): string; //Validador de campo de elemento de declaración
  fieldDatatypeValidator(newValue:string): string; //Validador de campo de tipo de dato
  lastFieldDeclarationItemOption: string; //Ultima opción de tipo de dato seleccionada
}

//Métodos de Bloque de declaración de variables
export const BlockVariableDeclarationMethods = {
  //Método para actualizar identificador
  updateIdentifier: function(){
    //Actualizar campo de itentificador de los bloques que usan el bloque de declaración
    for(let blockId in this.blocksIdUsingDeclaration){
      const curBlockUsingDeclaration = this.workspace.getBlockById(this.blocksIdUsingDeclaration[blockId]);
      curBlockUsingDeclaration?.setFieldValue(this.getFieldValue('FIELD_INPUT_IDENTIFIER'),'FIELD_INPUT_IDENTIFIER');
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
    
    if(this.lastFieldDeclarationItemOption != fieldDeclarationItemOption){
      this.lastFieldDeclarationItemOption = fieldDeclarationItemOption;
      
      this.setFieldValue(fieldDeclarationDatatypeOptions[0][1],'FIELD_DROPDOWN_DATATYPE');
    }

    const moveEvent = event as Blockly.Events.BlockMove;
    const changeEvent = event as Blockly.Events.BlockChange;

    if (event.type === Blockly.Events.BLOCK_MOVE || (event.type == Blockly.Events.BLOCK_CHANGE && changeEvent.element==='disabled')) {
      if(moveEvent.blockId || changeEvent.blockId){
        if (moveEvent.blockId === this.id || changeEvent.blockId === this.id) {

          if(this.type == "c_variable_declaration"){
            if(this.getRootBlock().type == "c_struct_definition"){
              this.setNextStatement(true,"Declaration");
              this.setPreviousStatement(true,"Declaration");
            }else{
              this.setNextStatement(true,['Procedure','Declaration']);
              this.setPreviousStatement(true,['Procedure','Declaration']);
            }
          }

          for(let blockId in this.blocksIdUsingDeclaration){
            const curBlock = this.workspace.getBlockById(this.blocksIdUsingDeclaration[blockId]) as BlockVariableOutput;
            curBlock?.setDeclarationBlockId(null);
          }
          this.blocksIdUsingDeclaration = {}
          this.searchBlocksUsingDeclaration();
        }
      }
    }
  },
  //Método que se llama cuando el bloque es eliminado
  destroy: function(){
    if(!this.isInFlyout){
      for(let blockId in this.blocksIdUsingDeclaration){
        const curBlock = this.workspace.getBlockById(this.blocksIdUsingDeclaration[blockId]) as BlockVariableOutput;
        curBlock?.setDeclarationBlockId(null);
        curBlock?.searchDeclarationBlock();
        
      }
    }
  },
  //Método para buscar bloques usando la declaración de variable
  searchBlocksUsingDeclaration: function(){
    /*Fijar bloques de busqueda a descendientes si se trata de un bloque de declaración de variable
    o a los padres si se trata de un bloque de parametro*/
    const descendants = this.type == "c_variable_declaration" ? this.getDescendants(true) : this.getParent()?.getDescendants(true);
    (descendants as BlockC[])?.forEach((block: BlockC) =>{
      if(block.type == 'c_variable_output'){
        if(block.getFieldValue('FIELD_INPUT_IDENTIFIER') == this.getFieldValue('FIELD_INPUT_IDENTIFIER')){
          //Verificar que el bloque aun no este registrado en el diccionarios de bloques utilizando la declaración
          if(!this.blocksIdUsingDeclaration[block.id]){
            (block as BlockVariableOutput).setDeclarationBlockId(this.id);
          }
        }
      }
    });
  },
  //Función de guardado de estado
  saveExtraState() {
    const state = {
      'blocksIdUsingDeclaration': this.blocksIdUsingDeclaration,
      'lastFieldDeclarationItemOption': this.lastFieldDeclarationItemOption
    }
    return state ;
  },
  //Función de cargado de estado
  loadExtraState(state) {
    this.blocksIdUsingDeclaration = state.blocksIdUsingDeclaration || {};
    this.lastFieldDeclarationItemOption = state.lastFieldDeclarationItemOption || this.getFieldValue('FIELD_DROPDOWN_DECLARATION_ITEM');
    
  },
  //Método para verificar si hay estructuras
  checkStructsDefined: function(newValue: string){
    if(newValue == 'INSTANCE'){
      if(arrayOptionsStruct.length == 0)
          this.setWarningText('No hay ninguna estructura definida.');
      else
          this.setWarningText(null);
      }else
          this.setWarningText(null);
  },
} as BlockVariableDeclaration;

//Interfaz de bloque de salida de variable
export interface BlockVariableOutput extends BlockC{
  blockIdVariableDeclaration: string | null; //ID de bloque de declaración de variable
  checkDeclarationBlock(): void; //Método para checar si la variable esta declarada
  searchDeclarationBlock(): void; //Método para buscar declaración de la variable
  searchDeclarationOnBlocks(currentBlock: BlockC | null): void; //Método para buscar declaración de la variable en los bloques
  searchDeclarationOnParameters(): void; //Método para buscar declaración en los parametros de la función
  setDeclarationBlockId(blockDeclarationId: string | null):void; //Método para asignar ID bloque de declaración
  setBlockStyleDeclaration(itemDeclarationName: string): void; //Método para fijar el estilo del bloque con base a lo que se está declarando
 }

/* ------------------- Interfaces de bloques de condición ------------------- */

//Interfaz del bloque if
export interface BlockConditionIf extends BlockC {
  haveElse: Boolean; //Atributo que indica si tiene la sentencia else actividada
  toggleElse(): void; //Método para conmutar else
}

//Interfaz del bloque switch
export interface BlockConditionSwitch extends BlockC{
  caseIndex: number;
  caseIndexArray: number[];
  isDefaultCaseEnabled: boolean;
  addCase(): void;
  appendCaseInputs(caseIndex: number): void;
  toggleDefaultCase(): void;
  updateDefaultCaseShape(isDefaultCaseEnabled: boolean): void;
  deleteCase(caseIndexName: number): void;
}

/* -------------------- Interfaces de bloques de función -------------------- */

//Interfaz de bloque con número de parametros
export interface BlockFunctionParameters extends BlockC {
  parametersCount: number; //Numero de parametros de función
  updateParametersShape(): void; //Método para actualizar forma de parametros
  addParameter(): void; //Método para agrega parametro
  removeParameter(): void; //Método para remover parametro
}



//Interfaz de bloque de llamada de función
export interface BlockFunctionCall extends BlockFunctionParameters {
  isOutput_: boolean; //Booleano que indica si el bloque es de salida
  updateOutputShape(): void; //Método para actualizar figura de salida de bloque
  toggleIsOutput(): void; //Método para conmutar forma de salida
}

/* ------------ Interfaces de bloques de operaciones matemáticas ------------ */

//Interfaz de bloque de operación matemática unaria básica.
export interface BlockMathUnaryOperator extends BlockC {
  operatorValidator(newValue:string): string; //Método de validador de operador
}

/* ------------------- Interfaces de bloques de estructura ------------------ */

//Interfaz de bloque de definición de estructura
export interface BlockStructDefinition extends BlockC {
  membersCount: number;
  structTag: string; //Etiqueta de la estructura
  structTagName: string; //Nombre de etiqueta de la estructura
  addMember(): void;
  deleteMember(inputMemberName: string): void;
}

/* --------------------- Interfaces de bloque de bucles --------------------- */
export interface BlockLoopFor extends BlockC {
  doDeclareVariable: boolean;
  toggleDeclareVariable(): void;
}