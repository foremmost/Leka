import {Model} from '../main/Model.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";

export class SettingsModel extends Model {
    constructor()  {
        super();
        const _ = this;
        _.componentName = 'Settings';
        _.settings = new Map();
        MainEventBus.add(_.componentName, 'initSystemSettings', _.initSystemSettings.bind(_));
    }

    async getSetting(settingObj) {
        const _ = this;
        if (!settingObj['name']) return ;
        if (_.settings.has(settingObj['name'])) {
            return _.settings.get(settingObj['name']);
        }
        let
            name = settingObj['name'] || '',
            moduleId = settingObj['module_id'] || null;

        let response = await _.handler({
                method: 'getSetting',
                type: 'class',
                data: {
                    'name': name,
                    'moduleId': moduleId,
                }
            }, 'JSON'
        );
        _.settings.set(settingObj['name'], response);
        return response;
    }

    async setSetting(settingObj) {
        const _ = this;
        let
            name = settingObj['name'] || '',
            value = settingObj['value'] || '',
            moduleId = settingObj['module_id'] || null;
        return await _.handler({
                method: 'setSetting',
                type: 'class',
                data: {
                    'name': name,
                    'value': value,
                    'moduleId': moduleId,
                }
            }, 'JSON'
        );
    }

    async updateSetting(settingObj) {
        const _ = this;
        let response = await _.handler({
                method: 'updateSetting',
                type: 'class',
                data: settingObj
            }, 'JSON'
        );
        _.settings.set(settingObj['prop'],{
            status: 'success',
            data: settingObj
        });
        return response;
    }

    async getTabs() {
        const _ = this;
        return _.handler({
            method: 'getTabs',
            data: null
        }, 'JSON');
    }

    async getSystemSettings() {
        const _ = this;
        return await _.handler({
            method: 'getSystemSettings',
            type: 'class',
            data: null
        }, 'JSON');
    }

    async initSystemSettings() {
        const _ = this;
        let response = await _.handler({
            method: 'getSystemSettings',
            type: 'class',
            data: null
        }, 'JSON');
        if (response.status === 'success') {
            for (let i = 0; i < response.data.length; i++) {
                let outSetting = {
                    status: 'success',
                    data: response.data[i]
                };
                _.settings.set(outSetting['data']['name'], outSetting);
            }
        }
        return response;
    }
}

