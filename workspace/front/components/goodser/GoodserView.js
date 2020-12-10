import { View } from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
import {Functions} from "../../libs/Functions.lib.js";
import {TweenMax} from "../../libs/GreenSock.lib.js";
export class GoodserView extends View {
    constructor(model){
        super(model);
        const _ = this;
        _.componentName = 'goodser';
        _.modulePage = 'goods';
        //
        MainEventBus.add(_.componentName,'showForm',_.showForm.bind(_),`${_.componentName}View`);
        MainEventBus.add('categorier','changeCat',_.changeCat.bind(_),`${_.componentName}View`);
    //    MainEventBus.add(_.componentName,'clearForm',_.clearForm.bind(_),`${_.componenName}View`);
    //    MainEventBus.add(_.componentName,'backToTable',_.backToTable.bind(_),`${_.componenName}View`);

    //    _.Cat = new Categorier();
    }
    async changeCat(catData){
        const  _ = this;

        _.fillCharacsList(catData['props'])
    }
    async catsTpl(charData){
        const _ = this;
        return await  MainEventBus.trigger('categorier','getCatList');// _.Cat.getCatList();
    }
    async fillCharacsList(characs){
        const _ = this;
         let charsCont = systemConts['content'].querySelector('.page-form-goods-chars');
         _.clearCont(charsCont);
         for (let charac of characs){
             if((charac['p_type'] == 'list')){
                 charsCont.append(await _.characItemlistTpl(charac));
             }else{
              charsCont.append(_.characItemTpl(charac));
             }
         }
         TweenMax.staggerFromTo(charsCont.querySelectorAll('.page-inpt'),.35,{
             x: -100,
             opacity:0
         },{
             x:0,
             opacity: 1
         },.15)
    }
    async characItemlistTpl(charac){
        const _ = this;
        let list  = await MainEventBus.trigger('categorier','getCurrentPropList',charac['name']);// _.Cat.getCurrentPropList(charac['name']);

        let listChildes = [];
        list['props'].forEach(function (prop) {
            listChildes.push(
                _.el('OPTION',{
                    value: prop['id'],
                    text: prop['value']
                })
            )
        });
        return _.el('DIV',{
            class:'page-inpt',
            style: 'opacity:0',
            childes:[
                _.el('SPAN',{
                    text: list['title']
                }),
                _.el('SELECT',{
                    'name':`prop-${charac['id']}`,
                    childes:listChildes
                })
            ]
        })
    }
    characItemTpl(charac){
        const _ = this;
        let tpl = {
            el: _.createEl('DIV','page-inpt',{style:'opacity:0'}),
            childes:[
                {
                    el: _.createEl('SPAN',null,{text: charac['name']})
                },{
                    el: _.createEl('INPUT',null,{'name':`prop-${charac['id']}`})
                }
            ]
        };
        return _.createTpl(tpl);
    }
    async headTpl(){
        const _ = this;
        let tpl =  {
            el : '',
            childes: [
                {
                    el:''
                }
            ]
        };
        let buffer = _.createTpl(tpl);
        return buffer;
    }

