import { View } from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib";
export class View extends View {
    constructor(model){
        super(model);
        const _ = this;
        _.componenName = '';
        _.modulePage = '';
        //
        MainEventBus.add(_.componentName,'showForm',_.showForm.bind(_),`${_.componenName}View`);
        MainEventBus.add(_.componentName,'clearForm',_.clearForm.bind(_),`${_.componenName}View`);
        MainEventBus.add(_.componentName,'backToTable',_.backToTable.bind(_),`${_.componenName}View`);
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
    async render(page) {
        const _ = this;
        return new Promise(async function (resolve) {
            if( page === _.modulePage){
                let content =  await _.pageTpl();
                resolve(systemConts['content']);
            }
        });
    }
}