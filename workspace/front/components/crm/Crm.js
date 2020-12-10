import { Module } from "../main/Module.js";
import { CrmModel } from "./CrmModel.js";
import { CrmView } from "./CrmView.js";
import { CrmCtrl } from "./CrmCtrl.js";

export class Crm extends Module {
    constructor(){
        let
            model = new CrmModel(),
            view = new CrmView(model),
            ctrl = new CrmCtrl(model, view);
        super(view,ctrl,model);
        const _ = this;
    }
    async init(page){
        super.init(page);
        const _ = this;
        await _.model.acceptSettings([
            {name:'Items per page',prop:'perPage'}
        ]);
        return await _.view.render(page);
    }
    async createOrder(orderData){
        const _ = this;
        return  await _.model.createOrder(orderData);
    }
}