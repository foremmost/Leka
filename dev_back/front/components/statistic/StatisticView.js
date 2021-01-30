import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import { View } from "../main/View.js";
import {systemConts} from "../../libs/Conts.lib.js";
import {Functions} from "../../libs/Functions.lib.js";


export class StatisticView extends View {
    constructor(model) {
        super(model);
        const _ = this;
        _.componentName = 'Statistic';
        _.modulePage = 'statistic';
        _.roundData = {
            'All tickets' : '150',
            'Tickets gifted' : '15',
            'Money from bought tickets($)' : '2250',
            'Participants' : '10',
            'New participants' : '5',
            'Participants from Affiliates' : '5',
            'Participant countries' : '2',
            'Affiliates' : '1',
            'New affiliates' : '1',
            'Affiliates from Converters' : '0',
            'Converters' : '0',
            'New converters' : '0',
            'Affiliates income($)' : '0',
            'Converters income($)' : '0'
        };
        _.allData = {
            'All tickets' : '225',
            'Tickets gifted' : '20',
            'Money from bought tickets($)' : '3150',
            'Participants' : '22',
            'Participants from Affiliates' : '10',
            'Participant countries' : '2',
            'Affiliates' : '2',
            'Affiliates from Converters' : '1',
            'Converters' : '1',
            'Affiliates income($)' : '250',
            'Converters income($)' : '125'
        }
    }

    // Создает шапку своей страницы
    pageHeadTpl(){
        const _ =  this;
        _.clearBody(systemConts['content'].querySelector('.page-head'));
        return new Promise(function (resolve) {
            let tpl  = {
                el: document.createDocumentFragment(),
                childes:[
                    {
                        el:_.createEl('H1','page-title',{'data-word':'Statistic'})
                    }
                ]
            };
            systemConts['content'].querySelector('.page-head').append(_.createTpl(tpl));
            resolve(systemConts['content'].querySelector('.page-head'));
        })
    }
    // Управляет методами вида
    tableTpl(pageData={}){
        const _ =  this;

        let workPageData = {};

        workPageData['page'] = pageData['page'] ? pageData['page'] : 1;
        super.tableTpl(workPageData);
        return new Promise( function (resolve) {
            //resolve(MainEventBus.trigger(_.componentName,'getRows',workPageData));
        });
    }
    // Создает фильтр и поиск на своей странице
    filterTpl(){
        const _ = this;
        let tpl = {
            el: _.createEl('DIV','page-filter'),
            childes: [{
                el: _.createEl('DIV','lang-select'),
                childes: [{
                    el:_.createEl('DIV','page-inpt'),
                    childes: [{
                        el:_.createEl('SPAN',null,{'data-word':'Choose Round'})
                    },{
                        el:_.createEl('SELECT','statistic-select',{'data-change-action':"tableTpl"}),
                        childes:[
                            {el:_.createEl('OPTION',null,{value:'all','data-word':"All"})},
                            {el:_.createEl('OPTION',null,{value:'error','data-word':"Round 1"})},
                            {el:_.createEl('OPTION',null,{value:'warning','data-word':"Round 2"})},
                            {el:_.createEl('OPTION',null,{value:'success','data-word':"Round 3"})},
                            {el:_.createEl('OPTION',null,{value:'system','data-word':"Round 4"})}
                        ]
                    }]
                }]
            },
                {
                    el: _.createEl('DIV','page-search'),
                    childes: [{
                        el:_.createEl('DIV','page-inpt'),
                        childes: [{
                            el:_.createEl('INPUT','log-search-value',{type:"text",'data-word':'Search',placeholder:"",'data-keyup-action':'Log:keyUpSearchWord'})
                        },{
                            el:_.createEl('BUTTON','page-btn',{'data-click-action':'Log:searchWord'}),
                            childes:[
                                {
                                    el:_.createEl('IMG',null,{src:"/img/search.svg"})
                                }
                            ]
                        }]
                    }]
                }
            ]
        };
        let buffer = _.createTpl(tpl,'LogFilterTpl');
        return buffer;
    }
    // Создает заголовок таблицы
    tableCont(){
        const _ = this;
        let tpl = {
            el: _.createEl('TABLE','page-table'),
            childes: [{
                el: _.createEl('THEAD'),
                childes: [{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TH')
                    },{
                        el:_.createEl('TH','',{'data-word':'This Round'})
                    },{
                        el:_.createEl('TH', null,{'data-word':'All Time'})
                    },{
                        el:_.createEl('TH')
                    }]
                }]
            },{
                el: _.createEl('TBODY'),
                childes:[{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'All tickets'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['All tickets']})
                    },{
                        el:_.createEl('TD',null,{'text':_.allData['All tickets']})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'Tickets gifted'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['Tickets gifted']})
                    },{
                        el:_.createEl('TD',null,{'text':_.allData['Tickets gifted']})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'Money from bought tickets($)'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['Money from bought tickets($)']})
                    },{
                        el:_.createEl('TD',null,{'text':_.allData['Money from bought tickets($)']})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'Participants'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['Participants']})
                    },{
                        el:_.createEl('TD',null,{'text':_.allData['Participants']})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'New participants'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['New participants']})
                    },{
                        el:_.createEl('TD',null,{'text':'-'})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'Participants from Affiliates'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['Participants from Affiliates']})
                    },{
                        el:_.createEl('TD',null,{'text':_.allData['Participants from Affiliates']})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'Participant countries'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['Participant countries']})
                    },{
                        el:_.createEl('TD',null,{'text':_.allData['Participant countries']})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'Affiliates'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['Affiliates']})
                    },{
                        el:_.createEl('TD',null,{'text':_.allData['Affiliates']})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'New affiliates'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['New affiliates']})
                    },{
                        el:_.createEl('TD',null,{'text':'-'})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'Affiliates from Converters'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['Affiliates from Converters']})
                    },{
                        el:_.createEl('TD',null,{'text':_.allData['Affiliates from Converters']})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'Converters'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['Converters']})
                    },{
                        el:_.createEl('TD',null,{'text':_.allData['Converters']})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'New converters'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['New converters']})
                    },{
                        el:_.createEl('TD',null,{'text':'-'})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'Affiliates income($)'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['Affiliates income($)']})
                    },{
                        el:_.createEl('TD',null,{'text':_.allData['Affiliates income($)']})
                    },{
                        el:_.createEl('TD')
                    }]
                },{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TD',null,{'data-word':'Converters income($)'})
                    },{
                        el:_.createEl('TD',null,{'text':_.roundData['Converters income($)']})
                    },{
                        el:_.createEl('TD',null,{'text':_.allData['Converters income($)']})
                    },{
                        el:_.createEl('TD')
                    }]
                }]
            }]
        };
        let buffer = _.createTpl(tpl,'StatisticTableContTpl');
        return buffer;
    }
    // Проверяет страницу, если своя запускает методы формирования страницы
    render(page){
        const _ = this;
        return new Promise(function (resolve) {
            if( page === _.modulePage){
                _.pageHeadTpl();
                _.tableTpl();
                resolve(systemConts['content']);
            } else {
                resolve(page)
            }
        });

    }
}