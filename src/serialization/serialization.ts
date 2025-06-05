/* -------------------------------------------------------------------------- */
/*    Archivo de serialización, guardado y cargado de proyecto de workspace   */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly'
import { addDatatypeStruct, clearDatatypeStruct, datatypesDict, IDatatypeInfo } from '../utils/datatype';
import { addFunctionDefinition, clearFunctionDictionary, functionsDictionary } from 'src/utils/function/function';
import Swal from 'sweetalert2';
import { PALLETTE } from 'src/utils/constants';

//Descargar workspace como archivo
function downloadWorkspaceFile(workspaceDataString: string,filename: string){

    const blobWorkspaceFileData = new Blob([workspaceDataString],{type: 'text/plain'});

    const url = URL.createObjectURL(blobWorkspaceFileData);
    const downloadElement = document.createElement("a");
    downloadElement.href = url;
    downloadElement.download = filename;
    downloadElement.click();
    window.URL.revokeObjectURL(url);
    
}

//Función para serializar el workspace y los tipos de datos de estructuras
// y funciones definidas por el usuario
export const serializeProject = function(workspace: Blockly.Workspace) {
    const projectData = {
        //Guardar tipos de datos de estructuras
        "datatypesStruct": datatypesDict["STRUCT"],
        //Guardar funciones definidas por el usuario
        "functions": functionsDictionary,
        //Guardar datos de workspace
        "workspace": Blockly.serialization.workspaces.save(workspace)
    }

    //DEBUG
    //console.log(JSON.stringify(Blockly.serialization.workspaces.save(workspace)));


    //Serializar workspace en JSON
    return JSON.stringify(projectData);
}

//Función para guardado rápido del workspace en el navegador
export function quickSaveInBrowser(workspace: Blockly.Workspace) {
    const saveDataString = serializeProject(workspace);
    const storageKey = 'mainWorkspace';
    window.localStorage?.setItem(storageKey, saveDataString);
}

//Función para guardar workspace
export async function saveProject(workspace: Blockly.Workspace){

    //Construir nombre de archivo con fecha
    const fileDate = new Date();
    const filenameDate = fileDate.toLocaleDateString().replace(/\//gi,"-");
    const filenameTime = fileDate.toLocaleTimeString().replace(/:/gi,"-").replace(/[\.]/gi,"_").replace(/\s/g,"");
    const filename = `ProyectoClocks-${filenameDate}-${filenameTime}.clocks`

    //Serializar workspace y datos del proyecto en JSON
    const saveDataString = serializeProject(workspace);

    //Probar compatibilidad con el File Picker, en caso de que no se pueda, descargar archivo automaticamente
    try{
        const handleFilePicker = await window.showSaveFilePicker({
            suggestedName: filename,
            types: [
                {
                    description: 'Proyecto de Clocks',
                    accept: { 'application/json': ['.clocks'] },
                }
            ]
        });
        const writable = await handleFilePicker.createWritable();
        await writable.write(saveDataString);
        await writable.close();
        //Si se guarda correctamente, mostrar mensaje de éxito
        Swal.fire({
            title: 'Proyecto guardado',
            text: `El proyecto se ha guardado correctamente como: "${filename}"`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            background: PALLETTE.UI.popup,
            customClass: {
                title: 'alert-title',
                popup: 'alert-popup',
                confirmButton: 'alert-confirm-button',
            }
        });
    }catch(exception: any){
        if (exception.name === 'AbortError')
            return;
        downloadWorkspaceFile(saveDataString,filename);
    }
}

//Función para cargar archivo desde disco duro
function fileSelectFromLocal(): Promise<File | null> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.clocks'; 
        input.addEventListener('change', () => {
            if (input.files && input.files.length > 0) {
                resolve(input.files[0]); 
            } else {
                resolve(null); 
            }
        });
        input.click();
    });
}

//Función para cargar workspace a partir de un string JSON
//Esta función carga el workspace y los tipos de datos de estructuras
export function loadProject(workspace: Blockly.Workspace,data: string){
    //Cargar datos
    const loadData = JSON.parse(data); 
    //Cargar tipos de datos de estructuras
    const structsDict: {[key: string]: IDatatypeInfo}  = loadData.datatypesStruct || {}; 
    //Limpiar tipos de datos de estructuras
    clearDatatypeStruct();
    //Agregar tipos de datos de estructuras al diccionario
    for(let structName in structsDict){
        addDatatypeStruct(structName,structsDict[structName].code);
    }
    //Cargar funciones definidas por el usuario
    const functionsDict: {[key: string]: IDatatypeInfo}  = loadData.functions || {};
    //Limpiar funciones definidas por el usuario
    clearFunctionDictionary();
    //Agregar funciones al diccionario
    for(let functionName in functionsDict){
        addFunctionDefinition(functionName);
    }
    Blockly.Events.disable();
    //Cargar workspace
    Blockly.serialization.workspaces.load(loadData.workspace, workspace, {
        recordUndo: true, //Habilitar undo al cargar workspace
    }); 
    Blockly.Events.enable();
}

//Función para cargar workspace
export function loadProjectFromFile(workspace: Blockly.Workspace){
    fileSelectFromLocal().then((file) =>{
        if(file){
            const reader = new FileReader();
            reader.onload = () =>{
                const fileData = reader.result as string;
                //Cargar proyecto
                loadProject(workspace,fileData);
            }
            reader.readAsText(file);
        }
    })
}

//Función para cargado rapido de workspace y datos desde el navegador
export function quickLoadFromBrowser(workspace: Blockly.Workspace){
    const storageKey = 'mainWorkspace';
    const fileData = window.localStorage?.getItem(storageKey);
    if(fileData){
        loadProject(workspace,fileData);
    }
}
