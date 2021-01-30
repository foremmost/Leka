import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
//import {Noticer} from "../../libs/Noticer.lib.js";
export class CrmCtrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;

        _.componentName = 'crm';

        _.busEvents = [
          'calcItemsCount',
          'nextPage',
          'prevPage',
          'goPage',
          'inputSearchQuery',
          'keyUpSearch',
          'btnSearch',
          'changeSetting',
          'showOrder',
          'deleteOrder',
        ];

      _.formStyles = {
        'border-radius': '5px',
        padding: '15px 10px'
      }
    }
    async showOrder(clickData){
        const _ = this;
        let
            item = clickData['item'],
            orderId = item.dataset.orderId,
            formTpl = await _.view.formToShowTpl(orderId);
        await MainEventBus.trigger('languager','loadTranslate',{cont:formTpl});
        MainEventBus.trigger('Modaler','showModal',{
            contentType:'object',
            content: formTpl,
            ..._.formStyles
        });
    }
    async deleteOrder(clickData){
        const _ = this;
        let item = clickData['item'];
        let customersId = item.dataset.orderId;
      let answer = await MainEventBus.trigger('Modaler','showConfirm',{
        text: 'Удалить?'
      });
      if(!answer) return ;
        let response  = await _.model.deleteOrder({id: customersId});
        if (response.status == 'success'){
            MainEventBus.trigger('Log','showLog',{
                'status': 'success',
                'title':'Order deleted',
                'save': true
            });
            item.parentNode.parentNode.parentNode.remove();
        }else{
            MainEventBus.trigger('Log','showLog',{
                'status': 'error',
                'title':'Order deleted fail',
                'save': true
            });
        }
    }
    async changeSetting(changeData){
        console.log(changeData)
        MainEventBus.trigger('Settings','updateSetting',changeData);
    }
}