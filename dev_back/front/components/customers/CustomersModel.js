import {Model} from '../main/Model.js';

export class CustomersModel extends Model {
  constructor(){
      super();
      const _ = this;
    _.componentName = 'Customers';
    _.perPage = 20;

    _.groups = [];

  }
  async getOneItem(itemData){
    const _ = this;
    let itemId = parseInt(itemData['itemId']);
    let currentItem = _.items.filter(  (item) => item['id'] === itemId );
    _.currentItem = currentItem[0];
    if(currentItem.length){
      return currentItem[0];
    }
    return null;
  }

  async getGroups(){
      const _ = this;
      let response = await _.handler(
          {
            method: 'getGroups',
            type: 'class'
          },
          'JSON'
      );
      _.groups = response;
      return  response;
  }
  async getTableItems(pageData = {page: 1}){
      const _ = this;
      let page = pageData['page'];
      let response = await _.handler(
          {
            method: 'getAll',
            type: 'class',
            page: page,
            perPage: _.perPage
          },
          'JSON'
      );
      _.items = response;
      return  response;
  }
    // Выборка количества слов
  updateItem(itemData){
    const _ = this;
    let itemId = parseInt(itemData['id']);
    _.items.forEach(  (item,index) =>{
      if (item['id'] === itemId){
        _.items[index] = itemData;
      }
    });
    return itemData;
  }
  async saveUser(userData){
    const _ = this;
    return await _.handler({
          method: 'saveUser',
          type: 'class',
          data: userData
        }, 'JSON'
    );
  }
  async editUser(){
    const _ = this;
    return await _.handler({
          method: 'editUser',
          type: 'class',
          data: _.editedFields
        }, 'JSON'
    );
  }
  async deleteUser(itemData){
    const _ = this;
    return await _.handler({
          method: 'delete',
          type: 'class',
          data: itemData
        }, 'JSON'
    );
  }
  async registerUser(userData){
    const _ = this;
    return await _.handler({
      type: 'class',
      method: 'registerUser',
      data: userData
    }, 'JSON');
  }
  async getTempUserByMail(userData){
    const _ = this;
    if(!userData.mail) return;
    let response = await _.handler({
      type: 'class',
      method:'getTempUserByMail',
      data:{
        mail:userData.mail
      }

    },'JSON');
    return response;
  }
}