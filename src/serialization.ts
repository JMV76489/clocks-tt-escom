/* -------------------------------------------------------------------------- */
/*    Archivo de serialización, guardado y cargado de proyecto de workspace   */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly'
import { addDatatypeStruct, datatypesDict, IDatatypeInfo } from './libs/datatype';

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

//Función para guardar workspace
export async function saveWorkspace(workspace: Blockly.Workspace){

    //Construir nombre de archivo con fecha
    const fileDate = new Date();
    const filenameDate = fileDate.toLocaleDateString().replace(/\//gi,"-");
    const filenameTime = fileDate.toLocaleTimeString().replace(/:/gi,"-").replace(/[\.]/gi,"_").replace(/\s/g,"");
    const filename = `ProyectoClocks-${filenameDate}-${filenameTime}.clocks`

    const saveData = {
        //Guardar tipos de datos de estructuras
        "datatypesStruct": datatypesDict["STRUCT"],
        //Guardar datos de workspace
        "workspace": Blockly.serialization.workspaces.save(workspace)
    }

    //Serializar workspace en JSON
    const saveDataString = JSON.stringify(saveData); 

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

//Función para cargar workspace
export function loadWorkspace(workspace: Blockly.Workspace){
    fileSelectFromLocal().then((file) =>{
        if(file){
            const reader = new FileReader();
            reader.onload = () =>{
                //Cargar datos
                const loadData = JSON.parse(reader.result as string); 
                //Cargar tipos de datos de estructuras
                const structsDict: {[key: string]: IDatatypeInfo}  = loadData.datatypesStruct; 
                //Agregar tipos de datos de estructuras al diccionario
                for(let structName in structsDict){
                    addDatatypeStruct(structName,structsDict[structName].code);
                }
                Blockly.Events.disable();
                //Cargar workspace
                Blockly.serialization.workspaces.load(loadData.workspace, workspace, undefined); 
                Blockly.Events.enable();
            }
            reader.readAsText(file);
        }
    })
}

