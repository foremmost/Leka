import { View } from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
import {Functions} from "../../libs/Functions.lib.js";
import {TweenMax} from "../../libs/GreenSock.lib.js";
export class CategorierView extends View {
    constructor(model){
        super(model);
        const _ = this;
        _.componentName = 'categorier';
        _.modulePage = 'categories';
        _.thumbnailSrc=  '/workspace/img/thumbnail.svg';
        MainEventBus.add(_.componentName,'showCatChildes',_.showCatChildes.bind(_),`${_.componentName}View`);
        MainEventBus.add(_.componentName,'hideCatChildes',_.hideCatChildes.bind(_),`${_.componentName}View`);
        MainEventBus.add(_.componentName,'editCat',_.editCat.bind(_),`${_.componentName}View`);

        MainEventBus.add(_.componentName,'changePropType',_.changePropType.bind(_),`${_.componentName}View`);
        MainEventBus.add(_.componentName,'doChangeCat',_.doChangeCat.bind(_),`${_.componentName}View`);
        MainEventBus.add(_.componentName,'showPropsForm',_.showPropsForm.bind(_),`${_.componentName}View`);
        MainEventBus.add(_.componentName,'backToTable',_.backToTable.bind(_),`${_.componentName}View`);
        _.actionType =  'inSide';
        _.actions = {
            'inSide':{
                'editCat':`${_.componentName}:editCat`,
                'showCatChildes':`${_.componentName}:showCatChildes`,
                'hideCatChildes':`${_.componentName}:hideCatChildes`
            },
            'outSide':{
                'editCat':`${_.componentName}:doChangeCat`
            }
        }
    }
    /**/
    async doChangeCat(clickData){
    	const _ = this;
      let item = clickData['item'],
          catId = parseInt(item.dataset.catId),
		      category = await _.model.getCategory({
          catId: catId
      });
      MainEventBus.trigger(_.componentName,'changeCat',category[0]);
    }
    getAction(actionName){
        let action = this.actions[this.actionType][actionName];
         if(action){
             return action;
         }else{
             return this.actions['inSide'][actionName]
         }
    }
    removeTpl(tpl){
        const _ = this;
        if(_[tpl]){
            _[tpl].remove();
            delete _[tpl];
        }
    }
    /**/
    changePropType(changeData){
        const _ = this;
        let elem = changeData['item'],
          tr = elem.parentNode.parentNode.parentNode,
          currentTpl = tr.querySelector('.prop-name .page-inpt');
        if(elem.value.toLowerCase() == 'line'){
            let
              select = currentTpl.querySelector('select'),
              lastValue = select.options[select.selectedIndex].textContent;
            _.clearCont(currentTpl);
            let option = _.createEl('INPUT',null,{'text':lastValue,'type':'text'});
            currentTpl.append(option);
        }else{
            _.clearCont(currentTpl);
            let buffer = _.createTpl(_.propsListTpl());
            currentTpl.append(buffer);
        }
    }
    async setParentField(elem,parentId){
        const _ =  this;
        let
          parentList = systemConts['content'].querySelector('.catg-parent-list'),
          parent = await _.model.getParentCategory({
              catId: parentId
          });
        if(!parent.length){
            let title = 'Нет родителя';
            elem.value = title;
            _.clearCont(parentList);
            parentList.append(_.createEl('OPTION',null,{
                text: 0,
                'data-parent-id': 0,
                value: title
            }));
        }else{
            elem.value = parent[0][`title`];
            _.clearCont(parentList);
            parentList.append(_.createEl('OPTION',null,{
                text: parent[0]['id'],
                'data-parent-id': parent[0]['id'],
                value: parent[0]['title']
            }));
        }
    }
    setImageField(elem,image){
        const _ = this;
        let thumbnail = systemConts['content'].querySelector('.categorier-thumbnail-img');
        elem.value = image;
        let imageUrl = image ? `/uploads/${image}` : '/workspace/img/thumbnail.svg';
        thumbnail.src= imageUrl;
    }
    async setPropsTable(props){
        const _ = this;
        let buffer = document.createDocumentFragment();
        let charsTable = systemConts['content'].querySelector('.categorier-chars-table tbody');
        _.clearCont(charsTable);
        Functions.showLoader(charsTable);
        for(let prop of props){
            buffer.append(await _.chatTableRow(prop));
        }
        charsTable.append(buffer);

        Functions.hideLoader(charsTable);
    }
    async editCat(clickData){
        const _ = this;
        let item = clickData['item'],
          catId = parseInt(item.dataset.catId);
        let
          category = await _.model.getCategory({catId:catId}),
          categorierTitle = systemConts['content'].querySelector('.page-subtitle'),
          categorierForm = systemConts['content'].querySelector('.categorier-form');
        categorierTitle.removeAttribute('data-lang');
        categorierTitle.setAttribute('data-word','Edit category');
        categorierForm.setAttribute('data-type','update');
        Functions.showLoader(categorierForm);
        for(let elem of categorierForm.elements){
            let prop = elem.name;
            if(prop == 'parent'){
                await _.setParentField(elem,category[0][`${prop}`])
                continue;
            }
            if(prop == 'image'){
                _.setImageField(elem,category[0][`${prop}`]);
                continue;
            }
            elem.value = category[0][`${prop}`] ? category[0][`${prop}`] : '';
        }
        if(category[0]['props']){
            await _.setPropsTable(category[0]['props'])
        }
        let pageActions = systemConts['content'].querySelector('.page-action');
        if(!_.CategorierAddBtnTpl){
            pageActions.append(_.getTpl('addBtnTpl',{save:true}));
        }

        MainEventBus.trigger(_.componentName,'addSaveBtn');
        MainEventBus.trigger('languager','loadTranslate',systemConts['content']);
        Functions.hideLoader(categorierForm);
    }
    addBtnTpl(){
        const _ =  this;
        return _.el('BUTTON',{
            class:'btn bg-green',
            'data-click-action':`${_.componentName}:addCat`,
            'data-word':'New category'
        })
    }
    saveEditedPropBtnTpl(type='save'){
        const _ =  this;
        return _.el(
            "BUTTON",{
                class: 'page-btn',
                'type': 'button',
                'data-click-action': `${_.componentName}:saveEditedProp`,
                childes:[
                    _.el('IMG',{
                        src:'/workspace/img/confirm.svg'
                    })
                ]
            }
        );
    }
    saveBtnTpl(type){
        const _ =  this;
        //let type = systemConts['content'].querySelector('.categorier-form').dataset.type;
        let tpl= {
            el: _.createEl('DIV', 'save-action'),
            childes:[
                {
                    el: _.createEl('BUTTON', 'btn', {
                        'type': 'button',
                        'data-click-action': `${_.componentName}:${type}Cat`,
                        'data-word': 'Save'
                    })
                }
            ]
        };
        return _.createTpl(tpl,`${_.componentName}SaveBtnTpl`);
    }
    propItemTpl(itemData){
        const _ = this;
        return _.el(
            'LI',{
                class: 'categorier-property-item',
                draggable: true,
                'data-cnt':itemData['cnt'],
                'data-drag-start-action': `${_.componentName}:dragStart`,
                'data-drag-leave-action': `${_.componentName}:dragLeave`,
                'data-drop-action': `${_.componentName}:dropItem`,
                'data-drag-over-action': `${_.componentName}:dragOver`,
                childes:[
                    _.el('SPAN',{ text:itemData['name']}),
                    _.el('INPUT',{ type:'hidden',name:'prop',value:itemData['name']}),
                    _.el('DIV',{
                        class: 'categorier-property-item-actions',
                        childes:[
                            _.el('BUTTON',{
                                class: 'page-btn',
                                type: 'button',
                                'data-value':itemData['name'],
                                'data-click-action': `${_.componentName}:editNewProperty`,
                                childes:[
                                    _.el('IMG',{
                                        src: '/workspace/img/edit.svg'
                                    })
                                ]}),
                            _.el('BUTTON',{
                                class: 'page-btn',
                                type: 'button',
                                'data-value':itemData['name'],
                                'data-click-action': `${_.componentName}:deleteNewProperty`,
                                childes:[
                                    _.el('IMG',{
                                        src: '/workspace/img/delete.svg'
                                    })
                                ]})
                        ]
                    })
                ]
            }
        );
    }
    savePropertyListBtnTpl(){
        const _ = this;
        return _.el(
            "BUTTON",{
                class: 'btn save-action bg-green',
                style:'opacity:0;',
                'data-click-action': `${_.componentName}:savePropertyList`,
                'data-word': 'Save prop list'
            }
        );
    }
    propertiesListItemTpl(list){
        const _ = this;
        return  _.el('LI',{
            childes:[
                _.el("BUTTON",{
                    text: list['title'],
                    type:'button',
                    'data-list-id':list['id'],
                    'data-click-action':`${_.componentName}:editPropertyList`
                }),
                _.el("BUTTON",{
                    type:'button',
                    class: 'page-btn',
                    'data-list-id':list['id'],
                    'data-click-action':`${_.componentName}:deletePropertyList`,
                    childes:[
                        _.el('IMG',{
                            src: '/workspace/img/delete.svg'
                        })
                    ]
                })
            ]
        })
    }
    propertiesListTpl(lists){
        const _ = this;
        let listArr = [];
        if (  !(lists instanceof Array)  ) return listArr;
        for(let list of lists){
            listArr.push(
                _.propertiesListItemTpl(list)
            );
        }
        return listArr;
    }
    propsFormTpl(param){
        const _ = this;
        return _.el(
                'DIV',{
                    class: 'page-form categoriers',
                    childes:[
                       _.el('DIV',{
                           class: 'page-form-left',
                           childes:[
                               _.el('DIV',{
                                   class:'page-search',
                                   childes:[
                                       _.el('DIV',{
                                           class: 'page-inpt',
                                           childes:[
                                               _.el('INPUT',{
                                                   type:"text",
                                                   'data-word':'Search',
	                                               'data-search-method': 'searchPropList',
                                                   'data-input-action':`${_.componentName}:inputSearchQuery`,
                                                   'data-keyup-action':`${_.componentName}:keyUpSearch`,
	                                                  'data-template':'searchCatPropsTpl',
                                               }),
                                               _.el('BUTTON',{
                                                    class: 'page-btn',
	                                                  type: 'button',
	                                                  'data-template':'searchCatPropsTpl',
                                                   'data-search-method': 'searchPropList',
                                                   'data-click-action':`${_.componentName}:btnSearch`,
                                                   childes:[
                                                       _.el('IMG',{
                                                           src:"/workspace/img/search.svg"
                                                       })
                                                   ]
                                               })
                                           ]
                                       })
                                   ]
                               }),
                               _.el('UL',{
                                    class: 'page-list categorier-properties-list',
                                   childes: _.propertiesListTpl(param['lists'])
                               })
                           ]
                       }),
                       _.el('FORM',{
                           class:'page-form-right categorier-property-form',
                            childes: [
                                _.el('DIV',{
                                    class: 'page-inpt',
                                    childes:[
                                        _.el('SPAN',{"data-word":'Title'}),
                                        _.el('INPUT',{"data-word":'Title',name:'title',required:true}),
                                    ]
                                }),
                                _.el(
                                    'DIV',{
                                        class: 'categorier-props-cont',
                                        childes: [
                                            _.el('DIV',{
                                                childes:[
                                                    _.el('DIV',{
                                                        class: 'categorier-new-prop page-inpt',
                                                        childes: [
                                                            _.el('INPUT',{
                                                                "data-word":'Property value',
                                                                'data-keyUp-action':`${_.componentName}:addNewPropertyKeyUp`
                                                            }),
                                                            _.el('BUTTON',{
                                                                class: 'page-btn add-new-property',
                                                                type: 'button',
                                                                'data-click-action': `${_.componentName}:addNewProperty`,
                                                                childes: [
                                                                    _.el('IMG',{
                                                                        src : '/workspace/img/plus.svg'
                                                                    })
                                                                ]
                                                            }),
                                                        ]
                                                    })
                                                ]
                                            }),
                                            _.el('UL',{class:'categorier-props-list',})
                                        ]
                                    }
                                ),

                            ]
                       })
                    ]
                }
        );
    }
    fillPropsForm(listData){
        const _ = this;
        let
            pageBody = systemConts['content'].querySelector('.page-body'),
            form = pageBody.querySelector('.categorier-property-form');
        form.setAttribute('data-list-id',listData['id']);
        form['elements']['title'].value = listData['title'];
        let propsCont = pageBody.querySelector('.categorier-props-list');
        _.clearCont(propsCont);
        listData['props'].forEach(function (el) {
            let itemTpl = _.getTpl('propItemTpl',{
                name: el.value,
                cnt: el.sort
            });
            propsCont.append(itemTpl);
        });
        TweenMax.staggerFromTo('.categorier-property-item',.35,
            {x:0-200,opacity:0},
            {x:0,opacity:1},.2
        );
    }
    async backToTable(){
        const _ = this;
        let
            pageActions = systemConts['content'].querySelector('.page-action'),
            addBtn = _.templates.get('addPropListBtnTpl');
        _.clearCont(pageActions);
        pageActions.prepend(addBtn);
        TweenMax.fromTo(addBtn,.5,{opacity:0,x:'-100%'},{opacity:1,x: '0%'});
        await _.contentTpl();
        MainEventBus.trigger('languager','loadTranslate',{
            cont: systemConts['content']
        });
    }
    backBtnTpl(){
        const _ = this;
        return _.el("BUTTON",{
            class:'btn',
	          'style': 'opacity:0',
            'data-word':'Back',
            'data-click-action': `${_.componentName}:backToTable`
        });
    }
    async showPropsForm(){
        const _ = this;
        let
            pageActions = systemConts['content'].querySelector('.page-action'),
            pageBody = systemConts['content'].querySelector('.page-body'),
            lists = await _.model.getPropertiesLists(),
            propsForm =  _.getTpl('propsFormTpl',{
                lists: lists
            }),
            backBtn = _.getTpl('backBtnTpl'),
            savePropertyListBtn = _.getTpl('savePropertyListBtnTpl');
        _.clearCont(pageBody);
        _.clearCont(pageActions);
        pageActions.prepend(backBtn);
        pageActions.prepend(savePropertyListBtn);
        TweenMax.fromTo(savePropertyListBtn,.5,{delay:.5,opacity:0,x: -100},{opacity:1,x: 0});
        TweenMax.fromTo(backBtn,.5,{delay:1,opacity:0,x:-200,},{opacity:1,x: 0});
        pageBody.append(propsForm);
        MainEventBus.trigger('languager','loadTranslate',{
            cont: systemConts['content']
        });
    }
    addPropListBtnTpl(){
        const _ = this;
        return _.el('BUTTON',{
                class:'btn bg-red',
                'data-click-action':`${_.componentName}:showPropsForm`,
                'data-word':'add Prop List'
        });
    }
    pageHeadTpl(pageData = {}){
        const _ =  this;
        _.clearBody(systemConts['content'].querySelector('.page-head'));
        return new Promise(function (resolve) {
            let tpl  = {
                el: document.createDocumentFragment(),
                childes:[
                    {
                        el:_.createEl('H1','page-title',{'data-word':'Categories'})
                    },{
                        el: _.createEl('DIV','page-action'),
                        childes:[
                            {
                                el: _.getTpl('addPropListBtnTpl',{
                                    save: true
                                })
                            }
                        ]
                    }
                ]
            };

            systemConts['content'].querySelector('.page-head').append(_.createTpl(tpl));
            resolve(systemConts['content'].querySelector('.page-head'));
        })
    }
    async searchCatTpl(searchData){
    	const _ = this;
    	if (searchData['query']){
    	  _.fillCategoriesList(searchData);
	    }else{
		    _.fillCategoriesList({page:1});
	    }
    }
    async searchCatPropsTpl(searchData){
    	const _ = this;

    	let propertiesList = systemConts['content'].querySelector('.categorier-properties-list');
			_.clearCont(propertiesList);
	    for(let list of searchData['items']){
		    propertiesList.append(_.propertiesListItemTpl(list));
	    }



    	console.log(searchData)
    }
    filterTpl(){
        const _ = this;
        return new Promise(function (resolve) {
            let tpl = {
                el: _.createEl('DIV','page-search'),
                childes: [{
                    el:_.createEl('DIV','page-inpt'),
                    childes: [{
                        el:_.createEl('INPUT',null,{
                            type:"text",
                            'data-word':'Search',
                            'data-template': 'searchCatTpl',
                            'data-input-action':`${_.componentName}:inputSearchQuery`,
                            'data-keyup-action':`${_.componentName}:keyUpSearch`})
                    },{
                        el:_.createEl('BUTTON','page-btn',{
                            'data-search-method': 'search',
	                        'data-template': 'searchCatTpl',
                            'data-click-action':`${_.componentName}:btnSearch`})
                        ,
                        childes:[
                            {
                                el:_.createEl('IMG',null,{src:"/workspace/img/search.svg"})
                            }
                        ]
                    }]
                }]

            };
            systemConts['content'].querySelector('.page-form-left').append(_.createTpl(tpl,`${_.componentName}FilterTpl`));
            resolve(systemConts['content'].querySelector('.page-form-left'));
        });
    }
    listRowTpl(categoryData){
        const _ = this;
        let
            className =  categoryData['hasChild']? 'hasChild' : null,
            subList =  categoryData['hasChild'] ? [
                {
                    el:  _.createEl("BUTTON",null,{
                        type: 'button',
                        'data-cat-id': categoryData['id'],
                        'data-click-action':`${_.getAction('showCatChildes')}`
                    }),
                }
            ] : [],
          showAction = categoryData['hasChild'] ? _.getAction('editCat') : _.getAction('editCat')
        let tpl = {
            el: _.createEl("LI",className,{
                'data-cat-id': categoryData['id'],
                'data-click-action': showAction,
                text:Functions.cutText(categoryData['title'],25)
            }),
            childes: subList
        };
        let listRow = _.createTpl(tpl);
        return listRow;
    }
    listTpl(type='main'){
        const _ = this;
        let buffer =  _.el('UL',{class:'page-list categorier-list'});
        systemConts['content'].querySelector('.page-form-left').append(buffer);
        return buffer;
    }
    subListTpl(parentItem){
        const _ = this;
        let tpl = {
            el: _.createEl('UL','page-list categorier-list-sub',{
                style:'margin-left:10px'
            })
        };
        let buffer = _.createTpl(tpl);
        parentItem.append(buffer);
        return buffer;
    }
    async showCatChildes(clickData){
        const _ = this;
        let
          item = clickData['item'],
          catId = parseInt(item.dataset.catId);
        clickData['event'].stopPropagation();
        item.parentNode.classList.add('open');
        item.setAttribute('data-click-action',_.getAction('hideCatChildes'));
        item.parentNode.setAttribute('data-click-action',_.getAction('editCat'));
        Functions.showLoader(item.parentNode);

        let childes = await _.model.getCatChildes({
            parentId: catId
        });
        _.fillCategoriesList({
            parent: _.subListTpl(item.parentNode),
            items: childes
        });
            Functions.hideLoader(item.parentNode);
    }
    async hideCatChildes(clickData){
        const _ = this;
        let
          item = clickData['item'];
        item.parentNode.classList.remove('open');
        item.setAttribute('data-click-action', _.getAction('showCatChildes'));
        item.parentNode.querySelector('.categorier-list-sub').remove();
    }
    async fillCategoriesList(wordData = {}){
        const _ = this;
        let listCont =  wordData['parent'] ? wordData['parent'] : systemConts['content'].querySelector('.page-list');
        _.clearCont(listCont);
        Functions.showLoader(listCont);
        let type = wordData['type'] ? wordData['type'] : null,
            catParents = wordData['items'] ? wordData['items'] : await _.model.getParentCategories({page:wordData['page']}),
          rowsFragment = document.createDocumentFragment();
        //
        for(let parent of catParents){
            let rowTpl = _.listRowTpl(parent);
            rowsFragment.append(rowTpl);
        }
        listCont.append(rowsFragment);
        Functions.hideLoader(listCont);
    }
    async contentTpl(){
        const _ =  this;
        _.clearBody(systemConts['content'].querySelector('.page-body'));
        return new Promise(async function(resolve) {
            let tpl = {
                el: _.createEl('DIV', 'page-form categoriers'),
                childes: [
                    {el: _.createEl('DIV', 'page-form-left')},
                    {el: _.createEl('DIV', 'page-form-right')},
                ]
            };
            systemConts['content'].querySelector('.page-body').append(_.createTpl(tpl));
            _.filterTpl();
            _.listTpl();
            _.fillCategoriesList({page:1});
            _.formTpl();
            resolve(true);
        });
    }
    /* Таблица характеристик */
    charTypeTpl(propType,propId){
        const _ = this;
        let
          typesList = ['line','list'],
          typesChildes = [];
        for(let type of typesList){
            let props = {'data-word':`${type}`,value:type}
            if(propType == type){
                props['selected'] = true;
            }
            typesChildes.push({el: _.createEl('OPTION',null,props)});
        }
        let propTypeTpl =  {
            el: _.createEl('DIV','page-inpt'),
            childes:[
                {
                    el: _.createEl('SELECT',null,{
                        'data-change-action':`${_.componentName}:changePropType`,
                        'data-input-action':`${_.componentName}:fillCategoryProp`,
                        'name':'p_type',
                        /*,'data-prop-id':`${propId}`*/}),
                    childes:typesChildes
                }
            ]
        };
        return propTypeTpl;
    }
    propsListTpl(prop = {},name=''){
        const _ = this;
        let nameTpl = {};
        let namesChildes = [];
        for(let prop of _.propslists){
            let nameProps = {'text':`${prop['title']}`,'value':prop['id']};
            if(prop['id'] == name) nameProps['selected'] = true;
            namesChildes.push({
                el: _.createEl('OPTION',null,nameProps)
            });
        }
        nameTpl = {
            el: _.createEl('SELECT',null,{
                'name': 'name',
                'data-input-action':`${_.componentName}:fillCategoryProp`
            }),
            childes: namesChildes
        }
        return nameTpl;
    }
    async charNameTpl(prop){
        const _ = this;
        let type = prop['p_type'],
            id = prop['id'],
            name = prop['name'],
          nameTpl = {};
        if(type == 'list'){
            nameTpl = _.propsListTpl(prop,name);//  childes: namesChildes
        }else{
            nameTpl = {
                el: _.createEl('INPUT',null,{
                    'text':prop['name'] ? prop['name'] : '',
                    'type':'text',
                    'name': 'name',
                    'data-input-action':`${_.componentName}:fillCategoryProp`
                })
            }
        }
        let tpl = {
            el: _.createEl('DIV','page-inpt'),
            childes:[nameTpl]
        };
        return tpl;
    }



