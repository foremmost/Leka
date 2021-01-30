import { View } from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
export class SettingsView extends View {
    constructor(model){
        super(model);
        const _ = this;
        _.componentName = 'Settings';
       _.modulePage = 'settings';
       MainEventBus.add(_.componentName,'updateTheme',_.updateThemeFromSelect.bind(_))
       //MainEventBus.add(_.componentName,'loadTabContent',_.loadTabContent.bind(_))
       // MainEventBus.add('Loader','modulesLoaded',_.render.bind(_),_.componentName+'Render');
    }
    updateThemeFromSelect(select){
        let value = select.value;
       document.body.className = value;

    }
    updateThemeFromSetting(setting){
       document.body.className = setting;
    }
    async pageHeadTpl(pageData = {}){
        const _ =  this;
        _.clearBody(systemConts['content'].querySelector('.page-head'));
        return new Promise(function (resolve) {
            let tpl  = {
                el: document.createDocumentFragment(),
                childes:[
                    {
                        el:_.createEl('H1','page-title',{'data-word':'Settings'})
                    }
                ]
            };
            systemConts['content'].querySelector('.page-head').append(_.createTpl(tpl));
            resolve(systemConts['content'].querySelector('.page-head'));
        })
    }
    async pageTpl(){
        const _ = this;
        return new Promise( async function (resolve) {
            await _.pageHeadTpl();
            let tab = await _.tabContentTpl();
            systemConts['content'].querySelector('.page-body').append(tab);
            resolve(tab);
        });
    }
    async loadTabs(cont){
        const _ = this;
        let i = 0;
        let tabs = await _.model.getTabs();
        for(let tab of tabs){
            if(!i){
                tab['className'] = 'active';
            }
            let t = _.tabTpl(tab);

            cont.append(t);
            i++;
        }
        return cont;
    }

    tabTpl(tabData){
        const _ = this;
        let tpl = {
            el: _.createEl('PAGE-TAB',tabData['className']),
            childes:[
                {
                    el: _.createEl('STRONG',null,{'data-word':tabData['text']}),
                }
            ]
        };
        return _.createTpl(tpl);
    }

    inptTpl(setting){
        const _ = this;
        let tpl = {
            el : document.createDocumentFragment(),
            childes:[
                {
                    el:_.createEl('DIV','page-inpt small'),
                    childes: [{
                        el:_.createEl('SPAN',null,{'data-word':`${setting['name']}`})
                    },{
                        el:_.createEl('INPUT','',{'data-id':`${setting['id']}`,'data-prop':setting['name'],'data-change-action':'Settings:updateSetting','value':`${setting['value']}`})
                    }]
                }
            ]
        };
        return _.createTpl(tpl);
    }
    selectTpl(setting){
        const _ = this;
        let options = setting['value'],childes = [];
        for (let option of options){
            let selected = '',
                elObj = {
                value:option['value'],
                'data-word':option['name']
            };
            if (option.active){
                elObj['selected'] = "true";
            }
            let newElem = { el: _.createEl('OPTION',null,elObj)};
            childes.push(newElem);
        }
        let tpl = {
            el : document.createDocumentFragment(),
            childes:[
                {
                    el:_.createEl('DIV','page-inpt small'),
                    childes: [{
                        el:_.createEl('SPAN',null,{'data-word':`${setting['name']}`})
                    },{
                        el:_.createEl('SELECT','',{
                            'data-id':`${setting['id']}`,
                            'data-prop':setting['name'],
                            'data-change-action':'Settings:updateSetting;Settings:update'+setting['name']
                        }),
                        childes: childes
                    }]
                }
            ]
        };
        return _.createTpl(tpl);
    }
    async tabsTpl(){
        const _ = this;
        let tabs =  _.createEl('PAGE-TABS',null,{});
        systemConts['content'].querySelector('.page-body').append(await _.loadTabs(tabs));
    }
    async tabContentTpl(){
        const _ = this;
        return new Promise( async function (resolve) {
            let tabContent =  _.createEl('PAGE-CONTENT',null,{}),
                systemSettings = await _.model.getSystemSettings();
            let tab = await _.loadTabContent(systemSettings,tabContent);
            await MainEventBus.trigger(_.componentName,'getSystemSettings');
            resolve(tab);
        })
    }
    loadTabContent(settings,tabContent){
        const _ = this;
        return new Promise( async function (resolve) {
            for (let setting of settings['data']) {
                let t = _.inptTpl(setting);
                if (setting['type'] == 'sel') {
                    t = _.selectTpl(setting);
                }
                tabContent.append(t);
            }
            resolve(tabContent);
        });
    }
    render(page){
        const _ = this;
        return new Promise(async function (resolve) {
            if (_.modulePage == page) {
                let content = await _.pageTpl();
                resolve(systemConts['content']);
            }else{
                resolve(true);
            }
        })
    }
}