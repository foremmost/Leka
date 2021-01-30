import { View } from "../main/View.js";
import { systemConts } from "../../libs/Conts.lib.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
export class AutherView extends View {
    constructor(){
        super();
        const _ = this;
        _.buffer = '';
        _.modulePage =  '/';
        MainEventBus.add('Auther','outFocus',_.outFocus.bind(_),'AutherViewOutFocus');
        MainEventBus.add('Auther','checkLoginSuccess',_.checkLoginSuccess.bind(_),'AutherViewCheckLoginSuccess');
        MainEventBus.add('Auther','checkLoginFail',_.checkLoginFail.bind(_),'AutherOutFocusCheckLoginFail');
        MainEventBus.add('Auther','loginSuccess',_.loginSuccess.bind(_),'AutherViewLoginSuccess');
        MainEventBus.add('Auther','loginFail',_.loginFail.bind(_),'AutherViewLoginFail');
    }
    loginSuccess(data){
        systemConts['main'].classList.add('login');
        setTimeout( ()=>{
            systemConts['main'].querySelector('.form-c').classList.add('pos');
            setTimeout(function () {
                MainEventBus.trigger('Loader','loadCarcass',null);
                setTimeout(function () {
                    MainEventBus.trigger('Loader','systemEntry',data);
                },500)
            },1000);
        },1000);
    }
    loginFail(){}
    checkLoginSuccess(){
        const _ = this;
        let inptRow = systemConts['main'].querySelector('.form-inpt-row'),
            inpt = systemConts['main'].querySelector('.form-inpt'),
            btn = systemConts['main'].querySelector('.form-btn'),
            title = systemConts['main'].querySelector('.form-inpt-title');
        btn.setAttribute('data-click-action',"Auther:second");
        btn.setAttribute('data-step',"2");
        title.removeAttribute('data-lang');
        title.setAttribute('data-word',"Password");
        inpt.setAttribute('type','password');
        inptRow.classList.remove('err');
        inpt.value = '';
        inpt.setAttribute('data-keyup-action','Auther:keyUpPass');
        MainEventBus.trigger('languager','loadTranslate',inptRow);
        _.outFocus(inpt);
    }
    checkLoginFail(){
        const _ = this;
        let inptRow = systemConts['main'].querySelector('.form-inpt-row'),
            inpt = systemConts['main'].querySelector('.form-inpt'),
            title = systemConts['main'].querySelector('.form-inpt-title');
        title.removeAttribute('data-lang');
        title.setAttribute('data-word',"Wrong login");
        inptRow.classList.add('err');
        inpt.value = '';
        MainEventBus.trigger('languager','loadTranslate',inptRow);
        _.outFocus(inpt);
    }
    outFocus(focusData) {
        let item = focusData['item'];
        if (!item) return;
        item.value ? item.classList.add('hide') : item.classList.remove('hide');
    }
    pageTpl(){
        const _ = this;
        let tpl = {
            el: _.createEl('DIV','form-c'),
            childes: [{
                    el: _.createEl('DIV','form-left'),
                    childes: [{
                        el:_.createEl('H1','form-logo'),
                        childes: [{
                            el:_.createEl('SPAN',null,{text:"G-ENGINE"})
                        }]
                    }]
                },{
                    el: _.createEl('DIV','form-right'),
                    childes: [{
                            el: _.createEl('H2','form-title',{/*text:'Авторизация'*/'data-word':'Authorization'}),
                        },{
                            el: _.createEl('FORM','form-cont'),
                            childes: [{
                                el:_.createEl('DIV','form-inpt-row'),
                                childes: [{
                                    el:_.createEl('DIV','form-inpt-c'),
                                    childes:[{
                                        el:_.createEl('INPUT','form-inpt',{type:'text','data-keyup-action':'Auther:keyUpLogin','data-outfocus-action':'Auther:outFocus'})
                                    },{
                                        el:_.createEl('SPAN','form-inpt-title',{/*text:'Логин'*/'data-word':'Login'})
                                    }]
                                },{
                                    el:_.createEl('DIV','form-btn-c'),
                                    childes: [{
                                        el:_.createEl('BUTTON','form-btn',{type:'button', 'data-step':1,'data-click-action':'Auther:check'}),
                                        childes:[{
                                            el:_.createEl('IMG','form-btn-img',{src:"img/arr.svg", alt:""})
                                        }]
                                    }]
                                }]
                        }
                    ]
                }]
            }]
        };
        let buffer = _.createTpl(tpl);
        systemConts['main'].classList.add('form-in');
        systemConts['main'].append(buffer);
        return buffer;
    }
    render(page){
        const _ = this;
        if( page === _.modulePage){
            let tpl = _.pageTpl();
            MainEventBus.trigger('Auther','pageTplLoaded',tpl);
        }
    }
}