    async chatTableRow(prop={}){
        const _ = this;
        let propId =  prop['id'] ? prop['id'] : _.genId();
        let tpl = {
            el: _.createEl('TR',null,{'data-id':propId}),
            childes:[
                {
                    el: _.createEl('TD','digit'),
                    childes:[
                        {
                            el: _.createEl('INPUT',null,{type:'checkbox',id:`p${propId}`})
                        }
                    ]
                },{
                    el: _.createEl('TD'),
                    childes:[
                        _.charTypeTpl(prop['p_type'],prop['id'])
                    ]
                },{
                    el: _.createEl('TD','prop-name'),
                    childes:[
                        await _.charNameTpl(prop)
                    ]
                },{
                    el: _.createEl('TD'),
                    childes:[
                        {
                            el: _.createEl('DIV','page-text'),
                            childes:[
                                {
                                    el: _.createEl('TEXTAREA',null,{
                                        'text': prop['p_desc'] ? prop['p_desc'] : '',
                                        'name':'p_desc',
                                        'data-input-action':`${_.componentName}:fillCategoryProp`
                                    })
                                }
                            ]
                        }
                    ]
                },{
                    el: _.createEl('TD','digit'),
                    childes:[
                        {
                            el: _.createEl('DIV','page-inpt small'),
                            childes:[
                                {
                                    el: _.createEl('INPUT',null,{
                                        'text':prop['sort'] ? prop['sort'] : '',
                                        type:'number',
                                        name: 'sort',
                                        'data-input-action':`${_.componentName}:fillCategoryProp`

                                    })
                                }
                            ]
                        }

                    ]
                },{
                    el: _.createEl('TD','digit'),
                    childes:[
                        {
                            el: _.createEl('DIV','page-table-actions'),
                            childes:[
                                {
                                    el:_.createEl('BUTTON','page-btn',{'data-prop-id':`${prop['id']}`,'data-click-action':`${_.componentName}:deleteProp`}),
                                    childes:[
                                        {
                                            el: _.createEl('IMG',null,{src:'/workspace/img/delete.svg'})
                                        }
                                    ]
                                }
                            ]
                        }

                    ]
                }
            ]
        };
        return _.createTpl(tpl);
    }
    async charTableTpl(){
        const _ = this;
        return new Promise(async function(resolve){
            let tpl = {
                el: _.createEl('TABLE','page-table categorier-chars-table'),
                childes: [{
                    el: _.createEl('THEAD'),
                    childes: [{
                        el:_.createEl('TR'),
                        childes: [{
                            el:_.createEl('TH','')
                        },{
                            el:_.createEl('TH',null,{'data-word':'Type'})
                        },{
                            el:_.createEl('TH',null,{'data-word':'Name'})
                        },{
                            el:_.createEl('TH',null,{'data-word':'Description'})
                        },{
                            el:_.createEl('TH',null,{'data-word':'Order'})
                        },{
                            el:_.createEl('TH',null,{'data-word':'#'})
                        }
                        ]
                    }]
                },{
                    el: _.createEl('TBODY'),
                    childes: [
                        //{ el: await _.tableRowTpl() },
                    ]
                }
                ]
            };
            resolve(_.createTpl(tpl));
        });
    }
    fillingParentsList(categories){
        const _ = this;
        if(!categories) return;
        let parentList = systemConts['content'].querySelector('.catg-parent-list'),
            rawList = document.createDocumentFragment();
        _.clearCont(parentList);
        for(let cat of categories){
            let option = _.createEl('OPTION',null,{
                text: cat['id'],
                'data-parent-id': cat['id'],
                value: cat['title']
            });
            rawList.append(option);
        }
        parentList.append(rawList);
    }
    async formTpl(){
        const _ = this;
        let tpl = _.el('temp',{
        	childes:[
							_.el('FORM',{class: 'categorier-form','data-submit-action': `${_.componentName}:addCategory`,'data-type':'save',childes:[
									_.el('H2',{class:"page-subtitle",'data-word': 'New category'}),
									_.el('DIV',{class:"categorier-form-row",childes:[
										_.el('DIV',{class:'categorier-form-left',childes:[
												_.el('DIV', {class:'page-inpt w49',childes:[
														_.el('SPAN',{
															'data-word': 'Title',
														}),
												  _.el('INPUT',{
												    'type': 'text',
												    'data-word': 'Title',
												    'data-input-action':`${_.componentName}:fillCategoryProperty`,
												    name: 'title'
												  })
												]}),
												_.el('DIV', {class:'page-inpt w49',childes:[
														_.el('SPAN',{
															'data-word': 'Parent',
														}),
												  _.el('INPUT',{
												    autocomplete: 'off',
												    list: 'catg-parent-list',
												    'data-word':'Parent',
												    name: 'parent',
													  'data-input-action': `${_.componentName}:fillCategoryProperty`,
												    'data-keyup-action': `${_.componentName}:searchParent`,
												  }),
															_.el('DATALIST',  {class:'catg-parent-list',id: 'catg-parent-list'}),
												]}),
												_.el('DIV', {class:'page-text w100',childes:[
														_.el('SPAN',{
															'data-word': 'Description',
														}),
												  _.el('TEXTAREA',{
												    'data-input-action':`${_.componentName}:fillCategoryProperty`,
													  'data-word': 'Description',name:'c_desc'})
												]}),
												_.el('DIV', {class:'page-text w49',childes:[
														_.el('SPAN',{
															'data-word': 'Meta description',
														}),
												  _.el('TEXTAREA',{
												    'type': 'text',
												    'data-input-action':`${_.componentName}:fillCategoryProperty`,
												    'placeholder': 'Meta description',
												    name: 'mdesc'
												  }),
												]}),
												_.el('DIV', {class:'page-text w49',childes:[
														_.el('SPAN',{
															'data-word': 'Meta keywords',
														}),
												  _.el('TEXTAREA',{
												    'placeholder': 'Meta keywords',
												    'data-input-action':`${_.componentName}:fillCategoryProperty`,
												    name: 'mkeys'
												  }),
												]}),
										]}),
										_.el('DIV',{class:'categorier-form-right',childes:[
										_.el('DIV',{class:'categorier-thumbnail',childes:[
										    _.el('DIV',{class:'categorier-btn-char',childes:[
										        _.el('BUTTON',{class:'page-btn','data-click-action':`${_.componentName}:addCategorierThumbnail`,childes:[
										            _.el('IMG',{src:'/workspace/img/plus.svg'})
										          ]})
										      ]}),
										      _.el('INPUT',{class:'categorier-thumbnail-img-inpt',name:'image',type:'hidden', 'data-change-action':`${_.componentName}:fillCategoryProperty`}),
										      _.el('IMG',{class:'categorier-thumbnail-img',src:_.thumbnailSrc})
										  ]})
										]})
									]}),
									_.el('DIV',{class:'categorier-chars',childes:[
									    _.el('DIV',{class:'categorier-btn-char inpt-file',childes:[
									        _.el('BUTTON',{class:'page-btn','data-click-action': `${_.componentName}:addProp`, type: 'button',childes:[
									            _.el('IMG',{src: '/workspace/img/plus.svg'})
									          ]}),
									      ]}),
									      _.el('H2',{class:'page-title','data-word': 'Characteristics'}),
									      await _.charTableTpl()
									  ]})
							]})
	        ]});
        systemConts['content'].querySelector('.page-form-right').append(tpl);
    }
    async pageTpl(){
        const _ = this;
        return new Promise( async function (resolve) {
            _.propslists = await _.model.getPropsList();
            _.pageHeadTpl();
            _.contentTpl();
            resolve(true);
        })
    }
    async fillCategoriesListOutSide(wordData = {}){
        const _ = this;
        _.actionType = 'outSide';
        return new Promise(async function (resolve) {
            let listCont =  _.createEl('UL','categorier-list page-list');
            let catParents = wordData['items'] ? wordData['items'] : await _.model.getParentCategories(
                {
                    page: 1,
                }),
                rowsFragment = document.createDocumentFragment();

            for(let parent of catParents){
                let rowTpl = _.listRowTpl(parent);
                rowsFragment.append(rowTpl);
            }
            listCont.append(rowsFragment);
            resolve(listCont);
        })

    }
    async render(page) {
        const _ = this;
        return new Promise(async function (resolve) {
            if( page === _.modulePage){
                let content =  await _.pageTpl();
                resolve(systemConts['content']);
            }else{
                resolve(true);
            }
        });
    }
}