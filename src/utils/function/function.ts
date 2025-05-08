/* -------------------------------------------------------------------------- */
/*            Archivo para controlar definiciones de funciones de C           */
/* -------------------------------------------------------------------------- */

//Interfaz de definición de función
interface FunctionDefinition {
    identifier: string;
}

//Diccionario de funciones
export let functionsDictionary: { [name: string]: FunctionDefinition } = {

}

//Función para añadir una definición de función al diccionario
export function addFunctionDefinition(identifier: string){
    functionsDictionary[identifier] = { identifier };
    console.log(functionsDictionary)
}

//Función para actualizar una definición de función en el diccionario
export function updateFunctionDefinition(oldIdentifier: string, newIdentifier: string){
    if (functionsDictionary[oldIdentifier]) {
        functionsDictionary[newIdentifier] = { identifier: newIdentifier };
        delete functionsDictionary[oldIdentifier];
    }
}

//Funcionar para limpiar el diccionario de funciones
export function clearFunctionDictionary(){
    functionsDictionary = {};
}

    