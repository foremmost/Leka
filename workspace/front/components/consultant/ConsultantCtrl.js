import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
export class ConsultantCtrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;

        _.componenName = 'consultant';

        //  Работа с пагинацией
        MainEventBus.add(_.componentName,'calcItemsCount',_.calcItemsCount.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'nextPage',_.nextPage.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'prevPage',_.prevPage.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'goPage',_.goPage.bind(_),`${_.componenName}Ctrl`);


    }
}