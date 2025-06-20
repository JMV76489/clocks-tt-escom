/* -------------------------------------------------------------------------- */
/*                  Archivo de fuciones para mostrar toast's                  */
/* -------------------------------------------------------------------------- */

import * as Toastify from 'toastify-js';
import { iconTick, iconWarning } from 'src/assets/assets';
import "./toast-style.css";
import Swal from 'sweetalert2';

export function showWarningIdentifierToast(messageText: string){
    Toastify({
        avatar: iconWarning,
        text: messageText,
        duration: 2000,
        gravity: "top",
        position: "center",
        close: true,
        backgroundColor: "#cd5959"
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
        stopOnFocus: true,
        backgroundColor: "#5692CE",
    }).showToast();

}
