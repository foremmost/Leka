import { Module } from "../main/Module.js";
import { LogModel } from "./LogModel.js";
import { LogView } from "./LogView.js";
import { LogCtrl } from "./LogCtrl.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";

export class Log extends Module {
    constructor(){
        let
            model = new LogModel(),
            view = new LogView(model),
            ctrl = new LogCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
        _.componentName = 'Log';
    }
    async install(){
        super.install();
        await MainEventBus.trigger('Settings', 'setSetting', {
            name: 'Log head length',
            value: 20
        });
        await MainEventBus.trigger('Settings', 'setSetting', {
            name: 'Log description length',
            value: 60
        });
        await MainEventBus.trigger('Settings', 'setSetting', {
            name: 'Time to live',
            value: 4
        });

    }
    async reinstall(){
        super.reinstall();
    }
    async uninstall(){
        super.uninstall();
        super.uninstall();
    }

    async init(page){
        super.init(page);
        const _ = this;

        await _.model.acceptSettings([
            {name:'Items per page',prop:'perPage'},
            {name:'Time to live',prop:'timeToLive'},
            {name:'Log head length',prop:'headLength'},
            {name:'Log description length',prop:'textLength'}
        ]);
        return _.view.render(page);
    }
}