/* -------------------------------------------------------------------------- */
/*           Archivo de interfaz de bloque de definicion de function          */
/* -------------------------------------------------------------------------- */

import { IBlockCVariableDeclaration } from "./c-variable-declaration";

///Interfaz de bloque de definición de función
export interface IBlockCFunctionDefinition extends IBlockCVariableDeclaration {
    functionIdentifier: string; //Identificador de la función
}