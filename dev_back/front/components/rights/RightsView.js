import {View} from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";

export class RightsView extends View {
    constructor(model){
        super(model);
        //
        const _ =  this;
        _.componentName= 'Rights';
        _.modulePage = 'rights';
        //MainEventBus.add('Loader','modulesLoaded',_.render.bind(_),'RightsViewRender');
        //
        MainEventBus.add(_.componentName,'loadModulesToChangeAvail',_.loadModulesToChangeAvail.bind(_),'RightsView');
        MainEventBus.add(_.componentName,'loadActionsToChangeAvail',_.loadActionsToChangeAvail.bind(_),'RightsView');
//        MainEventBus.add(_.componentName,'loadPagesChangeAvail',_.loadPagesChangeAvail.bind(_),'RightsView');
        MainEventBus.add(_.componentName,'loadPagesToSelect',_.loadPagesToSelect.bind(_),'RightsView');
        MainEventBus.add(_.componentName,'loadGroupsToSelect',_.loadGroupsToSelect.bind(_),'RightsView');
    }
    pageHeadTpl(){
        const _ =  this;
        _.clearBody(systemConts['content'].querySelector('.page-head'));
        return new Promise(function (resolve) {
            //let pageHead = _.rawPageHeadTpl();
            let tpl  = {
                el: document.createDocumentFragment(),
                childes:[
                    {
                        el:_.createEl('H1','page-title',{'data-word':'Rights'})
                    }
                ]

            };
            systemConts['content'].querySelector('.page-head').append(_.createTpl(tpl));
            resolve(systemConts['content'].querySelector('.page-head'));

        })
    }


    loadActionsToChangeAvail(actions){
        const _ = this;
        _.clearBody(systemConts['content'].querySelector('.actionslist'));
        for (let action of actions){
            let right = _.actionTpl(action);
            systemConts['content'].querySelector('.actionslist').append(right);
        }
    }
    loadModulesToChangeAvail(modules){
        const _ = this;
        _.clearBody(systemConts['content'].querySelector('.modulelist'));
        for (let module of modules){
            let right = _.rightTpl(module);
            systemConts['content'].querySelector('.modulelist').append(right);
        }
    }

    loadPagesToSelect(pages){
        for (let page of pages){
            let option = new Option(page['name'],page['id']);
            option.setAttribute('data-word',page['name']);
            systemConts['content'].querySelector('.rights-page-select').add(option);
        }
    }
    loadGroupsToSelect(groups){
        for (let group of groups){
            let option = new Option(group['name'],group['id']);
            option.setAttribute('data-word',group['name']);
            systemConts['content'].querySelector('.rights-group-select').add(option);
        }
    }
    filterTpl(){
        const _ = this;
        let tpl = {
            el: _.createEl('DIV','page-filter'),
            childes: [{
                el: _.createEl('DIV','lang-select'),
                childes: [{
                    el:_.createEl('DIV','page-inpt'),
                    childes: [{
                        el:_.createEl('SPAN',null,{'data-word':'Choose group'})
                    },{
                        el:_.createEl('SELECT','rights-group',{'data-change-action':"Rights:changeGroup"}),
                        childes:[
                            {el:_.createEl('OPTION',null,{value:'2','data-word':"Administrators"})},
                            {el:_.createEl('OPTION',null,{value:'3','data-word':"Users"})}

                        ]
                    }]
                }]
            },{
                el: _.createEl('DIV','page-search'),
                childes: []
            }]
        };
        return _.createTpl(tpl, 'RightsFilterTpl');
    }

