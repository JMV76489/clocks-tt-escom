/* -------------------------------------------------------------------------- */
/*            Archivo de bloque de salida de miembro de estructura            */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { IBlockCVariableOutput } from 'src/utils/interface/c-variable-output';
import { arrayOptionsPrimitive, datatypeInfoGetFromName } from 'src/utils/datatype';

//JSON de definición de bloque
export const cMemoryMalloc = {
    "type": "c_memory_malloc",
    "tooltip": "Bloque para reservar memoria dinámicamente. Para manejar la reserva debes utilizar un apuntador.",
    "helpUrl": "https://sopa.dis.ulpgc.es/so/cpp/intro_c/introc75.htm",
    "message0": "Reserva de %1 bloques(s) de memoria de tipo %2 %3",
    "args0": [
        {
        "type": "input_value",
        "name": "INPUT_VALUE_SIZE"
        },
        {
        "type": "field_dropdown",
        "name": "FIELD_DROPDOWN_DATATYPE",
        "options": arrayOptionsPrimitive
        },
        {
        "type": "input_dummy",
        "name": "INPUT_DUMMY_DATATYPE"
        }
    ],
    "output": null,
    "inputsInline": true,
    "style": 'c_memory_blocks'
  }

//Registro de bloque
Blockly.Blocks["c_memory_malloc"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cMemoryMalloc);

    //Inicializar uso de biblioteca
    this.libraryUse = "stdlib.h";
  }
} as IBlockC;

//Generador de código del bloque
cGenerator.forBlock["c_memory_malloc"] = function(block,generator) {
    const datatypeCode = datatypeInfoGetFromName(block.getFieldValue('FIELD_DROPDOWN_DATATYPE'))!.code;
    const sizeValueCode = generator.valueToCode(block,'INPUT_VALUE_SIZE',0);
    const code = `()`
    return [`(${datatypeCode} *) malloc(sizeof(${datatypeCode})${sizeValueCode.trim() == '1' ? '' : ` * ${sizeValueCode}`})`,0];
}