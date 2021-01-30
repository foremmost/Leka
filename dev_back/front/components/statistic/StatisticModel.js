import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import { Model } from '../main/Model.js';


export class StatisticModel extends Model {
    constructor() {
        super();
        const _ = this;
        _.componentName = 'Statistic';
    }
}