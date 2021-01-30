import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import { View } from "../main/View.js";
import {systemConts} from "../../libs/Conts.lib.js";
import {Functions} from "../../libs/Functions.lib.js";


export class LogView extends View {
    constructor(model){
        super(model);
        const _ = this;

        _.top = 0;
        _.offsetTop = 0;
        _.times = [];
        _.negativeOffset = 0;
        _.timeToAnim = .35;

        _.modulePage = 'logs';
        _.componentName = 'Log';
        MainEventBus.add(_.componentName,'showPopup',_.showPopup.bind(_));
        MainEventBus.add(_.componentName,'pauseToLog',_.pauseToLog.bind(_));
        MainEventBus.add(_.componentName,'continueToLog',_.continueToLog.bind(_));
        MainEventBus.add(_.componentName,'closeLog',_.closePopup.bind(_));
        MainEventBus.add(_.componentName,'closeLogByBtn',_.closeByButton.bind(_));
        MainEventBus.add(_.componentName,'loadPagination',_.loadPagination.bind(_));


    }

    enterHandler(e){
        let item = e.target;

        if( ('enterAction' in item.dataset) ){
            super.triggerWithEvent({'item':item,'event':e},'enterAction');
            return;
        }
    }

    leaveHandler(e){
        let item = e.target;

        if( ('leaveAction' in item.dataset) ){
            super.triggerWithEvent({'item':item,'event':e},'leaveAction');
            return;
        }
    }

    // Создает разметку контейнера и помещает на сайт
    contTpl(){
        const _ = this;
        let cont;

        if(!document.querySelector('log-cont')){
            cont = _.createEl('LOG-CONT');
            let body = document.querySelector('core');
            body.append(cont)
        }
        else { cont = document.querySelector('log-cont') }

        return cont;
    }

    // Создает разметку поп-ап окна
    popupTpl(){
        const _ = this;
        let
            tpl = {
            el: _.createEl('LOG', null,{'data-enter-action':'Log:pauseToLog','data-leave-action':'Log:continueToLog'}),
            childes:[
                {
                    el: _.createEl('LOG-HEAD'),
                    childes:[{
                        el: _.createEl('H5',)
                    }]
                },{
                    el: _.createEl('LOG-BODY'),
                    childes: [{
                        el: _.createEl('P',)
                    }]
                },{
                    el: _.createEl('BUTTON','log-button',{'data-click-action':'Log:closeLogByBtn'}),
                    childes: [{
                        el: _.createEl('IMG',null, {'src':'/workspace/img/close.svg'})
                    }]
                }
            ]
        };

        let buffer = _.createTpl(tpl,'LogPopupTpl');
        return buffer;
    }

    // Сохраняет поп-ап окно и отдает его клона
    getClonePopup(){
        const _ = this;
        let popupClone;

        if(!_.popup){ _.popup = _.popupTpl() }

        popupClone = _.popup.cloneNode(true);
        return popupClone;
    }

    // Сдвигает все поп-ап окна наверх
    doOffset(logs = this.contTpl().querySelectorAll('Log')){
        const _ = this;
        for(let log of logs){
            let top = parseInt(log.dataset['offset']) - _.negativeOffset;

            TweenMax.to(log,_.timeToAnim,{y:`${top}px`});

            log.setAttribute('data-offset',top);
        }

        _.negativeOffset = 0;
    }

    // Закрывает и удаляет поп-ап окно
    closePopup(popup){
        const _ = this;
        let items;

        if(popup.hasOwnProperty('item')){
            items = popup['items'];
            popup = popup['item'];
        }

        TweenMax.fromTo(popup, _.timeToAnim, {opacity: 1}, {opacity: 0});

        setTimeout(function () {
            let offsetHeight;

            if(popup.offsetHeight){ offsetHeight = popup.offsetHeight + 5 }
            else { offsetHeight = popup.offsetHeight; }

            _.offsetTop -= offsetHeight;
            _.negativeOffset = offsetHeight;

            popup.remove();
            _.doOffset(items);
            },_.timeToAnim * 1000)
    }

    // Проверяет есть ли предыдущий поп-ап
    hasPrevPopup(currentPopup){
        return currentPopup.previousElementSibling ? true : false;
    }

    // Возвращает предыдущий поп-ап
    getPrevPopup(currentPopup){
        return currentPopup.previousElementSibling;
    }

    // Останавливает удаление поп-ап окон при наведении на окно
    pauseToLog(){
        const _ = this;

        _.stopTime = new Date().getTime();

        for(let timeOut of _.times){
            clearTimeout(timeOut);
        }
    }

