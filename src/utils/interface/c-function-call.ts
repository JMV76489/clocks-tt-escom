/* -------------------------------------------------------------------------- */
/*             Archivo de interfaz de bloque de llamada a función             */
/* -------------------------------------------------------------------------- */

import { IBlockCFunctionParameters } from './c-function-parameter';

export interface IBlockCFunctionCall extends IBlockCFunctionParameters {
  isOutput_: boolean; //Booleano que indica si el bloque es de salida
  updateOutputShape(): void; //Método para actualizar figura de salida de bloque
  toggleIsOutput(): void; //Método para conmutar forma de salida
}
