import { Ctrl } from '../main/Ctrl.js';
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
import {TweenMax} from "../../libs/GreenSock.lib.js";
export class CategorierCtrl  extends Ctrl  {
    constructor(model,view){
        super(model,view);
        const _ = this;
        _.componentName = 'categorier';

	    _.busEvents = [
		    {
		    	componentName: 'filer',
			    eventName: 'changeFile',
			    handler: _.changeThumbnail.bind(_),
		    },
		    'calcItemsCount','nextPage','prevPage','goPage',
		    'inputSearchQuery','keyUpSearch','btnSearch',
		    'searchParent','addCategorierThumbnail','fillCategoryProperty',
		    'fillCategoryProp', 'addNewProperty','addNewPropertyKeyUp',
		    'editPropertyKeyUp', 'deleteNewProperty', 'editNewProperty',
		    'savePropertyList','saveEditedProp','dropItem','dragStart',
		    'dragOver','dragLeave','addCat','addSaveBtn','removeSaveBtn',
		    'addProp','editPropertyList','updatePropertyList','changePropType',
		    'saveCat','updateCat','deleteProp','confirmDeleteProp','deletePropertyList'
	    ];
        _.startItem = null;
        _.propCnt = 0;
    }
		async deletePropertyList(clickData){
			const  _ = this;
			let btn = clickData['item'],
					id  = Number(btn.dataset.listId);
			let answer = await MainEventBus.trigger('Modaler','showConfirm',{
				text: 'Удалить?'
			});
			if(!answer) return ;
			btn.parentNode.remove();
			_.clearPropertyForm();
			await _.model.deleteProperty(id);
		}
    clearPropertyForm(){
        const _ = this;
        let form = systemConts['content'].querySelector('.categorier-property-form'),
            newPropCont = form.querySelector('.categorier-new-prop'),
            propsCont = form.querySelector('.categorier-props-list');
        newPropCont.removeAttribute('data-temp-value');
        form.reset();
        _.model.propertyValues = [];
        _.view.clearCont(propsCont);
    }


    editPropertyList(clickData){
        const _ = this;
        let
            btn = clickData['item'],
            listId = parseInt(btn.dataset.listId),
            saveBtn = systemConts['content'].querySelector('.save-action');
        saveBtn.dataset.clickAction  = `${_.componentName}:updatePropertyList`;
        let list = _.model.getPropertiesList(listId);
        _.model.propertyValues = list['props'];
        _.view.fillPropsForm(list);
        _.recalcIndexes();
    }
    async updatePagePropsList(){
        const _ =  this;
        let propsList = systemConts['content'].querySelector('.categorier-properties-list');
        _.view.clearCont(propsList);
        let lists = await _.model.getPropertiesLists(),
            listItems = _.view.el('temp',{
                childes:_.view.propertiesListTpl(lists)
            })
       propsList.append(listItems);
    }

