import { header } from './header.js';
import { mydraw } from './mydraw.js';
import { AllDraw } from './AllDraw.js';
import { index } from './index.js';

const URL_FRONT= import.meta.env.VITE_URL_FRONT

function load() {
    header();
    if (window.location.href === `${window.location.origin}/pages/mydraw.html`) {
        mydraw();   
    }
    if (window.location.href === `${window.location.origin}/pages/AllDraw.html`) {
        AllDraw();
    }
    if (window.location.href === `${window.location.origin}`){
        index();
    }
}

window.onload = load;
