import {Ctrl} from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";

export class RightsCtrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;
        _.componentName= 'Rights';
        //


        MainEventBus.add(_.componentName,'getModules',_.getModules.bind(_),'RightsGetModules');
        MainEventBus.add(_.componentName,'getActions',_.getActions.bind(_),'RightsgetActions');
        MainEventBus.add(_.componentName,'getPages',_.getPages.bind(_),'RightsGetActions');
        MainEventBus.add(_.componentName,'getGroups',_.getGroups.bind(_),'RightsGetGroups');
        MainEventBus.add(_.componentName,'getModulesToAvail',_.getModulesToAvail.bind(_),'RightsGetGroups');
        MainEventBus.add(_.componentName,'choosePage',_.choosePage.bind(_),'RightsChoosePage');
        MainEventBus.add(_.componentName,'chooseGroup',_.chooseGroup.bind(_),'RightsChooseGroup');
        //
        MainEventBus.add(_.componentName,'changeActionAvail',_.changeActionAvail.bind(_),'RightsChangeActionAvail');
        MainEventBus.add(_.componentName,'changeModuleOnPage',_.changeModuleOnPage.bind(_),'RightsChangeModuleOnPage');


    }

    async changeActionAvail(changeData){
        const _ = this;
        let item  = changeData['item'];
        let rightsGroup = systemConts['content'].querySelector('.rights-group-select'),
            groupId = parseInt(rightsGroup.options[rightsGroup.selectedIndex].value),
            actionData = {
                'groupId': groupId,
                'actionId': item.dataset.id,
                'access': item.checked
            };
         await _.model.changeActionAvail(actionData);
    }
    async changeModuleOnPage(changePage){
        const _ = this;
        let item = changePage['item'];
        let rightsGroup = systemConts['content'].querySelector('.rights-page-select'),
            pageId = parseInt(rightsGroup.options[rightsGroup.selectedIndex].value),
            actionData = {
                'pageId': pageId,
                'moduleId': item.dataset.id,
                'access': item.checked
            };
       await _.model.changeModuleOnPage(actionData);
    }


    async choosePage(changePage){
        const _ = this;
        let item = changePage['item'],
            pageId = item.value;
        return await _.getModulesToAvail({'pageId': pageId});
    }
    async chooseGroup(changeObj){
        const _ = this;
        let item = changeObj['item'];
        let groupId = item.value;
        return _.getActions({'groupId':groupId});
    }
    async getActions(pagesData){
        const _ = this;
        let response = await _.model.getActions(pagesData);

        if (response.status === 'success'){
            await MainEventBus.trigger(_.componentName, 'loadActionsToChangeAvail', response['data']);
        }
    }
    async getPages(){
        const _ = this;
        let response = await _.model.getPages();
        if (response.status === 'success'){
            await MainEventBus.trigger(_.componentName, 'loadPagesToSelect', response['data']);
        }
    }

    async getGroups(){
        const _ = this;
        let response = await _.model.getGroups();
        if (response.status === 'success'){
            await MainEventBus.trigger(_.componentName,'loadGroupsToSelect',response['data']);
        }
    }
    async getModules(){
        const _ = this;
        let response = await _.model.getModules();
        if (response.status === 'success'){
            await MainEventBus.trigger(_.componentName, 'loadModulesToChangeAvail', response['data']);
        }
    }
    async getModulesToAvail(pagesData){
        const _ = this;
        let response = await _.model.getModulesToAvail(pagesData);
        if(response.status === 'success'){
            await MainEventBus.trigger(_.componentName, 'loadModulesToChangeAvail', response['data']);
        }
    }


}