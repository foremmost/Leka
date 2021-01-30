import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
export class SettingsCtrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;
        _.componentName = 'Settings';
        //MainEventBus.add(_.componentName,'getTabs',_.getTabs.bind(_));
        MainEventBus.add(_.componentName,'getSystemSettings',_.getSystemSettings.bind(_));
        MainEventBus.add(_.componentName,'updateSetting',_.updateSetting.bind(_));
    }
    async updateSetting(changeData){
        const _  = this;
        let inpt = changeData['item'];
        let settingData = {}, propName = inpt.dataset.prop;
        settingData['prop'] = propName;
        if (inpt.tagName === "SELECT"){
            settingData['id'] = inpt.dataset.id;

            settingData['value'] = [];
            for (let option of inpt.options){
                let optionObj = {
                        value:option['value'],
                        name:option.textContent,
                    };
                if (option.selected){
                    optionObj['active'] = true;
                }
                settingData['value'].push(optionObj)
            }
        }else{
            settingData['id'] = inpt.dataset.id;
            settingData['value'] = inpt.value;
        }
         await _.model.updateSetting(settingData);
        await MainEventBus.trigger('Settings','settingChanged',{
            name: propName,
            value:  inpt.value
        });
    }
    async getTabs(){
        const _ = this;
        let tabs = await _.model.getTabs();
        await MainEventBus.trigger(_.componentName, 'loadTabs', tabs);
    }
    async getSystemSettings(){
        const _ = this;
        let response = await _.model.getSystemSettings();
        if(response.status === 'success'){
            //MainEventBus.trigger(_.componentName,'loadTabContent',response['data']);
        }
    }
}