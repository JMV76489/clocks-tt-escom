/* -------------------------------------------------------------------------- */
/*            Archivo de interfaz de bloque de parametro de función           */
/* -------------------------------------------------------------------------- */

import { IBlockC } from './c-block';

export interface IBlockCFunctionParameters extends IBlockC {
  parametersCount: number; //Numero de parametros de función
  updateParametersShape(): void; //Método para actualizar forma de parametros
  addParameter(): void; //Método para agrega parametro
  removeParameter(): void; //Método para remover parametro
}