    savePropertyList(clickData){
        const _ = this;
        let propertyForm = systemConts['content'].querySelector('.categorier-property-form'),
            formData = _.createFormData(propertyForm);
        if (!(propertyForm['elements']['title'].value)){
            TweenMax.fromTo(propertyForm['elements']['title'],1,{
                borderColor: '#FE4B4F'
            },{
                clearProps: 'borderColor'
            });
            MainEventBus.trigger('Log','showLog',{
                'status': 'error',
                'title': 'Form error',
                'text': 'Property list title is empty',
                'save': false
            });
            return;
        }
        _.model.savePropertyList(formData);
        MainEventBus.trigger('Log','showLog',{
            'status': 'success',
            'title':'Saved',
            'text': 'Property list saved',
            'save': false
        });
        _.updatePagePropsList();
        _.clearPropertyForm();
    }
    updatePropertyList(clickData){
        const _ = this;
        let propertyForm = systemConts['content'].querySelector('.categorier-property-form'),
            formData = _.createFormData(propertyForm);
        formData['id'] = propertyForm.dataset.listId;
        _.model.updatePropertyList(formData);
        MainEventBus.trigger('Log','showLog',{
            'status': 'success',
            'title':'Updated',
            'text': 'Property list updated',
            'save': false
        });
        _.clearPropertyForm();
    }
    async dragStart(dragEvent){
        const  _ = this;
        _.startItem = dragEvent['item'];
        let dataTransfer = dragEvent['event'].dataTransfer,
            img = _.view.el('IMG',{src:'/workspace/img/move.svg'});
        dataTransfer.setDragImage(img,0,0);
    }
    async dragLeave(dragEvent){
        dragEvent['item'].classList.remove('dropWaiting');
        dragEvent['event'].preventDefault();
    }
    async dragOver(dragEvent){
        dragEvent['item'].classList.add('dropWaiting');
        dragEvent['event'].preventDefault();
    }
    recalcIndexes(){
        const _ = this;
        let items = systemConts['content'].querySelectorAll('.categorier-property-item');
        items.forEach(function (item,index) {
            item.dataset.cnt = index;
            _.model.recalcSort(item.querySelector('input').value, index);
        });
        _.propCnt = items.length;
    }
    dropItem(dropEvent){
        const _ = this;
        let
            temp  = dropEvent['item'].innerHTML;
        dropEvent['item'].innerHTML = _.startItem.innerHTML;
        _.startItem.innerHTML = temp;
        dropEvent['item'].classList.remove('dropWaiting');
        dropEvent['item'].classList.add('dropSuccess');
        setTimeout(()=>{
            dropEvent['item'].classList.remove('dropSuccess');
        },1000);
        _.recalcIndexes();
        _.startItem = null;
    }
    deleteNewProperty(clickData){
        const _ = this;
        let btn = clickData['item'];
        _.model.removePropertyValue(btn.dataset.value);
        btn.parentNode.parentNode.remove();
        _.recalcIndexes();
    }
    editPropertyKeyUp(clickData){
        const  _ = this;
    }
    highLightError(cont){
        const _ = this;
        return TweenMax.fromTo(
                cont,
                .5,{
                    x:-20,backgroundColor: '#FE4B4F'
                },{
                    x:0,clearProps:'backgroundColor'
                },
        );
    }
    saveEditedProp(clickData){
        const _ = this;
        let elem  = clickData['item'],
            newPropCont = elem.parentNode,
            newPropBtn = newPropCont.querySelector('.add-new-property'),
            inputProp = newPropCont.querySelector('input'),
            tempValue = inputProp.dataset.tempValue,
            newValue = inputProp.value;
        if (_.model.hasProperty(newValue)){
            _.highLightError(systemConts['content'].querySelector(`.categorier-property-item input[value="${newValue}"]`).parentNode);
            return;
        }
        _.model.editPropertyValue(tempValue,newValue);
        let
            currentInput = systemConts['content'].querySelector(`.categorier-property-item input[value="${tempValue}"]`);
        currentInput.value = newValue;
        currentInput.previousElementSibling.textContent = newValue;
        currentInput.parentNode.querySelector('.categorier-property-item-actions').querySelectorAll('button')[0].dataset.value = newValue;
        currentInput.parentNode.querySelector('.categorier-property-item-actions').querySelectorAll('button')[1].dataset.value = newValue;

        TweenMax.to(newPropBtn,.5,{opacity:1,x:0,display:'block'});
        TweenMax.to(elem,.5,{opacity:0,x:20,display:'none'});

        inputProp.setAttribute('data-keyup-action',`${_.componentName}:savePropertyKeyUp`);
        TweenMax.fromTo(
            currentInput.parentNode,
            .5,{
                x:-20,backgroundColor: '#F4D300'
            },{
                x:0,clearProps:'backgroundColor'
            },
        );
        inputProp.value ='';
    }
    editNewProperty(clickData){
        const _ = this;
        let btn = clickData['item'],
            value = btn.dataset.value,
            newPropCont = systemConts['content'].querySelector('.categorier-new-prop'),
            newPropBtn = newPropCont.querySelector('.add-new-property'),
            inputProp = newPropCont.querySelector('input');
        inputProp.setAttribute('data-temp-value',value);
        inputProp.value = value;
        inputProp.setAttribute('data-keyup-action',`${_.componentName}:editPropertyKeyUp`);

        let saveBtn = _.view.getTpl('saveEditedPropBtnTpl',{save:true});
        newPropCont.append(saveBtn);
        TweenMax.to(saveBtn,.5,{opacity:1,x:0,display:'block'});
        TweenMax.to(newPropBtn,.5,{opacity:0,x:-20,display:'none'});
        _.recalcIndexes();
    }
    addNewPropertyKeyUp(keyData){
        const _ = this;
        if (keyData['event']['key'] == 'Enter'){
            _.addNewProperty(keyData);
            keyData['item'].focus();
        }
    }
    addNewProperty(clickData){
        const _ = this;
        let
            btn = clickData['item'],
            btnCont = btn.parentNode,
            propsCont = btn.parentNode.parentNode.parentNode.querySelector('.categorier-props-list'),
            valuesCont = btn.parentNode.parentNode.parentNode,
            input = btnCont.querySelector('input');
        if (!input.value) return;
        if (_.model.hasProperty(input.value)){
            _.highLightError(valuesCont.querySelector(`input[value="${input.value}"]`).parentNode);
            return;
        }
        _.model.addPropertyValue(input.value,_.propCnt);
        let itemTpl = _.view.getTpl('propItemTpl',{
            name: input.value,
            cnt: _.propCnt
        });
        propsCont.append(itemTpl);
        TweenMax.fromTo(itemTpl,.35,
            {x:-100,opacity:0},
            {x:0,opacity:1},
        );
        _.propCnt++;
        input.value = '';
    }
    changePropType(changeData){
        const _ = this;
        let elem = changeData['item'],
          tr = elem.parentNode.parentNode.parentNode,
          propId = tr.dataset.id;
        if(elem.value == 'list'){
            for(let prop of _.model.categoryData['props']){
                if(propId == prop['id']){
                    prop['name'] = _.model.propsList[0].id;
                }
            }
        }
    }
    async saveCat(){
        const _  = this;
        let response = await _.model.saveCat();
        _.addCat();
        MainEventBus.trigger('Log','showLog',{
            'status': 'success',
            'title':'Saved',
            'text': 'Category saved',
            'save': false
        });
        _.view.fillCategoriesList({page:1});
    }
    async updateCat(){
        const _  = this;
        await _.model.updateCat();
        _.addCat();
        MainEventBus.trigger('Log','showLog',{
            'status': 'success',
            'title':'Updated',
            'text': 'Category updated',
            'save': false
        });
        _.view.fillCategoriesList({page:1});
    }
    confirmDeleteProp(clickData){
        const _ = this;
        let elem = clickData['item'],
          tr = elem.parentNode.parentNode.parentNode,
          propId = tr.dataset.id;
        for(let i=0;i < _.model.categoryData['props'].length;i++){
            let prop = _.model.categoryData['props'][0];

            if(propId == prop['id']){
            	let deletedProp = _.model.categoryData['props'].splice(i,1);
            	console.log(deletedProp,_.model.categoryData);
                _.model.deletedProps.push(deletedProp);
            }
        }
        tr.remove();
    }
    async deleteProp(clickData){
        const _ = this;
        let deleteBtn = clickData['item'];
        let answer = await MainEventBus.trigger('Modaler','showConfirm',{
            text: 'Удалить?'
        });
        if(answer){
        	  _.confirmDeleteProp(clickData);
            let tr =deleteBtn.parentNode.parentNode.parentNode,
                charId = tr.dataset.id;
            _.model.deletedChars.push(charId);
            deleteBtn.parentNode.parentNode.parentNode.remove();
        }
    }
    async addProp(){
        const _ = this;
        let buffer = document.createDocumentFragment();
        let charsTable = systemConts['content'].querySelector('.categorier-chars-table tbody');
        let charRow = await _.view.chatTableRow();
        buffer.append(charRow);
        MainEventBus.trigger('languager','loadTranslate',buffer);
        charsTable.prepend(buffer);
        let propObj = {
            'id': charRow.dataset.id,
            'state':'new',
            'p_type': 'line',
            'name': '',
            'p_desc': '',
            'sort': 0,
        };
        if('props' in _.model.categoryData){
            _.model.categoryData['props'].push(propObj);
            //console.log(_.model.categoryData);
        }else{
            _.model.categoryData['props'] = [];
            _.model.categoryData['props'].push(propObj);
        }
        MainEventBus.trigger('languager','loadTranslate',{
            cont: charRow
        });
        _.addSaveBtn();
    }
    async addCat(clickData){
        const _ = this;
        _.removeSaveBtn();
        let
          categorierImg = systemConts['content'].querySelector('.categorier-thumbnail-img'),
          categorierTitle = systemConts['content'].querySelector('.page-subtitle'),
          categorierForm = systemConts['content'].querySelector('.categorier-form');
        categorierTitle.removeAttribute('data-lang');
        categorierImg.setAttribute('src',_.view.thumbnailSrc);
        categorierTitle.setAttribute('data-word','New category');
        categorierForm.reset();
        let charsTable = systemConts['content'].querySelector('.categorier-chars-table tbody');
        _.view.clearCont(charsTable);
        _.clearData();
        MainEventBus.trigger('languager','loadTranslate',{
            cont:  categorierForm
        })
        if (clickData) clickData['item'].remove();

    }
    clearData(){
        const _ = this;
        _.model.categoryData =  {};
        systemConts['content'].querySelector('.categorier-thumbnail-img-inpt').value  = '';
    }
    fillCategoryProp(inputData){
        const _ = this;
        let elem = inputData['item'],
            tr = elem.parentNode.parentNode.parentNode,
            propId = tr.dataset.id;
        for(let prop of _.model.categoryData['props']){
            if(propId == prop['id']){
                let val = elem.value,
                    name = elem['name'];
                if(name == 'type'){
                    val = elem.value.toLowerCase();
                }
                prop[elem['name']] = val;
            }
        }
    }
    removeSaveBtn(){
        if(this.view.categorierSaveBtnTpl) this.view.removeTpl('categorierSaveBtnTpl');

        //if(this.view.categorierSaveBtnTpl) this.view.categorierSaveBtnTpl.remove();
    }
    addSaveBtn(value,name){
        const _ = this;
        if(    !value || !(value == _.model.dataCast[name])){
            if(!_.view.categorierSaveBtnTpl){
                let form = systemConts['content'].querySelector('.categorier-form'),
                    pageActions = systemConts['content'].querySelector('.page-action');
                pageActions.append(_.view.saveBtnTpl(form.getAttribute('data-type')));
                MainEventBus.trigger('languager','loadTranslate',pageActions);
            }
        }else{
            _.removeSaveBtn();
        }
    }
    fillCategoryProperty(inputData){
        const _ = this;
        let elem = inputData['item'],
            pageActions = systemConts['content'].querySelector('.page-action'),
            name = elem['name'];
        if(!_.model.dataCast)  _.model.dataCast = Object.assign({},_.model.categoryData);
        if(name){
            if(name == 'parent'){
                if(elem['list'])
                    if(elem['list'].options[0]) _.model.categoryData[elem['name']]  = elem['list'].options[0].textContent;
            }else{
                if(elem.value) _.model.categoryData[name] = elem.value;
                else delete _.model.categoryData[name];
            }
        }
        _.addSaveBtn(elem.value,name);
        MainEventBus.trigger('languager','loadTranslate',pageActions);
    }
    async addCategorierThumbnail(){
        const _ = this;
        let content = await MainEventBus.trigger("filer",'showOnModal',false);
        MainEventBus.trigger("Modaler",'showModal',{
          //  type:'object',
            'min-width': '90%',
            content: content
        })
    }
    changeThumbnail(fileData){
        const _ = this;
        systemConts['content'].querySelector('.categorier-thumbnail-img').src= fileData['thumbnailSrc'];
        systemConts['content'].querySelector('.categorier-thumbnail-img-inpt').value= fileData['fullPath'];
        let e = document.createEvent('HTMLEvents');
        e.initEvent('change', true, true);
        systemConts['content'].querySelector('.categorier-thumbnail-img-inpt').dispatchEvent(e);
        //_.model.categoryData['image'] =  fileData['fullPath'];
        MainEventBus.trigger('Modaler','closeLastModal');
    }
    async searchParent(inputData){
        const _ = this;
        let elem = inputData.item,
		        event = inputData.event,
            query = elem.value;
        if(event.key){
            let categories = await _.model.searchParent({searchQuery:query});
            _.view.fillingParentsList(categories);
        }
    }

}