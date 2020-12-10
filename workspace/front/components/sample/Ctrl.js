import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
export class Ctrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;

        _.componenName = '';

        //  Работа с пагинацией
        MainEventBus.add(_.componentName,'calcItemsCount',_.calcItemsCount.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'nextPage',_.nextPage.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'prevPage',_.prevPage.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'goPage',_.goPage.bind(_),`${_.componenName}Ctrl`);

        // Поиск
        MainEventBus.add(_.componentName,'inputSearchQuery',_.inputSearchQuery.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'keyUpSearch',_.keyUpSearch.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'btnSearch',_.btnSearch.bind(_),`${_.componenName}Ctrl`);
    }
}