    saveBtnTpl(){
        const _ = this;
        let tpl = {
            el: _.createEl('DIV','save-action',{
             }),
            childes:[
                {
                    el: _.createEl('BUTTON','btn',{'data-word':'Save',   'data-click-action':`${_.componentName}:saveProduct`})
                }
            ]
        };
        return _.createTpl(tpl,`${_.componentName}saveBtn`);
    }
    async showForm(item){
        const _ = this;
        Functions.showLoader(systemConts['content']);
        let
            pageFilter  = systemConts['content'].querySelector('.page-filter'),
            pageHead  = systemConts['content'].querySelector('.page-head'),
            actionBtn = pageHead.querySelector('.page-action button'),
            actionBtnSpan = pageHead.querySelector('.page-action button span'),
            pageBody  = systemConts['content'].querySelector('.page-body'),
            form = await _.formTpl();
        _.clearBody();

        pageHead.querySelector('.page-action').prepend(_.saveBtnTpl());

        pageBody.append(form);

        actionBtnSpan.removeAttribute('data-word');
        actionBtnSpan.removeAttribute('data-lang');
        actionBtnSpan.setAttribute('data-word','Back');
        actionBtn.setAttribute('data-click-action',`${_.componentName}:backToTable`);
        pageFilter.style.display = 'none';
        systemConts['content'].classList.remove('wf');
        MainEventBus.trigger('languager','loadTranslate',systemConts['content']);
        Functions.hideLoader(systemConts['content']);
    }
    pageHeadTpl(pageData = {}){
        const _ =  this;
        _.clearCont(_.content.querySelector('.page-head'));
        return new Promise(function (resolve) {
            let tpl  = {
                el: document.createDocumentFragment(),
                childes:[
                    {
                        el:_.createEl('H1','page-title',{'data-word':'Goods'})
                    },{
                        el: _.createEl('DIV','page-action'),
                        childes:[
                            {
                                el: _.createEl('BUTTON', 'btn', {'data-click-action': `${_.componentName}:showForm`,type:'button'}),
                                childes: [{
                                    el: _.createEl('SPAN', null, {'data-word': 'Adding a product'})
                                }]
                            }]
                    }
                ]
            };
            systemConts['content'].querySelector('.page-head').append(_.createTpl(tpl));
            resolve(systemConts['content'].querySelector('.page-head'));
        })

    }
    async pageTpl(){
        const _ = this;
        return new Promise( async function (resolve) {
            _.content = systemConts['content'];
            let pageBody = _.content.querySelector('.page-body');
            _.pageHeadTpl();
            _.clearCont(pageBody);
       //     _.content.querySelector('.page-head').append(await _.headTpl());
       //     pageBody.append(await _.bodyTpl());

            _.wf();
            await _.filterTpl();
            await _.tableTpl();
            await _.tableRowsTpl({
                page:1
            });
            resolve(_.content);
        })
    }
    async filterTpl(){
        const _ = this;
        return new Promise(async function (resolve) {
            let tpl = {
                el: _.createEl('DIV','page-filter'),
                childes: [{
                        el: _.createEl('DIV','page-search'),
                        childes: [{
                            el:_.createEl('DIV','page-inpt'),
                            childes: [{
                                el:_.createEl('INPUT','lang-search-value',{
                                    type:"text",
                                    'data-word':'Search',
                                    'data-search-method': 'searchWord',
                                    'data-input-action':`${_.componentName}:inputSearchQuery`,
                                    'data-keyup-action':`${_.componentName}:keyUpSearch`})
                            },{
                                el:_.createEl('BUTTON','page-btn',{
                                    'data-search-method': 'searchWord',
                                    'data-click-action':`${_.componentName}:btnSearch`,
                                    type: 'button'
                                })
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
    thumbnailTpl(thumbData){
        const _ = this;
        return new Promise(function (resolve) {
            resolve(_.createTpl(
                {
                    el: _.createEl('DIV','goods-thumb-main'),
                    childes:[
                        {
                            el: _.createEl('IMG','goods-thumb  goods-t',{
                                src:thumbData['src'],
                                'data-src':thumbData['src']
                            })
                        }, {
                            el: _.createEl('BUTTON','page-btn goods-thumb-del ',{
                                type:'button',
                                'data-click-action':`${_.componentName}:deleteImage;${_.componentName}:deleteMainImage`}),
                            childes:[
                                {
                                    el: _.createEl('IMG',null,{src:'/workspace/img/delete.svg'})
                                }
                            ]
                        }
                    ]
                }
            ));
        });
    }
    async thumbListItem(thumbData){
        const _ = this;
        return _.createTpl({
            el: _.createEl('DIV','goods-thumb-list-item',{
                'data-click-action':`${_.componentName}:changeMainThumb`,
                'data-name':thumbData['name'],
                'data-path':thumbData['fullPath'],
            }),
            childes:[
                {
                    el: _.createEl('IMG','goods-t',{src:thumbData['src'],'data-src':thumbData['src']}),
                }, {
                    el: _.createEl('BUTTON','page-btn goods-thumb-del',{type:'button','data-click-action':`${_.componentName}:deleteImage`}),
                    childes:[
                        {
                            el: _.createEl('IMG',null,{src:'/workspace/img/delete.svg'})
                        }
                    ]
                }
            ]
        });
    }
    async formTpl(){
        const _ = this;
        _.catsTpl();
        let tpl  = {
            el:_.createEl('FORM','page-form goods-form',{'data-submit-action':`${_.componentName}:saveProduct`}),
            childes: [
                {
                    el: _.createEl('INPUT','goods-cid',{type:'hidden'}),
                },
              {
                    el: _.createEl('DIV','page-form-right'),
                    childes: [{
                            el: _.createEl('DIV','page-form-right-head'),
                            childes:[
                                {el: _.createEl('H2','page-subtitle',{'data-word':'Adding a product'})}
                            ]
                        }, {
                            el: _.createEl('DIV','page-form-body goods-row'),
                            childes:[
                                {
                                    el: _.createEl('DIV','goods-left goods-side'),
                                    childes:[
                                        {
                                            el: _.createEl('DIV','goods-thumb'),
                                            childes:[
                                                { el: _.createEl('SPAN',null,{'data-word':'Image'})},
                                                {
                                                    el: _.createEl('DIV','goods-thumb-body'),
                                                    childes:[
                                                        {
                                                            el: _.createEl('BUTTON','page-btn goods-thumb-btn',{
                                                                'data-click-action': `${_.componentName}:addProductThumbnail`,
                                                                type:'button'
                                                            }),
                                                            childes:[
                                                                {
                                                                    el: _.createEl('IMG',null,{src: '/workspace/img/plus.svg'})
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },{
                                                    el: _.createEl('DIV','goods-thumb-list')
                                                }
                                            ]
                                        },{
                                            el: _.createEl('SPAN',null,{'data-word':'Category'}),
                                        },{
                                            el: await _.catsTpl()
                                        },{
                                            el: _.createEl('INPUT','goods-cat',{'type':'hidden'}),
                                        }
                                    ]
                                }, {
                                    el: _.createEl('DIV','goods-right  goods-side'),
                                    childes:[
                                        {
                                            el: _.createEl('DIV','page-inpt'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Title'}),
                                                },{
                                                    el: _.createEl('INPUT',null,{name:'title',}),
                                                }
                                            ]
                                        },{
                                            el: _.createEl('DIV','page-inpt'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Article'}),
                                                },{
                                                    el: _.createEl('INPUT',null,{name:'article',}),
                                                }
                                            ]
                                        },{
                                            el: _.createEl('DIV','page-inpt'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Model'}),
                                                },{
                                                    el: _.createEl('INPUT',null,{name:'model',}),
                                                }
                                            ]
                                        },{
                                            el: _.createEl('DIV','page-inpt'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Manufacturer'}),
                                                },{
                                                    el: _.createEl('INPUT',null,{name:'manufac',}),
                                                }
                                            ]
                                        },{
                                            el: _.createEl('DIV','page-inpt'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Price'}),
                                                },{
                                                    el: _.createEl('INPUT',null,{name:'price',}),
                                                }
                                            ]
                                        },{
                                            el: _.createEl('DIV','page-inpt'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Sale'}),
                                                },{
                                                    el: _.createEl('INPUT',null,{name:'sale',}),
                                                }
                                            ]
                                        },{
                                            el: _.createEl('DIV','page-inpt'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Available'}),
                                                },{
                                                    el: _.createEl('INPUT',null,{name:'avail',}),
                                                }
                                            ]
                                        },{
                                            el: _.createEl('DIV','page-inpt'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Weight'}),
                                                },{
                                                    el: _.createEl('INPUT',null,{name:'weight',}),
                                                }
                                            ]
                                        },{
                                            el: _.createEl('DIV','page-inpt'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Sort'}),
                                                },{
                                                    el: _.createEl('INPUT',null,{name:'sort',}),
                                                }
                                            ]
                                        },{
                                            el: _.createEl('DIV','page-text'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Description'}),
                                                },{
                                                    el: _.createEl('TEXTAREA',null,{name:'description',}),
                                                }
                                            ]
                                        },{
                                            el: _.createEl('DIV','page-text'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Meta keywords'}),
                                                },{
                                                    el: _.createEl('TEXTAREA',null,{name:'meta_keywords',}),
                                                }
                                            ]
                                        },{
                                            el: _.createEl('DIV','page-text'),
                                            childes:[
                                                {
                                                    el: _.createEl('SPAN',null,{'data-word':'Meta description'}),
                                                },{
                                                    el: _.createEl('TEXTAREA',null,{name:'meta_description',}),
                                                }
                                            ]
                                        }
                                    ]
                                },

                            ]
                        }
                    ]
                },
            {
                el: _.createEl('DIV','page-form-left'),
                childes:[
                    {
                        el: _.createEl('DIV','page-form-right-head'),
                        childes:[
                            {el: _.createEl('H2','page-subtitle',{'data-word':'Characteristics'})}
                        ]
                    },{
                        el: _.createEl('DIV','page-form-goods-chars'),
                    }
                ]
            }
            ]
        },buffer = _.createTpl(tpl);
        return buffer;
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
                        el:_.createEl('TH',null,{'data-word':'Image'})
                    },{
                        el:_.createEl('TH',null,{'data-word':'Title'})
                    },{
                        el:_.createEl('TH',null,{'data-word':'Article'})
                    },{
                        el:_.createEl('TH',null,{'data-word':'Category'})
                    },{
                        el:_.createEl('TH',null,{'data-word':'Price'})
                    },{
                        el:_.createEl('TH',null,{'data-word':'Available'})
                    },{
                        el:_.createEl('TH',null,{'text':'#'})
                    }
                    ]
                }]
            },{
                el: _.createEl('TBODY')
            }
            ]
        };
        let buffer = _.createTpl(tpl,`${_.componentName}TableContTpl`);
        _.content.querySelector('.page-body').append(buffer);
        return  Promise.resolve(_.content.querySelector('.page-body'));
    }
    async tableRowTpl(rowData){
        const _ = this;
        let  category =  await MainEventBus.trigger('categorier','getCategory',rowData['c_id']);    //_.Cat.getCategory(rowData['c_id']);
        let tpl = {
            el:_.createEl('TR'),
            childes: [{
                el:_.createEl('TD','digit',{text:`${rowData['id']}`})
            },{
                el:_.createEl('TD'),
                childes:[
                    {
                        el: _.createEl('IMG',null,{
                            src:'/uploads/'+rowData['image'],
                            'data-click-action': 'Modaler:showModal'
                        })
                    }
                ]
            },{
                el:_.createEl('TD',null,{
                    text: rowData['title']
                }),
            },{
                el:_.createEl('TD',null,{
                    text: rowData['article']
                }),
            },{
                el:_.createEl('TD',null,{
                    text: category[0]['title']
                }),
            },{
                el:_.createEl('TD',null,{
                    text: rowData['price']
                }),
            },{
                el:_.createEl('TD',null,{
                    text: rowData['avail']
                }),
            }
            ]
        };
        return _.createTpl(tpl);
    }
    async render(page) {
        const _ = this;
        return new Promise(async function (resolve) {
            if( page === _.modulePage){
                let content =   _.pageTpl();
                resolve(systemConts['content']);
            }else {
                resolve(true);
            }
        });
    }
}