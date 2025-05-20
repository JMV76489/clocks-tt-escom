/* -------------------------------------------------------------------------- */
/*        Archivo de interfaz de bloque de inicialización de elementos        */
/* -------------------------------------------------------------------------- */

import { IBlockC } from './c-block';

export interface IBlockCElementsInitialization extends IBlockC {
    elementsCount: number;
    addElement(): void;
    removeElement(): void;
}