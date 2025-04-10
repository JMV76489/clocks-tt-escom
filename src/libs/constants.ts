/* -------------------------------------------------------------------------- */
/*       Archivo de definición de constantes y variables de uso general       */
/* -------------------------------------------------------------------------- */

//Paleta de colores de categoria de bloques extraidas de index.css
const style = window.getComputedStyle(document.body)
export const PALLETTE = {
    "BLOCKS": {
        function: style.getPropertyValue('--color_block_category_function'),
        variable: style.getPropertyValue('--color_block_category_variable'),
        value: style.getPropertyValue('--color_block_category_value'),
        condition: style.getPropertyValue('--color_block_category_condition'),
        math: style.getPropertyValue('--color_block_category_math'),
        logic: style.getPropertyValue('--color_block_category_logic'),
        loop: style.getPropertyValue('--color_block_category_loop'),
        print: style.getPropertyValue('--color_block_category_print'),
        input: style.getPropertyValue('--color_block_category_input'),
        struct: style.getPropertyValue('--color_block_category_struct'),
        pointer: style.getPropertyValue('--color_block_category_pointer'),
        memory: style.getPropertyValue('--color_block_category_memory'),
    },
    "UI": {
        top: style.getPropertyValue('--color_ui_top'),
        button: style.getPropertyValue('--color_ui_button'),
        output: style.getPropertyValue('--color_ui_output'),
        popup: style.getPropertyValue('--color_ui_popup'),
        popupTitle: style.getPropertyValue('--color_ui_popup_title'),
    }
}

//Arreglo de palabras reservadas de C
export const C_RESERVED_KEYWORDS = [
    "auto",
    "break",
    "case",
    "char",
    "const",
    "continue",
    "default",
    "double",
    "else",
    "enum",
    "extern",
    "float",
    "for",
    "goto",
    "if",
    "int",
    "long",
    "register",
    "return",
    "short",
    "signed",
    "sizeof",
    "static",
    "struct",
    "switch",
    "typedef",
    "union",
    "unsigned",
    "void",
    "volatile",
    "while"
]

//Arreglo de tipos de datos primitivos 
export const C_PRIMITIVE_DATATYPES: string[] = [
    "int",
    "char",
    "float",
    "double",
]

//Diccionario de equivalencia de nombre de campo de operadores básicos a código
export const OPERATION_BINARY_BASIC_NAME_CODE_DICT: {[key:string]: string} = {
    "OPERATION_ADDITION": "+",
    "OPERATION_SUBSTRACTION": "-",
    "OPERATION_MULTIPLICATION": "*",
    "OPERATION_DIVISION": "/",
    "OPERATION_REMAINDER": "%"
}

//Lista con bloques de tipo operador binario
export const BLOCKS_TYPE_BINARY_OPERATORS: string[] = [
    "c_math_binary_operation_arithmetic",
    "c_logic_comparator",
    "c_logic_operator",
    "c_pointer_output"
]

//Diccionario de equivalencia a código de campo de incremento de bloque for simple de incremento
export const FOR_SIMPLE_INCREMENT_DICT_CODE: {[key:string]: string} = {
    "INCREMENT_ADDING": "+=",
    "INCREMENT_SUBTRACTING": "-=",
    "INCREMENT_MULTIPLYING": "*=",
    "INCREMENT_DIVIDING": "/="
}

//Diccionario de equivlencia de nombre de campo de comparadores a código
export const COMPARATOR_NAME_CODE_DICT: {[key:string]: string} = {
    "COMPARATOR_EQUAL": "==",
    "COMPARATOR_GREATER": ">",
    "COMPARATOR_LESS": "<",
    "COMPARATOR_GREATER_EQUAL": ">=",
    "COMPARATOR_LESS_EQUAL": "<=",
    "COMPARATOR_EQUAL_NOT": "!="
}

//Diccionario de equivlencia de nombre de campo de operadores lógicos a código
export const LOGIC_OPERATOR_NAME_CODE_DICT: {[key:string]: string} = {
    "LOGIC_AND": "&&",
    "LOGIC_OR": "||",
    "LOGIC_NOT": "!",
}

//Diccionario de escpeficadores de formato de tipos de dato en C
export const C_FORMAT_SPECIFIER_DATATYPE_DICT: { [key: string]: string } = {
    "PRIMITIVE_INT": "d",
    "PRIMITIVE_CHAR": "c",
    "PRIMITIVE_FLOAT": "f",
    "PRIMITIVE_DOUBLE": "lf",
};

//Diccionario de equivalencia de nombre de campo de operadores básicos a código
export const OPERATION_UNARY_BASIC_NAME_CODE_DICT: {[key:string]: string} = {
    "OPERATOR_SQUARE_ROOT": "sqrt",
    "OPERATOR_EXP": "exp",
    "OPERATOR_LOGARITHM_NATURAL": "log",
    "OPERATOR_LOGARITHM_10": "log10",
    "OPERATOR_SINE": "sin",
    "OPERATOR_COSINE": "sin",
    "OPERATOR_TANGENT": "tan",
    "OPERATOR_ARCSINE": "asin",
    "OPERATOR_ARCCOSINE": "acos",
    "OPERATOR_ARCTANGENT": "atan"
}

//Diccionario de equivalencia de nombre de campo de operadores básicos a código
export const MATH_CONSTANTS_CODE_DICT: {[key:string]: string} = {
    "MATH_CONSTANT_PI": "M_PI",
    "MATH_CONSTANT_PI_DIVIDED_TWO": "M_PI_2",
    "MATH_CONSTANT_PI_DIVIDED_FOUR": "M_PI_4",
    "MATH_CONSTANT_ONE_DIVIDED_PI": "M_1_PI",
    "MATH_CONSTANT_TWO_DIVIDED_PI": "M_2_PI",
    "MATH_CONSTANT_TWO_DIVIDED_SQRT_PI": "M_2_SQRTPI",
    "MATH_CONSTANT_E": "M_E",
    "MATH_CONSTANT_LOG_TWO_E": "M_LOG2E",
    "MATH_CONSTANT_LOG_TEN_E": "M_LOG10E",
    "MATH_CONSTANT_LN_TWO": "M_LN2",
    "MATH_CONSTANT_LN_TEN": "M_LN10",
    "MATH_CONSTANT_SQRT_TWO": "M_SQRT2",
    "MATH_CONSTANT_ONE_DIVIDED_SQRT_TWO": "M_SQRT1_2"
}

//Diccionario de equivalencia de nombre de campo de modificadores de flujo de bucle a código
export const LOOP_FLOW_MODIFIER_CODE_DICT: {[key:string]: string} = {
    "LOOP_BREAK": "break",
    "LOOP_CONTINUE": "continue",
}

export const STRING_CODE_HTML_FORMAT = {
    "SEMICOLON": `<span style = "color: black">;</span>`,
    "COMMA": `<span style = "color: black">,</span>`,
    "BREAK": `<span style = "color: ${PALLETTE.BLOCKS.loop}">break</span>`
}