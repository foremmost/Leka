import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
//import {Noticer} from "../../libs/Noticer.lib.js";
export class CrmCtrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;

        _.componentName = 'Crm';

        //  Работа с пагинацией
        MainEventBus.add(_.componentName,'calcItemsCount',_.calcItemsCount.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'nextPage',_.nextPage.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'prevPage',_.prevPage.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'goPage',_.goPage.bind(_),`${_.componenName}Ctrl`);

        // Поиск
        MainEventBus.add(_.componentName,'inputSearchQuery',_.inputSearchQuery.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'keyUpSearch',_.keyUpSearch.bind(_),`${_.componenName}Ctrl`);
        MainEventBus.add(_.componentName,'btnSearch',_.btnSearch.bind(_),`${_.componenName}Ctrl`);


        //Noticer.notifies.push();
        MainEventBus.add(_.componentName,'changeSetting',_.changeSetting.bind(_));

        MainEventBus.add(_.componentName,'showOrder',_.showOrder.bind(_));
        MainEventBus.add(_.componentName,'deleteOrder',_.deleteOrder.bind(_));
    }
    async showOrder(clickData){
        const _ = this;
        let item = clickData['item'],
            orderId = item.dataset.orderId;
        let formTpl = await _.view.formToShowTpl(orderId);
        await MainEventBus.trigger('languager','loadTranslate',{cont:formTpl});
        MainEventBus.trigger('Modaler','showModal',{
            contentType:'object',
            content: formTpl
        });
    }
    async deleteOrder(clickData){
        const _ = this;
        let item = clickData['item'];
        let customersId = item.dataset.orderId;
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