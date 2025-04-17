/* ------------------ Archivo de definicion de validadores ------------------ */

import { C_PRIMITIVE_DATATYPES, C_RESERVED_IDENTIFIERS, C_RESERVED_KEYWORDS, MATH_CONSTANTS_CODE_DICT, MATH_H_FUNCTIONS_NAME_CODE_DICT, OPERATION_BINARY_BASIC_NAME_CODE_DICT } from "./constants";

//Expresión regular para validar campo de indetificador
const regex_variable_identifier = new RegExp("^[_a-zA-Z][_a-zA-Z0-9]{0,30}$") 


//Función para validar si el identificador es utilizable
function isIdentifierUsed(fieldValue: string){
    for(const key in C_RESERVED_IDENTIFIERS){
        const curIdentifier = C_RESERVED_IDENTIFIERS[key];
        if (fieldValue == curIdentifier) 
            return true;
    }
    for(const key in MATH_CONSTANTS_CODE_DICT){
        const curConstant = MATH_CONSTANTS_CODE_DICT[key];
        if (fieldValue == curConstant) 
            return true;
    }
    for(const key in MATH_H_FUNCTIONS_NAME_CODE_DICT){
        const curConstant = MATH_H_FUNCTIONS_NAME_CODE_DICT[key];
        if (fieldValue == curConstant) 
            return true;
    }
    return false;
}

//Validador de campo de de identificador
export const identifierValidator = function(fieldValue: string){
    fieldValue = fieldValue.trim(); //Recortar espacios al inicio y al final de la cadena
    //Validar si la sintaxis es correcta
    const isSyntaxCorrect = regex_variable_identifier.test(fieldValue) 
    //Verificar que el tenga sintaxis correcta y no use ninguna palabra clave
    if (!isSyntaxCorrect || C_RESERVED_KEYWORDS.indexOf(fieldValue) > -1 || isIdentifierUsed(fieldValue)) {
        return null;
    }
    return fieldValue
}

//Validador de campo de tipo de dato primitivo
export const datatypePrimitiveValidator = function(field_input: string){
    //Recortar espacios al inicio y al final de la cadena
    const fieldInputTrimmed = field_input.trim();  
    //Verificar que sea un tipo de dato primitivo valido 
    return (C_PRIMITIVE_DATATYPES.indexOf(fieldInputTrimmed) > -1) ? fieldInputTrimmed : null;
}