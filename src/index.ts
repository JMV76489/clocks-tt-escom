/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* -------------------------------------------------------------------------- */
/*                     Archivo principal de la aplicación                     */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly';
import * as Assets from './assets/assets';
import * as Es from 'blockly/msg/es'; 
import './index.css';
import './blocks/blocks'
import { cGenerator } from './generators/c';
import { clocksWorkspace,newProject,workspaceInit } from './workspace';
import { loadProject, saveProject } from './serialization';
import { showToastSuccess } from './utils/toast/toast';

/* ---------------- Ajustar elementos de la interfaz gráfica ---------------- */

Blockly.setLocale(Es) //Fijar idioma español a Blockly

//Obtener elementos de la interfaz gráfica
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blockly-div');

//Asignar imagen al elemento del logo
const dom_logo = document.getElementById("img-logo") as HTMLImageElement;
dom_logo?.setAttribute('src',Assets.clocksLogo);

//Colocar favicon en el index.html
let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
if (!faviconLink) {
    faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    document.head.appendChild(faviconLink);
}
faviconLink.href = Assets.iconFav;

/* ----------------------- Asignar funciones a botones ---------------------- */

//Obtener elementos de botones
const buttonCodeGeneration = document.getElementById('button-code-generate') as HTMLButtonElement;
const buttonCodeCopy = document.getElementById('button-code-copy') as HTMLButtonElement;
const buttonSaveWorkspace = document.getElementById('button-project-save') as HTMLButtonElement;
const buttonLoadWorkspace = document.getElementById('button-project-load') as HTMLButtonElement;
const buttonNewProject = document.getElementById('button-project-new') as HTMLButtonElement;;

//Botón de generación de código
const codeDiv = document.getElementById('generated-code')?.firstChild as HTMLDivElement;
buttonCodeGeneration.onclick = function(){
  const code = cGenerator.workspaceToCode(clocksWorkspace);
  codeDiv!.innerHTML = code;
  showToastSuccess("Código generado correctamente");
}

//Botón de copiar código
buttonCodeCopy.onclick = function(){
  navigator.clipboard.writeText(codeDiv!.innerText);
}

//Botón de guardar workspace
buttonSaveWorkspace.onclick = function(){
  saveProject(clocksWorkspace);
}

//Botón de cargar workspace
buttonLoadWorkspace.onclick = function(){
  loadProject(clocksWorkspace);
}

//Botón de nuevo proyecto
buttonNewProject.onclick = function(){
  newProject(codeDiv);
}

//Inicializar workspace
workspaceInit(codeDiv);