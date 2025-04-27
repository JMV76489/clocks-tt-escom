/* -------------------------------------------------------------------------- */
/*                  Archivo de bloque de negación matemática                  */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import { cGenerator } from 'src/generators/c';

export const cMathNegation = {
    "type": "c-math-negation-arithmetic",
    "tooltip": "Bloque para negar un valor numérico.",
    "helpUrl": "https://learn.microsoft.com/es-es/cpp/c-language/c-operators?view=msvc-170",
    "message0": "- %1",
    "args0": [
        {
        "type": "input_value",
        "name": "INPUT_VALUE_OPERAND"
        }
    ],
    "output": null,
    "inputsInline": true,
    "style": "c_math_blocks",
}

//Registro de bloque
Blockly.Blocks['c-math-negation-arithmetic'] = {
    init: function() {
        this.jsonInit(cMathNegation);
    }
};

//Generador de código del bloque
cGenerator.forBlock['c-math-negation-arithmetic'] = function(block, generator) {
    return [`-${generator.valueToCode(block,'INPUT_VALUE_OPERAND',0)}` || '1',1];
}
                          