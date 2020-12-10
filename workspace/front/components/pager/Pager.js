import { Module } from "../main/Module.js";
import { PagerModel } from "./PagerModel.js";
import { PagerView } from "./PagerView.js";
import { PagerCtrl } from "./PagerCtrl.js";

export class Pager extends Module {
    constructor(){
        let
            model = new PagerModel(),
            view = new PagerView(model),
            ctrl = new PagerCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
    }
    async init(page){
        const _ = this;
        return await _.view.render(page);
    }
}