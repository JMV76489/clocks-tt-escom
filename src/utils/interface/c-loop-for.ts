/* -------------------------------------------------------------------------- */
/*                 Archivo de interfaz de bloque de bucle for                 */
/* -------------------------------------------------------------------------- */

import { IBlockC } from './c-block';

export interface IBlockCLoopFor extends IBlockC {
  doDeclareVariable: boolean;
  toggleDeclareVariable(): void;
}
