import { Module } from "../main/Module.js";
import { PluginerModel } from "./PluginerModel.js";
import { PluginerView } from "./PluginerView.js";
import { PluginerCtrl } from "./PluginerCtrl.js";

export class Pluginer extends Module {
    constructor(){
        let
            model = new PluginerModel(),
            view = new PluginerView(model),
            ctrl = new PluginerCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
    }
    async init(page){
        const _ = this;
        return await _.view.render(page);
    }
}