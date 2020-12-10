import {TweenMax} from "./GreenSock.lib.js";
import {MainEventBus} from "./MainEventBus.lib.js";
class _Animation{
	constructor(){
		const _ = this;

		//MainEventBus.add('Animation','scrollContent',_.scrollContent.bind(_));
		MainEventBus.add('Animation','textAnimation',_.textAnimation.bind(_));
	}
	wordOnletters(word,tag='i',action=''){
		if(!word) return '';
		let outWord = word,
				outStr = '',
				wordsIn = outWord.split(' ');
		for (let i=0;i < wordsIn.length;i++){
			let wordIn  = wordsIn[i],
					inStr = '';
			for(let i=0; i < wordIn.length;i++){
				inStr+= `<${tag}>${wordIn[i]}</${tag}>`;
			}
			outStr+=`<wordspan>${inStr}</wordspan>&nbsp;`;
		}
		return outStr;
	}
	textAnimation(data={}){
		const _ = this;
		let type = data.type ? data.type : 'upDown';
		switch (type) {
			case 'upDown':{
				let elems = data.elems;
				for(let elem of elems){
					if(!elem) continue;
					elem.innerHTML = _.wordOnletters(elem.textContent,'cspan');
					let letters = elem.querySelectorAll('cspan');
					TweenMax.staggerFromTo(letters,.75,{
						opacity:0,
						yoyo:true,
						cycle:{
							rotation: [90,-90],
							y: [60,-60]
						}
					},{
						cycle:{rotation:[0,0],y:[0,0]},
						opacity:1,
						y:0,
						ease: Back.easeOut
					},.025);
				}

			}
		}

	}
}
export const Animation = new _Animation();
