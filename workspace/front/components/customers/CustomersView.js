import { View } from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
import {Functions} from "../../libs/Functions.lib.js";
export class CustomersView extends View {
    constructor(model){
        super(model);
        const _ = this;
        _.modulePage =  'customers';
        _.componentName = 'Customers';
        _.submitActions = {
            'add': `${_.componentName}:saveUser`,
            'edit': `${_.componentName}:editUser`,
        };
        //
        MainEventBus.add(_.componentName,'showForm',_.showForm.bind(_),'CustomersView');
        MainEventBus.add(_.componentName,'backToTable',_.backToTable.bind(_),'CustomersView');
        MainEventBus.add(_.componentName,'userUpdated',_.userUpdated.bind(_),'CustomersView');
    }
    userUpdated(itemData){
        const _ = this;
        let itemRow = systemConts['content'].querySelector(`[data-item-id="${itemData['id']}"]`);
        if(!itemRow) {
            MainEventBus.trigger('Modaler','closeModal');
            return;
        }
        for (let prop in _.model.editedFields){
            let  currentField =  itemRow.querySelector(`[data-name="${prop}"]`);
            if(prop == 'group_id'){
                let groupName = _.model.getInnerItem(_.model.groups,'id',itemData['group_id']*1)['value'];
                currentField.removeAttribute('data-lang');
                currentField.setAttribute('data-word',groupName);
                MainEventBus.trigger('languager','loadTranslate',{cont:itemRow});
            }else if (currentField)  currentField.textContent = _.model.editedFields[prop];
        }
        MainEventBus.trigger('Modaler','closeModal');
    }
    pageHeadTpl(){
        const _ =  this;
        let pageHead = systemConts['content'].querySelector('.page-head');
        _.clearBody(pageHead);
        Functions.showLoader(pageHead);
        return new Promise(function(resolve){
            let tpl  = {
                el: document.createDocumentFragment(),
                childes:[
                    {
                        el:_.createEl('H1','page-title',{'data-word':'Customers'})
                    },{
                        el: _.createEl('DIV','page-action'),
                        childes:[
                            {
                                el: _.createEl('BUTTON', 'btn', {type:'button','data-click-action': `${_.componentName}:showForm`}),
                                childes: [{
                                    el: _.createEl('SPAN', null, {'data-word': 'Adding a customer'})
                                }]
                            }]
                    }
                ]

            };
            pageHead.append(_.createTpl(tpl));
            Functions.hideLoader(pageHead);
            resolve(pageHead);
        });

    }
    tableRowTpl(rowData){
        const _ = this;
        let groupName = _.model.getInnerItem(_.model.groups,'id',rowData['group_id'])['value'];
        let tpl = {
            el:_.createEl('TR',null,{'data-item-id':rowData['id']}),
            childes: [{
                el:_.createEl('TD','digit',{text:rowData['id']})
            },{
                el:_.createEl('TD',null,{ 'data-name':'name',  text:rowData['name']})
            },{
                el:_.createEl('TD',null,{'data-name':'login',text:rowData['login']}),
            },{
                el:_.createEl('TD',null,{'data-name':'group_id','data-word':groupName})
            },{
                el:_.createEl('TD'),
                childes:[
                    {
                        el:_.createEl('DIV','page-table-actions'),
                        childes:[
                            {
                                el:_.createEl('BUTTON','page-btn',{'data-user-id':rowData['id'],type:'button','data-click-action':`${_.componentName}:showCustomer`}),
                                childes:[
                                    {
                                        el:_.createEl('IMG',null,{src:'/workspace/img/show.svg'}),
                                    }
                                ]
                            },{
                                el:_.createEl('BUTTON','page-btn',{'data-user-id':rowData['id'],
                                    type:'button','data-click-action':`${_.componentName}:editCustomer`}),
                                childes:[
                                    {
                                        el:_.createEl('IMG',null,{src:'/workspace/img/edit.svg'}),
                                    }
                                ]
                            },{
                                el:_.createEl('BUTTON','page-btn',{'data-user-id':rowData['id'],type:'button','data-click-action':`${_.componentName}:deleteCustomer`}),
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
        let row = _.createTpl(tpl);
        return row;
    }
    tableTpl(){
        const _ = this;
        let tpl = {
            el: _.createEl('TABLE','page-table'),
            childes: [{
                el: _.createEl('THEAD'),
                childes: [{
                    el:_.createEl('TR'),
                    childes: [{
                        el:_.createEl('TH','digit',{text:"ID"})
                    },{
                        el:_.createEl('TH',null,{'data-word':"Name"})
                    },{
                        el:_.createEl('TH',null,{ text:'E-mail'})
                    },{
                        el:_.createEl('TH',null,{'data-word':'Group'})
                    },{
                        el:_.createEl('TH','digit',{text:"#"})
                    }
                    ]
                }]
            },{
                el: _.createEl('TBODY')}
            ]
        };
        let buffer = _.createTpl(tpl,`${_.componentName}TableContTpl`);
        systemConts['content'].querySelector('.page-body').append(buffer);
        return  systemConts['content'].querySelector('.page-body');
    }
    filterTpl(){
        const _ = this;
        let tpl = {
            el: _.createEl('DIV','page-filter'),
            childes: [
                {
                    el: _.createEl('DIV','page-search'),
                    childes: [{
                        el:_.createEl('DIV','page-inpt'),
                        childes: [{
                            el:_.createEl('INPUT',null,{
                                type:"text",
                                'data-word':'Search',
                                'data-input-action':`${_.componentName}:inputSearchQuery`,
                                'data-keyup-action':`${_.componentName}:keyUpSearch`,
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
        let buffer = _.createTpl(tpl,`${_.componentName}FilterTpl`);
        systemConts['content'].querySelector('.page-head').append(buffer);
        return  systemConts['content'].querySelector('.page-head');
    }
    listTpl(type='main'){
        const _ = this;
        let tpl = {
            el: _.createEl('UL','page-list')
        };
        return _.createTpl(tpl,`${_.componentName}ListTpl`);
    }
    listRowTpl(listData){
        const _ = this;
        let tpl = {
            el: _.createEl("LI"),
            childes:[
                {
                    el:  _.createEl("BUTTON",null,{
                        'data-word-text': listData['value'],
                        'data-user-id':listData['id'],
                        'data-click-action':`${_.componentName}:editCustomer`,
                        type:'button',
                        text: `${listData['name']} ${listData['second_name']}`
                    }),
                }
            ]
        };
        let listRow = _.createTpl(tpl);
        return listRow;
    }
    async listRowsTpl(listData = {}){
        const _ = this;
        let type = listData['type'] ? listData['type'] : null;
        let rows = listData['items'] ? listData['items'] : await _.model.getTableItems(listData['page']),
            childes = [],
            listTpl = systemConts['content'].querySelector('.page-list');

        for (let row of rows){
            let rowTpl = {el:_.listRowTpl(row)};
            childes.push(rowTpl);
        }
        _.clearBody( listTpl );
        listTpl.append(_.createTpl({el:document.createDocumentFragment(),childes:childes}));

        return listTpl;
    }
    loadCustomersList(customersData) {
        const _ = this;
        _.listRowsTpl(customersData);
    }
    pageFormLeft() {
        const _ =  this;
        let tpl = {
            el: _.createEl('DIV', 'page-form-left'),
            childes: [
                {
                    el: _.createEl('DIV', 'page-search'),
                    childes: [{
                        el: _.createEl('DIV', 'page-inpt'),
                        childes: [{
                            el: _.createEl('INPUT', null, {
                                type: "text",
                                'data-word': 'Search',
                                'data-template': `loadCustomersList`,
                                'data-input-action': `${_.componentName}:inputSearchQuery`,
                                'data-keyup-action': `${_.componentName}:keyUpSearch`
                            })
                        }, {
                            el: _.createEl('BUTTON', 'page-btn', {
                                'data-click-action': `${_.componentName}:btnSearch`,
                                'data-template': `loadCustomersList`,
                            }),
                            childes: [
                                {
                                    el: _.createEl('IMG', null, {src: "/workspace/img/search.svg"})
                                }
                            ]
                        }]
                    }]
                }
            ]
        };
        return _.createTpl(tpl);
    }
    pageFormRight(){
        const _ =  this;
        let tpl = {
            el: _.createEl('DIV','page-form-right'),
            childes: [
                {
                    el: _.createEl('H2','page-subtitle',{'data-word':'Adding a customer'})
                },{
                    el: _.createEl('FORM','page-form-body',{'data-submit-action': _.submitActions['add']}),
                    childes:[
                        {
                            el: _.createEl('DIV','page-inpt large'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'text':'E-mail/Login'}),
                                },{
                                    el: _.createEl('INPUT',null,{name:'login',type:'email','required':true})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-inpt large'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Name'}),
                                },{
                                    el: _.createEl('INPUT',null,{name:'name',type:'text'})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-inpt large'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Surname'}),
                                },{
                                    el: _.createEl('INPUT',null,{type:'text',name:'second_name'})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-inpt'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Group'}),
                                },{
                                    el: _.createEl('select',null,{name:'group_id'}),
                                    childes:[
                                        {
                                            el: _.createEl('OPTION',null,{value:'3','data-word':'Users'}),
                                        },{
                                            el: _.createEl('OPTION',null,{value:'2','data-word':'Administrators'}),
                                        }
                                    ]
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-text'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Description'}),
                                },{
                                    el: _.createEl('TEXTAREA',null,{name:'description'}),
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-inpt large'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Password'}),
                                },{
                                    el: _.createEl('INPUT',null,{name:'pass',type:'text','required':true})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-inpt large'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Confirm password'}),
                                },{
                                    el: _.createEl('INPUT',null,{name:'cpass',type:'text','required':true})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-do'),
                            childes:[
                                {
                                    el: _.createEl('BUTTON','btn btn-large',{'data-word':'Save'})
                                }
                            ]
                        },
                    ]
                }
            ]
        };
        return _.createTpl(tpl);
    }
    async formToEditTpl(itemId){
        const _ =  this;
        let customerData  = await _.model.getOneItem({itemId:itemId});
        //console.log(customerData);
        let tpl = {
            el: _.createEl('DIV','page-form-right'),
            childes: [
                {
                    el: _.createEl('H2','page-subtitle',{'data-word':'Edit profile'})
                },{
                    el: _.createEl('FORM','page-form-body',{'data-submit-action': _.submitActions['edit']}),
                    childes:[
                        {
                            el: _.createEl('INPUT',null,{type:'hidden',name:'uId',value:customerData['id']})
                        },
                        {
                            el: _.createEl('DIV','page-inpt large edit'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'text':'E-mail/Login'}),
                                },{
                                    el: _.createEl('INPUT',null,{
                                        'data-input-action':`${_.componentName}:changeFieldValue`,
                                        name:'login',
                                        type:'email',
                                        'required':true,
                                        text:customerData['login']})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-inpt large edit'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Name'}),
                                },{
                                    el: _.createEl('INPUT',null,{
                                        'data-input-action':`${_.componentName}:changeFieldValue`,
                                        name:'name',type:'text',text:customerData['name']})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-inpt large edit'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Surname'}),
                                },{
                                    el: _.createEl('INPUT',null,{
                                        'data-input-action':`${_.componentName}:changeFieldValue`,
                                        type:'text',name:'second_name',
                                        text:customerData['second_name']})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-inpt edit'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Group'}),
                                },{
                                    el: _.createEl('select',null,{
                                        'data-change-action':`${_.componentName}:changeFieldValue`,
                                        name:'group_id'}),
                                    childes:[
                                        {
                                            el: _.createEl('OPTION',null,{value:'3','data-word':'Users'}),
                                        },{
                                            el: _.createEl('OPTION',null,{value:'2','data-word':'Administrators'}),
                                        }
                                    ]
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-text edit'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Description'}),
                                },{
                                    el: _.createEl('TEXTAREA',null,{
                                        'data-input-action':`${_.componentName}:changeFieldValue`,
                                        name:'description',text:customerData['description']}),
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-inpt large edit'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Password'}),
                                },{
                                    el: _.createEl('INPUT',null,{name:'pass',type:'text'})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-inpt large edit'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Confirm password'}),
                                },{
                                    el: _.createEl('INPUT',null,{name:'cpass',type:'text'})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-do'),
                            childes:[
                                {
                                    el: _.createEl('BUTTON','btn btn-large',{'data-word':'Save'})
                                }
                            ]
                        },
                    ]
                }
            ]
        };
        return _.createTpl(tpl);
    }
    async formToShowTpl(customerId){
        const _ =  this;
        let customerData  = await _.model.getOneItem({itemId:customerId});
        //console.log(customerData);
        let groupName = _.model.getInnerItem(_.model.groups,'id',parseInt(customerData['group_id']))['value'];
        let tpl = {
            el: _.createEl('DIV','page-form-right'),
            childes: [
                {
                    el: _.createEl('H2','page-subtitle',{'data-word':'User profile'})
                },{
                    el: _.createEl('DIV','page-form-body'),
                    childes:[
                        {
                            el: _.createEl('DIV','page-form-row'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'text':'E-mail/Login'}),
                                },{
                                    el: _.createEl('STRONG',null,{'text':customerData['login']})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-form-row'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Name'}),
                                },{
                                    el: _.createEl('STRONG',null,{'text':customerData['name']})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-form-row'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Surname'}),
                                },{
                                    el: _.createEl('STRONG',null,{'text':customerData['second_name']})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-form-row'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Group'}),
                                },{
                                    el: _.createEl('STRONG',null,{'data-word':groupName})
                                }
                            ]
                        },{
                            el: _.createEl('DIV','page-form-row'),
                            childes:[
                                {
                                    el: _.createEl('SPAN',null,{'data-word':'Description'}),
                                },{
                                    el: _.createEl('STRONG',null,{'text':customerData['description']})
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        return _.createTpl(tpl);
    }
    formTpl(){
        const _ =  this;
        let tpl  = {
            el:_.createEl('DIV','page-form'),
            childes: [
                {
                   el: _.pageFormLeft()
                },{
                    el: _.pageFormRight()
                }
            ]
        };
        let buffer = _.createTpl(tpl,null);
        return buffer;
    }
    async showForm(item){
        const _ = this;
        Functions.showLoader(systemConts['content']);
        let
            pageFilter  = systemConts['content'].querySelector('.page-filter'),
            pageHead  = systemConts['content'].querySelector('.page-head'),
            actionBtn = pageHead.querySelector('.page-action button'),
            actionBtnSpan = pageHead.querySelector('.page-action button>span'),

            pageBody  = systemConts['content'].querySelector('.page-body'),
            customersList = _.listTpl(),
            form = _.formTpl();
        _.clearBody();
        actionBtnSpan.setAttribute('data-word','Back');
        actionBtnSpan.removeAttribute('data-lang');
        actionBtn.setAttribute('data-click-action',`${_.componentName}:backToTable`);


        pageBody.append(form);
        let  pageFormLeft  = pageBody.querySelector('.page-form-left');
        pageFormLeft.append(customersList);
        _.listRowsTpl();
        pageFilter.style.display = 'none';
        systemConts['content'].classList.remove('wf');
        MainEventBus.trigger('languager','loadTranslate',{
            cont: systemConts['content'],
            anim: true
        });
        Functions.hideLoader(systemConts['content']);
    }
    async backToTable(clickData){
        const _ = this;
        Functions.showLoader(systemConts['content']);
        let item = clickData['item'];
        _.clearBody();
        let
          pageFilter  = systemConts['content'].querySelector('.page-filter'),
          actionBtn = item.querySelector('span');
        item.setAttribute('data-click-action',`${_.componentName}:showForm`);
        actionBtn.removeAttribute('data-word');
        actionBtn.removeAttribute('data-lang');
        actionBtn.setAttribute('data-word','Adding a customer');
        pageFilter.style.display = 'flex';
        MainEventBus.trigger('languager','loadTranslate',{
            cont: systemConts['content'],
            anim: true
        });
        await _.mainContentTpl();
        Functions.hideLoader(systemConts['content']);
    }
    async mainContentTpl(){
        const _ = this;
        _.wf();
        _.filterTpl();
        _.tableTpl();
        await _.tableRowsTpl({page:1});
    }
    async pageTpl(){
        const _ = this;
        _.pageHeadTpl();
        return await _.mainContentTpl();
    }
    render(page) {
        const _ = this;
        return new Promise(async function (resolve) {
            if (page === _.modulePage) {
                await _.pageTpl();
                MainEventBus.trigger('languager','loadTranslate',systemConts['content']);
                resolve(systemConts['content'])
            }
        });
    }
}