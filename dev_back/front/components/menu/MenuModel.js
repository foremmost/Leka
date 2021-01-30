import { Model } from '../main/Model.js';
export class MenuModel extends Model {
    constructor(){
        super();
        const _ = this;
        _.componentName = 'Menu';
        _.contextItems = [];
    }
    getMenuItems(){
        const _ = this;
        return  _.handler({
            method: 'getMenuItems',
            data: null
        },'JSON');
    }
}