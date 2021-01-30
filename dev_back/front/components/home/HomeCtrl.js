import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
export class HomeCtrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;

        _.componentName = 'Home';

        //  Работа с пагинацией
        MainEventBus.add(_.componentName,'calcItemsCount',_.calcItemsCount.bind(_),`${_.componentName}Ctrl`);
        MainEventBus.add(_.componentName,'nextPage',_.nextPage.bind(_),`${_.componentName}Ctrl`);
        MainEventBus.add(_.componentName,'prevPage',_.prevPage.bind(_),`${_.componentName}Ctrl`);
        MainEventBus.add(_.componentName,'goPage',_.goPage.bind(_),`${_.componentName}Ctrl`);

        // Поиск
        MainEventBus.add(_.componentName,'inputSearchQuery',_.inputSearchQuery.bind(_),`${_.componentName}Ctrl`);
        MainEventBus.add(_.componentName,'keyUpSearch',_.keyUpSearch.bind(_),`${_.componentName}Ctrl`);
        MainEventBus.add(_.componentName,'btnSearch',_.btnSearch.bind(_),`${_.componentName}Ctrl`);
    }
}