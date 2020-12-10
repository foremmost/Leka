import {Model} from "../main/Model.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";

export class UserModel extends Model{
    constructor(){
        super();
        const _ = this;
        _.componentName = 'User';
        _.perPage = 20;
    }
    async checkLogin(){
        const _ = this;
        let response = await _.handler({
              method: 'checkLogin',
              data: null
            }
        ,'JSON');
        if(response.status === 'success') {
          if (response.page !== '/') {
            MainEventBus.trigger(_.componentName, 'enteredAsUser', response);
          } else {
            MainEventBus.trigger(_.componentName, 'enteredAsGuest', response);
          }
        }
        return true;
    }
    async userOut(){
      const _ = this;
      debugger;
      return  await _.handler({
          method: 'logout',
      },'JSON');
    }
    async getName(){
        const _ = this;
        let response = await _.handler({
                method: 'getName',
                data: null
            },'JSON'
        );
        if (response.status === 'success'){
          return response['data'];
        }
    }
}