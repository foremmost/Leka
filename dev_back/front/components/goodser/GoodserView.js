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
		//		MainEventBus.add(_.componentName,'clearForm',_.clearForm.bind(_),`${_.componenName}View`);
				MainEventBus.add(_.componentName,'backToTable',_.backToTable.bind(_),`${_.componenName}View`);

				MainEventBus.add(_.componentName,'doAnimation',_.inputsAnimation.bind(_),`${_.componenName}View`);


		//		_.Cat = new Categorier();
		}
		inputsAnimation(cont ='.goods-right' ){
			const _ =	this;
			let animCont = systemConts['content'].querySelector(cont);
			TweenMax.staggerFromTo([...animCont.querySelectorAll('.page-inpt'),...animCont.querySelectorAll('.page-text')],.35,{
				y: 100,
				opacity:0
			},{
				y:0,
				opacity: 1
			},.05);
		}
		async changeCat(catData){
				const	_ = this;
			 await _.fillCharacsList(catData['props']);
		}
		async catsTpl(charData){
				const _ = this;
				return await	MainEventBus.trigger('categorier','getCatList');// _.Cat.getCatList();
		}
		async fillCharacsList(characs){
			const _ = this;
			return new Promise(async function (resolve){
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
				 },.15);
				 resolve(charsCont);
			});
		}
		async characItemlistTpl(charac){
			const _ = this;
			let list	= await MainEventBus.trigger('categorier','getCurrentPropList',charac['name']);// _.Cat.getCurrentPropList(charac['name']);

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
				let tpl =	{
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
				return _.el('BUTTON',{
					class:'btn bg-green',
					'data-word':'Save',
					'data-click-action':`${_.componentName}:saveGoods`
				});
		}
		async backToTable(clickData){
			const _ = this;
			_.pageTpl();
			let
					pageFilter	= systemConts['content'].querySelector('.page-filter');
			pageFilter.style.display = 'block';
			MainEventBus.trigger(_.componentName,'clearForm');
			MainEventBus.trigger('languager','loadTranslate',systemConts['content']);
		}
		async showForm(clickData){
			const _ = this;
			Functions.showLoader(systemConts['content']);
			let
					currentBtn = clickData['item'],
					pageFilter	= systemConts['content'].querySelector('.page-filter'),
					pageHead	= systemConts['content'].querySelector('.page-head'),
					actionBtn = pageHead.querySelector('.main-action'),
					pageBody	= systemConts['content'].querySelector('.page-body'),
					formData,cat;

			let
					form = await _.formTpl();
			_.clearBody();

			let saveBtn = _.getTpl('saveBtnTpl',{save:true})
			pageHead.querySelector('.page-action').append(saveBtn);

			pageBody.append(form);
			_.inputsAnimation();
			actionBtn.setAttribute('data-word','back');
			actionBtn.setAttribute('data-click-action',`${_.componentName}:backToTable`);
			pageFilter.style.display = 'none';
			if (currentBtn.dataset.type === 'edit'){
				MainEventBus.trigger(_.componentName,'fillForm',currentBtn.dataset.itemId);
			}
			MainEventBus.trigger('languager','loadTranslate',systemConts['content']);
			Functions.hideLoader(systemConts['content']);
		}
		pageHeadTpl(pageData = {}){
				const _ =	this;
				_.clearCont(_.content.querySelector('.page-head'));
				return new Promise(function (resolve) {
						let tpl = _.el('temp',{childes:[
								_.el('H1',{
									class:'page-title',
									'data-word':'Goods'
								}),
									_.el('DIV',{
										class:'page-action',childes:[
												_.el('BUTTON',{class:'btn	bg-blue','data-click-action': `${_.componentName}:importGoods`,type:'button',childes:[
														_.el('IMG',{src:'/workspace/img/import.svg'})
													]}),
												_.el('BUTTON',{class:'btn bg-blue','data-click-action': `${_.componentName}:exportGoods`,type:'button',childes:[
														_.el('IMG',{src:'/workspace/img/export.svg'})
													]}),
												_.el('BUTTON',{class:'btn main-action','data-click-action':`${_.componentName}:showForm`,type:'button',childes:[
														_.el('SPAN',{'data-word':'Adding a product'})
												]}),
										]
									})
							]});
						systemConts['content'].querySelector('.page-head').append(tpl);
						resolve(systemConts['content'].querySelector('.page-head'));
				});
		}
		async pageTpl(){
				const _ = this;
				return new Promise( async function (resolve) {
						_.content = systemConts['content'];
						let pageBody = _.content.querySelector('.page-body');
						_.pageHeadTpl();
						_.clearCont(pageBody);

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
														el: _.createEl('IMG','goods-thumb goods-t',{
																src: thumbData['src'],
																'data-src':thumbData['src']
														})
												}, {
														el: _.createEl('BUTTON','page-btn goods-thumb-del ',{
																type:'button',
																'data-click-action':`${_.componentName}:deleteMainImage`}),
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
		async formTpl(goodsData){
				const _ = this;
				let tpl	= {
						el:_.createEl('FORM','page-form goods-form',{'data-submit-action':`${_.componentName}:saveGoods`}),
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
																		el: _.createEl('DIV','goods-right	goods-side'),
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
				return	Promise.resolve(_.content.querySelector('.page-body'));
		}
		async tableRowTpl(rowData){
				const _ = this;
				let	category =	await MainEventBus.trigger('categorier','getCategory',rowData['c_id']);
				let ttpl = _.el('TR',{
					childes:[
							_.el('TD',{class:'digit',text:rowData['id']}),
							_.el('TD',{
								childes:[
										_.el('IMG',{
											src:rowData['image'],
											'data-click-action': 'Modaler:showModal'
										})
								]
							}),
							_.el('TD',{text: rowData['title']}),
							_.el('TD',{text: rowData['article']}),
							_.el('TD',{text: category['title']}),
							_.el('TD',{text: rowData['price']}),
							_.el('TD',{text: rowData['avail']}),
							_.el('TD',{
								childes:[
										_.el('DIV',{
											class:'page-table-actions',
											childes:[
												_.el('BUTTON',{class:'page-btn',type:'button','data-click-action':`${_.componentName}:copyGoods`,childes:[
														_.el('IMG',{src:'/workspace/img/copy.svg'})
													]}),
												_.el('BUTTON',{class:'page-btn',type:'button','data-click-action':`${_.componentName}:showGoods`,childes:[
														_.el('IMG',{src:'/workspace/img/show.svg'})
													]}),
												_.el('BUTTON',{class:'page-btn',type:'button','data-item-id':rowData['id'],'data-type':'edit','data-click-action':`${_.componentName}:showForm`,childes:[
														_.el('IMG',{src:'/workspace/img/edit.svg'})
													]}),
												_.el('BUTTON',{class:'page-btn',type:'button','data-click-action':`${_.componentName}:deleteGoods`,childes:[
														_.el('IMG',{src:'/workspace/img/delete.svg'})
													]})
											]
										})

								]
							})
					]
				});
				return ttpl;
		}
		async render(page) {
				const _ = this;
				return new Promise(async function (resolve) {
						if( page === _.modulePage){
								let content =	 _.pageTpl();
								resolve(systemConts['content']);
						}else {
								resolve(true);
						}
				});
		}
}