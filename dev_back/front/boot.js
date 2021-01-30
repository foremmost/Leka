import { Loader } from "./libs/Loader.lib.js";
window.addEventListener('load',() =>{
    (async()=>{
        await new Loader().init()
    })();
});