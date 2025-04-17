/* -------------------------------------------------------------------------- */
/*         Archivo de bloque de bucle de modificador de flujo de bucle        */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { LOOP_FLOW_MODIFIER_CODE_DICT } from 'src/utils/constants';

//JSON de definición de bloque
export const cLoopFlowModiifer = {
    "type": "c_loop_flow_modifier",
    "tooltip": "",
    "helpUrl": "",
    "message0": "%1 %2 %3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "FIELD_DROPDOWN_FLOW_MODIFIER",
        "options": [
          [
            "romper",
            "LOOP_BREAK"
          ],
          [
            "cotinuar",
            "LOOP_CONTINUE"
          ]
        ]
      },
      {
        "type": "field_label_serializable",
        "name": "FIELD_LABEL_SENTENCE",
        "text": "el bucle"
      },
      {
        "type": "input_dummy",
        "name": "INPUT_DUMMY"
      }
    ],
    "previousStatement": "Procedure",
    "style": 'c_loop_blocks',
}
                      
//Registro de bloque
Blockly.Blocks["c_loop_flow_modifier"] = {
  init: function(this: IBlockC){
    //Inicializar bloque con JSON
    this.jsonInit(cLoopFlowModiifer);

    //Asignar validador al campo de modificador de flujo de bucle
    this.getField('FIELD_DROPDOWN_FLOW_MODIFIER')?.setValidator((newValue: string) =>{
      if(newValue == 'LOOP_BREAK')
        this.setFieldValue('bucle actual','FIELD_LABEL_SENTENCE');
      else if(newValue == 'LOOP_CONTINUE')
        this.setFieldValue('con siguiente iteración.','FIELD_LABEL_SENTENCE');
    })
  }
}    

//Generador de código de bloque de lectura simple desde entrada estandar
cGenerator.forBlock['c_loop_flow_modifier'] = function(block) {
  return `${LOOP_FLOW_MODIFIER_CODE_DICT[block.getFieldValue('FIELD_DROPDOWN_FLOW_MODIFIER')]}`;
}