import {Model} from '../main/Model.js';
import {MainEventBus} from "../../../../workspace/front/libs/MainEventBus.lib.js";

export class CrmModel extends Model {
    constructor(){
        super();
        const _ = this;
        _.componentName = 'crm';
        _.perPage = 3;

      MainEventBus.add('Settings','settingChanged',_.changeSetting.bind(_),`${_.componentName}ChangeSetting`);
    }
    async createOrder(orderData){
        const _ = this;
      return await _.handler({
              method: 'createOrder',
              type: 'class',
              data: orderData
            }, 'JSON'
        );
    }
    async getTableItems(workPageData){
        const _ = this;
        let page = workPageData['page'],
            response = await _.handler({
                method: 'getOrders',
                type: 'class',
                data: {
                    'page': page,
                    'perPage': _.perPage,
                }
            },'JSON'
        );
        _.items = response;
        return response;
    }
// Выборка количества слов
    async getItemsCnt(cntData){
      const _ = this;
      let type = cntData['type'] ? cntData['type'] : 'orders',
          method = {
          'main' : {
            method : 'getItemsCnt',
            type: 'class',
            data : cntData
          },
          'search' : {
            method : 'getSearchedCnt',
            type: 'class',
            data : {
              searchQuery: _.searchQuery,
              lang: cntData['lang']
            }
          }
        },
          response = await _.handler(
            method[type], 'JSON'
           );
      return  response['data']['cnt'];
    }
    async deleteOrder(orderData){
      const _ = this;
      return await _.handler({
        method: 'deleteOrder',
        type: 'class',
        data: orderData
        },'JSON'
      );
    }
}