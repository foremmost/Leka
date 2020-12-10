import { Module } from "../main/Module.js";
import { RightsModel } from "./RightsModel.js";
import { RightsView } from "./RightsView.js";
import { RightsCtrl } from "./RightsCtrl.js";
export class Rights extends Module {
    constructor(){
        let
            model = new RightsModel(),
            view = new RightsView(model),
            ctrl = new RightsCtrl(model, view);
        super(view,ctrl,model);
    }
    init(page){
        super.init(page).then(()=>{
            const _ = this;
            return _.view.render(page);
        } );
    }
}