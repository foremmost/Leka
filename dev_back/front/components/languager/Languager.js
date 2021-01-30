import { Module } from "../main/Module.js";
import { LanguagerModel } from "./LanguagerModel.js";
import { LanguagerView } from "./LanguagerView.js";
import { LanguagerCtrl } from "./LanguagerCtrl.js";

export class Languager extends Module {
    constructor(){
        let
            model = new LanguagerModel(),
            view = new LanguagerView(model),
            ctrl = new LanguagerCtrl(model, view);
        super(view,ctrl,model);
    }
    async init(page){
        super.init(page);
        const _ = this;
        return new Promise(async function (resolve) {
            await _.model.acceptSettings([
                {name:'Items per page',prop:'perPage'}
            ]);
            resolve(_);
        });
    }
    async changeLang(changeData){
        return await this.ctrl.changeLang(changeData);
    }
    setCurrentLang(lang){
        this.model.currentLang = lang;
    }
}
