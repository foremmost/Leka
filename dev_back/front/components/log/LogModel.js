import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import { Model } from '../main/Model.js';
export class LogModel extends Model {
    constructor(){
        super();
        const _ = this;
        _.componentName = 'Log';

        //--= Динамические даннные =---
        _.currentType = 'main';
        _.currentPage = 1;
        _.items = [];
        _.perPage = 10;
        //--= Динамические даннные =---
        _.searchParam = 'query';
        MainEventBus.add(_.componentName,'saveLog', _.saveLog.bind(_));

        MainEventBus.add('Settings','settingChanged',_.changeSetting.bind(_),`${_.componentName}ChangeSetting`)

    }

    // Сохраняет логи на сервере
    async saveLog(logData){
        const _ = this;
        let response = await _.handler({
                method: 'saveLog',
                data: logData
            },'JSON'
        );
        return response;
    }

    // Выборка количества логов
    async getItemsCnt(cntData){
        const _ = this;
        let type = cntData['type'] ? cntData['type'] : 'main';
        let
            method = {
                'main' : {
                    method : 'getLogsCnt',
                    data : null
                },
                'search' : {
                    method : 'getSearchedCnt',
                    data : {'query' : cntData['query']}
                },
                'filter' : {
                    method : 'getSelectedCnt',
                    data :  {'type' : cntData['query']}
                }
            };
        let response = await _.handler(
            method[type],
            'JSON'
        );
        if(response['status'] === 'success'){
            return response['data']['cnt']
        }
        return 0;
    }

    // Запрашивает сохраненные логи
    async getTableItems(workPageData){
        const _ = this;
        let page = workPageData['page'];
        let response = await _.handler({
                method: 'getLogs',
                data: {
                    'page': page,
                    'perPage': _.perPage,
                }
            },'JSON'
        );
        _.items = response;
        return response;

    }
    async getTableItem(workPageData){
        const _ = this;
        let itemId = workPageData['logId'];
        let currentLog = _.items.filter(  (log) => log['id'] === itemId );
        if(currentLog.length){
            return currentLog[0];
        }
        return null;
    }


    // Метод фильтрации логов
    async filterLogs(type,page = 1){
        const _ = this;
        let response = await _.handler({
                method: 'filterLogs',
                data: {
                    'page': page,
                    'perPage': _.perPage,
                    'type': type
                }
            },'JSON'
        );
        _.items = response;
        return response;
    }

    // Удаляет лог
    async deleteLog(id){
        const _ = this;
        let response = await _.handler({
                method: 'deleteLog',
                data: {id:id}
            },'JSON'
        );
        return response;
    }

    // Удаляет все логи
    async clear(){
        const _ = this;
        let response = await _.handler({
                method: 'clear'
            },'JSON'
        );
        return response;
    }

    //Запрашивает имя пользователя
    async getUserName(user_id){
        if(user_id) return 'Антон Сметанин';
        return;
    }
}