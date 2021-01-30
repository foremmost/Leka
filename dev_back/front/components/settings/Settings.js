import {Module} from "../main/Module.js";
import {SettingsModel} from "./SettingsModel.js";
import {SettingsView} from "./SettingsView.js";
import {SettingsCtrl} from "./SettingsCtrl.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";

export class Settings extends Module {
    constructor(){
        let
            model = new SettingsModel(),
            view = new SettingsView(model),
            ctrl = new SettingsCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
        _.componentName = 'Settings';
        MainEventBus.add('Settings','getSetting',_.getSetting.bind(_),'Settings');
        MainEventBus.add('Settings','setSetting',_.setSetting.bind(_),'Settings');

    }
    async getSetting(setting){
        const _ = this;
        return  new Promise( async function (resolve) {
            let sended = await _.model.getSetting(setting);
            if (sended.status === 'success')    resolve(sended['data']);
        })
    }
    async setSetting(setting){
        const _ = this;
        return await _.model.setSetting(setting);
    }
    async updateSetting(updateData){
        const _ = this;
        return await _.ctrl.updateSetting(updateData);
    }
    async init(page){
        super.init(page);
        const _ = this;
        return new Promise( async function (resolve) {
            await _.model.initSystemSettings();
            await _.model.acceptSettings([{name:'Theme',prop:'theme'}]);
            _.view.updateThemeFromSetting(_.model.theme);
            resolve( _.view.render(page));
        });
    }
}