import { Module } from "../main/Module.js";
import { Model } from "./Model.js";
import { View } from "./View.js";
import { Ctrl } from "./Ctrl.js";

export class Module extends Module {
    constructor(){
        let
            model = new Model(),
            view = new View(model),
            ctrl = new Ctrl(model, view);
        super(view,ctrl,model);
        const _ = this;
    }
    async init(page){
        const _ = this;
        return await _.view.render(page);
    }
}