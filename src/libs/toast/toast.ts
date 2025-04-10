/* -------------------------------------------------------------------------- */
/*                  Archivo de fuciones para mostrar toast's                  */
/* -------------------------------------------------------------------------- */

import * as Toastify from 'toastify-js';
import { iconTick, iconWarning } from 'src/assets/assets';
import "./toast-style.css";

export function showWarningToast(messageText: string){
    Toastify({
        avatar: iconWarning,
        text: messageText,
        duration: 2000,
        gravity: "top",
        position: "center",
        close: true,
    }).showToast();
}

export function showToastSuccess(messageText: string){
    Toastify({
        avatar: iconTick,
        text: messageText,
        duration: 1000,
        gravity: "top",
        position: "center",
        close: true,
        stopOnFocus: true
    }).showToast();

}
