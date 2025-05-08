import * as Blockly from 'blockly';
import { IBlockC } from 'src/utils/interface/c-block';

/* ------------------ Archivo de control de tipos de datos ------------------ */

/* -------------- Interfaces y diccionarios para tipos de datos ------------- */

//Interfaz de información de tipos de dato
export interface IDatatypeInfo {
    "optionString": string,
    "code": string,
    "formatSpecifier": string | null;
}

//Interfaz de diccionario de tipos de dato
export interface IDatatypeDict {
    //Categoría del tipo de dato
    [category: string]: {
        /*  Nombre del tipo de dato (este mismo nombre debe ser usado para los nombres de las opciones
            de los campos de los FieldDropdown de tipos ded ato)*/
        [name: string]: IDatatypeInfo
    }
}

//Diccionario con tipos de dato
export const datatypesDict: IDatatypeDict = {
    //Categoría de tipo de dato primitivo
    "PRIMITIVE": {
        "PRIMITIVE_INTEGER": {
            "optionString": "Entero",
            "code": "int",
            "formatSpecifier": "%d"
        },
        "PRIMITIVE_FLOAT": {
            "optionString": "Flotante",
            "code": "float",
            "formatSpecifier": "%f"
        },
        "PRIMITIVE_DOUBLE": {
            "optionString": "Double",
            "code": "double",
            "formatSpecifier": "%lf"
        },
        "PRIMITIVE_CHAR": {
            "optionString": "Char",
            "code": "char",
            "formatSpecifier": "%c"
        }
    },
    //Categoría de tipo de dato de struct
    "STRUCT": {
    },
    //Categoría de tipo de dato incompleto
    "MISC": {
        //Tipo de dato para puntero a void
        "INCOMPLETE_VOID": {
            "optionString": "Nada o Vacio",
            "code": "void",
            "formatSpecifier": null
        },
        //Tipo de dato para dirección de memoria
        //Este tipo de dato no es un tipo de dato en sí, sino un puntero a void
        //pero que se guada en el diccionario para poder usarlo en el bloque de impresión
        "MEMORY_ADDRESS": {
            "optionString": "Dirección de memoria",
            "code": "void*",
            "formatSpecifier": "%p"
        }
    }
}

//Función para obtener el diccionario de información de tipos de datos mediante el nombre
export function datatypeInfoGetFromName(name: string): IDatatypeInfo | null {
    for(let category in datatypesDict){
        if(datatypesDict[category][name]!= undefined)
            return datatypesDict[category][name];

    }
    return null;
}

/* ----- Arreglos de opciones para los FieldDropdowns de tipos de datos ----- */

//Tipos de datos primitivos
export const arrayOptionsPrimitive: [string,string][] = [];


//Tipos de datos de structs
export const arrayOptionsStruct: [string,string][] = [];
//Todos los tipos de dato
export const arrayOptionsAll: [string,string][] = [];

//Inicializar arreglos de opciones para FieldDropdowns de tipos de datos
for(let category in datatypesDict){
    for(let name in datatypesDict[category]){
        const curDatatype: [string,string] = [datatypesDict[category][name].optionString,name];
        if(category == "PRIMITIVE") arrayOptionsPrimitive.push(curDatatype);
        // if(category == "STRUCT") arrayOptionsStruct.push(curDatatype); 
        arrayOptionsAll.push(curDatatype);
    }
}

//Tipos de datos primitivos con formato de impresión
export const arrayOptionsPrintVariable: [string,string][] = [...arrayOptionsPrimitive];
arrayOptionsPrintVariable.push(['Dirección de memoria','MEMORY_ADDRESS']);


/* -------------- Funciones para manipulación de tipos de datos ------------- */

//Función para añadir tipo de dato de estructura
export function addDatatypeStruct(name: string, keyword: string): boolean{

    //Añadir tipo de dato en el diccionario de tipos de datos
    if(!datatypesDict["STRUCT"][name]){
        datatypesDict["STRUCT"][name] = {
            "optionString": keyword,
            "code": keyword,
            "formatSpecifier": null
        }
        //Añadir tipos de dato en los arreglos de opciones
        arrayOptionsAll.push([keyword,name]);
        arrayOptionsStruct.push([keyword,name]);
        return true;
    }
    return false;
}

//Función para eliminar tipo de dato de estructura
export function removeDatatypeStruct(name: string): void {
    //Eliminar elemento en el diccionario de tipos de datos
    delete datatypesDict["STRUCT"][name]; 
    //Elininar tipos de dato en los arreglos de opciones
    arrayOptionsAll.forEach((option, index) =>{
        if(option[1] == name){
            arrayOptionsAll.splice(index,1);
        }
    })
    arrayOptionsStruct.forEach((option, index) =>{
        if(option[1] == name){
            arrayOptionsStruct.splice(index,1);
        }
    })
}

//Función para eliminar todos los tipos de datos
export function clearDatatypeStruct(){
    //Eliminar todos los tipos de dato en el diccionario de tipos de datos
    for(let name in datatypesDict["STRUCT"]){
        delete datatypesDict["STRUCT"][name]; 
    }
    //Eliminar todos los tipos de dato en los arreglos de opciones
    arrayOptionsAll.length = 0;
    arrayOptionsStruct.length = 0;
}

//Función para actualizar tipo de dato de estructura
export function updateDatatypeStruct(oldName: string,newName:string,newKeyword: string){
    removeDatatypeStruct(oldName);
    addDatatypeStruct(newName,newKeyword);
}

export const arrayOptionsDeclarationItemVariable: [string,string][] = [
    ['variable', 'VARIABLE'],
    ['apuntador', 'POINTER'],
    ['instancia', 'INSTANCE'],
]

export const arrayOptionsDeclarationItemFunction: [string,string][] = [...arrayOptionsDeclarationItemVariable]
arrayOptionsDeclarationItemFunction.push(["nada",'VOID']);


//Generador de opciones de tipos de datos para bloques que especifican una variable
export function datatypeOptionsGenerator(block: IBlockC | null,fieldItemName: string): [string,string][]{
    if(block){
        const blockFieldDeclarationItem = block?.getFieldValue(fieldItemName);
        if(blockFieldDeclarationItem == 'INSTANCE'){
            if(arrayOptionsStruct.length == 0){
                block.setWarningText('No hay ninguna estructura definida.');
                return arrayOptionsPrimitive;
            }else{
                block.setWarningText(null);
                block.setFieldValue('STRUCT_ETIQUETA',fieldItemName);
                return arrayOptionsStruct;
            }
        }
        block.setWarningText(null);
        return arrayOptionsPrimitive;
    }
    return arrayOptionsPrimitive;
}