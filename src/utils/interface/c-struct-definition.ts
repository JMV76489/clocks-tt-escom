/* -------------------------------------------------------------------------- */
/*          Archivo de interfaz de bloque de definición de estructura         */
/* -------------------------------------------------------------------------- */

import { IBlockC } from './c-block';

export interface IBlockCStructDefinition extends IBlockC {
  membersCount: number;
  structTag: string; //Etiqueta de la estructura
  structTagName: string; //Nombre de etiqueta de la estructura
  addMember(): void;
  deleteMember(inputMemberName: string): void;
}
