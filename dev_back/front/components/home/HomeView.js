import { View } from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
import {Functions} from "../../libs/Functions.lib.js";
export class HomeView extends View {
    constructor(model){
        super(model);
        const _ = this;
        _.componentName = 'Home';
        _.modulePage = 'home';
        //
       // MainEventBus.add(_.componentName,'showForm',_.showForm.bind(_),`${_.componentName}View`);
   //     MainEventBus.add(_.componentName,'clearForm',_.clearForm.bind(_),`${_.componentName}View`);
    //    MainEventBus.add(_.componentName,'backToTable',_.backToTable.bind(_),`${_.componentName}View`);
    }
    async headTpl(){
        const _ = this;
        let tpl =  {
            el : '',
            childes: [
                {
                    el:''
                }
            ]
        };
        let buffer = _.createTpl(tpl);
        return buffer;
    }
    pageHeadTpl(pageData = {}){
        const _ =  this;
        _.clearBody(systemConts['content'].querySelector('.page-head'));
        return new Promise(function (resolve) {
            let tpl  = {
                el: document.createDocumentFragment(),
                childes:[
                ]
            };

            systemConts['content'].querySelector('.page-head').append(_.createTpl(tpl));
            resolve(systemConts['content'].querySelector('.page-head'));
        })
    }
    async tableTpl(){
        const _ = this;
        let tpl =  {
            el : '',
            childes: [
                {
                    el:''
                }
            ]
        };
        let buffer = _.createTpl(tpl);
        return buffer;
    }
    async tableRowTpl(){
        const _ = this;
    }
    pageHeadTpl(){
        const _ =  this;
        let pageHead = systemConts['content'].querySelector('.page-head');
        _.clearBody(pageHead);
        Functions.showLoader(pageHead);
        return new Promise(function(resolve){
            let tpl  = {
                el: document.createDocumentFragment(),
                childes:[
                    {
                        el:_.createEl('H1','page-title',{'data-word':'Home page'})
                    }
                ]

            };
            pageHead.append(_.createTpl(tpl));
            Functions.hideLoader(pageHead);
            resolve(pageHead);
        });
    }
    async render(page) {
        const _ = this;
        return new Promise(async function (resolve) {
            if( page === _.modulePage){
                let content =  await _.pageHeadTpl();
                resolve(systemConts['content']);
            }
        });
    }
}