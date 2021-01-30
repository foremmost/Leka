import { View } from "../main/View.js";
import {systemConts} from "../../libs/Conts.lib.js";
export class PluginerView extends View {
    constructor(model){
        super(model);
    }
    async pageTpl(){
        const _ = this;
        _.pageHeadTpl();
        _.bodyTpl();
    }
    bodyTpl(){
        const _ = this;
        _.clearCont(systemConts['content'].querySelector('.page-body'));

    }
    pageHeadTpl(pageData = {}){
        const _ =  this;
        _.clearCont(systemConts['content'].querySelector('.page-head'));
        return new Promise(function (resolve) {
            systemConts['content'].querySelector('.page-head').append(_.createEl('H1','page-title',{'data-word':'Plugins'}));
            resolve(systemConts['content'].querySelector('.page-head'));
        })

    }
    render(page){
        const _ = this;
        return new Promise(function (resolve) {
            _.pageTpl();
            resolve(true);
        })
    }
}