    // Запускает удаление поп-ап окон по времени при уберании курсора с окна
    continueToLog(){
        const _ = this;
        let popups = systemConts['main'].querySelectorAll("log");

        _.times = [];

        for(let popup of  popups){
            let difference = parseInt(_.stopTime) - parseInt(popup.dataset['time']),
                time = parseInt(popup.dataset['live']) - difference;

            popup.setAttribute('data-time',new Date().getTime());
            popup.setAttribute('data-live',time);

            _.times.push(
                setTimeout(function(){
                    if(popup.getAttribute('data-hide') !== true){
                        MainEventBus.trigger(_.componentName,'closeLog', popup)
                    }
                },time)
            );
        }
    }

    // Запускает удаление поп-ап окна по кнопке
    closeByButton(button){
        const _ = this;
        let popup = button.item.parentElement,
            nextPopup = popup.nextElementSibling,
            items = [];

        while(nextPopup !== null){
            if(nextPopup.hasAttribute('data-hide'))  nextPopup = nextPopup.nextElementSibling;
            items.push(nextPopup);
            nextPopup = nextPopup.nextElementSibling;
        }

        _.closePopup({
            'item' : popup,
            'type' : 'btn',
            'items' : items
        });
        _.continueToLog();
    }

    // Запускает удаление поп-ап окна
    beginToClose(popup,liveTime = this.popupLiveTime){
        const _ = this;
        if(_.hasPrevPopup(popup)){
            let
                prev = _.getPrevPopup(popup),
                difference = (parseInt(popup.dataset['time']) - parseInt(prev.dataset['time']));
            _.timeToLive -= difference;
            _.timeToLive += 1000;
            if(_.timeToLive < liveTime){ _.timeToLive = liveTime; }
        } else { _.timeToLive = liveTime; }

        popup.setAttribute('data-live',_.timeToLive);

        _.times.push(
            setTimeout(function(){
                MainEventBus.trigger(_.componentName,'closeLog', popup)
            },_.timeToLive)
        );
    }

    // Управляет методами вида
    async showPopup(popupData){
        const _ = this;
        _.popupLiveTime = popupData.popupLiveTime;
        _.soundPlay = popupData.soundPlay;

        let
            headLen = popupData.headLength,
            textLength = popupData.textLength,
            cont = _.contTpl(popupData),
            popup = _.getClonePopup(),
            text = popupData.text,
            title = popupData.title;

        if(popupData.status){
            popup.className = popupData.status
        }

        if(text){
            if(text.length > textLength){
                _.setDataAttr(popup.querySelector('p'),`data-word`,Functions.cutText(text,textLength))
            } else {
                _.setDataAttr(popup.querySelector('p'),`data-word`,text)
            }
        }
        else {
            popup.classList.add('log');
            headLen = headLen * 2;
        }
        if(title){
            if(title.length > headLen){
                _.setDataAttr(popup.querySelector('h5'),`data-word`,Functions.cutText(title,headLen))
            } else {
                _.setDataAttr(popup.querySelector('h5'),`data-word`,title)
            }

        }

        cont.append(popup);
        popup.setAttribute('data-offset',_.offsetTop);
        popup.setAttribute('data-time', new Date().getTime());

        MainEventBus.trigger('languager','loadTranslate',{cont:popup});

        TweenMax.fromTo(popup,_.timeToAnim,
            {opacity:0,y:0},
            {opacity:1,y:`${_.offsetTop}px`}
        );

        if(popupData.sound && _.soundPlay === true){ popupData.sound.play() }

        let offsetHeight = popup.offsetHeight + 5;
        _.offsetTop += offsetHeight;

        popup.addEventListener('mouseleave',_.leaveHandler);
        popup.addEventListener('mouseenter',_.enterHandler);
        _.beginToClose(popup);
    }


