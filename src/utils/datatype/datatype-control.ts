import { IBlockC } from "../interface/c-block";
import { Datatype } from "./datatype";

interface IDatatypeControlDict{
    [category: string]: {
        [name: string]: Datatype
    }
    
}

export class DatatypeControl {
    private static datatypesDict: IDatatypeControlDict = {
        //Categoría de tipo de dato primitivo
        "PRIMITIVE": {
            "PRIMITIVE_INTEGER": new Datatype("PRIMITIVE_INTEGER", "int", "%d", "PRIMITIVE", "Entero"),
            "PRIMITIVE_FLOAT": new Datatype("PRIMITIVE_FLOAT", "float", "%f", "PRIMITIVE", "Flotante"),
            "PRIMITIVE_DOUBLE": new Datatype("PRIMITIVE_DOUBLE", "double", "%lf", "PRIMITIVE", "Double"),
            "PRIMITIVE_CHAR": new Datatype("PRIMITIVE_CHAR", "char", "%c", "PRIMITIVE", "Char"),
        },
        //Categoría de tipo de dato de struct
        "STRUCT": {
        },
        //Categoría de tipo de dato incompleto
        "INCOMPLETE": {
            "INCOMPLETE_VOID": new Datatype("INCOMPLETE_VOID", "void", null, "INCOMPLETE", "Nada o Vacio"),
        }
    }

    private static arrayOptionsPrimitive: [string, string][] = [];
    private static arrayOptionsStruct: [string, string][] = [];
    private static arrayOptionsAll: [string, string][] = [];
    private static arrayOptionsDeclarationItemVariable: [string, string][] = [];
    private static arrayOptionsDeclarationItemFunction: [string, string][] = [];

    public static initialize() {
        // Inicializar arreglos de opciones de tipos de datos  
        for (let category in DatatypeControl.datatypesDict) {
            for (let datatypeName in DatatypeControl.datatypesDict[category]) {
                const datatypeInstance = DatatypeControl.datatypesDict[category][datatypeName];
                if (category === "PRIMITIVE") 
                    DatatypeControl.arrayOptionsPrimitive.push([datatypeInstance.getOptionString(), datatypeName]);
                DatatypeControl.arrayOptionsAll.push([datatypeInstance.getOptionString(), datatypeName]);
            }
        }

        this.arrayOptionsDeclarationItemVariable = [
            ['variable', 'VARIABLE'],
            ['apuntador', 'POINTER'],
            ['instancia', 'INSTANCE']
        ]

        this.arrayOptionsDeclarationItemFunction = [...this.arrayOptionsDeclarationItemVariable];
        this.arrayOptionsDeclarationItemFunction.push(["nada",'VOID']);


    }

    public static addDatatypeStruct(name: string, code: string) {
        this.datatypesDict["STRUCT"][name] = new Datatype(name, code, null, "STRUCT", name);
        this.arrayOptionsStruct.push([name, name]);
        this.arrayOptionsAll.push([name, name]);
    }

    public static removeDatatypeStruct(name: string) {
        delete this.datatypesDict["STRUCT"][name];  
        this.arrayOptionsStruct = this.arrayOptionsStruct.filter(option => option[1] !== name); //Eliminar de arrayOptionsStruct
        this.arrayOptionsAll = this.arrayOptionsAll.filter(option => option[1] !== name); //Eliminar de arrayOptionsAll
    }

    public static updateDatatypeStruct(oldName: string, newName: string, code: string) {
        //Actualizar nombre de tipo de dato en el diccionario   
        delete this.datatypesDict["STRUCT"][oldName]; //Eliminar el antiguo
        this.datatypesDict["STRUCT"][newName] = new Datatype(newName, code, null, "STRUCT", newName);
        this.arrayOptionsStruct = this.arrayOptionsStruct.map(option => {
            if (option[1] === oldName) {
                return [newName, newName]; //Actualizar el nombre en el arrayOptionsStruct
            }
            return option;
        }); //Actualizar el nombre en el arrayOptionsStruct

        this.arrayOptionsAll = this.arrayOptionsAll.map(option => {
            if (option[1] === oldName) {
                return [newName, newName]; //Actualizar el nombre en el arrayOptionsAll
            }
            return option;
        }); //Actualizar el nombre en el arrayOptionsAll
    }

    public static getDatatypeFromName(name: string): Datatype | null {
        for (const category in this.datatypesDict) {
            const datatype = this.datatypesDict[category][name];
            if (datatype) {
                return datatype;
            }
        }
        return null; // Si no se encuentra el tipo de dato, devolver null
    }

    public static datatypeOptionsGenerator(block: IBlockC | null, fieldItemName: string): [string, string][] {
        const datatypeOptions: [string, string][] = [];

        if (block) {
            const blockFieldDeclarationItem = block.getFieldValue(fieldItemName);
                if(blockFieldDeclarationItem == 'INSTANCE'){    
                    if(this.arrayOptionsStruct.length == 0){
                        block.setWarningText('No hay ninguna estructura definida.');
                        return this.arrayOptionsPrimitive;
                    }else{
                        block.setWarningText(null);
                        return this.arrayOptionsStruct;
                    }
                }

            block.setWarningText(null);
            return this.arrayOptionsPrimitive;
        }
        return this.arrayOptionsPrimitive;
    }

    /* ------------------- Métodos setter y getter de atibutos ------------------ */

    public static getDatatypesDict(): IDatatypeControlDict {
        return this.datatypesDict;
    }

    public static getArrayOptionsPrimitive(): [string, string][] {
        return this.arrayOptionsPrimitive;
    }

    public static setArrayOptionsPrimitive(arrayOptions: [string, string][]) {
        this.arrayOptionsPrimitive = arrayOptions;     
    }

    public static getArrayOptionsStruct(): [string, string][] {
        return this.arrayOptionsStruct;
    }  
    
    public static setArrayOptionsStruct(arrayOptions: [string, string][]) {
        this.arrayOptionsStruct = arrayOptions; 
    }

    public static getArrayOptionsAll(): [string, string][] {
        return this.arrayOptionsAll;
    }

    public static setArrayOptionsAll(arrayOptions: [string, string][]) {
        this.arrayOptionsAll = arrayOptions; 
    }
}

DatatypeControl.initialize(); // Inicializar la clase al cargar el script