import { Modaler } from "../../libs/Modaler.lib.js";
import { Animation } from "../../libs/Animation.lib.js";
import { systemConts } from "../../libs/Conts.lib.js";
import { Ctrl } from "../main/Ctrl.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
export class LanguagerCtrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;
        _.componentName = 'languager';
        _.events = [
        ];
        MainEventBus.add('Loader','modulesLoaded',_.initLoadTranslate.bind(_),'LanguagerCtrl'); // Инициализационная загрука страницы
        MainEventBus.add('Loader','pageReady',_.pageLoadTranslate.bind(_),'LanguagerCtrl'); // Загрузка страницы по клику на пункт меню
        MainEventBus.add(_.componentName,'translateReady',_.translateReady.bind(_),'LanguagersCtrl');
        MainEventBus.add(_.componentName,'loadTranslate',_.loadTranslate.bind(_),'LanguagerCtrl');
        //
        MainEventBus.add(_.componentName,'changeTranslateLang',_.changeTranslateLang.bind(_));
        MainEventBus.add(_.componentName,'changeLang',_.changeLang.bind(_));
        MainEventBus.add(_.componentName,'editWord',_.editWord.bind(_));

        //  Работа с пагинацией
        MainEventBus.add(_.componentName,'calcItemsCount',_.calcItemsCount.bind(_),'LanguagerCtrl');
        MainEventBus.add(_.componentName,'nextPage',_.nextPage.bind(_),'LanguagerCtrl');
        MainEventBus.add(_.componentName,'prevPage',_.prevPage.bind(_),'LanguagerCtrl');
        MainEventBus.add(_.componentName,'goPage',_.goPage.bind(_),'LanguagerCtrl');
        //
        MainEventBus.add(_.componentName,'saveTranslateWord',_.saveTranslateWord.bind(_),'LanguagerCtrl');
        MainEventBus.add(_.componentName,'saveDefaultWord',_.saveDefaultWord.bind(_),'LanguagerCtrl');
        MainEventBus.add(_.componentName,'editDefaultWord',_.editDefaultWord.bind(_),'LanguagerCtrl');
        //
        MainEventBus.add(_.componentName,'showModalTranslate',_.showModalTranslate.bind(_),'LanguagerCtrl');
        // Поиск
        MainEventBus.add(_.componentName,'inputSearchQuery',_.inputSearchQuery.bind(_),'LanguagerCtrl');
        MainEventBus.add(_.componentName,'keyUpSearch',_.keyUpSearch.bind(_),'LanguagerCtrl');
        MainEventBus.add(_.componentName,'btnSearch',_.btnSearch.bind(_),'LanguagerCtrl');
    }
    //
    loadTranslate(translateData = {}){
        const _ = this;
        return  new Promise( async function (resolve) {
            if (translateData['from']){
                if(translateData['from'] == 'id'){
                    resolve( await _.loadContTranslateFromId(translateData));
                }
            }
            resolve( await _.loadContTranslate(translateData))
        });
    }

    async loadContTranslateFromId(translateData= {}){
        const _ = this;
        let
            anim = translateData['anim']  ? translateData['anim'] : true,
            cont = translateData['cont']  ? translateData['cont'] :systemConts['main'],
            animationCont = translateData['animationCont']  ? translateData['animationCont'] :systemConts['main'];
        return new Promise( async function (resolve) {
            let words = [], animWords = [];
            words = [...cont.querySelectorAll(".word")];
            animWords = [...animationCont.querySelectorAll(".word")];
            let fwords = [];
            for(let i=0;i< words.length;i++){
                if (words[i].dataset.wordId){
                    if(fwords.indexOf(words[i].dataset.wordId) > -1) continue;
                    fwords.push(words[i].dataset.wordId);
                }
            }
            let translates = await _.model.getTranslatesFromId(fwords);
            let outTranslates = [];
            for(let i = 0,len = words.length ;i< len;i++){
                let word = words[i];
                if (!word) continue;
                if (!word.dataset.wordId) continue;
                word.setAttribute('data-context-action','Menu:showContext');
                let trl = {
                    'translate':'', word: word, 'default': word.dataset.word
                };
                for(let j=0; j < translates.length;j++){
                    let translate = translates[j];
                    if ( word.dataset.wordId == translate['id'] ){
                        trl['translate'] = translate['translate'];
                        trl['word'] = word;
                        trl['default'] = translate['default'];
                        outTranslates.push(trl);
                        break;
                    }
                }
                outTranslates.push(trl);
            }
            let translated = await _.view.translateWord({
                words: outTranslates,
                cont: words
            });
            if (anim){
                MainEventBus.trigger('Animation','textAnimation',{
                    elems:  animWords
                });
            }
            resolve(translated);
        })
    }
    async loadContTranslate(translateData= {}){
        const _ = this;
        let
            anim = translateData['anim']  ? translateData['anim'] : false,
            cont = translateData['cont']  ? translateData['cont'] : systemConts['main'],
            animationCont = translateData['animationCont']  ? translateData['animationCont'] : cont;
        return new Promise( async function (resolve) {
            let words = [], animWords = [];
            words = [...cont.querySelectorAll("[data-word]")];
            if (animationCont)  animWords = [...animationCont.querySelectorAll("[data-word]")];
            let fwords = [];
            for(let i=0;i< words.length;i++){
                if (words[i].dataset.word){
                    if(fwords.indexOf(words[i].dataset.word) > -1) continue;
                    fwords.push(words[i].dataset.word);
                }
            }
            let translates = await _.model.getTranslates(fwords);
            let outTranslates = [];
            for(let i = 0,len = words.length ;i< len;i++){
                let word = words[i];
                if (!word) continue;
                if (!word.dataset.word) continue;
                if(word.getAttribute('data-lang')  == _.model.currentLang){
                    continue;
                }
                word.setAttribute('data-lang',_.model.currentLang);
                word.setAttribute('data-context-action','Menu:showContext');
                let trl = {
                    'translate':'', word: word, 'default': word.dataset.word
                };
                for(let j=0; j < translates.length;j++){
                    let translate = translates[j];
                    if ( word.dataset.word && translate['default'] ){
                        if ( word.dataset.word.toLowerCase() == translate['default'].toLowerCase() ){
                            trl['translate'] = translate['translate'];
                            trl['word'] = word;
                            trl['default'] = translate['default'];
                            outTranslates.push(trl);
                            //words.splice(i,1);
                            break;
                        }
                    }
                }

                outTranslates.push(trl);
            }
            let translated = await _.view.translateWord({
                words: outTranslates,
                cont: words
            });
            if (anim){
                MainEventBus.trigger('Animation','textAnimation',{
                    elems:  animWords
                });
            }
            resolve(translated);
        })
    }
    
    async initLoadTranslate(page){

       this.loadContTranslate();

    }
    async pageLoadTranslate(cont){
       this.loadContTranslate(cont);
    }
    async getLangs(){
        const _ = this;
        let langData = {
            currentLang : _.model.currentLang
        }
        let response = await _.model.getLangs();
        if(response){
            langData['langs'] = response;
            await MainEventBus.trigger(_.componentName,'loadLangOptions',langData)
        }
    }
    showModalTranslate(clickObj){
        const _ = this;
        let item = clickObj['item'];
        MainEventBus.trigger('Modaler','showModal',{
            contentType: 'string',
            content: item.getAttribute('data-text')
        })
    }

    translateReady(cont){
        let elems = {
            elems: cont
        };
        //MainEventBus.trigger('Animation','textAnimation',elems);
    }

    async editWord(clickObj){
        const _ = this;
        let btn = clickObj['item'];
        let
            wordId = btn.dataset.wordId,
            wordText = btn.dataset.wordText,
            wordType = btn.dataset.wordType;
        _.view.loadToEditForm({
            id: wordId,
            text: wordText,
            type: wordType,
        });

    }
    async editDefaultWord(item){
        const _ = this;
        let edit = true;
       _.saveDefaultWord(item,edit);
    }

    async saveTranslateWord(focusData){
        const _ = this;
        let //tr = item.parentNode.parentNode,
            item = focusData['item'],
            wordId = item.dataset.wordId,
            wordText = item.dataset.wordText;
        if(wordText === item.value) return;
        //if(!item.value) return;

        let langSelect = systemConts['content'].querySelector('.lang-select select'),
            langValue = langSelect.options[langSelect.selectedIndex].value,
            wordObj = {};
        wordObj['lang'] = langValue;
        wordObj['translate'] = item.value;
        wordObj['wordId'] = wordId;

        let response = await _.model.saveTranslateWord(wordObj);

        if(response.status === 'success'){
            item.setAttribute('data-word-text',item.value);
            MainEventBus.trigger(_.componentName,'saveTranslateWordComplete',null)
        }else{
            MainEventBus.trigger(_.componentName,'saveTranslateWordError',null)
        }
    }
    async saveDefaultWord(item,type=''){
       const _ = this;
       let e = item['event'],
           form = item['item'];
       e.preventDefault();

       let fields = form.elements,
           wordObj = {};

       if(fields['value'].value){
           wordObj['value'] = fields['value'].value;
       }
       if(fields['value'].hasAttribute('data-id')){
           wordObj['wordId'] = fields['value'].getAttribute('data-id');
       }
        wordObj['type'] = fields['type'].options[fields['type'].selectedIndex].value;
       let response = {},
           outObj  = {
               value: wordObj['value']
           };
        if(!type){
            outObj['add'] = true;
            response = await  _.model.saveDefaultWord(wordObj);
        }else{
            response = await  _.model.editDefaultWord(wordObj);
        }
        if(response.status === 'success'){
            outObj['id'] = response['data']['id'];
            MainEventBus.trigger(_.componentName,'saveDefaultWordComplete',outObj);
        }else{
            MainEventBus.trigger(_.componentName,'saveDefaultWordError',outObj);
        }
    }
    changeLang(changeData){
        const _ = this;
        return new Promise(async function (resolve) {
            let select = changeData['item'],selectedOption  = select.options[select.options.selectedIndex],
                langValue = selectedOption.value;
            if(langValue === _.currentLang) return;
            let langObj = {
                lang: langValue,
                from: changeData['from'] ? changeData['from'] : false,
                cont: changeData['cont'] ? changeData['cont'] : systemConts['main'],
                animationCont: changeData['animationCont'] ? changeData['animationCont'] : systemConts['main']
            };
            if (changeData['anim'] == undefined){
                langObj['anim'] = true;
            }else{
                langObj['anim'] = false;
            }
            MainEventBus.trigger(_.componentName,'chooseLang',langObj);
            resolve(true);
        });

    }



    async changeTranslateLang(changeData){
        const _ = this; _.model.requestData['lang'] = item.value;
       await _.view.mainContentTpl();
    }


    async getDefaultWords(page=1){
        const _ = this;
        let searchInpt = systemConts['content'].querySelector('.lang-search-value');
        if(searchInpt.value){
            let searched = await _.model.searchDefaultWord(searchInpt.value,page);
            await _.view.loadDefaultWords({
                words: searched,
                type: 'search',
                page: page
            });
        }else{
            let words = await _.model.getDefaultWords(page);
            await _.view.loadDefaultWords({
                words: words,
                type: 'main',
                page: page
            });
        }
    }

    async loadPageItems(page=1,template,searchMethod){
        const _ = this;
        let type = _.model.getCurrentType(),langValue;
        let langSelect = systemConts['content'].querySelector('.lang-select select');
        if (langSelect)
            langValue = langSelect.options[langSelect.selectedIndex].value;

        if(type == 'main'){
            await _.view[template](
                {
                    page:page,
                    type: type,
                    lang: langValue
                }
            );
        }else{
            let items = await _.search(searchMethod,template,page);
        }
    }

}