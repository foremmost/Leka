import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import { Functions } from "../../libs/Functions.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
export class CustomersCtrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;
        _.componentName = 'Customers';
        MainEventBus.add(_.componentName,'calcItemsCount',_.calcItemsCount.bind(_),'CustomersCtrl');
        MainEventBus.add(_.componentName,'inputSearchQuery',_.inputSearchQuery.bind(_),'CustomersCtrl');
        MainEventBus.add(_.componentName,'keyUpSearch',_.keyUpSearch.bind(_),'CustomersCtrl');
        MainEventBus.add(_.componentName,'btnSearch',_.btnSearch.bind(_),'CustomersCtrl');

        //
        MainEventBus.add(_.componentName,'saveUser',_.saveUser.bind(_),'CustomersCtrl');
        MainEventBus.add(_.componentName,'editUser',_.editUser.bind(_),'CustomersCtrl');
        MainEventBus.add(_.componentName,'showCustomer',_.showCustomer.bind(_),'CustomersCtrl');
        MainEventBus.add(_.componentName,'editCustomer',_.editCustomer.bind(_),'CustomersCtrl');
        MainEventBus.add(_.componentName,'deleteCustomer',_.deleteCustomer.bind(_),'CustomersCtrl');

        MainEventBus.add(_.componentName,'changeFieldValue',_.changeFieldValue.bind(_),'CustomersCtrl');
        //  Работа с пагинацией
        MainEventBus.add(_.componentName,'calcItemsCount',_.calcItemsCount.bind(_),'LanguagerCtrl');
        MainEventBus.add(_.componentName,'nextPage',_.nextPage.bind(_),'LanguagerCtrl');
        MainEventBus.add(_.componentName,'prevPage',_.prevPage.bind(_),'LanguagerCtrl');
        MainEventBus.add(_.componentName,'goPage',_.goPage.bind(_),'LanguagerCtrl');


    }

    changeFieldValue(inputData){
        const _ = this;
        let item = inputData['item'],
            fieldName = item.name,
            fieldValue = item.value;
        if(Functions.deepEqual(_.model.currentItem[fieldName],fieldValue)){
           delete _.model.editedFields[fieldName];
        }else{
            _.model.editedFields[fieldName] = fieldValue;
        }

    }
    async editUser(eventData) {
        const  _ = this;
        let form =  eventData['item'],
            user =  _.createFormData(form);
        if (user['pass'] !== user['cpass']){
            MainEventBus.trigger('Log','showLog',{
                status:'error',
                title: 'Password not equals'
            });
            return ;
        }
        let response = await _.model.editUser();
        if (response.status === 'success'){
            user['id'] = parseInt(user['uId']);
            let itemData= _.model.updateItem(user);
            return MainEventBus.trigger(_.componentName,'userUpdated',itemData);
        }
        if (response.status === 'fail'){
            MainEventBus.trigger('Log','showLog',{
                status:'error',
                title: response.failText
            })
        }
    }
    async saveUser(eventData){
        const _ = this;
        let form =  eventData['item'],
            user =  _.createFormData(form);
        if(user['pass'] !== user['cpass']){
            MainEventBus.trigger('Log','showLog',{
                status:'error',
                title: 'Password not equals'
            });
            return ;
        }
        let response = await _.model.saveUser(user);
        if (response.status === 'success'){
            MainEventBus.trigger('User','userSaved',response);
            MainEventBus.trigger('Log','showLog',{
                status:'success',
                title: ''
            });
            _.view.listRowsTpl();
            return ;
        }
        if (response.status === 'fail'){
            MainEventBus.trigger('Log','showLog',{
                status:'error',
                title: response.failText
            })
        }
    }
    async showCustomer(clickData){
        const _ = this;
        let item = clickData['item'];
        let customersId = item.dataset.userId;
        let formTpl = await _.view.formToShowTpl(customersId);
        await MainEventBus.trigger('languager','loadTranslate',{cont:formTpl});
        MainEventBus.trigger('Modaler','showModal',{
            contentType:'object',
            content: formTpl
        });
    }
    async editCustomer(clickData){
        const _ = this;
        let item = clickData['item'];
        let customersId = item.dataset.userId;
        _.model.editedFields['id'] = customersId;

        let formTpl = await _.view.formToEditTpl(customersId);
        await MainEventBus.trigger('languager','loadTranslate',{cont:formTpl});
        MainEventBus.trigger('Modaler','showModal',{
            contentType:'object',
            content: formTpl
        });
    }
    async deleteCustomer(clickData){
        const _ = this;
        let item = clickData['item'];
        let customersId = item.dataset.userId;
        let response  = await _.model.deleteUser({id: customersId});
        if (response.status == 'success'){
            MainEventBus.trigger('Log','showLog',{
                'status': 'success',
                'title':'User deleted',
                'save': true
            });
            item.parentNode.parentNode.parentNode.remove();
        }else{
            MainEventBus.trigger('Log','showLog',{
                'status': 'error',
                'title':'User deleted fail',
                'save': true
            });
        }
    }


}