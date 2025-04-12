/* -------------------------------------------------------------------------- */
/*         Archivo de interfaz de bloque de operador unario matemático        */
/* -------------------------------------------------------------------------- */

import { IBlockC } from './c-block';

export interface IBlockCMathUnaryOperator extends IBlockC {
  operatorValidator(newValue: string): string; //Método de validador de operador
}
