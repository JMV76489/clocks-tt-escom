/* ------------------ - Archivo de generador de código de C ----------------- */

import * as Blockly from 'blockly/core';
import { BlockC } from 'src/libs/interface/block-interface';
import { STRING_CODE_HTML_FORMAT } from 'src/libs/constants';

//Crear generador de cógo en C
export const cGenerator = new Blockly.Generator('C');

//Lista de bloques de sentencias que no necesitan un punto y coma después.
const BLOCKS_STATEMENTS_NOT_NEED_SEMICOLON = [
  "c_function_main",
  "c_function_definition",
  "c_condition_if",
  "c_loop_while",
  "c_loop_do_while",
  "c_loop_for_increment",
  "c_condition_switch_cases",
  "c_condition_switch",
]

//Sobreescribir método BlockToCode para agregar formato de color
export const cGeneratorBlockToCode = cGenerator.blockToCode
cGenerator.blockToCode = function (block: Blockly.Block): string | [string, number] {
  let generatedCode = cGeneratorBlockToCode.call(this,block)
  let unformattedCode = '';
  let blockColor = block?.getColour();
  if(Array.isArray(generatedCode))
    unformattedCode = generatedCode[0];
  else
    unformattedCode = generatedCode

  let formatedCode = `<span style = "color: ${blockColor};">${unformattedCode}</span>`;

  return Array.isArray(generatedCode) ? [formatedCode,generatedCode[1]] : formatedCode;
}

//Sobreescritura¿ del metodo scrub para controlar la generación de código de bloques por lineas.
cGenerator.scrub_ = function(block, code, thisOnly) {

  //Siguiente bloque conectado al actual
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();

  //Verificar que el bloque no sea una sentencia
  if(!block.outputConnection){
    //Booleano que identifica si es un bloque que no necesita punto y coma
    const noNeedSemicolon = BLOCKS_STATEMENTS_NOT_NEED_SEMICOLON.indexOf(block.type) == -1;
    return code + (noNeedSemicolon ? STRING_CODE_HTML_FORMAT.SEMICOLON : '') + ((nextBlock && !thisOnly) ? `\n${this.blockToCode(nextBlock)}` : '')
  }else{
    //Devolver unicamente el código si no se trata de una sentencia
    return code
  }
}

//Sobreescribir método workspaceToCode para controlar el manejo del código del workspace
cGenerator.workspaceToCode = function(workspace): string{

  //Filtrar bloques por diferentes tipos para controlar el orden de cada uno de ellos
  const blocks = workspace?.getAllBlocks(true); //Todos los bloques
  const functionBlocks = blocks?.filter(block => ["c_function_definition"].includes(block.type)); //Bloques de función
  const structBlocks = blocks?.filter(block => ["c_struct_definition"].includes(block.type)); //Bloques de definición de estructura
  const mainBlock = blocks?.filter(block => ["c_function_main"].includes(block.type))[0]; //Bloque main

  /* ------------ Proceso de concatenación de códigos del workspace ----------- */
  let workspaceCode = '';

  //Agregar uso de librerias por bloques a un conjunto 
  const blocksLibraryUseSet = new Set<string>();
  blocks?.forEach(block =>{
    //Agregar uso de librería unicamente a bloques que se encuentren dentro del main o de una función
    if(["c_function_definition","c_function_main"].indexOf(block.getRootBlock().type) !== -1){
      const blockLibraryUse = (block as BlockC).libraryUse;
      if(blockLibraryUse){
        blocksLibraryUseSet.add(blockLibraryUse);
      }
    }
  });

  //Concatenar código de liberías
  blocksLibraryUseSet.forEach(library =>{
    
    workspaceCode += `#include &lt${library}&gt\n`;
  });
  if(blocksLibraryUseSet.size)
    workspaceCode += "\n";
  

  //Concatenar códigos de estructuras
  structBlocks?.forEach(block =>{
    workspaceCode += `${cGenerator.blockToCode(block)}\n\n`;
  });
  if(structBlocks?.length)
    workspaceCode += "\n";
  
  /*Generar código de funciónes y guardarlos en un arreglo para primero colocar los prototipos y luego
   las definiciones*/
  let functionDefinitionCodes: string[] = [];
  functionBlocks?.forEach(block =>{
    const blockFunctionCode = cGenerator.blockToCode(block)
    /*En caso de que por alguna extraña razon el código sea una tupla [string, number], solamente se
    tomara la parte donde esta la cadena*/
    functionDefinitionCodes.push(Array.isArray(blockFunctionCode) ? blockFunctionCode[0] : blockFunctionCode);
  });

  //Concatenar códigos de prototipos de función
  functionDefinitionCodes.forEach(code =>{
    workspaceCode += `${code.split("{")[0]}${STRING_CODE_HTML_FORMAT.SEMICOLON}\n`;
  });
  if(functionBlocks?.length)
    workspaceCode += "\n";

  //Concatenar código de función main
  workspaceCode+= `${cGenerator.blockToCode(mainBlock!)}\n\n`;

  //Concatenar código de cuerpo de funciones
  functionDefinitionCodes.forEach(code =>{
    workspaceCode += `${code}\n\n`;
  });

  return workspaceCode.trimEnd();
}