    rightTpl(rightData){
        const _ = this;
        let inptParam = {
            'data-change-action':'Rights:changeModuleOnPage',
            'data-id':`${rightData['module_id']}`,
            type:'checkbox',
            id:`module-${rightData['module_id']}`
        };
        if(rightData['page_id']){
            inptParam['checked'] = true;
        }
        let tpl =  {
            el: _.createEl('LI','rights-page'),
            childes:[
                { el:_.createEl('INPUT',null, inptParam )},
                {
                    el:_.createEl('LABEL',null, {for:`module-${rightData['module_id']}`}),
                    childes:[
                        {
                            el:_.createEl('STRONG',null,{'text':`${rightData['name']}`})
                        },{
                            el:_.createEl('SPAN')
                        }
                    ]
                },
            ]
        };
        return _.createTpl(tpl);
    }
    actionTpl(rightData){
        const _ = this;
        let inptParam = {
            'data-id': `${rightData['id']}`,
            'data-change-action':'Rights:changeActionAvail',
            type:'checkbox',
            id:`action-${rightData['id']}`};
        if(rightData['access']){
            inptParam['checked'] = true;
        }
        let tpl =  {
            el: _.createEl('LI','rights-page'),
            childes:[
                { el:_.createEl('INPUT',null, inptParam)},
                {
                    el:_.createEl('LABEL',null, {for:`action-${rightData['id']}`}),
                    childes:[
                        {
                            el:_.createEl('STRONG',null,{'text':`${rightData['name']}`})
                        },{
                            el:_.createEl('SPAN')
                        }
                    ]
                },
            ]
        };
        return _.createTpl(tpl);
    }
    modulesTpl(){
        const _ = this;
        let tpl = {
            el: _.createEl('DIV','page-body-in rights-in'),
            childes: [
                {
                    el: _.createEl('DIV','page-body-block'),
                    childes:[
                        {
                            el: _.createEl('DIV','page-body-block-head'),
                            childes:[
                                {
                                    el:_.createEl('DIV','page-inpt'),
                                    childes: [{
                                        el:_.createEl('SPAN',null,{'data-word':'Choose page'})
                                    },{
                                        el:_.createEl('SELECT','rights-page-select',{'data-change-action':'Rights:choosePage'})
                                    }]
                                },{
                                    el: _.createEl('h3','page-body-in-title page-subtitle',{'data-word':'Module availability'})
                                }
                            ]
                        },{
                            el: _.createEl('UL','rights-pages modulelist'),
                        }
                    ]
                }

            ]
        };
        return _.createTpl(tpl, 'RightsFilterTpl');
    }
    actionsTpl(){
        const _ = this;
        let tpl = {
            el: _.createEl('DIV','page-body-in rights-head'),
            childes: [
                {
                    el: _.createEl('DIV','page-body-block'),
                    childes:[
                        {
                            el: _.createEl('DIV','page-body-block-head'),
                            childes:[
                                {
                                    el:_.createEl('DIV','page-inpt'),
                                    childes: [{
                                        el:_.createEl('SPAN',null,{'data-word':'Choose group'})
                                    },{
                                        el:_.createEl('SELECT','rights-group-select',{'data-click-action':'Rights:chooseGroup'})
                                    }]
                                },{
                                    el: _.createEl('h3','page-body-in-title page-subtitle',{'data-word':'Action availability'})
                                }
                            ]
                        },{
                            el: _.createEl('UL','rights-pages actionslist'),
                        }
                    ]
                }

            ]
        };
        return _.createTpl(tpl);
    }
    async bodyTpl(){
        const _ = this;
        _.clearBody();
//        systemConts['content'].querySelector('.page-body').append(_.filterTpl());
        systemConts['content'].querySelector('.page-body').append(_.modulesTpl());
        systemConts['content'].querySelector('.page-body').append(_.actionsTpl());

        await  MainEventBus.trigger(_.componentName,'getPages');
        await  MainEventBus.trigger(_.componentName,'getGroups');

        let rightsGroup = systemConts['content'].querySelector('.rights-group-select'),
            rightsGroupValue = rightsGroup.options[rightsGroup.selectedIndex].value;
        let rightsPage = systemConts['content'].querySelector('.rights-page-select');
        let rightsPageValue = rightsPage.options[rightsPage.selectedIndex].value;

        await MainEventBus.trigger(_.componentName, 'getModulesToAvail', {'pageId': rightsPageValue});
        await MainEventBus.trigger(_.componentName, 'getActions', {'groupId': rightsGroupValue});

    }

    render(page){
        const _ = this;
        return new Promise(function (resolve) {
            if( page === _.modulePage){
                _.pageHeadTpl();
                _.bodyTpl().then(  ()=>{
                    resolve(systemConts['content']);
                });
            }
        })
    }
}