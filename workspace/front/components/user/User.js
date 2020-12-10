import {Module} from "../main/Module.js";
import {UserModel} from "./UserModel.js";
import {UserView} from "./UserView.js";
import {UserCtrl} from "./UserCtrl.js";

export class User extends Module {
    constructor(){
        let
            model = new UserModel(),
            view = new UserView(model),
            ctrl = new UserCtrl(model, view);
        super(view,ctrl,model);
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

}