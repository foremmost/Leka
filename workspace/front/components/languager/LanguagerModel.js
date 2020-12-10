import { Model } from "../main/Model.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {Storage} from "../../libs/Storage.lib.js";
export class LanguagerModel extends Model {
    constructor(){
      super();
      const _ = this;

      _.componentName = 'languager';
      _.perPage = 20;

      _.setCurrentLang();
      _.defaultWordsPage = 1;
      _.defaultWords = null;
      _.langs = null;
      _.translates = [];
      _.langChanged = false;
      MainEventBus.add(_.componentName,'chooseLang',_.chooseLang.bind(_));
      MainEventBus.add('Settings','settingChanged',_.changeSetting.bind(_));
      _.searchParam = 'word';
      _.requestData = {
        lang: 'ru',
      };
//
    }
    set currentLang(value){
      this._currentLang = value;
    }
    get currentLang(){
      return this._currentLang;
    }
    set langChanged(value){
      this._langChanged = value;
    }
    get langChanged(){
      return this._langChanged;
    }
    setCurrentLang(langValue){
    const _ = this;
    if (langValue){
      return _.currentLang = langValue;
    }
    if(!Storage.get('lang')){
      _.currentLang = 'en';
    }else{
      _.currentLang = Storage.get('lang');
    }
  }
    chooseLang(langObj){
      const _ = this;
      _.setCurrentLang(langObj['lang']);
      _.langChanged = true;
      _.saveCurrentLang(langObj['lang']);
      MainEventBus.trigger(_.componentName,'loadTranslate',langObj);
    }
    saveCurrentLang(langValue){
      Storage.save('lang',langValue);
    }
    // Выборка количества слов
    async getItemsCnt(cntData){
      const _ = this;
      let type = cntData['type'] ? cntData['type'] : 'main';
      cntData['lang'] = _.currentLang;
      let
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
                word: _.searchQuery,
                lang: cntData['lang']
              }
            }
          };
      return await _.handler(
          method[type],
          'JSON'
      );
    }
    async getSearchedCnt(searchedData){
      const _ = this;
      return await _.handler({
            method: 'getSearchedCnt',
            type: 'class',
            data:{
              'lang': _.currentLang,//searchedData['lang'],
              'word': searchedData['query']
            }
          },'JSON'
      );
    }
    // Методы выборки слов
    async getDefaultWords(page = 1){
      const _ = this;
      let response = await _.handler({
            method: 'getDefaultWords',
            type: 'class',
            data:{
              page: page,
              perPage: _.perPage,
            }
          },'JSON'
      );
      _.defaultWords = response;
      _.defaultWordsPage = page;
      //console.log(response)
    return response;
  }
    async getLangs(){
      const _ = this;
      if (_.langs) return _.langs;
      let response = await _.handler({
            method: 'getLangs',
            type: 'class',
            data: null
          },'JSON'
      );
      _.langs = response;
      return  response;
    }
    async getWordTypes(){
      const _ = this;
      let response = await _.handler({
            method: 'getWordTypes',
            type: 'class',
            data:null
          },'JSON'
      );
      if (response.status === 'success'){
        return response.types;
      }else{
        return  [];
      }
    }
    async getTableItems(wordData){
      const _ = this;
      let lang = wordData['lang'] ? wordData['lang'] : _.currentLang,
          page = wordData['page'];
      return await _.handler({
            method: 'getLangWords',
            type: 'class',
            data: {
              'lang': lang,
              'page': page,
              'perPage': _.perPage
            }
          },'JSON'
      );
    }
    async getTranslates(words){
      const _ = this;
      let response = await _.handler({
            method: 'getTranslates',
            type: 'class',
            data:{
              'words': words,
              'lang':  _.currentLang
            }
          },'JSON'
      );
      _.langChanged = false;
      return  response;
    }
    async getTranslatesFromId(wordIds){
      const _ = this;
      let response = await _.handler({
            method: 'getTranslates',
            type: 'class',
            data:{
              'words': wordIds,
              'type': 'id',
              'lang':  _.currentLang
            }
          },'JSON'
      );
      _.langChanged = false;
      return  response;
    }
    // Методы поиска слов
    // Методы сохранения слов
    async saveDefaultWord(wordData){
      const _ = this;
      return await _.handler({
            method: 'saveDefaultWord',
            type: 'class',
            data:wordData
          },'JSON'
      );
    }
    async saveTranslateWord(wordData){
      const _ = this;
      return  await _.handler({
            method: 'saveTranslateWord',
            type: 'class',
            data:wordData
          },'JSON'
      );
    }
    // Методы редактирования слов
    async editDefaultWord(wordData){
        const _ = this;
        return await _.handler({
                  method: 'editDefaultWord',
                  type: 'class',
                  data:wordData
              },'JSON'
          );
    }
}