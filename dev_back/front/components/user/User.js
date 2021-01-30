import {Module} from "../main/Module.js";
import {UserModel} from "./UserModel.js";
import {UserView} from "./UserView.js";
import {UserCtrl} from "./UserCtrl.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";

export class User extends Module {
    constructor(){
        let
            model = new UserModel(),
            view = new UserView(model),
            ctrl = new UserCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
        _.componentName = 'user';
        MainEventBus.add(_.componentName,'getUserId',_.getUserId.bind(_))
        MainEventBus.add(_.componentName,'getName',_.getName.bind(_))
    }
    async init(page){
        super.init(page);
        const _ = this;
        return new Promise( async function (resolve) {
            let response = await _.model.checkLogin();
            if (response)   resolve(_.view.render(page));
            resolve(true);
        })
    }

    async getUserId(){
      const _ = this;
      return await _.model.getUserId();
    }
    async getName(uId){
      const _ = this;
      return await _.model.getName(uId);
    }
    async checkLogin(){
        const _ = this;
        return _.model.checkLogin()
    }
}