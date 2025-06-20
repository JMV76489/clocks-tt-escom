/* -------------------------------------------------------------------------- */
/*             Archivo de interfaz de bloque de llamada a función             */
/* -------------------------------------------------------------------------- */

import { IBlockC } from './c-block';

export interface IBlockCFunctionCall extends IBlockC {
  parametersCount: number; //Numero de parametros de función
  isOutput_: boolean; //Booleano que indica si el bloque es de salida
  updateOutputShape(): void; //Método para actualizar figura de salida de bloque
  toggleIsOutput(): void; //Método para conmutar forma de salida
  updateParametersShape(): void; //Método para actualizar forma de parametros
  addParameter(): void; //Método para agrega parametro
  removeParameter(): void; //Método para remover parametro
}
