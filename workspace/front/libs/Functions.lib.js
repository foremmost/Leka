import {TweenMax} from "./GreenSock.lib.js";

 class _Functions{
	constructor(){
		const _ = this;
		_.words = [];

	}
	hideLoader(cont){
		const _ = this;
		if(cont){
			let loader = cont.querySelector('CORE-LOADER');
			if(loader)		loader.remove();
		}
	}
	showLoader(cont){
		const _ = this;
		if(cont){
			let loader = document.createElement('CORE-LOADER');
			let roller = document.createElement('CORE-LOADER-ROLLER');
			loader.append(roller)
			for(let i=0; i < 8;i++){
				roller.append(document.createElement('DIV'));
			}
			//loader.textContent = 'Загрузка...';
			cont.append(loader);
		}
		/*let loader = document.querySelector('core-loader');
		TweenMax.to(loader,.5,{scale:1,opacity:1,zIndex: 100000});*/
	}
	cutText(str,cnt = 10){
		if(!str) return ;
		if(!str.length) return ;
		let miniStr = str;

		if(str.length > cnt){ miniStr = (str.slice(0, cnt - 1) + '…') }

		return miniStr;
	 }
 deepEqual( param1,param2  ) {
		 const _ = this;
		 let deep = false;
		 if( param1 && param2){
			 if((typeof param1 === 'object') && (typeof param2 === 'object')){
				 let len1 = Object.keys(param1).length,
						 len2 = Object.keys(param2).length;
				 if(len1 === len2){
					 let qual = false;
					 for(let i=0;i < len1;i++){
						 if(Object.keys(param1)[i] !== Object.keys(param2)[i]) qual = false
						 else qual = true;
					 }
					 if(qual){
						 for(let prop in param1){
							 if( param1[prop] && param2[prop]){
								 if((typeof param1[prop] === 'object') && (typeof param2[prop] === 'object')) {
									 deep = _.deepQual(param1[prop],param2[prop]);
									 if(!deep) break;
								 }else if(param1[prop] !== param2[prop]){
									 deep = false;
									 break;
								 }
							 }
							 deep = true;
						 }
						 return deep;
					 }
				 }
			 }
		 }
		 if(param1 === param2){
			 deep =  true;
		 }else{
			 deep = false;
		 }

		 return deep;
	 }
}
export const Functions = new _Functions();
