import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import { Ctrl } from '../main/Ctrl.js';
import {systemConts} from "../../libs/Conts.lib.js";


export class StatisticCtrl extends Ctrl {
    constructor(model, view) {
        super(model, view);
        const _ = this;
        _.componentName = 'Statistic';
    }
}