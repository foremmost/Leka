import { systemConts } from "../../libs/Conts.lib.js";
import { View } from "../main/View.js";
import {TimelineMax} from "../../libs/GreenSock.lib.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
export class CategorierView extends View {
    constructor(model) {
        super(model);
        const _ = this;
        _.componentName = 'Categorier';
        _.modulePage = 'categories';
        _.perPage = 15;
        _.pages = 1;

        _.clickActions = {
            'showSubCatgs': `${_.componentName}:showSubCatgs`,
        };

        MainEventBus.add(_.componentName, 'showSubCatgs', _.showSubCatgs.bind(_));
    }

    /* Шапка */
    headTpl() {
        const _ =  this;
        _.clearBody(systemConts['content'].querySelector('.page-head'));
        return new Promise(function (resolve) {
            let headTpl = {
                el: document.createDocumentFragment(),
                childes: [
                    { el: _.createEl('H1', 'page-title', {'data-word': 'Categories'}), },
                    {
                        el: _.createEl('DIV', 'page-action', null),
                        childes: [
                            {el: _.createEl('BUTTON', 'btn', {'data-word': 'Add category', 'data-click-action': `${_.componentName}:addEditCategory`})}
                        ]
                    }
                ]
            };
            systemConts['content'].querySelector('.page-head').append(_.createTpl(headTpl));
            resolve(systemConts['content'].querySelector('.page-head'));
        });
    }

    /* Шаблон content */
    contentTpl(){
        const _ =  this;
        _.clearBody(systemConts['content'].querySelector('.page-body'));
        return new Promise(async function(resolve){
            let tpl = {
                el: _.createEl('DIV', 'page-form categoriers'),
                childes: [
                    {el: _.createEl('DIV', 'page-form-left')},
                    {el: _.createEl('DIV', 'page-form-right')},
                ]
            };

            systemConts['content'].querySelector('.page-body').append(_.createTpl(tpl));

            let leftContent = new Map()
                .set('search', await _.searchTpl())

            let rightContent = new Map()
                .set('categoryForm', await _.addCategoryTpl());

            _.addToColumn('left', leftContent);
            _.addToColumn('right', rightContent);

            await _.categoriesListTpl(); // Добавление списка категорий
            _.paginationAdd(); // Добавление пагинаций

            // Запросить перевод строк
            MainEventBus.trigger('languager','loadTranslate', systemConts['content']);

            resolve(systemConts['content'].querySelector('.page-body'));
        })
    }
    /* Шаблон content */

    /* Затереть разметку колонки side = 'left' | 'right' */
    addToColumn(side, content){
        const _ = this;
        if(side === 'left') side = '.page-form-left';
        else if(side === 'right') {
            side = '.page-form-right';
        }
        else return;

        let to = systemConts['content'].querySelector(side);
        _.clearCont(to);
        content.forEach(function(item){ to.append(item) })
    }
    /* Затереть разметку колонки */

    /* --------------------- Left Side --------------------- */

    /* Поиск по категориям */
    async searchTpl(){
        const _ = this;
        return new Promise(function(resolve){
            let tpl = {
                el: _.createEl('DIV','page-search'),
                childes: [{
                    el:_.createEl('DIV','page-inpt'),
                    childes: [{
                        el:_.createEl('INPUT','lang-search-value',{
                            type:"text",
                            'data-word':'Search',
                            'data-input-action':`${_.componentName}:inputSearchQuery`,
                            'data-keyup-action':`${_.componentName}:keyUpSearch`
                        })
                    },{
                        el:_.createEl('BUTTON','page-btn',{
                            'data-search-method': `search`,
                            'data-click-action':`${_.componentName}:btnSearch`,
                            'data-template':`categoriesListTpl`
                        }),
                        childes:[
                            {
                                el:_.createEl('IMG',null,{src:"/workspace/img/search.svg"})
                            }
                        ]
                    }]
                }]
            };
            resolve(_.createTpl(tpl, 'CategorierSearchTpl'));
        })
    }
    /* Поиск по категориям */

    /* Зачистка и сборка внешнего контейнера категорий */
    async categoriesListTpl(data = {page: 1}){
        const _ = this;

        let listContainer = systemConts['content'].querySelector('.categories-list'),
            listUl;

        if(!listContainer) {
            listContainer = { el: _.createEl('DIV', 'categories-list'), childes: [
                    { el: _.createEl('DIV', 'page-list', null), childes: [] }
                ] };
            systemConts['content'].querySelector('.page-form-left').append(_.createTpl(listContainer));
        }

        listUl = systemConts['content'].querySelector('.page-list');
        _.clearCont(listUl);

        let categories = await _.requestCatgs(data);
        for (let i = 0; i < categories.parents.length; i++){
            let childMarkup = _.privateMarkupChildCat(categories.childes, categories.parents[i].id, categories.parents[i].title);
            listUl.append(_.createTpl(childMarkup));
        }
    }
    /* Зачистка и сборка внешнего контейнера категорий */

