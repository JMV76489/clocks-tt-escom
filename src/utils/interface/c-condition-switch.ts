/* -------------------------------------------------------------------------- */
/*              Archivo de interfaz de bloque de condición switch             */
/* -------------------------------------------------------------------------- */

import { IBlockC } from './c-block';

export interface IBlockCConditionSwitch extends IBlockC {
  caseIndex: number;
  caseIndexArray: number[];
  isDefaultCaseEnabled: boolean;
  addCase(): void;
  appendCaseInputs(caseIndex: number): void;
  toggleDefaultCase(): void;
  updateDefaultCaseShape(isDefaultCaseEnabled: boolean): void;
  deleteCase(caseIndexName: number): void;
}
