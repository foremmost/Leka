import { MainEventBus } from "../../libs/MainEventBus.lib.js";
import { Model } from "../main/Model.js";
export class AutherModel extends Model {
    constructor(){
        super();
        const _ = this;
        _.componentName = 'Auther';
        _.login = '';
    }
    async checkLogin(loginData) {
        const _ = this;
        let response = await _.handler({
              method: 'login',
              data: {
                  'login': loginData['login'],
                  'step': loginData['step']
              }
            }
        ,'JSON');
        if(response.status === 'success'){
          _.login = response['data'].login;
          MainEventBus.trigger('Auther','checkLoginSuccess',response);
        }else{
          MainEventBus.trigger('Auther','checkLoginFail',response);
        }
    }
    async loGin(loginData){
      const _ = this;
      let response = await _.handler({
            method: 'login',
            data: {
              login: _.login,
              pass: loginData['pass'],
              step: loginData['step']
          }
      },'JSON');
      if(response.status === 'success'){
        MainEventBus.trigger('Auther','loginSuccess',response);
      }else{
        MainEventBus.trigger('Auther','loginFail',response);
      }
    }
    async frontLogin(loginData){
      const _ = this;
      return await _.handler({
            method: 'frontLogin',
            data: {
              login: loginData['login'],
              pass: loginData['pass'],
          }
      },'JSON');
    }

  async frontCheckLogin(loginData) {
    const _ = this;
    return await _.handler({
          method: 'frontCheckLogin',
          data: {
            'login': loginData['login']
          }
        }
        , 'JSON');
  }
} 