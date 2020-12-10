import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import { Ctrl } from '../main/Ctrl.js';
import {systemConts} from "../../libs/Conts.lib.js";
export class LogCtrl extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;
        _.componentName = 'Log';
        _.currentPageValue = 1;

        MainEventBus.add(_.componentName,'showLog',_.showLog.bind(_));

        MainEventBus.add(_.componentName,'showFullLog',_.showFullLog.bind(_));
        MainEventBus.add(_.componentName,'deleteLog',_.deleteLog.bind(_));
        MainEventBus.add(_.componentName,'clear',_.clear.bind(_));

        //  Работа с пагинацией
        MainEventBus.add(_.componentName,'nextPage',_.nextPage.bind(_),'LogCtrl');
        MainEventBus.add(_.componentName,'prevPage',_.prevPage.bind(_),'LogCtrl');
        MainEventBus.add(_.componentName,'goPage',_.goPage.bind(_),'LogCtrl');
        MainEventBus.add(_.componentName,'filterLogs',_.filterLogs.bind(_));

        MainEventBus.add(_.componentName,'search',_.searchLog.bind(_),'LogCtrlSearchWord');
        MainEventBus.add(_.componentName,'keyUpSearchLog',_.keyUpSearchLog.bind(_),'LogCtrl');

        MainEventBus.add(_.componentName,'inputSearchQuery',_.inputSearchQuery.bind(_),'LogCtrl');
        MainEventBus.add(_.componentName,'calcItemsCount',_.calcItemsCount.bind(_),'LogCtrl');
        MainEventBus.add(_.componentName,'btnSearch',_.btnSearch.bind(_),'LogCtrl');
    }
    // Добавляет доп данные к логу( звук, статус, временную метку)
    showLog(data){
        const _ = this;

        if(_.model.timeToLive){
            data.popupLiveTime = _.model.timeToLive;
            data.soundPlay = _.model.soundPlay;
            data.headLength = _.model.headLength;
            data.textLength = _.model.textLength;
        }
        else {
            data.popupLiveTime = 4000;
            data.soundPlay = false;
            data.headLength = 20;
            data.textLength = 40;
        }

        if(data.status){ data.sound = new Audio(`front/components/log/assets/sounds/${data.status}.mp3`) }    // выбор звука для типа сообщения
        if(!data.status){ data.status = 'system' }
        if(!data.text){ data.text = '' }
        data.time = new Date().getTime();

        if(data.save !== false){
            _.model.saveLog({
            title: data.title,
            desc: data.text,
            type: data.status
        })
        }
        _.view.showPopup(data)
    }

    // Удаляет лог с сервера
    deleteLog(clickObj){
        const _ = this;
        let e = clickObj['item'];
        _.model.deleteLog(e.getAttribute('data-log-id'));
        if(e.classList.contains('log-modal-button')){
            MainEventBus.trigger('Modaler','closeModal');
            let table = systemConts['content'].querySelector('tbody');
            let button = table.querySelectorAll('button');
            button.forEach(function (el) {
                let id = el.getAttribute('data-log-id');
                if(id === e.getAttribute('data-log-id')){
                    while(el.tagName !== 'TR'){
                        el = el.parentElement;
                    }
                    el.remove();
                }
            })
        } else {
            while(e.tagName !== 'TR'){
                e = e.parentElement;
            }
            e.remove();
        }
        MainEventBus.trigger(_.componentName,'showLog',{
            'title' : 'Log deleted',
            'status' : 'success',
            'save' : false
        });
    }

    // Удаляет все логи с сервера
    clear(){
        const _ = this;
        _.model.clear();
        MainEventBus.trigger(_.componentName,'showLog',{
            'title' : 'All logs deleted',
            'status' : 'success',
            'save' : false
        });
        let logs = document.querySelectorAll('TR');
        for(let i = 0; i < logs.length; i++){
            logs[i].remove();
        }
    }

    async showFullLog(clickObj){
        const _ = this;
        let btn = clickObj['item'],
            logId = parseInt(btn.dataset.logId),
            currentLog = await _.model.getTableItem({logId:logId}),
            user = '',
            userName,
            id = currentLog.u_id,
            style = `<style>
                        h2,p,div{ margin-bottom: 15px; }
                        div:first-child,div:last-child{ margin-bottom: 0; }
                        .log-modal-button{
                            padding: 12px 18px;
                            border-radius: 3px;
                            background-color: rgba(136,163,255,0.91);
                            color:#fff;
                            transition: .35s ease;
                        }
                        .log-modal-button:hover{ background-color: rgba(247,145,65,0.85); }
                    </style>`,
            time = `<div><span data-word="Time"></span> : <span>${currentLog.add_date.slice(11)}</span></div>`,
            date = `<div><span data-word="Date"></span> : <span>${currentLog.add_date.slice(8,10) + '.' + currentLog.add_date.slice(5,7) + '.' + currentLog.add_date.slice(0,4)}</span></div>`,
            p = `<p><span data-word="Description"></span> : <span data-word="${currentLog.desc}"></span></p>`,
            ip = `<div><span>ip</span> : <span>${currentLog.ip}</span></div>`;

        if(!currentLog.desc) p = '';
        if(!currentLog.ip) ip = '';
        if(id){
            userName = await _.model.getUserName(id),
            user = `<div><span data-word="User Name"></span> : <span>${userName}</span></div>`;
        }


        MainEventBus.trigger('Modaler','showModal',{
            content : `     <div style="max-width: 700px;">
                                ${style}
                                <h2><span data-word="Title"></span> : <span data-word="${currentLog.title}"></span></h2>
                                ${p}
                                <div><span data-word="Type"></span> : <span data-word="${currentLog.type}"></span></div>
                                ${time}
                                ${date}
                                ${user}
                                ${ip}
                                <div style="text-align: center">
                                    <button data-click-action="${_.componentName}:deleteLog" data-log-id="${currentLog.id}" class="log-modal-button">
                                        <span data-word="Delete log"></span>
                                    </button>
                                </div>
                            </div>
            `,
            contentType : 'layout'
        });


        MainEventBus.trigger('languager','loadTranslate');
    }

    // Смена типа логов
    async filterLogs(item,page = 1){
        const _ = this;
        let logSelect = systemConts['content'].querySelector('.log-select select'),
            logValue = logSelect.options[logSelect.selectedIndex].value,
            selected = await _.model.filterLogs(logValue,page),
            type = 'filter';
        systemConts['content'].querySelector('.log-search-value').value = '';
        _.model.requestData['filterProps'] = {};


        if(logValue === 'all'){
            selected = await _.model.getTableItems({page : 1});
            type = 'main';
            _.model.requestData['filterProps'] = null;
        }


        if(!selected.length){
            _.view.clearTable();
        }


       await  _.view.tableRowsTpl({
            'items' : selected,
            'type' : type,
            'query' : logValue
        });
        MainEventBus.trigger('languager','loadTranslate',{
            cont: systemConts['content']
        });
    }
    async keyUpSearchLog(keyUpData){
        const _ = this;
        systemConts['content'].querySelector('.log-select select').value = 'all';
        _.keyUpSearch(keyUpData);
    }
    async searchLog(searchMethod,template,page){
        const _ = this;
        systemConts['content'].querySelector('.log-select select').value = 'all';
        _.search(searchMethod,template,page);
    }

    async loadPageItems(page= 1,template,searchMethod) {
        const _ = this;
        let type = _.model.getCurrentType();
        if (type == 'main') {
            await _.view[template]({
                page : page,
                type : type
            });
            MainEventBus.trigger('languager','loadTranslate',{
                cont : systemConts['content']
            });
        } else {
            if(systemConts['content'].querySelector('.log-search-value').value){
                await _.searchLog(searchMethod,template,page);
            } else {
                await _.filterLogs(null,page);
            }
        }

    }
}