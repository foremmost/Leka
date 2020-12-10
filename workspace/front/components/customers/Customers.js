import { Module } from "../main/Module.js";
import { CustomersModel } from "./CustomersModel.js";
import { CustomersView } from "./CustomersView.js";
import { CustomersCtrl } from "./CustomersCtrl.js";

export class Customers extends Module {
    constructor(){
        let
            model = new CustomersModel(),
            view = new CustomersView(model),
            ctrl = new CustomersCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
    }
    async registerUser(userData){
        return this.model.registerUser(userData);
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