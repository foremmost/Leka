import { Model } from "../main/Model.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {Storage} from "../../libs/Storage.lib.js"
export class CategorierModel extends Model {
    constructor() {
        super();
        const _ = this;
        _.componentName = 'Categorier';
        _.perPage = 50;
        _.currentPage = 1;
    }

    async getAllCategories(){
        const _ = this;
        let response = await _.handler({
            method: 'getAllCategories',
        },'JSON');
        return (response === '') ? [] : response;
    }

    async getCategories(data={page: 1}){
        const _ = this;
        let response = await _.handler({
                method: 'getCategories',
                data: {
                    perPage: _.perPage,
                    currentPage: data.page
                }
            },'JSON');
        return (response === '') ? [] : response;
        }

    async getItemsCount(){
        const _ = this;
        let response = await _.handler({
                method: 'getItemsCount'
            },'JSON'
        );
        if (response === ''){
            return  [];
        }else{
            return parseInt(response);
        }
    }
}