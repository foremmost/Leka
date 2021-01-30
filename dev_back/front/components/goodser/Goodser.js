import { Module } from "../main/Module.js";
import { GoodserModel } from "./GoodserModel.js";
import { GoodserView } from "./GoodserView.js";
import { GoodserCtrl } from "./GoodserCtrl.js";
export class Goodser extends Module {
    constructor(page){
        let
            model = new GoodserModel(),
            view = new GoodserView(model),
            ctrl = new GoodserCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
    }
    async init(page){
        const _ = this;
        return await _.view.render(page);
    }
}