import { Ctrl } from "../main/Ctrl.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
export class AutherCtrl  extends Ctrl  {
    constructor(model,view,params){
        super(model,view,params);
        const _ = this;
        MainEventBus.add('Auther','keyUpLogin',_.keyUpLogin.bind(_));
        MainEventBus.add('Auther','keyUpPass',_.keyUpPass.bind(_));
        MainEventBus.add('Auther','check',_.check.bind(_));
        MainEventBus.add('Auther','second',_.second.bind(_));
    }
    async keyUpLogin(data){
        const _ = this;
        let event = data['event'];
        if ( (event['key'] === 'Enter')) {
            let login = _.container.querySelector('.form-inpt');
            return await _.model.checkLogin({'step':1,login:login.value});
        }
    }
    async keyUpPass(data){
        const _ = this;
        let event = data['event'];
        if ( (event['key'] === 'Enter')) {
            let pass = _.container.querySelector('.form-inpt');
            return await _.model.loGin({'step':2,pass:pass.value});
        }
    }
    async check(clickObj){
        const _ = this;
        let elem = clickObj['item'];
        let step = parseInt(elem.dataset.step),
            login = _.container.querySelector('.form-inpt');
        return await _.model.checkLogin({'step':step,login:login.value});
    }
    async second(clickObj){
        const _ = this;
        let elem = clickObj['item'];
        let step = parseInt(elem.dataset.step),
            pass = _.container.querySelector('.form-inpt');
        return await _.model.loGin({'step':step,pass:pass.value});
    }
}