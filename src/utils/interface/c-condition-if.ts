/* -------------------------------------------------------------------------- */
/*                Archivo de interfaz de bloque de condición if               */
/* -------------------------------------------------------------------------- */

import { IBlockC } from './c-block';

export interface IBlockCConditionIf extends IBlockC {
  haveElse: Boolean; //Atributo que indica si tiene la sentencia else actividada
  toggleElse(): void; //Método para conmutar else
}