    /* Запрос категорий */
    async requestCatgs(data){
        const _ = this;
        let categories = data['items'] ? data['items'] : await _.model.getCategories({page: data.page});
        let result = {
            parents: [],
            childes: [],
        };
        console.log(categories);
        categories.map((item) => { item.parent === 0 ? result.parents.push(item) : result.childes.push(item);});
        return result;
    }
    /* Запрос категорий */

    /* Сборка внутреннего дерева категорий */
    privateMarkupChildCat(childCatgs, id, title){
        const _ = this;
        let elem = {el: _.createEl('DIV', 'cat-el cat-el-parent', {text: title, 'data-click-action': 'Categorier:showSubCatgs'}), childes:[]};
        let currentInfo, element, isChild = false;
        for(let i = 0; i < childCatgs.length; i++){
            if(id === childCatgs[i].parent){
                isChild = true;
                currentInfo = {id:  childCatgs[i].id, title: childCatgs[i].title};
                childCatgs.splice(i, 1); i--;
                element = _.privateMarkupChildCat(childCatgs, currentInfo.id, currentInfo.title);
                elem.childes.push(element);
            }
        }
        if(!isChild) elem = {el: _.createEl('DIV', 'cat-el', {text: title, 'data-id': id}), childes: []};
        return elem;
    }
    /* Сборка внутреннего дерева категорий */

    /* Установка стрелок для toogle дочерних категорий */
    showSubCatgs(e){
        const _ = this;
        let target = e.item;
        let elementsToShow = Array.from(e.item.childNodes);
        let tl = new TimelineMax();

        if(target.classList.contains('cat-el-parent_reverse-arr')){
            tl.to(elementsToShow, .3, {height: 0});
            tl.to(elementsToShow, 0, {display: 'none'});
        } else {
            tl.to(elementsToShow, 0, {display: 'block'});
            tl.to(elementsToShow, .3, {height: 'auto'});
        }

        target.classList.toggle('cat-el-parent_reverse-arr');
    }
    /* Установка стрелок для toogle дочерних категорий */

    /* Подготовка пагинаций */
    async paginationAdd() {
        const _ = this;
        let count = await _.model.getItemsCount();
        _.loadPagination({
            cnt: count,
            tableClass: '.page-list',
            searchMethod: 'searchDefaultCharacteristics',
            template: 'categoriesListTpl',
        });
    }
    /* Подготовка пагинаций */

    /* --------------------- Left Side --------------------- */


    /* --------------------- Right Side --------------------- */

    /* Шаблон формы добавления/изменения категорий */
    addCategoryTpl(){
        const _ = this;
        return new Promise(async function(resolve){
            let tpl = {
                el: document.createDocumentFragment(),
                childes: [
                    {
                        el: _.createEl('FORM', 'category-form', {'data-submit-action': `${_.componentName}:addEditCategory`}),
                        childes: [
                            { el: _.createEl('H2', 'page-subtitle', {'data-word': 'Add category'}) },
                            {
                                el: _.createEl('DIV', 'page-inpt'),
                                childes: [
                                    { el: _.createEl('INPUT', '', {'type': 'text', 'placeholder': 'Category name', name: 'catg-name'}) },
                                ]
                            },
                            {
                                el: _.createEl('DIV', 'page-inpt'),
                                childes: [
                                    {
                                        el: _.createEl('INPUT', '', {list: 'catg-parent-list', name: 'catg-parent-list'})
                                    },
                                    {
                                        el: _.createEl('DATALIST', 'catg-parent-list', {id: 'catg-parent-list'}),
                                        childes: await _.addCatgsInDataList()

                                    },
                                ]
                            },
                            {
                                el: _.createEl('DIV', 'page-text'),
                                childes: [
                                    { el: _.createEl('TEXTAREA', '', {'placeholder': 'Category description'}) },
                                ]
                            },
                            {
                                el: _.createEl('DIV', 'inpt-file', {}),
                                childes: [
                                    {
                                        el: _.createEl('BUTTON', 'page-btn', {'data-click-action': `${_.componentName}:addThumbnail`, type: 'button'}),
                                        childes: [
                                            {el: _.createEl('IMG', '', {src: '/workspace/img/plus.svg'})}
                                        ]
                                    }
                                ]
                            },
                            { el: _.createEl('H2', 'page-subtitle', {'data-word': 'Characteristics'}) },
                            { el: await _.filterCharTpl() },
                            { el: await _.charTableTpl() },
                        ]
                    }
                ]
            };
            resolve(_.createTpl(tpl));
        });
    }
    /* Шаблон формы добавления/изменения категорий *//* Шаблон формы добавления/изменения категорий */


