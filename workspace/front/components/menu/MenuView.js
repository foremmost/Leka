import { View } from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
import {TweenMax} from "../../libs/GreenSock.lib.js";
import {Functions} from "../../libs/Functions.lib.js";
export class MenuView extends View {
  constructor(model){
    super(model);
    const _ = this;

    _.componentName = 'Menu';
    _.modulePage =  'menu';
    _.tpl = null;
    //MainEventBus.add('Loader','modulesLoaded',_.render.bind(_),'MenuViewLoaderRender');
    MainEventBus.add('User','showMoreInfo',_.reDrawMenu.bind(_));
    MainEventBus.add(_.componentName,'showContext',_.showContext.bind(_));
    MainEventBus.add(_.componentName,'hideContext',_.hideContext.bind(_));
    MainEventBus.add(_.componentName,'showMenu',_.showMenu.bind(_),'MenuShowMenu');
    _.menuShowed = false;
  }
	showMenu(clickData){
  	const _ = this;
  	let burger = clickData['item'];
  	if (!_.menuShowed ){
		  burger.classList.add('active');
		  TweenMax.to('menu-place',.5,{
			  x: 0
		  });
		  TweenMax.to('menu',.5,{
			  x: 0, delay:1.2
		  });
		  _.menuShowed = true;
	  }else{
		  burger.classList.remove('active');
		  TweenMax.to('menu-place',.5,{
			  x: -1200
		  });
		  TweenMax.to('menu',.5,{
			  x: -1200, delay:0
		  });
		  _.menuShowed = false;
	  }
  }
  hideContext(){
    document.body.querySelector('menu-context').remove();
    document.body.querySelector('.context-shadow').remove();
  }
  async showContext(contextObj){
    const _ = this;
    let
      event  = contextObj['event'];
    if(document.querySelector('core').querySelector('menu-context'))
      document.querySelector('core').querySelector('menu-context').remove();
    let tpl = _.contextTpl();
    MainEventBus.trigger('languager','loadTranslate',tpl);

    tpl.style.top = event.clientY+'px';
    tpl.style.left = event.clientX+'px';

    document.querySelector('core').append(_.createEl('DIV','context-shadow',{'data-click-action':'Menu:hideContext'}));
    document.querySelector('core').append(tpl);
  }
  async loadMenuItems(menuCont){
    const _ = this;
    let items =  await _.model.getMenuItems();
    for(let item of items['data']){
      let itemTpl = _.menuItemTpl(item,history.state);
      menuCont.append(itemTpl)
    }
    return menuCont;
  }
  burgerTpl(){
  	const _ = this;
  	return _.el('MENU-BURGER',{
  		'data-click-action':`${_.componentName}:showMenu`
	  });
  }
  placeTpl(){
  	const _ = this;
  	return _.el('MENU-PLACE');
  }
  contextTpl(){
    const _ = this;
    let tpl = {
      el :_.createEl('MENU-CONTEXT',null),
      childes: [
        {
          el: _.createEl('MENU-CONTEXT-ITEM',null,{ 'data-word':'Edit word'}),
        }
      ]
    };
    return _.createTpl(tpl);
  }
  menuItemTpl(menuItemData,page=''){
    const _ = this;
    let cls = '';
    if (page === menuItemData.name){
      cls = 'active';
    }
    let word = menuItemData['name'],
        img = word;
    if (img == 'home'){
      img = 'main'
    }
    let tpl = {
      el: _.createEl('MENU-ITEM',cls,{'data-click-action':'Menu:getPage','data-page':`${menuItemData['name']}`}),
      childes: [{
        el: _.createEl('MENU-ITEM-NOTIFICATIONS'),
      },{
       /// el: _.createEl('OBJECT', '', {type:"image/svg+xml",data:`/workspace/img/${menuItemData['name']}.svg` }),
        el: _.createEl('IMG', '', {src:`/workspace/img/${img}.svg` }),
      },{el:_.createEl('SPAN','',{'data-word':`${word}`}),
      }]
    };
    return _.createTpl(tpl);
  }
  async pageTpl(){
    const _ = this;
    return new Promise( async function (resolve) {

      if(systemConts['menu'].querySelector('menu')) {
        resolve(true);
        return ;
      }
      let buffer = _.el('MENU');
      Functions.showLoader(systemConts['menu']);
      systemConts['menu'].append(_.burgerTpl());
      systemConts['menu'].append(_.placeTpl());
      systemConts['menu'].append(await _.loadMenuItems(buffer));
      Functions.hideLoader(systemConts['menu']);
      _.tpl =  systemConts['menu'];
       resolve(systemConts['menu']);
    });
  }

  reDrawMenu(){
    const _ = this;
    let tplSizes = _.tpl.getBoundingClientRect(),
        changeWidth =  tplSizes.width + 10,
        menuItems = _.tpl.querySelectorAll('menu-item'),
        itemsCnt = menuItems.length;
    if(!_.menuWidth)  _.menuWidth = systemConts['menu'].offsetWidth;
    if(!_.menuShowed){
      TweenMax.to('.user-more-play',.75,{rotation: 180});
      TweenMax.to(systemConts['head'],.75,{x:'11%',width:'89%'});
      TweenMax.to(systemConts['content'],.75,{x:'11%',width:'89%'});
      TweenMax.to(systemConts['menu'],.75,{width:`${(_.menuWidth * 2)+15}px`});
      TweenMax.to(menuItems,0,{ width: `${tplSizes.width/1.1}px`});
      TweenMax.staggerTo(menuItems,.5,{
        ease: Sine.easeOut,
        cycle:{
          x: function (index) {
            if( (index === 1)  ) return `${changeWidth}px`;
            if( (index > 0) && ((index % 2) === 0)  ) return `${changeWidth}px`;
          },
          y: function (index,item) {
            if(!index) return 0;
            let  itemSize = item.getBoundingClientRect();
            return `-${(itemSize.height+10)*(Math.round(index/2))}px`;
          }
        }
      },.5 / itemsCnt);
      _.menuShowed = true;
    }else{

	    TweenMax.to('.user-more-play',.75,{rotation: 0});
      TweenMax.to(systemConts['head'],.75,{x:'0%',width:'97.5%'});
      TweenMax.to(systemConts['content'],.75,{x:'0%',width:'97.5%'});
      TweenMax.to(systemConts['menu'],.5,{width:_.menuWidth});
      TweenMax.to(menuItems,.35,{ width: '100%'});
      TweenMax.staggerTo(menuItems,0.5,{
        ease: Sine.easeOut,
        cycle:{
          x: function () {
            return 0;
          },
          y: function () {
            return 0;
          }
        }
      },0.5 / itemsCnt);
      _.menuShowed = false;
    }
  }
  ///
  render(page){
    const _ = this;
    return new Promise(async function (resolve) {
      if(page !== '/'){
        systemConts['content'].classList.remove('wf');
        let pageBody = systemConts['content'].querySelector('.page-body');
        _.clearCont(pageBody);
        Functions.showLoader(pageBody);
        resolve( await _.pageTpl(page));
        Functions.hideLoader(pageBody);
      }else{
        resolve(true);
      }
    })
  }
}