    clearTable(){
        let body = systemConts['content'].querySelector('tbody'),
            pag = systemConts['content'].querySelector('.page-pagination');
        body.innerHTML = '';
        if(pag) pag.remove();
    }
    // Создает шапку своей страницы
    pageHeadTpl(pageData = {}){
        const _ =  this;
        _.clearBody(systemConts['content'].querySelector('.page-head'));
        return new Promise(function (resolve) {
            let tpl  = {
                el: document.createDocumentFragment(),
                childes:[
                    {
                        el:_.createEl('H1','page-title',{'data-word':'Logs'})
                    },{
                        el: _.createEl('DIV','page-action'),
                        childes:[
                            {
                                el: _.createEl('BUTTON', 'btn', {'data-click-action': "Log:clear"}),
                                childes: [{
                                    el: _.createEl('SPAN', null, {'data-word': 'Clear all logs'})
                                }]
                            }]
                    }
                ]
            };
            systemConts['content'].querySelector('.page-head').append(_.createTpl(tpl))
            resolve(systemConts['content'].querySelector('.page-head'));
        })

    }
    // Создает фильтр и поиск на своей странице
    filterTpl(){
        const _ = this;
        let tpl = {
            el: _.createEl('DIV','page-filter'),
            childes: [{
                el: _.createEl('DIV','log-select'),
                childes: [{
                    el:_.createEl('DIV','page-inpt'),
                    childes: [{
                        el:_.createEl('SPAN',null,{'data-word':'Choose type'})
                    },{
                        el:_.createEl('SELECT',null,{'data-change-action':"Log:filterLogs"}),
                        childes:[
                            {el:_.createEl('OPTION',null,{value:'all','data-word':"All"})},
                            {el:_.createEl('OPTION',null,{value:'error','data-word':"Error"})},
                            {el:_.createEl('OPTION',null,{value:'warning','data-word':"Warning"})},
                            {el:_.createEl('OPTION',null,{value:'success','data-word':"Success"})},
                            {el:_.createEl('OPTION',null,{value:'system','data-word':"System"})}
                        ]
                    }]
                }]
            },{
                    el: _.createEl('DIV','page-search'),
                    childes: [{
                        el:_.createEl('DIV','page-inpt'),
                        childes: [{
                            el:_.createEl('INPUT','log-search-value',{
                                type:"text",
                                'data-word':'Search',
                                placeholder:"",
                                'data-keyup-action':'Log:keyUpSearchLog',
                                'data-input-action':`${_.componentName}:inputSearchQuery`
                            })
                        },{
                            el:_.createEl('BUTTON','page-btn',{
                                'data-click-action':`${_.componentName}:btnSearch`
                            }),
                            childes:[
                                {
                                    el:_.createEl('IMG',null,{src:"/workspace/img/search.svg"})
                                }
                            ]
                        }]
                    }]
                }
            ]
        };
        systemConts['content'].querySelector('.page-head').append(_.createTpl(tpl,'LogFilterTpl'));
        return systemConts['content'].querySelector('.page-head')
    }
    // Формирует таблицу
    tableTpl(){
        const _ = this;
        let tpl = {
            el: _.createEl('TABLE','page-table'),
            childes: [{
                el: _.createEl('THEAD'),
                childes: [{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TH','log-table-date',{'data-word':"Date"})
                    },{
                        el:_.createEl('TH','log-table-date',{'data-word':'Time'})
                    },{
                        el:_.createEl('TH','log-table-title',{'data-word':'Title'})
                    },{
                        el:_.createEl('TH','log-table-description',{'data-word':'Description'})
                    },{
                        el:_.createEl('TH','digit',{text: `#` })
                    }]
                }]
            },{
                el: _.createEl('TBODY')}
            ]
        };
        systemConts['content'].querySelector('.page-body').append(_.createTpl(tpl,'LogTableContTpl'));
        return systemConts['content'].querySelector('.page-body')
    }
    // Создает строчку таблицы с выводом лога
    tableRowTpl(elem){
        const _ = this;
        if(!elem.desc) elem.desc = '';
        let
            time = elem.add_date.slice(11),
            date = elem.add_date.slice(8,10) + '.' + elem.add_date.slice(5,7) + '.' + elem.add_date.slice(0,4),
            tpl = {
                el: _.createEl('TR',`log-status-${elem.type}`),
                childes: [{
                    el: _.createEl('TD'),
                    childes : [{
                        el: _.createEl('DIV',null,{text : date})
                    }]
                },{
                    el: _.createEl('TD'),
                    childes: [{
                        el: _.createEl('DIV', null, {text : time})
                    }]
                },{
                    el: _.createEl('TD'),
                    childes: [{
                        el: _.createEl('SPAN', 'log-span', {'data-word' : elem.title})
                    }]
                },{
                    el: _.createEl('TD'),
                    childes: [{
                        el: _.createEl('SPAN', 'log-span', {'data-word' : elem.desc})
                    }]
                },{
                    el:_.createEl('TD'),
                    childes:[
                        {
                            el:_.createEl('DIV','page-table-actions'),
                            childes:[
                                {
                                    el:_.createEl('BUTTON','page-btn',{'data-log-id':`${elem.id}`,type:'button','data-click-action':`${_.componentName}:showFullLog`}),
                                    childes:[
                                        {
                                            el:_.createEl('IMG',null,{src:'/workspace/img/show.svg'}),
                                        }
                                    ]
                                },{
                                    el:_.createEl('BUTTON','page-btn',{'data-log-id':`${elem.id}`,type:'button','data-click-action':`${_.componentName}:deleteLog`}),
                                    childes:[
                                        {
                                            el:_.createEl('IMG',null,{src:'/workspace/img/delete.svg'}),
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }]
            };
        let buffer = _.createTpl(tpl);
        return buffer;
    }
    // Проверяет страницу, если своя запускает методы формирования страницы
    render(page){
        const _ = this;
        return new Promise( async function (resolve) {
            if( page === _.modulePage){
                _.pageHeadTpl();
                await _.filterTpl();
                _.tableTpl();
                await _.tableRowsTpl();
                resolve(systemConts['content']);
            }else{
                resolve(page)
            }
        });
    }
}