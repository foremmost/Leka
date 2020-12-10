import { Module } from "../main/Module.js";
import { ConsultantModel } from "./ConsultantModel.js";
import { ConsultantView } from "./ConsultantView.js";
import { ConsultantCtrl } from "./ConsultantCtrl.js";

export class Consultant extends Module {
    constructor(){
        let
            model = new ConsultantModel(),
            view = new ConsultantView(model),
            ctrl = new ConsultantCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
    }
    async init(page){
        const _ = this;
        return await _.view.render(page);
    }
}