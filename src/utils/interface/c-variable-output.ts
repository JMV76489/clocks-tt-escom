/* -------------------------------------------------------------------------- */
/*             Archivo de interfaz de bloque de salida de variable            */
/* -------------------------------------------------------------------------- */

import { IBlockC } from './c-block';

export interface IBlockCVariableOutput extends IBlockC {
  blockIdVariableDeclaration: string | null; //ID de bloque de declaración de variable cuyo valor esta accediendo
  haveArrayIndexInput: boolean; //Si el bloque tiene un input de índice de arreglo
  itemTypeNameDeclaration: string; //Nombre del tipo de elemento al que se está accediendo
  checkDeclarationBlock(): void; //Método para checar si la variable esta declarada
  searchDeclarationBlock(): void; //Método para buscar declaración de la variable
  searchDeclarationOnBlocks(currentBlock: IBlockC | null): void; //Método para buscar declaración de la variable en los bloques
  searchDeclarationOnParameters(): void; //Método para buscar declaración en los parametros de la función
  setDeclarationBlockId(blockDeclarationId: string | null): void; //Método para asignar ID bloque de declaración
  setBlockStyleDeclaration(itemDeclarationName: string): void; //Método para fijar el estilo del bloque con base a lo que se está declarando
  toggleArrayIndexInput(): void; //Método para alternar el input de índice de arreglo
}
