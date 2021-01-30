import {View} from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";

export class CrmView extends View {
  constructor(model){
      super(model);
      const _ = this;
      _.componentName = 'crm';
      _.modulePage = 'crm';
      //
   /*   MainEventBus.add(_.componentName,'showForm',_.showForm.bind(_),`${_.componentName}View`);
      MainEventBus.add(_.componentName,'clearForm',_.clearForm.bind(_),`${_.componentName}View`);
      MainEventBus.add(_.componentName,'backToTable',_.backToTable.bind(_),`${_.componentName}View`);*/
      MainEventBus.add(_.componentName,'showFormTemplatesTpl',_.showFormTemplatesTpl.bind(_),`${_.componentName}View`);
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
          let tpl = _.el('DIV',{
            class:'page-filter',
            childes:[
                _.el('DIV',{
                  class:'page-search',
                  childes:[
                        _.el('DIV',{
                          class:'page-inpt',
                          childes:[
                              _.el('INPUT',{
                                type:"text",
                                'data-word':'Search',
                                'data-search-method': 'search',
                                'data-input-action':`${_.componentName}:inputSearchQuery`,
                                'data-keyup-action':`${_.componentName}:keyUpSearch`
                              }),
                              _.el('BUTTON',{
                                class: 'page-btn',
                                'data-search-method': 'search',
                                'data-click-action':`${_.componentName}:btnSearch`,
                                childes:[
                                    _.el('IMG',{src:"/workspace/img/search.svg"})
                                ]
                              })
                          ]
                        })
                  ]
                })
            ]
          });
          resolve(tpl);
      });
  }
  tabsTpL(){
      const _ = this;
      return _.el('CORE-TABS',{
        childes:[
            _.el('CORE-TABS-ITEM',{
              class:'active',
              'data-click-action':`${_.componentName}:showOrdersTpl`,
              childes:[
                  _.el('CORE-TABS-ITEM-TEXT',{
                    'data-word':`Orders`
                  })
              ]
            }),
            _.el('CORE-TABS-ITEM',{
              'data-click-action':`${_.componentName}:showFormTemplatesTpl`,
              childes:[
                  _.el('CORE-TABS-ITEM-TEXT',{
                    'data-word':`Form Templates`
                  })
              ]
            }),
          _.el('CORE-TABS-ITEM',{
            'data-click-action':`${_.componentName}:showEmailTemplatesTpl`,
            childes:[
              _.el('CORE-TABS-ITEM-TEXT',{
                'data-word':`Email Templates`
              })
            ]
          })
        ]
      });
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
      let pageHead = systemConts['content'].querySelector('.page-head');
      let filterTpl = await _.getTpl('filterTpl',{save:true});
      pageHead.append(filterTpl);
      await _.ordersTableTpl();
      await _.tableRowsTpl({
        page:1,
        type: 'main'
      });
     MainEventBus.trigger('languager', 'loadTranslate', {
        cont: systemConts['content']
     });
  }
  async pageTpl(){
    const _ = this;
    await _.pageHeadTpl();
    _.ordersContentTpl();
    let tabsTpl = _.getTpl('tabsTpL',{
      save:'true'
    });
    systemConts['head'].append(tabsTpl);
    return systemConts['content'];
  }
  fieldTypesTpl() {
    const _ = this;
    return [_.el(
      'OPTION',{
        'data-word': '1 type',
        value: 1
      }
    )];
  }
  async formFieldsTpl(){
    const _ = this;
    return new Promise(function (resolve) {
      resolve([
        _.el('BUTTON',{
          class:'btn',
          type:'button',
          'data-word':'Add field',
          'data-click-action':`${_.componentName}:addField`
        }),
        _.el('DIV',{
          class:'page-inpt',
          childes:[
            _.el('SPAN',{'text':'Name'}),
            _.el('INPUT',{'text':'name',name:'name'}),
          ]
        }),
        _.el('DIV',{
          class:'page-inpt',
          childes:[
            _.el('SPAN',{'data-word':'Alias'}),
            _.el('INPUT',{'text':'name',name:'alias'}),
          ]
        }),
        _.el('DIV',{
          class:'page-check',
          childes:[
            _.el('INPUT',{type:'checkbox',id:'1',name:'required'}),
            _.el('LABEL',{for:'1',
              childes:[
                _.el('STRONG',{'data-word':'Required'}),
                _.el('SPAN'),
              ]
            }),
          ]
        }),
        _.el('DIV',{
          class:'page-inpt',
          childes:[
            _.el('SPAN',{'data-word':'Size'}),
            _.el('INPUT',{'data-word':'Size',name:'size'}),
          ]
        }),
        _.el('DIV',{
          class:'page-inpt',
          childes:[
            _.el('SPAN',{'data-word':'Type'}),
            _.el('SELECT',{
              childes: _.fieldTypesTpl(),
              'data-change-action':`${_.componentName}:changeFormType`
            }),
          ]
        }),
      ]);
    })
  }
  formTemplatesTpl(){
        const _ = this;
        return new Promise(async function(resolve){
           let tpl =

               _.el('temp',{
                 childes:[
                   _.el('DIV',{
                     class: 'page-form-left',
                     childes:[
                       _.el('DIV',{
                         class:'page-inpt',
                         childes:[
                           _.el('SPAN',{'data-word':'Form name'}),
                           _.el('INPUT',{'data-word':'Form name'}),
                         ]
                       }),
                       _.el('DIV',{
                         class:'page-inpt',
                         childes:[
                           _.el('SPAN',{'data-word':'Form action'}),
                           _.el('INPUT',{'data-word':'Form action'}),
                         ]
                       }),
                       _.el('DIV',{
                         class:'page-inpt',
                         childes:[
                           _.el('SPAN',{'data-word':'Form method'}),
                           _.el('INPUT',{'data-word':'Form method'}),
                         ]
                       }),
                       _.el('DIV',{
                         class:'form-fields',
                         childes: await _.getTpl('formFieldsTpl')
                       })
                     ]
                   }),
                   _.el('DIV',{
                       class:'page-form-right',
                       childes:[
                         _.el('H3',{
                           class:'page-subtitle',
                           'data-word':' Form fields:'
                         }),
                       ]
                     })
                 ]
               });
          resolve(tpl)
        });
    }
  async showFormTemplatesTpl(clickData){
      const _ = this;
      let tab = clickData['item'],
          pageHead = systemConts['content'].querySelector('.page-head'),
          pageBody = systemConts['content'].querySelector('.page-body');
      _.selectCurrentTab(tab);
      _.clearCont(pageBody);
      if (pageHead.querySelector('.page-filter')) pageHead.querySelector('.page-filter').remove();
      let pageTitle  = pageHead.querySelector('.page-title');
      _.updateEl(pageTitle,'page-title',{'data-word':'Form templates'});
      let formTemplatesTpl = await _.formTemplatesTpl();
      pageBody.append(formTemplatesTpl);

      await MainEventBus.trigger('languager', 'loadTranslate');
  }
  async showOrdersTpl(clickData){
      const _ = this;
      let tab = clickData['item'];
      _.selectCurrentTab(tab);
      _.clearBody();
      await _.ordersContentTpl();
  }
  async formToShowTpl(orderId){
      const _ =  this;
      let orderData  = await _.model.getOneItem({itemId:orderId});
      let tpl = {
          el: _.createEl('DIV','page-form-right  modal-form',{style:"width:100%;min-width:450px"}),
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
              resolve(_.pageTpl());
          }
      });
  }
}