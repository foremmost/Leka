import {Ctrl} from "../main/Ctrl.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";

export class UserCtrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        //
        const _ = this;

        _.componentName = 'User';

        MainEventBus.add('User','userOut',_.userOut.bind(_),'UserCtrl');

    }
    async userOut(){
        const _ = this;

        await _.model.userOut();
        location.reload();
    }
}