    /* Добавление в select выбора род.категорий вариантов */
    async addCatgsInDataList(){
        const _ = this;
        let categories = await _.model.getAllCategories();
        let categoriesTpl = [];
        if(categories){
            categories.forEach(category => {
                categoriesTpl.push({
                    el: _.createEl('OPTION', 'cat-parent-list-item',
                        {'data-word': category.title, 'data-id': category.id, 'data-parent': category.parent} )});
            });
        }

        return categoriesTpl;
    }
    /* Добавление в select выбора род.категорий вариантов */

    /* Фильтр характеристик категорий */
    async filterCharTpl(){
        const _ = this;
        return new Promise(function(resolve){
            let tpl = {
                el: _.createEl('DIV','page-search'),
                childes: [{
                    el:_.createEl('DIV','page-inpt'),
                    childes: [{
                        el:_.createEl('INPUT','lang-search-value',{
                            type:"text",
                            'data-word':'Search',
                            'data-input-action':`${_.componentName}:inputSearchQuery`,
                            'data-keyup-action':`${_.componentName}:keyUpSearch`
                        })
                    },{
                        el:_.createEl('BUTTON','page-btn',{
                            'data-search-method': `search`,
                            'data-click-action':`${_.componentName}:btnSearch`,
                            'data-template': `categoriesListTpl`,
                        }),
                        childes:[
                            {
                                el:_.createEl('IMG',null,{src:"/workspace/img/check.svg"})
                            }
                        ]
                    }]
                }]
            };
            resolve(_.createTpl(tpl, 'CategorierFilterTpl'));
        })
    }
    /* Фильтр характеристик категорий */

    /* Таблица характеристик */
    charTableTpl(){
        const _ = this;
        return new Promise(async function(resolve){
            let tpl = {
                el: _.createEl('TABLE','page-table'),
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
                        { el: await _.tableRowTpl() },
                    ]
                }
                ]
            };
            resolve(_.createTpl(tpl, 'CategorierTableTpl'));
        });
    }
    /* Таблица характеристик */

    /* Шаблон одной характеристики категорий */
    tableRowTpl(){
        const _ = this;
        return new Promise(function(resolve){
            let tpl = {
                el: _.createEl('tr', 'table-header-row'),
                childes: [
                    { el: _.createEl('td', 'table-col'),
                        childes: [{
                        el: _.createEl('DIV', 'char-check', {type: 'text'}),
                            childes: [
                                {el: _.createEl('INPUT', null, {type: 'checkbox', id: 'cat-row-check', name: 'charcs-choosen'})},
                                {el: _.createEl('LABEL', null, {'for': 'cat-row-check'})}
                            ]
                    }]
                    },
                    {
                        el: _.createEl('td', 'table-col', {}),
                        childes: [
                            {
                                el: _.createEl('DIV', 'page-inpt'),
                                childes: [
                                    { el: _.createEl('SELECT', 'char-select', {name: 'charcs-type-desc'}),
                                        childes: [
                                            {el: _.createEl('OPTION', 'char-select-opt', {text: 'Текст'})},
                                            {el: _.createEl('OPTION', 'char-select-opt', {text: 'Список'})},
                                    ] }
                                ]
                            }
                        ]
                    },
                    {
                        el: _.createEl('td', 'table-col', {}),
                        childes: [ {
                            el:_.createEl('div','page-inpt'),
                            childes: [
                                {
                                el:_.createEl('INPUT',null,{type:'text','data-word':'Name', name: 'charcs-name' }),
                            }]
                        } ]
                    },
                    {
                        el: _.createEl('td', 'table-col', {}),
                        childes: [
                            {
                                el: _.createEl('DIV', 'page-inpt'),
                                childes: [ { el: _.createEl('INPUT', 'char-description', {type: 'text', name: 'charcs-desc'})} ]
                            }
                        ]
                    },
                    {
                        el: _.createEl('td', 'table-col', {}),
                        childes: [ {
                            el: _.createEl('DIV', 'page-inpt'),
                            childes: [ { el: _.createEl('INPUT', 'char-order', {type: 'number', min: 0, name: 'charcs-order'})} ]
                        } ]
                    },
                    {
                        el: _.createEl('td', 'table-col', {}),
                        childes: [ {
                            el: _.createEl('BUTTON', 'page-btn', {}),
                            childes: [
                                { el:_.createEl('IMG',null,{src:"/workspace/img/plus.svg"}) }
                            ]
                        } ]
                    },
                ]
            };
            resolve(_.createTpl(tpl, 'categoryCharRow'));
        })
    }
    /* Шаблон одной характеристики категорий */

    /* --------------------- Right Side --------------------- */



    /* Отрисовка шалонов на страницу */
    render(page){
        const _ = this;
        return new Promise(async function (resolve) {
            if(_.modulePage === page){
                _.headTpl();
                _.contentTpl();
                resolve(systemConts['content']);
            } else {
                resolve(page);
            }
        })
    }
    /* Отрисовка шалонов на страницу */
}