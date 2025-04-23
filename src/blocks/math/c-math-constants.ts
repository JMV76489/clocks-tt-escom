/* -------------------------------------------------------------------------- */
/*            Archivo de bloque de constantes matemáticas de math.h           */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';
import { IBlockC } from 'src/utils/interface/c-block';
import { MATH_H_MACROS_CODE_DICT } from 'src/utils/constants';

//JSON de definición de bloque
export const cMathConstants = {
    "type": "c_math_constants",
    "tooltip": "Bloque de constantes matemáticas.",
    "helpUrl": "https://learn.microsoft.com/es-es/cpp/c-runtime-library/math-constants?view=msvc-170",
    "message0": "%1 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "FIELD_DROPDOWN_CONSTANT",
        "options": [
          [
            "π",
            "MATH_CONSTANT_PI"
          ],
          [
            "π/2",
            "MATH_CONSTANT_PI_DIVIDED_TWO"
          ],
          [
            "π/4",
            "MATH_CONSTANT_PI_DIVIDED_FOUR"
          ],
          [
            "1/π",
            "MATH_CONSTANT_ONE_DIVIDED_PI"
          ],
          [
            "2/π",
            "MATH_CONSTANT_TWO_DIVIDED_PI"
          ],
          [
            "2/√π",
            "MATH_CONSTANT_TWO_DIVIDED_SQRT_PI"
          ],
          [
            "e",
            "MATH_CONSTANT_E"
          ],
          [
            "Log₂e",
            "MATH_CONSTANT_LOG_TWO_E"
          ],
          [
            "Log₁₀e",
            "MATH_CONSTANT_LOG_TEN_E"
          ],
          [
            "Ln(2)",
            "MATH_CONSTANT_LN_TWO"
          ],
          [
            "Ln(10)",
            "MATH_CONSTANT_LN_TEN"
          ],
          [
            "√2",
            "MATH_CONSTANT_SQRT_TWO"
          ],
          [
            "1/√2",
            "MATH_CONSTANT_ONE_DIVIDED_SQRT_TWO"
          ],
        ]
      },
      {
        "type": "input_dummy",
        "name": "INPUT_DUMMY_CONSTANT"
      }
    ],
    "output": null,
    "style": 'c_math_blocks',
}
                      

//Registro de bloque
Blockly.Blocks["c_math_constants"] = {
  init: function(){
    //Inicializar bloque con JSON
    this.jsonInit(cMathConstants);
    //Uso de biblioteca
    this.libraryUse = "math.h";
  },
} as IBlockC;

//Generador de código de operaciones matemáticas básicas unarias
cGenerator.forBlock['c_math_constants'] = function(block,generator){
  //Obtener código y campos de bloques
  return  [MATH_H_MACROS_CODE_DICT[block.getFieldValue("FIELD_DROPDOWN_CONSTANT")],0];
}