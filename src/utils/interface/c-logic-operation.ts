/* -------------------------------------------------------------------------- */
/*              Archivo de interfaz de bloque de operación lógica             */
/* -------------------------------------------------------------------------- */

import { IBlockC } from "./c-block";

export interface IBlockCLogicOperation extends IBlockC {
    operatorValidatorDropdown(newValue: string): string; //Validador de campo de operador lógico
}