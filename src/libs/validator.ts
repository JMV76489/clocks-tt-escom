/* ------------------ Archivo de definicion de validadores ------------------ */

import { C_PRIMITIVE_DATATYPES, C_RESERVED_KEYWORDS } from "./constants";

//Expresión regular para validar campo de indetificador
const regex_variable_identifier = new RegExp("^[_a-zA-Z][_a-zA-Z0-9]{0,30}$") 

//Validador de campo de de identificador
export const identifierValidator = function(fieldValue: string){
    //Validar si la sintaxis es correcta
    const isSyntaxCorrect = regex_variable_identifier.test(fieldValue) 
    //Verificar que el tenga sintaxis correcta y no use ninguna palabra clave
    if (!isSyntaxCorrect || C_RESERVED_KEYWORDS.indexOf(fieldValue) > -1) {
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