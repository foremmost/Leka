import { Module } from "../main/Module.js";
import { StatisticModel } from "./StatisticModel.js";
import { StatisticView } from "./StatisticView.js";
import { StatisticCtrl } from "./StatisticCtrl.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";


export class Statistic extends Module {
    constructor(){
        let
            model = new StatisticModel(),
            view = new StatisticView(model),
            ctrl = new StatisticCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
        _.componentName = 'Statistic';
    }
    async init(page){
        super.init(page);
        const _ = this;

        return _.view.render(page);
    }

}