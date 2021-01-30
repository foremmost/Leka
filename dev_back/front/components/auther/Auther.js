import { Module } from "../main/Module.js";
import { AutherModel } from "./AutherModel.js";
import { AutherView } from "./AutherView.js";
import { AutherCtrl } from "./AutherCtrl.js";
export class Auther extends Module {
    constructor(){
        let
            model = new AutherModel(),
            view = new AutherView(model),
            ctrl = new AutherCtrl(model, view);
        super(view,ctrl,model);
    }
    async init(page){
        super.init(page);
        const _ = this;
        return await _.view.render(page);
    }
    async frontLogin(loginData){
        return await this.model.frontLogin(loginData);
    }
    async frontCheckLogin(loginData){
        return await this.model.frontCheckLogin(loginData);
    }
}
