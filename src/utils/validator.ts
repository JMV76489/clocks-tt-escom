/* ------------------ Archivo de definicion de validadores ------------------ */

import { C_PRIMITIVE_DATATYPES, C_LIBRARY_DICT_CODE, C_RESERVED_KEYWORDS} from "./constants";

//Expresión regular para validar campo de indetificador
const regex_variable_identifier = new RegExp("^[_a-zA-Z][_a-zA-Z0-9]{0,30}$") 


//Función para validar si el identificador es utilizable
function isIdentifierUsedByLibrary(fieldValue: string){
    for(const type in C_LIBRARY_DICT_CODE){
        for(const library in C_LIBRARY_DICT_CODE[type]){
            for(const code in C_LIBRARY_DICT_CODE[type][library]){
                if(C_LIBRARY_DICT_CODE[type][library][code] == fieldValue){
                    return true; //Identificador en uso por una funcion o constante de una libreria
                }
            }
        }
    }
    return false;
}

//Función para verificar si el identificador es invalido
export const identifierInvalidCheckType = function(identifier: string): number{

    const isSyntaxCorrect = regex_variable_identifier.test(identifier) 
    if(identifier == "") //Verificar que no sea una cadena vacia
        return 0; //Identificador incorrecto por ser una cadena vacia
    if(!isSyntaxCorrect)
        return 1; //Identificador incorrecto por sintaxis incorrecta
    else if(C_RESERVED_KEYWORDS.indexOf(identifier) > -1 ){
        return 2; //Identificador incorrecto por ser una palabra reservada
    }else if(isIdentifierUsedByLibrary(identifier))
        return 3; //Identificador incorrecto por estar en uso por una funcion o constante de una libreria
    else    
        return -1; //Identificador correcto
}

//Validador de campo de de identificador
export const identifierFieldValidator = function(fieldValue: string){
    fieldValue = fieldValue.trim(); //Recortar espacios al inicio y al final de la cadena
    //Validar si la sintaxis es correcta
    const isSyntaxCorrect = regex_variable_identifier.test(fieldValue) 
    //Verificar que el tenga sintaxis correcta y no use ninguna palabra clave
    if (identifierInvalidCheckType(fieldValue) !== -1) {
         return null;
    }else
        return fieldValue
}

//Validador de campo de tipo de dato primitivo
export const datatypePrimitiveValidator = function(field_input: string){
    //Recortar espacios al inicio y al final de la cadena
    const fieldInputTrimmed = field_input.trim();  
    //Verificar que sea un tipo de dato primitivo valido 
    return (C_PRIMITIVE_DATATYPES.indexOf(fieldInputTrimmed) > -1) ? fieldInputTrimmed : null;
}