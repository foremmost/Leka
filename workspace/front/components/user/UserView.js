import {View} from "../main/View.js";
import {MainEventBus} from "../../libs/MainEventBus.lib.js";
import {systemConts} from "../../libs/Conts.lib.js";
import {TweenMax} from "../../libs/GreenSock.lib.js";
import {Functions} from "../../libs/Functions.lib.js";
export class UserView extends View{
    constructor(model){
        super(model);
        const _ = this;
        _.modulePage =  'users';
        MainEventBus.add(_.componentName,'showMoreInfo',_.showMoreInfo.bind(_));
	      MainEventBus.add('Menu','showMenu',_.showMenu.bind(_),'UserShowMenu');
        //
        _.headRendered = false;
        _.moreShowed = false;
        _.componentName = 'User';
				_.userHelloShowed = false;
    }
    showMenu(){
    	const _ = this;
    	if (!_.userHelloShowed){
		    TweenMax.to('user-hello',.5,{
		      delay: .5,   x: 0
		    });
		    _.userHelloShowed = true;
	    }else{
		    TweenMax.to('user-hello',.5,{
			    delay: 0,   x: -1200
		    });
		    _.userHelloShowed = false;
	    }

    }
    showMoreInfo(){
        const _ = this;
        let
            userAction = systemConts['body'].querySelector('user-action'),
            tplSizes = userAction.getBoundingClientRect(),
            changeWidth = tplSizes.width;
        if(!_.moreShowed){
            userAction.style.width = `${changeWidth}px`;
            TweenMax.to(userAction,1,{x:`${changeWidth/2}px`});
            TweenMax.to(userAction.querySelector('user-photo'),1,{scale:'1'});
            TweenMax.to(userAction.querySelector('.user-more-btn'),1,{marginTop:'70px'});
            TweenMax.to(userAction.querySelector('.user-more-play'),1,{y:'30px',x:'110px',width: '30px',height: '30px'});
            TweenMax.to(userAction.querySelector('.user-more-play img'),1,{width:'8px',marginLeft:'-3px',rotation:'180deg'});
            _.moreShowed = true;
        }else{
            userAction.style.width = `auto`;
            TweenMax.to(userAction,1,{x:0});
            TweenMax.to(userAction.querySelector('user-photo'),1,{scale:'0'});
            TweenMax.to(userAction.querySelector('.user-more-btn'),1,{marginTop:'14px'});
            TweenMax.to(userAction.querySelector('.user-more-play'),1,{y:'0',x:'0',width: '50px',height: '50px'});
            TweenMax.to(userAction.querySelector('.user-more-play img'),1,{width:'12px',marginLeft:'3px',rotation:'0deg'});
            _.moreShowed = false;
        }
    }

    menuTpl(){
    	const _ = this;
    	return  _.el('USER-ACTION',{
		    childes:[
			    _.el('USER-PHOTO',{
				    childes:[
					    _.el('IMG',{
						    src:'/workspace/img/user.png'
					    })
				    ]
			    }),
			    _.el('BUTTON',{class:'user-more-play','data-click-action':"User:showMoreInfo",
				    childes:[
					    _.el('IMG',{src:'/workspace/img/play.svg'})
				    ]}
			    ),
			    _.el('BUTTON',{class:'user-more-btn','data-click-action':"User:showMoreInfo",
				    childes:[
					    _.el('SPAN',{'data-word':'Profile'})
				    ]}
			    )
		    ]
	    });
    }
    userHeadTpl(userNameResponse){
    	const _ = this;
    	return _.el('temp',{
		    childes:[
			    _.el('USER-HELLO',{
				    childes:[
					    _.el('SPAN',{'data-word':'Good Morning,'}),
					    _.el('USER-NAME',{text: `${userNameResponse['name']} ${userNameResponse['second_name']}`}),
					    _.el('BUTTON',{ 'type':'button','data-click-action':`${_.componentName}:userOut`,'data-word':'Exit'})
				    ]
			    }),
			    _.el('USER-ROLE',{
				    childes:[
					    _.el('SPAN',{'data-word':'Type of access:'}),
					    _.el('STRONG',{'data-word':'Administrator'})
				    ]
			    })
		    ]
	    });
    }
    async headTpl(page){
       const _ = this;
       if(systemConts['head'].querySelector('USER-HELLO')) return;
       let menuTpl =_.getTpl('menuTpl',{
       	  save: true
       })
       systemConts['menu'].prepend(menuTpl);

       let userNameResponse = await _.model.getName();
       if(!(userNameResponse) ) return;

	    let userHeadTpl =_.getTpl('userHeadTpl',{
	    	name: userNameResponse['name'],
		    second_name: userNameResponse['second_name'],
		    save: true
	    });
        systemConts['head'].prepend(userHeadTpl);
        return true;
    }
    async render(page){
        const _ = this;
        return new Promise(async function (resolve) {
            if( page !== '/') {
                    Functions.showLoader(systemConts['head']);
                    let head = await _.headTpl();

                    Functions.hideLoader(systemConts['head']);
                    _.headRendered = true;
                    resolve(head);
            }else{
              resolve(true);
            }
        });
    }
}