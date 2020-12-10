import {View} from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";

export class CrmView extends View {
    constructor(model){
        super(model);
        const _ = this;
        _.componentName = 'Crm';
        _.modulePage = 'crm';
        //
     /*   MainEventBus.add(_.componentName,'showForm',_.showForm.bind(_),`${_.componentName}View`);
        MainEventBus.add(_.componentName,'clearForm',_.clearForm.bind(_),`${_.componentName}View`);
        MainEventBus.add(_.componentName,'backToTable',_.backToTable.bind(_),`${_.componentName}View`);*/
        MainEventBus.add(_.componentName,'showSettingsTpl',_.showSettingsTpl.bind(_),`${_.componentName}View`);
        MainEventBus.add(_.componentName,'showOrdersTpl',_.showOrdersTpl.bind(_),`${_.componentName}View`);
    }
    pageHeadTpl(pageData = {}){
        const _ =  this;
        let pageHead = systemConts['content'].querySelector('.page-head');
        _.clearBody(pageHead);
        return new Promise(function (resolve) {
            let tpl  = {
                el: document.createDocumentFragment(),
                childes:[
                    {
                        el:_.createEl('H1','page-title',{'data-word':'Orders'})
                    }
                ]
            };
            pageHead.append(_.createTpl(tpl));
            resolve(pageHead);
        })
    }
    filterTpl(){
        const _ = this;
        return new Promise(function (resolve) {
            let tpl = {
                el: _.createEl('DIV','page-filter'),
                childes: [ {
                        el: _.createEl('DIV','page-search'),
                        childes: [{
                            el:_.createEl('DIV','page-inpt'),
                            childes: [{
                                el:_.createEl('INPUT',null,{
                                    type:"text",
                                    'data-word':'Search',
                                    'data-search-method': 'search',
                                    'data-input-action':`${_.componentName}:inputSearchQuery`,
                                    'data-keyup-action':`${_.componentName}:keyUpSearch`})
                            },{
                                el:_.createEl('BUTTON','page-btn',{
                                    'data-search-method': 'search',
                                    'data-click-action':`${_.componentName}:btnSearch`})
                                ,
                                childes:[
                                    {
                                        el:_.createEl('IMG',null,{src:"/workspace/img/search.svg"})
                                    }
                                ]
                            }]
                        }]
                    }]

            };
            systemConts['content'].querySelector('.page-head').append(_.createTpl(tpl,`${_.componentName}FilterTpl`));
            resolve(systemConts['content'].querySelector('.page-head'));
        });
    }
    tabsTpL(){
        const _ = this;
        let pageBody = systemConts['content'];
        let tpl = {
            el: _.createEl('CORE-TABS',''),
            childes: [{
                el: _.createEl('CORE-TABS-ITEM','active',{'data-click-action':`${_.componentName}:showOrdersTpl`}),
                childes: [
                    {
                        el:_.createEl('CORE-TABS-ITEM-TEXT',null,{'data-word':`Orders`})
                    }
                ]
            },{
                el: _.createEl('CORE-TABS-ITEM',null,{'data-click-action':`${_.componentName}:showSettingsTpl`}),
                childes: [
                    {
                        el:_.createEl('CORE-TABS-ITEM-TEXT',null,{'data-word':`Settings`})
                    }
                ]
            }]
        };
        pageBody.append(_.createTpl(tpl,`${_.componentName}TabsContTpl`));
        return  pageBody;
    }
    async ordersTableTpl(){
        const _ = this;
        let pageBody = systemConts['content'].querySelector('.page-body');
        let tpl = {
            el: _.createEl('TABLE','page-table'),
            childes: [{
                el: _.createEl('THEAD'),
                childes: [{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TH','digit',{text:"ID"})
                    },{
                        el:_.createEl('TH',null,{'text':'Email'})
                    }, {
                        el: _.createEl('TH', null, {'data-word': 'Phone'})
                    },{
                        el:_.createEl('TH',null,{'data-word':'Name'})
                    },{
                        el:_.createEl('TH',null,{'data-word':'Order form'})
                    },{
                        el:_.createEl('TH',null,{'data-word':'Type'})
                    }
                    ]
                }]
            },{
                el: _.createEl('TBODY')
            }
            ]
        };
        pageBody.append(_.createTpl(tpl,`${_.componentName}TableContTpl`));
        return  pageBody;
    }
    tableRowTpl(rowData){
        const _ = this;
        let
            tpl = {
                el: _.createEl('TR'),
                childes: [{
                    el: _.createEl('TD','digit',{text : rowData['id']})
                },{
                    el: _.createEl('TD'),
                    childes: [{
                        el: _.createEl('DIV', null, {text : rowData['email']})
                    }]
                },{
                    el: _.createEl('TD'),
                    childes: [{
                        el: _.createEl('DIV',null, {text :rowData['phone']})
                    }]
                },{
                    el: _.createEl('TD'),
                    childes: [{
                        el: _.createEl('DIV',null, {text :rowData['name']})
                    }]
                },{
                    el: _.createEl('TD'),
                    childes: [{
                        el: _.createEl('DIV', null, {'data-word' : rowData['form_order']})
                    }]
                },{
                    el:_.createEl('TD'),
                    childes:[
                        {
                            el:_.createEl('DIV','page-table-actions'),
                            childes:[
                                {
                                    el:_.createEl('BUTTON','page-btn',{
                                        'data-order-id':`${rowData['id']}`,
                                        type:'button',
                                        'data-click-action':`${_.componentName}:showOrder`}),
                                    childes:[
                                        {
                                            el:_.createEl('IMG',null,{src:'/workspace/img/show.svg'}),
                                        }
                                    ]
                                },{
                                    el:_.createEl('BUTTON','page-btn',{
                                        'data-order-id':`${rowData['id']}`,
                                        type:'button',
                                        'data-click-action':`${_.componentName}:deleteOrder`}),
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
        return _.createTpl(tpl);
    }


    async ordersContentTpl(){
        const _ = this;
        await _.filterTpl();
        await _.ordersTableTpl();
        await _.tableRowsTpl({
            page:1,
            type: 'main'
        });
        await MainEventBus.trigger('languager', 'loadTranslate', {
            cont: systemConts['content']
        });
    }
    async pageTpl(){
        const _ = this;
        //_.tabsTpL();
        await _.pageHeadTpl();
        _.ordersContentTpl();
        return systemConts['content'];
    }
    settingsTpl(){
        const _ = this;
        return new Promise(function(resolve){
            let tpl = {
                el: _.createEl('FORM','page-form'),
                childes:[
                    {
                        el: _.createEl('DIV','page-inpt small'),
                        childes:[
                            {
                              el: _.createEl('SPAN',null,{
                                  'data-word': 'Orders per page'
                              })
                            },{
                                el:_.createEl('INPUT',null, {
                                    type: 'number',
                                    'data-id':10,
                                    'data-prop': 'Order per page',
                                    value: 1,
                                    'data-change-action': `${_.componentName}:changeSetting`
                                })
                            }
                        ]
                    }
                ]
            };
            resolve(_.createTpl(tpl));
        });
    }

    async showSettingsTpl(clickData){
        const _ = this;
        let tab = clickData['item'],
            pageHead = systemConts['content'].querySelector('.page-head'),
            pageBody = systemConts['content'].querySelector('.page-body');
        _.selectCurrentTab(tab);
        _.clearBody();
        if (pageHead.querySelector('.page-filter')) pageHead.querySelector('.page-filter').remove();
        let pageTitle  = pageHead.querySelector('.page-title');
        _.updateEl(pageTitle,'page-title',{'data-word':'Settings'});


        systemConts['content'].classList.remove('wf');
        let setting = await _.settingsTpl();
        pageBody.append(setting);

        await MainEventBus.trigger('languager', 'loadTranslate');
    }
    async showOrdersTpl(clickData){
        const _ = this;
        let tab = clickData['item'];
        _.selectCurrentTab(tab);
        _.clearBody();
        await _.ordersContentTpl();
        _.wf();
    }

    async formToShowTpl(orderId){
        const _ =  this;
        let orderData  = await _.model.getOneItem({itemId:orderId});
        console.log(orderData);
//        let groupName = _.model.getInnerItem(_.model.groups,'id',parseInt(customerData['group_id']))['value'];
        let tpl = {
            el: _.createEl('DIV','page-form-right',{style:"width:100%;min-width:450px"}),
            childes: [
                {
                    el: _.createEl('H2','page-subtitle',{'data-word':'Order info'})
                },{
                    el: _.createEl('DIV','page-form-body'),
                    childes:[
                        {
                            el: _.createEl('DIV','page-form-row'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'text':'E-mail'}),
                                }, {
                                    el: _.createEl('STRONG', null, {'text': orderData['email']})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-form-row'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Name'}),
                                },{
                                    el: _.createEl('STRONG',null,{'text':orderData['name']})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-form-row'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Phone'}),
                                },{
                                    el: _.createEl('STRONG',null,{'text':orderData['phone']})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-form-row'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Order form'}),
                                },{
                                    el: _.createEl('STRONG',null,{'data-word':orderData['form_order']})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-form-row'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Date'}),
                                },{
                                    el: _.createEl('STRONG',null,{'text':orderData['date']})
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        return _.createTpl(tpl);
    }
    async render(page) {
        const _ = this;
        return new Promise(async function (resolve) {
            if( page === _.modulePage){
                _.wf();
                resolve(_.pageTpl());
            }
        });
    }
}