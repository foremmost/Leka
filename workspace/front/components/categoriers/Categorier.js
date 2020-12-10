import { Module } from "../main/Module.js";
import { CategorierModel } from "./CategorierModel.js";
import { CategorierView } from "./CategorierView.js";
import { CategorierCtrl } from "./CategorierCtrl.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";

export class Categorier extends Module {
    constructor(){
        let
            model = new CategorierModel(),
            view = new CategorierView(model),
            ctrl = new CategorierCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
    }
    async init(page){
        const _ = this;
        super.init(page);
        return _.view.render(page);
    }
}