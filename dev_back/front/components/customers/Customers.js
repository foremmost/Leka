import { Module } from "../main/Module.js";
import { CustomersModel } from "./CustomersModel.js";
import { CustomersView } from "./CustomersView.js";
import { CustomersCtrl } from "./CustomersCtrl.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";

export class Customers extends Module {
    constructor(){
        let
            model = new CustomersModel(),
            view = new CustomersView(model),
            ctrl = new CustomersCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
        _.componentName = 'customers';
        MainEventBus
            .on(_,'getTempUserByMail')
            .on(_,'registerUser');
    }
    async registerUser(userData){
        return this.model.registerUser(userData);
    }
    async getTempUserByMail(userData){
        return await this.model.getTempUserByMail(userData);
    }
    async init(page){
        const _ = this;
        await _.model.getGroups();
        await _.model.acceptSettings([
            {name:'Items per page',prop:'perPage'}
        ]);
        return await _.view.render(page);
    }
}