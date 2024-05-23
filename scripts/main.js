import { header } from './header.js';
import { mydraw } from './mydraw.js';
import { AllDraw } from './AllDraw.js';
import { index } from './index.js';

const URL_FRONT= import.meta.env.VITE_URL_FRONT

function load() {
    header();
    if (window.location.href === `${URL_FRONT}/pages/myDraw.html`) {
        mydraw();   
    }
    if (window.location.href === `${URL_FRONT}/pages/AllDraw.html`) {
        AllDraw();
    }
    if (window.location.href === `${URL_FRONT}/index.html`){
        index();
    }
}

window.onload = load;
