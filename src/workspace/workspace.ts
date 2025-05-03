/* -------------------------------------------------------------------------- */
/*                Archivo de definición y control de workspace                */
/* -------------------------------------------------------------------------- */

import * as Blockly from 'blockly'
import {toolbox} from 'src/toolbox/toolbox'; 
import { PALLETTE } from 'src/utils/constants';
import {Multiselect} from '@mit-app-inventor/blockly-plugin-workspace-multiselect';
import Swal from 'sweetalert2';
import 'src/utils/sweetalert2/sweetalert2-style.css';
import { iconWarning } from 'src/assets/assets';

//Div para inyectar el workspace
const blocklyDiv = document.getElementById('blockly-div') as HTMLDivElement;

//Verificar si el div para el workspace existe
if (!blocklyDiv) {
    throw new Error(`div with id 'blocklyDiv' not found`);
}

// Definir un tema personalizado con una fuente específica
const customTheme = Blockly.Theme.defineTheme('themeClocksClassic', {
  'name': 'themeClocksClassic',
  'base': Blockly.Themes.Classic,
  'fontStyle': {
    family: 'bradley hand, cursive',// Cambia la fuente
    size: 11
  },
  'blockStyles':{
    'c_function_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.function
    },
    'c_variable_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.variable
    },
    'c_value_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.value
    },
    'c_condition_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.condition
    },
    'c_math_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.math
    },
    'c_logic_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.logic
    },
    'c_loop_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.loop
    },
    'c_print_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.print
    },
    'c_pointer_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.pointer
    },
    'c_struct_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.struct
    },
    'c_memory_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.memory
    },
    'c_input_blocks': {
      'colourPrimary': PALLETTE.BLOCKS.input
    },
  },
  'categoryStyles': {
    'logic_category': {
      'colour': "#8b4513",
    },
    'c_function': {
      'colour': PALLETTE.BLOCKS.function
    },
    'c_variable': {
      colour: PALLETTE.BLOCKS.variable
    },
    'c_value': {
      colour: PALLETTE.BLOCKS.value
    },
    'c_condition' : {
      'colour': PALLETTE.BLOCKS.condition
    },
    'c_math' : {
      'colour': PALLETTE.BLOCKS.math
    },
    'c_logic' : {
      'colour': PALLETTE.BLOCKS.logic
    },
    'c_loop' : {
      'colour': PALLETTE.BLOCKS.loop
    },
    'c_print' : {
      'colour': PALLETTE.BLOCKS.print
    },
    'c_pointer' : {
      'colour': PALLETTE.BLOCKS.pointer
    },
    'c_struct' : {
      'colour': PALLETTE.BLOCKS.struct
    },
    'c_memory' : {
      'colour': PALLETTE.BLOCKS.memory
    },
    'c_input' : {
      'colour': PALLETTE.BLOCKS.input
    }
  },
});

//Inyectar y exportar workspace
export const clocksWorkspace = Blockly.inject(blocklyDiv, 
  //Opciones de Blockly
  {
  //Caja de herramientas
  toolbox: toolbox, 
  //Tema del workspace
  theme: customTheme,
  //Opciones de zoom
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.05,
    pinch: true
  },
  //Opciones de cuadricula
  grid: {
    spacing: 20,
    length: 4,
    colour: '#CCCCCC',
    snap: true
  },
  
});

//Opciones del multiselector (Licensia Apache 2.0 por MIT)
const multiselectOptions = {
  useDoubleClick: false, //Usar doble click para seleccionar bloques
  bumpNeighbours: false, //Bumpear bloques vecinos al seleccionar
  multiFieldUpdate: false, //No actualizar varios campos al mismo tiempo
  workspaceAutoFocus: true, //Autoenfocar el workspace al seleccionar bloques
  //Iconos del multiselector
  multiselectIcon: {
    hideIcon: false,
    weight: 3,
    enabledIcon: 'https://github.com/mit-cml/workspace-multiselect/raw/main/test/media/select.svg',
    disabledIcon: 'https://github.com/mit-cml/workspace-multiselect/raw/main/test/media/unselect.svg',
  },
  //Teclas de acceso rapido para el multiselector
  multiSelectKeys: ['Shift'], 
  //Opciones de copiado y pegado del multiselector
  multiselectCopyPaste: {
    crossTab: false,
    menu: false,
  },
};

//Inicializar plugin del multiselector
const multiselectPlugin = new Multiselect(clocksWorkspace);
multiselectPlugin.init(multiselectOptions);

//Cambiar el texto del menu contextual
const selectAllBlocksOption = Blockly.ContextMenuRegistry.registry.getItem('workspaceSelectAll');
if (selectAllBlocksOption) {
  Blockly.ContextMenuRegistry.registry.unregister('workspaceSelectAll');
  Blockly.ContextMenuRegistry.registry.register({
    ...selectAllBlocksOption,
    displayText: function() {
      return 'Seleccionar todos los bloques';
    },
  });
}

//Función para inicializar workspace
export function workspaceInit(codeDiv: HTMLDivElement) {
    clocksWorkspace.clear(); //Limpiar workspace
    //Colocar bloque main en el workspace
    const blockMain = clocksWorkspace.newBlock('c_function_main');
    blockMain.initSvg();
    blockMain.render();
    codeDiv.innerHTML = ''; //Limpiar div de código generado
}

//Función para crear nuevo proyecto
export function newProject(codeDiv: HTMLDivElement){
  Swal.fire({
    title: '¿Crear nuevo proyecto?',
    text: "El proyecto actual será borrado",
    color: 'black',
    imageUrl: iconWarning,
    imageWidth: 100,
    imageHeight: 100,
    imageAlt: 'Icono de advertencia',
    showDenyButton: true,
    confirmButtonText: 'Si',
    denyButtonText: 'No',
    background: PALLETTE.UI.popup,
    customClass:{
      title: 'alert-title',
      popup: 'alert-popup',
      confirmButton: 'alert-confirm-button',
      denyButton: 'alert-deny-button',
    }
  }).then((result)=>{
    if(result.isConfirmed){
      workspaceInit(codeDiv);
    }
  })
}