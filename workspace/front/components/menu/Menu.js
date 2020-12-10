import { Module } from "../main/Module.js";
import { MenuModel } from "./MenuModel.js";
import { MenuView } from "./MenuView.js";
import { MenuCtrl } from "./MenuCtrl.js";

export class Menu extends Module {
    constructor(){
        let
            model = new MenuModel(),
            view = new MenuView(model),
            ctrl = new MenuCtrl(model, view);
        super(view,ctrl,model);
    }
    async init(page){
        await super.init(page);
    }
}