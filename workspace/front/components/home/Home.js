import { Module } from "../main/Module.js";
import { HomeModel } from "./HomeModel.js";
import { HomeView } from "./HomeView.js";
import { HomeCtrl } from "./HomeCtrl.js";

export class Home extends Module {
    constructor(){
        let
            model = new HomeModel(),
            view = new HomeView(model),
            ctrl = new HomeCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
    }
    async init(page){
        const _ = this;
        return await _.view.render(page);
    }
}