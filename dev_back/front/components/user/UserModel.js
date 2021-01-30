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
        return new Promise(async function (resolve){
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
          resolve(response);
        })
    }
    async userOut(){
      const _ = this;
      return  await _.handler({
          method: 'logout',
      },'JSON');
    }
    async getName(uId){
        const _ = this;
        let response = await _.handler({
            type: 'class',
                method: 'getName',
                data: {
                  'uId':uId
                }
            },'JSON'
        );
        if (response.status === 'success'){
          return response['data'];
        }else{
          return  response['failText']
        }
    }
    async getUserId(){
        const _ = this;
        let response = await _.handler({
                method: 'getUserId',
                data: null
            },'JSON'
        );
        if (response.status === 'success'){
          return response['data'];
        }else{
          return  response['failText']
        }
    }

}